import React, { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { observer } from "mobx-react";
import authStore from "../../../stores/AuthStore";
import stationsStore from "../../../stores/StationsStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

const CreateWaterLevel = observer(({ close }) => {
  const type = "Waterlevel"
  const initialFormValue = {
    addR_E: "string",
    address: "string",
    admicode: 0,
    alert: 10,
    alertL1: 10,
    alertL2: 10,
    alertL3: 10,
    area: "string",
    areaCode: "string",
    city: "string",
    county: "string",
    countyCode: "string",
    deptid: 0,
    description: "WaterLevelStation",
    latitude: 3.14,
    leveL0: 0,
    longitude: 3.14,
    metadataJson: "",
    namE_E: "string",
    name: "WaterLevel1",
    observe: 0,
    operationStatus: "Active",
    photoDate: "string",
    photoLink1: "string",
    photoLink2: "string",
    reservoir: 0,
    river: "string",
    rivwlsta_id: 0,
    stationIndex: "string",
    stationNumber: "string",
    stationType: "string",
    status: "string",
    street: "string",
    tM_X97: 0,
    tM_Y97: 0,
    township: "string",
    wR_DIST_NO: 0,
    warning: "string",
  };

  const [createWaterLevelData, setCreateWaterLevelData] =
    useState(initialFormValue);

  async function handleCreateWaterLevel(e) {
    e.preventDefault();
    stationsStore.doneMsg = null;
    stationsStore.error = null;

    await stationsStore.createStation(
      createWaterLevelData,
      authStore.token,
      type
    );
    if (stationsStore.doneMsg) {
      stationsStore.error = null;
      setCreateWaterLevelData(initialFormValue);
    } else {
      stationsStore.doneMsg = null;
    }
  }

  const handleInputChange = (field, value) => {
    setCreateWaterLevelData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const[waterLevelType , setWaterLevelType]=useState([])
  async function getWaterLevelTypes(params) {
    try{
      const response = await stationsStore.getWaterLevelTypes()
      setWaterLevelType(response.data.result)
      
    }catch(error){
      console.log(error);
      
    }
  }

  useEffect(()=>{
    getWaterLevelTypes()
  },[])

  return (
    <Modal show={true} onClose={close} size="lg" popup className="nav">
      <Modal.Header />
      <Modal.Body className="min-h-[78vh] p-6">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create New Water Level Station
          </h3>
          <div className="handel-actions">
            <div
              className={`font-bold text-red-600 mt-3 text-center ${
                stationsStore.error ? "" : "hidden"
              }`}
            >
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                beat
                style={{ color: "#c70000" }}
              />
              {stationsStore.error}
            </div>
            <div
              className={`font-bold text-green-600 mt-3 text-center ${
                stationsStore.doneMsg ? "" : "hidden"
              }`}
            >
              {stationsStore.doneMsg}
            </div>
          </div>
          <form
            onSubmit={handleCreateWaterLevel}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Station Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createWaterLevelData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <input
                id="description"
                name="description"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createWaterLevelData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </div>

            {/* Operation Status */}
            <div>
              <label
                htmlFor="operationStatus"
                className="block text-sm font-medium text-gray-700"
              >
                Operation Status
              </label>
              <select
                id="operationStatus"
                name="operationStatus"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createWaterLevelData.operationStatus}
                onChange={(e) =>
                  handleInputChange("operationStatus", e.target.value)
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            {/* Latitude */}
            <div>
              <label
                htmlFor="latitude"
                className="block text-sm font-medium text-gray-700"
              >
                Latitude
              </label>
              <input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createWaterLevelData.latitude}
                onChange={(e) =>
                  handleInputChange("latitude", parseFloat(e.target.value))
                }
              />
            </div>

            {/* Longitude */}
            <div>
              <label
                htmlFor="longitude"
                className="block text-sm font-medium text-gray-700"
              >
                Longitude
              </label>
              <input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createWaterLevelData.longitude}
                onChange={(e) =>
                  handleInputChange("longitude", parseFloat(e.target.value))
                }
              />
            </div>

            {/* County */}
            <div>
              <label
                htmlFor="county"
                className="block text-sm font-medium text-gray-700"
              >
                County
              </label>
              <input
                id="county"
                name="county"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createWaterLevelData.county}
                onChange={(e) => handleInputChange("county", e.target.value)}
              />
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createWaterLevelData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createWaterLevelData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>

            {/* Alert Level 1 */}
            <div>
              <label
                htmlFor="alertL1"
                className="block text-sm font-medium text-gray-700"
              >
                Alert Level 1
              </label>
              <input
                id="alertL1"
                name="alertL1"
                type="number"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createWaterLevelData.alertL1}
                onChange={(e) =>
                  handleInputChange("alertL1", parseInt(e.target.value))
                }
              />
              
            </div>

            {/* Alert Level 2 */}
            <div>
              <label
                htmlFor="alertL2"
                className="block text-sm font-medium text-gray-700"
              >
                Alert Level 2
              </label>
              <input
                id="alertL2"
                name="alertL2"
                type="number"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createWaterLevelData.alertL2}
                onChange={(e) =>
                  handleInputChange("alertL2", parseInt(e.target.value))
                }
              />
            </div>

            {/* Alert Level 3 */}
            <div>
              <label
                htmlFor="alertL3"
                className="block text-sm font-medium text-gray-700"
              >
                Alert Level 3
              </label>
              <input
                id="alertL3"
                name="alertL3"
                type="number"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createWaterLevelData.alertL3}
                onChange={(e) =>
                  handleInputChange("alertL3", parseInt(e.target.value))
                }
              />
            </div>

            {/* Station Type */}
            <div>
              <label
                htmlFor="stationType"
                className="block text-sm font-medium text-gray-700"
              >
                Station Type
              </label>
              <select
                id="stationType"
                name="stationType"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createWaterLevelData.stationType}
                onChange={(e) =>
                  handleInputChange("stationType", e.target.value)
                }
              >
                {
                  waterLevelType.map((e)=><option key={e} value={`${e}`} >{e}</option>)
                }
              </select>
            </div>

            {/* River */}
            <div className="sm:col-span-2">
              <label
                htmlFor="river"
                className="block text-sm font-medium text-gray-700"
              >
                River
              </label>
              <input
                id="river"
                name="river"
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:border-indigo-600 focus:outline-none focus:ring-indigo-600 sm:text-sm"
                value={createWaterLevelData.river}
                onChange={(e) => handleInputChange("river", e.target.value)}
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

export default CreateWaterLevel;
