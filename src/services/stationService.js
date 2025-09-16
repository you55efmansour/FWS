import apiClient from "./apiClient";

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

// Fetch stations using the new API and normalize the response shape
async function getStationsByType(
  type,
  city = "",
  County = "",
  AreaName = "",
  Town = "",
  Street = ""
) {
  return apiClient.get("api/services/app/Thing/GetAllStationsByType", {
    params: {
      City: city,
      Type: type,
      County: County,
      AreaName: AreaName,
      Town: Town,
      Street: Street,
    },
  });
}

async function fetchStationById(id) {
  return apiClient.get("/api/services/app/Thing/GetStationById", {
    params: { id },
  });
}

async function fetchObservations(datastreamId, start, end) {
  return apiClient.get("/api/services/app/Observation/GetObservations", {
    params: { datastreamId, start, end },
  });
}
async function getWaterLevelTypes() {
  return apiClient.get("/api/services/app/Thing/GetWaterLevelStationTypes");
}
async function getRainTypes() {
  return apiClient.get("/api/services/app/Thing/GetRainStationTypes");
}
async function updateStation(id, data, token , type) {
  return apiClient.put("/api/services/app/Thing/UpdateStation", data, {
    params: { id ,  type},
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
  });
}

async function createStation(data, token , type) {
  return apiClient.post("/api/services/app/Thing/CreateStation", data, {
    params: { type },
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
  });
}


async function deleteStation(id, token) {
  return apiClient.delete("/api/services/app/Thing/DeleteStation", {
    params: { id },
    headers: authHeaders(token),
  });
}

async function fetchAllCities() {
  return apiClient.get("/api/services/app/Location/GetAllCities");
}
async function fetchCountiesWithAreasAndStations(stationType) {
  return apiClient.get("/api/services/app/Location/GetCountiesWithAreasAndStations", {
    params: {stationType},
  });
}

const stationService = {
  getStationsByType,
  fetchStationById,
  fetchObservations,
  updateStation,
  deleteStation,
  fetchAllCities,
  createStation,
  getWaterLevelTypes,
  getRainTypes,
  fetchCountiesWithAreasAndStations
};

export default stationService;
