import { makeAutoObservable } from "mobx";
import stationService from "../services/stationService";

class StationsStore {
  error = null;
  doneMsg = null;

  // normalized state by type
  stationsByType = {
    WaterLevel: null,
    Rain: null,
    Sewer: null,
    FloodNtc: null,
  };

  // selection state
  selectedStationId = null;
  selectedStationType = null;

  // optional meta per type (counts, totals)
  stationsMetaByType = {
    WaterLevel: null,
    Rain: null,
    Sewer: null,
    FloodNtc: null,
  };

  // per-type loading flags
  isLoadingByType = {
    WaterLevel: false,
    Rain: false,
    Sewer: false,
    FloodNtc: null,
  };

  // UI flags (kept for backward compatibility with consumers)
  WaterLevelIsActive = true;
  RainIsActive = false;
  SewerIsActive = false;
  FloodNtcIsActive = false;

  // Priority system for filtering
  panelIsOpen = false;
  panelSelectedType = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // computed getters for backward compatibility
  get allWaterLevelStations() {
    return this.stationsByType.WaterLevel;
  }
  get allRainLevelStations() {
    return this.stationsByType.Rain;
  }
  get allSewerLevelStations() {
    return this.stationsByType.Sewer;
  }
  get allFloodNtcStations() {
    return this.stationsByType.FloodNtc;
  }

  // Priority-aware computed getters for map display
  get effectiveWaterLevelIsActive() {
    if (this.panelIsOpen) {
      // Show if it's the panel's selected type OR if there's a selected WaterLevel station
      return (
        this.panelSelectedType === "WaterLevel" ||
        (this.selectedStationType === "WaterLevel" && this.selectedStationId)
      );
    }
    // When panel is closed, show if FilterLayer has it enabled OR if there's a selected WaterLevel station
    return (
      this.WaterLevelIsActive ||
      (this.selectedStationType === "WaterLevel" && this.selectedStationId)
    );
  }
  get effectiveRainIsActive() {
    if (this.panelIsOpen) {
      // Show if it's the panel's selected type OR if there's a selected Rain station
      return (
        this.panelSelectedType === "Rain" ||
        (this.selectedStationType === "Rain" && this.selectedStationId)
      );
    }
    // When panel is closed, show if FilterLayer has it enabled OR if there's a selected Rain station
    return (
      this.RainIsActive ||
      (this.selectedStationType === "Rain" && this.selectedStationId)
    );
  }
  get effectiveSewerIsActive() {
    if (this.panelIsOpen) {
      // Show if it's the panel's selected type OR if there's a selected Sewer station
      return (
        this.panelSelectedType === "Sewer" ||
        (this.selectedStationType === "Sewer" && this.selectedStationId)
      );
    }
    // When panel is closed, show if FilterLayer has it enabled OR if there's a selected Sewer station
    return (
      this.SewerIsActive ||
      (this.selectedStationType === "Sewer" && this.selectedStationId)
    );
  }
  get effectiveFloodNtcIsActive() {
    if (this.panelIsOpen) {
      // Show if it's the panel's selected type OR if there's a selected FloodNtc station
      return (
        this.panelSelectedType === "FloodNtc" ||
        (this.selectedStationType === "FloodNtc" && this.selectedStationId)
      );
    }
    // When panel is closed, show if FilterLayer has it enabled OR if there's a selected FloodNtc station
    return (
      this.FloodNtcIsActive ||
      (this.selectedStationType === "FloodNtc" && this.selectedStationId)
    );
  }

  // toggle UI layer visibility
  togglingWaterLevel() {
    this.WaterLevelIsActive = !this.WaterLevelIsActive;
  }
  togglingRain() {
    this.RainIsActive = !this.RainIsActive;
  }
  togglingSewer() {
    this.SewerIsActive = !this.SewerIsActive;
  }
  togglingFloodNtc() {
    this.FloodNtcIsActive = !this.FloodNtcIsActive;
  }

