import mongoose from 'mongoose';
import Youtube from '../models/youtube.model.js';

const getAllYoutubeCompanies = async (req, res) => {
  try {
    const registros = await Youtube.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: registros.length,
      data: registros
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los registros de YouTube'
    });
  }
};

const getYoutubeCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalido'
      });
    }

    const registro = await Youtube.findById(id);

    if (!registro) {
      return res.status(404).json({
        success: false,
        message: 'Registro de YouTube no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      data: registro
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el registro de YouTube'
    });
  }
};

const postYoutubeCompany = async (req, res) => {
  try {
    const nuevoRegistro = new Youtube(req.body);
    const registroGuardado = await nuevoRegistro.save();

    return res.status(201).json({
      success: true,
      message: 'Registro de YouTube creado correctamente',
      data: registroGuardado
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validacion',
        errors: Object.values(error.errors).map((err) => err.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al crear el registro de YouTube'
    });
  }
};

const putYoutubeCompany = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalido'
      });
    }

    const registroActualizado = await Youtube.findByIdAndUpdate(id, req.body, {
      returnDocument: 'after',
      runValidators: true
    });

    if (!registroActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Registro de YouTube no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Registro de YouTube actualizado correctamente',
      data: registroActualizado
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validacion',
        errors: Object.values(error.errors).map((err) => err.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el registro de YouTube'
    });
  }
};

const deleteYoutubeCompany = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalido'
      });
    }

    const registroEliminado = await Youtube.findByIdAndDelete(id);

    if (!registroEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Registro de YouTube no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Registro de YouTube eliminado correctamente',
      data: registroEliminado
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el registro de YouTube'
    });
  }
};

const getYoutubeCompaniesByCountry = async (req, res) => {
  try {
    const { pais } = req.params;

    const registros = await Youtube.find({
      pais: { $regex: pais, $options: 'i' }
    });

    return res.status(200).json({
      success: true,
      count: registros.length,
      data: registros
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al filtrar registros de YouTube por pais'
    });
  }
};

export {
  getAllYoutubeCompanies,
  getYoutubeCompanyById,
  postYoutubeCompany,
  putYoutubeCompany,
  deleteYoutubeCompany,
  getYoutubeCompaniesByCountry
};
