import React, { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { observer } from "mobx-react";
import authStore from "../../../stores/AuthStore";
import stationsStore from "../../../stores/StationsStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const CreateRain = observer(({ close }) => {
    const type = "Rain"
  const initialFormValue = {
    address: "string",
    alertH1: 0,
    alertH12: 0,
    alertH24: 0,
    alertH3: 0,
    alertH6: 0,
    area: "string",
    areaCode: "string",
    city: "string",
    county: "string",
    countyCode: "string",
    dataBeg: "string",
    description: "string",
    floodH12L: 0,
    floodH1L: 0,
    floodH24L: 0,
    floodH3L: 0,
    floodH6L: 0,
    latitude: 0,
    longitude: 0,
    metadataJson: "string",
    name: "string",
    operationStatus: "string",
    stationIndex: "string",
    stationNumber: "string",
    stationType: "string",
    street: "string",
    township: "string",
    warningCounty: "string"
  };

  const [createRainLevelData, setCreateRainLevelData] = useState(initialFormValue);
  const [rainType, setRainType] = useState([]);

  async function getRainTypes() {
    try {
      const response = await stationsStore.getRainTypes();
      setRainType(response.data.result);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getRainTypes();
  }, []);

  async function handleCreateRain(e) {
    e.preventDefault();
    stationsStore.doneMsg = null;
    stationsStore.error = null;

    await stationsStore.createStation(createRainLevelData, authStore.token ,type);
    if (stationsStore.doneMsg) {
      stationsStore.error = null;
      setCreateRainLevelData(initialFormValue);
    } else {
      stationsStore.doneMsg = null;
    }
  }

  const handleInputChange = (field, value) => {
    setCreateRainLevelData((prev) => ({
      ...prev,
      [field]: field.includes("alert") || field.includes("flood") || field === "latitude" || field === "longitude" ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <Modal show={true} onClose={close} size="lg" popup className="nav">
      <Modal.Header />
      <Modal.Body className="min-h-[78vh] p-6">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create New Rain Level Station
          </h3>
          <div className="handel-actions">
            <div
              className={`font-bold text-red-600 mt-3 text-center ${stationsStore.error ? "" : "hidden"}`}
            >
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                beat
                style={{ color: "#c70000" }}
              />
              {stationsStore.error}
            </div>
            <div
              className={`font-bold text-green-600 mt-3 text-center ${stationsStore.doneMsg ? "" : "hidden"}`}
            >
              {stationsStore.doneMsg}
            </div>
          </div>
          <form onSubmit={handleCreateRain} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Station Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createRainLevelData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                id="description"
                name="description"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createRainLevelData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            {/* Operation Status */}
            <div>
              <label htmlFor="operationStatus" className="block text-sm font-medium text-gray-700">
                Operation Status
              </label>
              <select
                id="operationStatus"
                name="operationStatus"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createRainLevelData.operationStatus}
                onChange={(e) => handleInputChange("operationStatus", e.target.value)}
                aria-required="true"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            {/* Station Type */}
            <div>
              <label htmlFor="stationType" className="block text-sm font-medium text-gray-700">
                Station Type
              </label>
              <select
                id="stationType"
                name="stationType"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createRainLevelData.stationType}
                onChange={(e) => handleInputChange("stationType", e.target.value)}
                aria-required="true"
              >
                  {rainType.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
              </select>
            </div>

            {/* Latitude */}
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                Latitude
              </label>
              <input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                required
                min="-90"
                max="90"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createRainLevelData.latitude}
                onChange={(e) => handleInputChange("latitude", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Longitude */}
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                Longitude
              </label>
              <input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                required
                min="-180"
                max="180"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createRainLevelData.longitude}
                onChange={(e) => handleInputChange("longitude", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* County */}
            <div>
              <label htmlFor="county" className="block text-sm font-medium text-gray-700">
                County
              </label>
              <input
                id="county"
                name="county"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createRainLevelData.county}
                onChange={(e) => handleInputChange("county", e.target.value)}
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createRainLevelData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createRainLevelData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>

            {/* Alert H1 */}
            <div>
              <label htmlFor="alertH1" className="block text-sm font-medium text-gray-700">
                Alert H1
              </label>
              <input
                id="alertH1"
                name="alertH1"
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createRainLevelData.alertH1}
                onChange={(e) => handleInputChange("alertH1", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Alert H3 */}
            <div>
              <label htmlFor="alertH3" className="block text-sm font-medium text-gray-700">
                Alert H3
              </label>
              <input
                id="alertH3"
                name="alertH3"
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createRainLevelData.alertH3}
                onChange={(e) => handleInputChange("alertH3", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Alert H6 */}
            <div>
              <label htmlFor="alertH6" className="block text-sm font-medium text-gray-700">
                Alert H6
              </label>
              <input
                id="alertH6"
                name="alertH6"
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createRainLevelData.alertH6}
                onChange={(e) => handleInputChange("alertH6", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Alert H12 */}
            <div>
              <label htmlFor="alertH12" className="block text-sm font-medium text-gray-700">
                Alert H12
              </label>
              <input
                id="alertH12"
                name="alertH12"
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createRainLevelData.alertH12}
                onChange={(e) => handleInputChange("alertH12", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Alert H24 */}
            <div>
              <label htmlFor="alertH24" className="block text-sm font-medium text-gray-700">
                Alert H24
              </label>
              <input
                id="alertH24"
                name="alertH24"
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createRainLevelData.alertH24}
                onChange={(e) => handleInputChange("alertH24", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Flood H1L */}
            <div>
              <label htmlFor="floodH1L" className="block text-sm font-medium text-gray-700">
                Flood H1L
              </label>
              <input
                id="floodH1L"
                name="floodH1L"
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createRainLevelData.floodH1L}
                onChange={(e) => handleInputChange("floodH1L", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Flood H3L */}
            <div>
              <label htmlFor="floodH3L" className="block text-sm font-medium text-gray-700">
                Flood H3L
              </label>
              <input
                id="floodH3L"
                name="floodH3L"
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createRainLevelData.floodH3L}
                onChange={(e) => handleInputChange("floodH3L", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Flood H6L */}
            <div>
              <label htmlFor="floodH6L" className="block text-sm font-medium text-gray-700">
                Flood H6L
              </label>
              <input
                id="floodH6L"
                name="floodH6L"
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createRainLevelData.floodH6L}
                onChange={(e) => handleInputChange("floodH6L", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Flood H12L */}
            <div>
              <label htmlFor="floodH12L" className="block text-sm font-medium text-gray-700">
                Flood H12L
              </label>
              <input
                id="floodH12L"
                name="floodH12L"
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createRainLevelData.floodH12L}
                onChange={(e) => handleInputChange("floodH12L", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Flood H24L */}
            <div>
              <label htmlFor="floodH24L" className="block text-sm font-medium text-gray-700">
                Flood H24L
              </label>
              <input
                id="floodH24L"
                name="floodH24L"
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createRainLevelData.floodH24L}
                onChange={(e) => handleInputChange("floodH24L", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Warning County */}
            <div className="sm:col-span-2">
              <label htmlFor="warningCounty" className="block text-sm font-medium text-gray-700">
                Warning County
              </label>
              <input
                id="warningCounty"
                name="warningCounty"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createRainLevelData.warningCounty}
                onChange={(e) => handleInputChange("warningCounty", e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="sm:col-span-2 flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600"
            >
              {stationsStore.loading ? (
                <FontAwesomeIcon className="text-xl" icon={faSpinner} spin />
              ) : (
                "Create Station"
              )}
            </button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
});

export default CreateRain;