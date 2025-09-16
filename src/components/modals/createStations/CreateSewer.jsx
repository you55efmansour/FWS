import React, { useState } from "react";
import { Modal } from "flowbite-react";
import { observer } from "mobx-react";
import authStore from "../../../stores/AuthStore";
import stationsStore from "../../../stores/StationsStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const CreateSewer = observer(({ close }) => {
  const type = "Sewer";
  const initialFormValue = {
    address: "",
    area: "",
    areaCode: "",
    batteryvol: 0,
    city: "",
    county: "",
    countyCode: "",
    dateTime: "",
    delay: false,
    description: "",
    device_type: "",
    latitude: 0,
    longitude: 0,
    metadataJson: "",
    name: "",
    notify: false,
    operationStatus: "",
    organizationId: "",
    rssi: "",
    stationIndex: "",
    stationNumber: "",
    street: "",
    township: "",
    village: "",
    warn_lv1: 0,
    warn_lv2: 0,
    warn_lv3: 0,
    water_inner: 0,
    water_inner_bed: 0
  };

  const [createSewerData, setCreateSewerData] = useState(initialFormValue);


  async function handleCreateSewer(e) {
    e.preventDefault();
    stationsStore.doneMsg = null;
    stationsStore.error = null;

    await stationsStore.createStation(createSewerData, authStore.token, type);
    if (stationsStore.doneMsg) {
      stationsStore.error = null;
      setCreateSewerData(initialFormValue);
    } else {
      stationsStore.doneMsg = null;
    }
  }

  const handleInputChange = (field, value) => {
    setCreateSewerData((prev) => ({
      ...prev,
      [field]: 
        field.includes("warn_") || 
        field.includes("water_") || 
        field === "batteryvol" || 
        field === "latitude" || 
        field === "longitude" 
          ? parseFloat(value) || 0 
          : field === "delay" || field === "notify"
            ? value === "true"
            : value
    }));
  };

  return (
    <Modal show={true} onClose={close} size="lg" popup className="nav">
      <Modal.Header />
      <Modal.Body className="min-h-[78vh] p-6">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create New Sewer Station
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
          <form onSubmit={handleCreateSewer} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                value={createSewerData.name}
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
                value={createSewerData.description}
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
                value={createSewerData.operationStatus}
                onChange={(e) => handleInputChange("operationStatus", e.target.value)}
                aria-required="true"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Maintenance">Maintenance</option>
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
                value={createSewerData.latitude}
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
                value={createSewerData.longitude}
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
                value={createSewerData.county}
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
                value={createSewerData.city}
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
                value={createSewerData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>

            {/* Village */}
            <div>
              <label htmlFor="village" className="block text-sm font-medium text-gray-700">
                Village
              </label>
              <input
                id="village"
                name="village"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createSewerData.village}
                onChange={(e) => handleInputChange("village", e.target.value)}
              />
            </div>

            {/* Battery Voltage */}
            <div>
              <label htmlFor="batteryvol" className="block text-sm font-medium text-gray-700">
                Battery Voltage
              </label>
              <input
                id="batteryvol"
                name="batteryvol"
                type="number"
                step="any"
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createSewerData.batteryvol}
                onChange={(e) => handleInputChange("batteryvol", e.target.value)}
              />
            </div>

            {/* Warn Level 1 */}
            <div>
              <label htmlFor="warn_lv1" className="block text-sm font-medium text-gray-700">
                Warning Level 1
              </label>
              <input
                id="warn_lv1"
                name="warn_lv1"
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createSewerData.warn_lv1}
                onChange={(e) => handleInputChange("warn_lv1", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Warn Level 2 */}
            <div>
              <label htmlFor="warn_lv2" className="block text-sm font-medium text-gray-700">
                Warning Level 2
              </label>
              <input
                id="warn_lv2"
                name="warn_lv2"
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createSewerData.warn_lv2}
                onChange={(e) => handleInputChange("warn_lv2", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Warn Level 3 */}
            <div>
              <label htmlFor="warn_lv3" className="block text-sm font-medium text-gray-700">
                Warning Level 3
              </label>
              <input
                id="warn_lv3"
                name="warn_lv3"
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createSewerData.warn_lv3}
                onChange={(e) => handleInputChange("warn_lv3", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Water Inner */}
            <div>
              <label htmlFor="water_inner" className="block text-sm font-medium text-gray-700">
                Water Inner
              </label>
              <input
                id="water_inner"
                name="water_inner"
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createSewerData.water_inner}
                onChange={(e) => handleInputChange("water_inner", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Water Inner Bed */}
            <div>
              <label htmlFor="water_inner_bed" className="block text-sm font-medium text-gray-700">
                Water Inner Bed
              </label>
              <input
                id="water_inner_bed"
                name="water_inner_bed"
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createSewerData.water_inner_bed}
                onChange={(e) => handleInputChange("water_inner_bed", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Delay */}
            <div>
              <label htmlFor="delay" className="block text-sm font-medium text-gray-700">
                Delay
              </label>
              <select
                id="delay"
                name="delay"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createSewerData.delay.toString()}
                onChange={(e) => handleInputChange("delay", e.target.value)}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            {/* Notify */}
            <div>
              <label htmlFor="notify" className="block text-sm font-medium text-gray-700">
                Notify
              </label>
              <select
                id="notify"
                name="notify"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createSewerData.notify.toString()}
                onChange={(e) => handleInputChange("notify", e.target.value)}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <button
              type="submit"
              className="sm:col-span-2 flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600"
            >
              {stationsStore.loading ? (
                <FontAwesomeIcon className="text-xl" icon={faSpinner} spin />
              ) : (
                "Create Sewer Station"
              )}
            </button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
});

export default CreateSewer;