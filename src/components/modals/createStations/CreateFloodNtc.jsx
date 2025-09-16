import React, {useState } from "react";
import { Modal } from "flowbite-react";
import { observer } from "mobx-react";
import authStore from "../../../stores/AuthStore";
import stationsStore from "../../../stores/StationsStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const CreateFloodNtc = observer(({ close }) => {
  const type = "FloodNtc";
  const initialFormValue = {
    address: "",
    area: "",
    areaCode: "",
    basin: "",
    batteryVol: 0,
    batteryVol2: 0,
    city: "",
    county: "",
    countyCode: "",
    datatime: "",
    description: "",
    deviceType: "",
    dtype: 0,
    imageinfo: "",
    latitude: 0,
    leftHeight: 0,
    longitude: 0,
    metadataJson: "",
    name: "",
    notify: false,
    operationStatus: "",
    orgId: "",
    rainInner: 0,
    receivetime: "",
    rightHeight: 0,
    river: "",
    sendtime: "",
    speed: 0,
    stCode: "",
    stName: "",
    stNo: "",
    street: "",
    supplier: 0,
    township: "",
    village: "",
    warnLv1: 0,
    warnLv2: 0,
    warnLv3: 0,
    waterInner: 0
  };

  const [createFloodNtcData, setCreateFloodNtcData] = useState(initialFormValue);
  async function handleCreateFloodNtc(e) {
    e.preventDefault();
    stationsStore.doneMsg = null;
    stationsStore.error = null;

    await stationsStore.createStation(createFloodNtcData, authStore.token, type);
    if (stationsStore.doneMsg) {
      stationsStore.error = null;
      setCreateFloodNtcData(initialFormValue);
    } else {
      stationsStore.doneMsg = null;
    }
  }

  const handleInputChange = (field, value) => {
    setCreateFloodNtcData((prev) => ({
      ...prev,
      [field]: 
        field.includes("warnLv") || 
        field.includes("Height") || 
        field === "batteryVol" || 
        field === "batteryVol2" || 
        field === "latitude" || 
        field === "longitude" || 
        field === "rainInner" || 
        field === "waterInner" || 
        field === "speed" || 
        field === "dtype" || 
        field === "supplier"
          ? parseFloat(value) || 0 
          : field === "notify"
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
            Create New Flood NTC Station
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
          <form onSubmit={handleCreateFloodNtc} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                value={createFloodNtcData.name}
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
                value={createFloodNtcData.description}
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
                value={createFloodNtcData.operationStatus}
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
                value={createFloodNtcData.latitude}
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
                value={createFloodNtcData.longitude}
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
                value={createFloodNtcData.county}
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
                value={createFloodNtcData.city}
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
                value={createFloodNtcData.address}
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
                value={createFloodNtcData.village}
                onChange={(e) => handleInputChange("village", e.target.value)}
              />
            </div>

            {/* Basin */}
            <div>
              <label htmlFor="basin" className="block text-sm font-medium text-gray-700">
                Basin
              </label>
              <input
                id="basin"
                name="basin"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createFloodNtcData.basin}
                onChange={(e) => handleInputChange("basin", e.target.value)}
              />
            </div>

            {/* River */}
            <div>
              <label htmlFor="river" className="block text-sm font-medium text-gray-700">
                River
              </label>
              <input
                id="river"
                name="river"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createFloodNtcData.river}
                onChange={(e) => handleInputChange("river", e.target.value)}
              />
            </div>

            {/* Battery Voltage */}
            <div>
              <label htmlFor="batteryVol" className="block text-sm font-medium text-gray-700">
                Battery Voltage
              </label>
              <input
                id="batteryVol"
                name="batteryVol"
                type="number"
                step="any"
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createFloodNtcData.batteryVol}
                onChange={(e) => handleInputChange("batteryVol", e.target.value)}
              />
            </div>

            {/* Battery Voltage 2 */}
            <div>
              <label htmlFor="batteryVol2" className="block text-sm font-medium text-gray-700">
                Battery Voltage 2
              </label>
              <input
                id="batteryVol2"
                name="batteryVol2"
                type="number"
                step="any"
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createFloodNtcData.batteryVol2}
                onChange={(e) => handleInputChange("batteryVol2", e.target.value)}
              />
            </div>

            {/* Left Height */}
            <div>
              <label htmlFor="leftHeight" className="block text-sm font-medium text-gray-700">
                Left Height
              </label>
              <input
                id="leftHeight"
                name="leftHeight"
                type="number"
                step="any"
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createFloodNtcData.leftHeight}
                onChange={(e) => handleInputChange("leftHeight", e.target.value)}
              />
            </div>

            {/* Right Height */}
            <div>
              <label htmlFor="rightHeight" className="block text-sm font-medium text-gray-700">
                Right Height
              </label>
              <input
                id="rightHeight"
                name="rightHeight"
                type="number"
                step="any"
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createFloodNtcData.rightHeight}
                onChange={(e) => handleInputChange("rightHeight", e.target.value)}
              />
            </div>

            {/* Warn Level 1 */}
            <div>
              <label htmlFor="warnLv1" className="block text-sm font-medium text-gray-700">
                Warning Level 1
              </label>
              <input
                id="warnLv1"
                name="warnLv1"
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createFloodNtcData.warnLv1}
                onChange={(e) => handleInputChange("warnLv1", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Warn Level 2 */}
            <div>
              <label htmlFor="warnLv2" className="block text-sm font-medium text-gray-700">
                Warning Level 2
              </label>
              <input
                id="warnLv2"
                name="warnLv2"
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createFloodNtcData.warnLv2}
                onChange={(e) => handleInputChange("warnLv2", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Warn Level 3 */}
            <div>
              <label htmlFor="warnLv3" className="block text-sm font-medium text-gray-700">
                Warning Level 3
              </label>
              <input
                id="warnLv3"
                name="warnLv3"
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createFloodNtcData.warnLv3}
                onChange={(e) => handleInputChange("warnLv3", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Rain Inner */}
            <div>
              <label htmlFor="rainInner" className="block text-sm font-medium text-gray-700">
                Rain Inner
              </label>
              <input
                id="rainInner"
                name="rainInner"
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createFloodNtcData.rainInner}
                onChange={(e) => handleInputChange("rainInner", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Water Inner */}
            <div>
              <label htmlFor="waterInner" className="block text-sm font-medium text-gray-700">
                Water Inner
              </label>
              <input
                id="waterInner"
                name="waterInner"
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createFloodNtcData.waterInner}
                onChange={(e) => handleInputChange("waterInner", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Speed */}
            <div>
              <label htmlFor="speed" className="block text-sm font-medium text-gray-700">
                Speed
              </label>
              <input
                id="speed"
                name="speed"
                type="number"
                step="any"
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createFloodNtcData.speed}
                onChange={(e) => handleInputChange("speed", e.target.value)}
              />
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
                value={createFloodNtcData.notify.toString()}
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
                "Create Flood NTC Station"
              )}
            </button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
});

export default CreateFloodNtc;