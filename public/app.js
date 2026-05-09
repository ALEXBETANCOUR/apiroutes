const indicatorForm = document.getElementById("indicator-form");
const countryInput = document.getElementById("country");
const indicatorInput = document.getElementById("indicator");
const mrvInput = document.getElementById("mrv");
const feedback = document.getElementById("feedback");
const countryButton = document.getElementById("country-button");
const populationButton = document.getElementById("population-button");
const countryResult = document.getElementById("country-result");
const indicatorResult = document.getElementById("indicator-result");
const historyList = document.getElementById("history-list");

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
}

function formatNumber(value) {
  if (value === null || value === undefined) {
    return "-";
  }

  return new Intl.NumberFormat("es-EC", {
    maximumFractionDigits: 2,
  }).format(value);
}

async function fetchJson(url) {
  const response = await fetch(url);
  const payload = await response.json();

  if (!response.ok || !payload.ok) {
    throw new Error(payload.message || "No se pudo completar la solicitud.");
  }

  return payload;
}

function renderCountry(payload) {
  const country = payload.data;

  countryResult.innerHTML = `
    <article class="card">
      <strong>${country.name || "-"}</strong>
      <p>Codigo ISO2: ${country.iso2Code || "-"}</p>
      <p>Capital: ${country.capitalCity || "-"}</p>
      <p>Region: ${country.region?.value || "-"}</p>
      <p>Ingreso: ${country.incomeLevel?.value || "-"}</p>
      <p>Estado de la API: ${payload.metadata?.total || "-"}</p>
    </article>
  `;
}

function renderIndicator(payload) {
  const rows = payload.data
    .map((item) => {
      return `
        <tr>
          <td>${item.date || "-"}</td>
          <td>${item.country?.id || "-"}</td>
          <td>${item.country?.value || "-"}</td>
          <td>${item.indicator?.id || "-"}</td>
          <td>${item.indicator?.value || "-"}</td>
          <td>${formatNumber(item.value)}</td>
        </tr>
      `;
    })
    .join("");

  indicatorResult.innerHTML = `
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Anio</th>
            <th>Pais</th>
            <th>Nombre pais</th>
            <th>Indicador</th>
            <th>Nombre indicador</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderHistory(items) {
  if (!Array.isArray(items) || items.length === 0) {
    historyList.innerHTML = "<p>No hay historial disponible.</p>";
    return;
  }

  historyList.innerHTML = items
    .map((item) => {
      return `
        <article class="history-item">
          <strong>${item.countryName || item.countryCode} - ${item.indicatorCode}</strong>
          <p>${item.indicatorName || "-"}</p>
          <p>Anio: ${item.year || "-"} | Valor: ${formatNumber(item.value)}</p>
          <p class="meta">Guardado: ${formatDate(item.createdAt)}</p>
        </article>
      `;
    })
    .join("");
}

async function loadHistory() {
  try {
    const payload = await fetchJson("/api/worldbank/history?limit=12");
    renderHistory(payload.data);
  } catch (error) {
    historyList.innerHTML = "<p>No se pudo cargar el historial.</p>";
  }
}

indicatorForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const country = countryInput.value.trim().toLowerCase();
  const indicator = indicatorInput.value.trim().toUpperCase();
  const mrv = mrvInput.value.trim();

  if (!country || !indicator) {
    feedback.textContent = "Debes ingresar pais e indicador.";
    return;
  }

  try {
    feedback.textContent = "Consultando indicador...";
    const query = new URLSearchParams();
    if (mrv) {
      query.set("mrv", mrv);
    }

    const payload = await fetchJson(
      `/api/worldbank/indicator/${country}/${indicator}?${query.toString()}`
    );

    renderIndicator(payload);
    feedback.textContent = "Consulta de indicador completada.";
    await loadHistory();
  } catch (error) {
    feedback.textContent = error.message;
  }
});

countryButton.addEventListener("click", async () => {
  const country = countryInput.value.trim().toLowerCase();

  if (!country) {
    feedback.textContent = "Ingresa un codigo de pais.";
    return;
  }

  try {
    feedback.textContent = "Consultando pais...";
    const payload = await fetchJson(`/api/worldbank/country/${country}`);
    renderCountry(payload);
    feedback.textContent = "Consulta de pais completada.";
  } catch (error) {
    feedback.textContent = error.message;
  }
});

populationButton.addEventListener("click", async () => {
  const country = countryInput.value.trim().toLowerCase();

  if (!country) {
    feedback.textContent = "Ingresa un codigo de pais.";
    return;
  }

  try {
    feedback.textContent = "Consultando poblacion...";
    const payload = await fetchJson(`/api/worldbank/population/${country}?mrv=5`);
    renderIndicator(payload);
    feedback.textContent = "Consulta de poblacion completada.";
  } catch (error) {
    feedback.textContent = error.message;
  }
});

loadHistory();
