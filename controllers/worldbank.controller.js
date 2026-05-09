const axios = require("axios");
const mongoose = require("mongoose");

const WorldBankQuery = require("../models/WorldBankQuery");

const COUNTRY_REGEX = /^(ALL|[A-Z]{2,3})$/;
const INDICATOR_REGEX = /^[A-Za-z0-9._;-]+$/;
const DATE_REGEX = /^\d{4}(:\d{4})?$/;

function getEnvConfig() {
  const parsedPerPage = Number.parseInt(process.env.DEFAULT_PER_PAGE || "300", 10);
  const baseUrl = String(process.env.WORLD_BANK_BASE_URL || "").trim().replace(/\/+$/, "");

  if (!baseUrl) {
    throw buildError("No existe WORLD_BANK_BASE_URL en el archivo .env", 500);
  }

  return {
    baseUrl,
    defaultCountry: String(process.env.DEFAULT_COUNTRY || "EC").trim().toUpperCase(),
    defaultIndicator: String(process.env.DEFAULT_INDICATOR || "SP.POP.TOTL").trim().toUpperCase(),
    defaultFormat: String(process.env.DEFAULT_FORMAT || "json").trim().toLowerCase(),
    defaultPerPage: Number.isNaN(parsedPerPage) || parsedPerPage < 1 ? 300 : parsedPerPage,
  };
}

function buildError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function parsePositiveInt(value, fieldName) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number.parseInt(String(value), 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    throw buildError(`El parametro ${fieldName} debe ser un entero positivo.`, 400);
  }

  return parsed;
}

function validateCountry(country) {
  if (!COUNTRY_REGEX.test(country)) {
    throw buildError("El parametro country es invalido. Usa 2 o 3 letras (ej. EC, COL, USA) o ALL.", 400);
  }
}

function validateIndicator(indicator) {
  if (!INDICATOR_REGEX.test(indicator)) {
    throw buildError("El parametro indicator es invalido.", 400);
  }
}

function extractWorldBankMessage(metadata) {
  if (!metadata || !Array.isArray(metadata.message)) {
    return "";
  }

  return metadata.message
    .map((item) => item?.value || item?.key || "")
    .filter(Boolean)
    .join(" ");
}

function buildWorldBankParams(query, envConfig) {
  const params = {
    format: String(query.format || envConfig.defaultFormat).trim().toLowerCase(),
  };

  const perPage = parsePositiveInt(query.per_page, "per_page");
  params.per_page = perPage || envConfig.defaultPerPage;

  const page = parsePositiveInt(query.page, "page");
  const mrv = parsePositiveInt(query.mrv, "mrv");
  const mrnev = parsePositiveInt(query.mrnev, "mrnev");

  if (page) {
    params.page = page;
  }
  if (mrv) {
    params.mrv = mrv;
  }
  if (mrnev) {
    params.mrnev = mrnev;
  }

  if (query.date !== undefined && query.date !== null && query.date !== "") {
    const dateValue = String(query.date).trim();

    if (!DATE_REGEX.test(dateValue)) {
      throw buildError("El parametro date debe tener formato AAAA o AAAA:AAAA.", 400);
    }

    params.date = dateValue;
  }

  return params;
}

function normalizeTextField(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
}

function normalizeCreatePayload(body = {}) {
  const country = String(body.country || body.countryCode || "").trim().toUpperCase();
  const indicator = String(body.indicator || body.indicatorCode || "").trim().toUpperCase();

  if (!country) {
    throw buildError("country es obligatorio.", 400);
  }
  if (!indicator) {
    throw buildError("indicator es obligatorio.", 400);
  }

  validateCountry(country);
  validateIndicator(indicator);

  let value = null;
  if (body.value !== undefined && body.value !== null && body.value !== "") {
    if (Number.isNaN(Number(body.value))) {
      throw buildError("value debe ser un numero.", 400);
    }
    value = Number(body.value);
  }

  const rawData = body.rawData && typeof body.rawData === "object" ? body.rawData : {};

  return {
    country,
    indicator,
    countryName: normalizeTextField(body.countryName),
    indicatorName: normalizeTextField(body.indicatorName),
    year: normalizeTextField(body.year),
    value,
    source: normalizeTextField(body.source) || "World Bank API",
    notes: normalizeTextField(body.notes),
    rawData,
  };
}

