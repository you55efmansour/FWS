import {
  faSpinner,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "flowbite-react";
import { observer } from "mobx-react";
import { useState } from "react";
import stationsStore from "../../../stores/StationsStore";
import authStore from "../../../stores/AuthStore";
import { useTranslation } from "react-i18next"; // Assuming i18next for localization

const EditStationModal = observer(
  ({ element, close, type, getStationById }) => {
    console.log(type);
    
    const { t } = useTranslation(); // Hook to access translations

    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);

    async function handleEdit(e, id) {
      e.preventDefault();
      setLoading(true);

      const form = e.target;

      let updatedData = {
        longitude: +form.longitude.value,
        latitude: +form.latitude.value,
        alertL1: +form.alertL1.value,
        alertL2: +form.alertL2.value,
        name: form.name.value,
        // addR_E: form.addR_E.value,
        // address: form.address.value,
        // admicode: +form.admicode.value,
        // alert: +form.alert.value,
      };
      if (form.alertL3?.value) updatedData = {...updatedData, alertL3: +form.alertL3.value,} 

      console.log(updatedData);
      
      await stationsStore.editStation(updatedData, authStore.token, id, type);

      if (stationsStore.doneMsg) {
        stationsStore.error = null;
        close();
        await getStationById(element.id);
        stationsStore.doneMsg = null;
      } else {
        stationsStore.doneMsg = null;
      }
      setLoading(false);
    }

    return (
      <Modal size="lg" show={true} onClose={close} className="nav">
        <Modal.Header>
          {t("editStationModal.header", { name: element?.name || "Unknown" })}
        </Modal.Header>
        <Modal.Body className="min-h-[70vh]">
          <div className="handel-actions">
            <div
              className={`font-bold text-red-600 mt-3 ${
                stationsStore.error ? "" : "hidden"
              } text-center`}
            >
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                beat
                style={{ color: "#c70000" }}
              />{" "}
              {stationsStore.error}
            </div>
            <div
              className={`font-bold ${
                stationsStore.doneMsg ? "" : "hidden"
              } text-green-600 mt-3 text-center`}
            >
              {stationsStore.doneMsg}
            </div>
          </div>
          <form onSubmit={(e) => handleEdit(e, element.id)}>
            {/* name */}
            <div>
              <label htmlFor="name" className="block text-sm/6 font-medium">
                {t("editStationModal.form.labels.name")}
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  defaultValue={element.name}
                />
              </div>
            </div>
            {/* longitude */}
            <div>
              <label
                htmlFor="longitude"
                className="block text-sm/6 font-medium"
              >
                {t("editStationModal.form.labels.longitude")}
              </label>
              <div className="mt-2">
                <input
                  id="longitude"
                  name="longitude"
                  type="number"
                  required
                  autoComplete="longitude"
                  className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  defaultValue={element.longitude}
                />
              </div>
            </div>
            {/* latitude */}
            <div>
              <label htmlFor="latitude" className="block text-sm/6 font-medium">
                {t("editStationModal.form.labels.latitude")}
              </label>
              <div className="mt-2">
                <input
                  id="latitude"
                  name="latitude"
                  type="number"
                  required
                  autoComplete="latitude"
                  className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  defaultValue={element.latitude}
                />
              </div>
            </div>
            {/* alertL1 */}
            <div>
              <label
                htmlFor="alertL1"
                className="block text-sm/6 font-medium text-red-700"
              >
                {t("editStationModal.form.labels.alertL1")}
              </label>
              <div className="mt-2">
                <input
                  id="alertL1"
                  name="alertL1"
                  type="number"
                  required
                  autoComplete="alertL1"
                  className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  defaultValue={element.alertL1}
                />
              </div>
            </div>
            {/* alertL2 */}
            <div>
              <label
                htmlFor="alertL2"
                className="block text-sm/6 font-medium text-orange-500"
              >
                {t("editStationModal.form.labels.alertL2")}
              </label>
              <div className="mt-2">
                <input
                  id="alertL2"
                  name="alertL2"
                  type="number"
                  required
                  autoComplete="alertL2"
                  className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  defaultValue={element.alertL2}
                />
              </div>
            </div>
            {/* alertL3 */}
            {typeof element.alertL3 === 'number'?(<div>
              <label
                htmlFor="alertL3"
                className="block text-sm/6 font-medium text-green-600"
              >
                {t("editStationModal.form.labels.alertL3")}
              </label>
              <div className="mt-2">
                <input
                  id="alertL3"
                  name="alertL3"
                  type="number"
                  required
                  autoComplete="alertL3"
                  className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  defaultValue={element.alertL3}
                />
              </div>
            </div>
            ):""
            }

            <button
              className={`flex w-full justify-center rounded-md ${
                showMore ? "bg-gray-600" : "bg-green-600"
              } px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm  ${
                showMore ? "hover:bg-gray-500" : "hover:bg-green-500"
              }  hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-3`}
              type="button"
              onClick={() => {
                setShowMore((prev) => !prev);
              }}
            >
              {showMore
                ? t("editStationModal.form.buttons.less")
                : t("editStationModal.form.buttons.more")}
            </button>

            <div className={`${showMore ? "" : "hidden"}`}>
              {/* addR_E */}
              <div>
                <label htmlFor="addR_E" className="block text-sm font-medium">
                  addR_E
                </label>
                <div className="mt-2">
                  <input
                    id="addR_E"
                    name="addR_E"
                    type="text"
                    defaultValue={element.addR_E}
                    className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 outline-gray-300 
        placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              {/* address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium">
                  address
                </label>
                <div className="mt-2">
                  <input
                    id="address"
                    name="address"
                    type="text"
                    defaultValue={element.address}
                    className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 outline-gray-300 
        placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              {/* admicode */}
              <div>
                <label htmlFor="admicode" className="block text-sm font-medium">
                 admicode
                </label>
                <div className="mt-2">
                  <input
                    id="admicode"
                    name="admicode"
                    type="number"
                    defaultValue={element.admicode}
                    className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 outline-gray-300 
        placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              {/* alert */}
              <div>
                <label
                  htmlFor="alert"
                  className="block text-sm font-medium text-red-600"
                >
                  alert
                </label>
                <div className="mt-2">
                  <input
                    id="alert"
                    name="alert"
                    type="number"
                    defaultValue={element.alert}
                    className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 outline-gray-300 
        placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* btns start */}
            {loading ? (
              <FontAwesomeIcon
                className="text-xl font-bold"
                icon={faSpinner}
                spin
              />
            ) : (
              <div className="btns">
                {/* done btn */}
                <button
                  className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-500 hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-3"
                  type="submit"
                >
                  {t("editStationModal.form.buttons.done")}
                </button>
              </div>
            )}
            {/* btns end */}
          </form>
        </Modal.Body>
      </Modal>
    );
  }
);

export default EditStationModal;
