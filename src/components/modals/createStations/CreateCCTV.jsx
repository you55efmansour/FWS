import React, {useState } from "react";
import { Modal } from "flowbite-react";
import { observer } from "mobx-react";
import authStore from "../../../stores/AuthStore";
import stationsStore from "../../../stores/StationsStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const CreateCCTV = observer(({ close }) => {
  const type = "CCTV";
  const initialFormValue = {
    address: "",
    area: "",
    areaCode: "",
    cctvid: "",
    city: "",
    county: "",
    countyCode: "",
    description: "",
    latitude: 0,
    linkID: "",
    locationMile: "",
    locationType: "",
    longitude: 0,
    metadataJson: "",
    name: "",
    operationStatus: "",
    roadClass: "",
    roadDirection: "",
    roadID: "",
    roadName: "",
    street: "",
    subAuthorityCode: "",
    surveillanceDescription: "",
    township: "",
    videoStreamURL: ""
  };

  const [createCCTVData, setCreateCCTVData] = useState(initialFormValue);

  async function handleCreateCCTV(e) {
    e.preventDefault();
    stationsStore.doneMsg = null;
    stationsStore.error = null;

    await stationsStore.createStation(createCCTVData, authStore.token, type);
    if (stationsStore.doneMsg) {
      stationsStore.error = null;
      setCreateCCTVData(initialFormValue);
    } else {
      stationsStore.doneMsg = null;
    }
  }

  const handleInputChange = (field, value) => {
    setCreateCCTVData((prev) => ({
      ...prev,
      [field]: field === "latitude" || field === "longitude" ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <Modal show={true} onClose={close} size="lg" popup className="nav">
      <Modal.Header />
      <Modal.Body className="min-h-[78vh] p-6">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create New CCTV Station
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
          <form onSubmit={handleCreateCCTV} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                value={createCCTVData.name}
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
                value={createCCTVData.description}
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
                value={createCCTVData.operationStatus}
                onChange={(e) => handleInputChange("operationStatus", e.target.value)}
                aria-required="true"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            {/* Location Type */}
            <div>
              <label htmlFor="locationType" className="block text-sm font-medium text-gray-700">
                Location Type
              </label>
              <input
                id="locationType"
                name="locationType"
                type="text"
                step="any"
                required
                min="-90"
                max="90"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createCCTVData.locationType}
                onChange={(e) => handleInputChange("locationType", e.target.value)}
                aria-required="true"
              />
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
                value={createCCTVData.latitude}
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
                value={createCCTVData.longitude}
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
                value={createCCTVData.county}
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
                value={createCCTVData.city}
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
                value={createCCTVData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>

            {/* Road Name */}
            <div>
              <label htmlFor="roadName" className="block text-sm font-medium text-gray-700">
                Road Name
              </label>
              <input
                id="roadName"
                name="roadName"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createCCTVData.roadName}
                onChange={(e) => handleInputChange("roadName", e.target.value)}
              />
            </div>

            {/* Road Direction */}
            <div>
              <label htmlFor="roadDirection" className="block text-sm font-medium text-gray-700">
                Road Direction
              </label>
              <input
                id="roadDirection"
                name="roadDirection"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createCCTVData.roadDirection}
                onChange={(e) => handleInputChange("roadDirection", e.target.value)}
              />
            </div>

            {/* Road Class */}
            <div>
              <label htmlFor="roadClass" className="block text-sm font-medium text-gray-700">
                Road Class
              </label>
              <input
                id="roadClass"
                name="roadClass"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createCCTVData.roadClass}
                onChange={(e) => handleInputChange("roadClass", e.target.value)}
              />
            </div>

            {/* CCTV ID */}
            <div>
              <label htmlFor="cctvid" className="block text-sm font-medium text-gray-700">
                CCTV ID
              </label>
              <input
                id="cctvid"
                name="cctvid"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createCCTVData.cctvid}
                onChange={(e) => handleInputChange("cctvid", e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Link ID */}
            <div>
              <label htmlFor="linkID" className="block text-sm font-medium text-gray-700">
                Link ID
              </label>
              <input
                id="linkID"
                name="linkID"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createCCTVData.linkID}
                onChange={(e) => handleInputChange("linkID", e.target.value)}
              />
            </div>

            {/* Road ID */}
            <div>
              <label htmlFor="roadID" className="block text-sm font-medium text-gray-700">
                Road ID
              </label>
              <input
                id="roadID"
                name="roadID"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createCCTVData.roadID}
                onChange={(e) => handleInputChange("roadID", e.target.value)}
              />
            </div>

            {/* Location Mile */}
            <div>
              <label htmlFor="locationMile" className="block text-sm font-medium text-gray-700">
                Location Mile
              </label>
              <input
                id="locationMile"
                name="locationMile"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createCCTVData.locationMile}
                onChange={(e) => handleInputChange("locationMile", e.target.value)}
              />
            </div>

            {/* Surveillance Description */}
            <div className="sm:col-span-2">
              <label htmlFor="surveillanceDescription" className="block text-sm font-medium text-gray-700">
                Surveillance Description
              </label>
              <input
                id="surveillanceDescription"
                name="surveillanceDescription"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createCCTVData.surveillanceDescription}
                onChange={(e) => handleInputChange("surveillanceDescription", e.target.value)}
              />
            </div>

            {/* Video Stream URL */}
            <div className="sm:col-span-2">
              <label htmlFor="videoStreamURL" className="block text-sm font-medium text-gray-700">
                Video Stream URL
              </label>
              <input
                id="videoStreamURL"
                name="videoStreamURL"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createCCTVData.videoStreamURL}
                onChange={(e) => handleInputChange("videoStreamURL", e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="sm:col-span-2 flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600"
            >
              {stationsStore.loading ? (
                <FontAwesomeIcon className="text-xl" icon={faSpinner} spin />
              ) : (
                "Create CCTV Station"
              )}
            </button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
});

export default CreateCCTV;