function normalizeUpdatePayload(body = {}) {
  const payload = {};

  if (body.country !== undefined || body.countryCode !== undefined) {
    const country = String(body.country || body.countryCode || "").trim().toUpperCase();
    if (!country) {
      throw buildError("country no puede estar vacio.", 400);
    }
    validateCountry(country);
    payload.country = country;
  }

  if (body.indicator !== undefined || body.indicatorCode !== undefined) {
    const indicator = String(body.indicator || body.indicatorCode || "").trim().toUpperCase();
    if (!indicator) {
      throw buildError("indicator no puede estar vacio.", 400);
    }
    validateIndicator(indicator);
    payload.indicator = indicator;
  }

  if (body.countryName !== undefined) {
    payload.countryName = normalizeTextField(body.countryName);
  }

  if (body.indicatorName !== undefined) {
    payload.indicatorName = normalizeTextField(body.indicatorName);
  }

  if (body.year !== undefined) {
    payload.year = normalizeTextField(body.year);
  }

  if (body.source !== undefined) {
    payload.source = normalizeTextField(body.source);
  }

  if (body.notes !== undefined) {
    payload.notes = normalizeTextField(body.notes);
  }

  if (body.value !== undefined) {
    if (body.value === null || body.value === "") {
      payload.value = null;
    } else if (Number.isNaN(Number(body.value))) {
      throw buildError("value debe ser un numero.", 400);
    } else {
      payload.value = Number(body.value);
    }
  }

  if (body.rawData !== undefined) {
    if (body.rawData && typeof body.rawData === "object") {
      payload.rawData = body.rawData;
    } else {
      throw buildError("rawData debe ser un objeto.", 400);
    }
  }

  return payload;
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function handleError(error, res, fallbackMessage = "Error interno del servidor.") {
  if (error?.statusCode) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (axios.isAxiosError(error)) {
    return res.status(error.response?.status || 502).json({
      success: false,
      message: "Error consultando World Bank API.",
      detail: error.response?.data || error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: fallbackMessage,
    error: error.message,
  });
}

async function searchWorldBank(req, res) {
  try {
    const envConfig = getEnvConfig();
    const country = String(req.query.country || envConfig.defaultCountry).trim().toUpperCase();
    const indicator = String(req.query.indicator || envConfig.defaultIndicator).trim().toUpperCase();

    validateCountry(country);
    validateIndicator(indicator);

    const params = buildWorldBankParams(req.query, envConfig);
    const url = `${envConfig.baseUrl}/country/${country}/indicator/${indicator}`;

    const response = await axios.get(url, {
      params,
      timeout: 15000,
    });

    const metadata = response.data?.[0] || {};
    const data = Array.isArray(response.data?.[1]) ? response.data[1] : [];
    const wbMessage = extractWorldBankMessage(metadata);

    if (wbMessage && data.length === 0) {
      return res.status(404).json({
        success: false,
        message: wbMessage,
      });
    }

    return res.status(200).json({
      success: true,
      metadata,
      count: data.length,
      data,
    });
  } catch (error) {
    return handleError(error, res);
  }
}

async function getSavedQueries(req, res) {
  try {
    const records = await WorldBankQuery.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: records.length,
      data: records,
    });
  } catch (error) {
    return handleError(error, res, "Error obteniendo registros guardados.");
  }
}

async function getSavedQueryById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID no valido.",
      });
    }

    const record = await WorldBankQuery.findById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Registro no encontrado.",
      });
    }

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    return handleError(error, res, "Error buscando registro por ID.");
  }
}

async function createSavedQuery(req, res) {
  try {
    const payload = normalizeCreatePayload(req.body);
    const newRecord = await WorldBankQuery.create(payload);

    return res.status(201).json({
      success: true,
      message: "Registro creado correctamente.",
      data: newRecord,
    });
  } catch (error) {
    return handleError(error, res, "Error creando registro.");
  }
}

async function updateSavedQuery(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID no valido.",
      });
    }

    const payload = normalizeUpdatePayload(req.body);

    const updatedRecord = await WorldBankQuery.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updatedRecord) {
      return res.status(404).json({
        success: false,
        message: "Registro no encontrado.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Registro actualizado correctamente.",
      data: updatedRecord,
    });
  } catch (error) {
    return handleError(error, res, "Error actualizando registro.");
  }
}

async function deleteSavedQuery(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "ID no valido.",
      });
    }

    const deletedRecord = await WorldBankQuery.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({
        success: false,
        message: "Registro no encontrado.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Registro eliminado correctamente.",
      data: deletedRecord,
    });
  } catch (error) {
    return handleError(error, res, "Error eliminando registro.");
  }
}

module.exports = {
  searchWorldBank,
  getSavedQueries,
  getSavedQueryById,
  createSavedQuery,
  updateSavedQuery,
  deleteSavedQuery,
};