  // Panel state management
  setPanelOpen(isOpen) {
    this.panelIsOpen = isOpen;
  }
  setPanelSelectedType(type) {
    this.panelSelectedType = type;
  }

  // helpers
  clearMessages() {
    this.error = null;
    this.doneMsg = null;
  }

  // get all stations by type
  displayCityName = "";
  async getStationsByType(type, city = "") {
    // Check if we already have data for this type and city
    if (
      this.stationsByType[type] &&
      this.displayCityName === city &&
      !this.isLoadingByType[type]
    ) {
      console.log(
        `[StationsStore] Data already loaded for ${type} in city ${city}, skipping API call`
      );
      return;
    }

    try {
      console.log(
        `[StationsStore] Loading stations for type: ${type}, city: ${city}`
      );
      this.displayCityName = city;
      this.isLoadingByType[type] = true;

      const response = await stationService.getStationsByType(type, city);
      console.log(`[StationsStore] API response for ${type}:`, response);

      // The API returns data in result[0], which contains the stations array directly
      const result = response.data?.result?.[0];
      console.log(`[StationsStore] Parsed result for ${type}:`, result);

      const stations = result?.stations ?? result ?? [];
      console.log(
        `[StationsStore] Final stations array for ${type}:`,
        stations,
        "length:",
        stations.length
      );

      this.stationsByType[type] = stations;
      this.stationsMetaByType[type] = result;

      this.error = null;
      console.log(
        `[StationsStore] Successfully loaded ${stations.length} stations for ${type}`
      );
    } catch (error) {
      console.error(
        `[StationsStore] Error loading stations for ${type}:`,
        error
      );
      this.error = error?.response?.data?.error?.message || error.message;
      // Set empty array on error to prevent null data
      this.stationsByType[type] = [];
    } finally {
      this.isLoadingByType[type] = false;
    }
  }

  // selection helpers
  setSelectedStation(type, id) {
    this.selectedStationType = type;
    this.selectedStationId = id;
  }
  clearSelectedStation() {
    this.selectedStationType = null;
    this.selectedStationId = null;
  }
  isSelected(type, id) {
    return this.selectedStationType === type && this.selectedStationId === id;
  }

  // get station by id
  async getStationById(id) {
    return stationService.fetchStationById(id);
  }

  // get last observations
  async getLastObservations(dataStreamId, start, end) {
    return stationService.fetchObservations(dataStreamId, start, end);
  }
  async getWaterLevelTypes() {
    return stationService.getWaterLevelTypes();
  }
  async getRainTypes() {
    return stationService.getRainTypes();
  }

  // edit Station
  async editStation(inf, token, id, type) {
    try {
      const effectiveToken = token || sessionStorage.getItem("token");
      await stationService.updateStation(id, inf, effectiveToken, type);
      this.doneMsg = "Change successfully";
      this.error = null;
    } catch (error) {
      this.error = error?.response?.data?.error?.message || error.message;
    }
  }
  // create Station
  async createStation(inf, token, type) {
    try {
      console.log(inf);

      const effectiveToken = token || sessionStorage.getItem("token");
      await stationService.createStation(inf, effectiveToken, type);
      this.doneMsg = "created successfully";
      this.error = null;
    } catch (error) {
      console.log(error);
    }
  }

  // delete Station
  async deleteStation(id, token) {
    try {
      const effectiveToken = token || sessionStorage.getItem("token");
      await stationService.deleteStation(id, effectiveToken);
      this.error = null;
    } catch (error) {
      this.error = error?.response?.data?.error?.message || error.message;
    }
  }

  // get all cities
  async getAllCities() {
    return stationService.fetchAllCities();
  }
  // get fetch CountiesWithAreasAndStations
  async fetchCountiesWithAreasAndStations(type) {
    return stationService.fetchCountiesWithAreasAndStations(type);
  }
}

const stationsStore = new StationsStore();
export default stationsStore;