import React, { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { observer } from "mobx-react";
import authStore from "../../../stores/AuthStore";
import userStore from "../../../stores/UsersStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faSpinner,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import ProtectedRoute from "../../protected/ProtectedRoute";


const ResetPassModal = observer(({ close }) => {
  const {t}=useTranslation()

  const [showPasswordOne, setShowPasswordOne] = useState(false);
  const [showPasswordTwo, setShowPasswordTwo] = useState(false);

  const initialFormValue = {
    adminPassword: "",
    newPassword: "",
    userId: null,
  };

  const [changePassData, setChangePassData] = useState(initialFormValue);

  async function handleChangeForm(e) {
    e.preventDefault();
    userStore.doneMsg = null;
    userStore.error = null;
    await userStore.resetPassword(changePassData, authStore.token);
    userStore.doneMsg ? (userStore.error = null) : (userStore.doneMsg = null);
  }

  function closeModal() {
    close();
    userStore.doneMsg = null;
    userStore.error = null;
  }

  useEffect(() => {
    userStore.error = null;
  }, []);

  return (
    <ProtectedRoute permission={["Users.ResetPassword"]}>
      <Modal
        show={true}
        onClose={() => {
          closeModal();
        }}
        size="sm"
        popup
        className="nav"
      >
      <Modal.Header>{t("ResetPassword.header")}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="handel-actions">
              <div
                className={`font-bold text-red-600 mt-3 ${
                  userStore.error ? "" : "hidden"
                }  text-center`}
              >
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  beat
                  style={{ color: "#c70000" }}
                />{" "}
                {userStore.error}
              </div>
              <div
                className={`font-bold ${
                  userStore.doneMsg ? "" : "hidden"
                }  text-center text-green-600 mt-3`}
              >
                {userStore.doneMsg && userStore.doneMsg}
              </div>
            </div>

            <form onSubmit={(e) => handleChangeForm(e)}>
              {/* adminPassword  */}
              <div>
                <label
                  htmlFor="adminPassword"
                  className="block text-sm/6 font-medium "
                >
                  {t("ResetPassword.adminPassword")}
                </label>
                <div className="mt-2 flex items-center">
                  <input
                    id="adminPassword"
                    name="adminPassword"
                    type={showPasswordOne ? "text" : "password"}
                    required
                    autoComplete="adminPassword"
                    className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base  outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    onChange={(event) =>
                      setChangePassData((prev) => ({
                        ...prev,
                        adminPassword: event.target.value,
                      }))
                    }
                  />
                  <span
                    className="hover:cursor-pointer ms-1"
                    onClick={() => {
                      setShowPasswordOne(!showPasswordOne);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={showPasswordOne ? faEye : faEyeSlash}
                    />
                  </span>
                </div>
              </div>

              {/* newPassword */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm/6 font-medium "
                >
                  {t("ResetPassword.newPassword")}
                </label>
                <div className="mt-2 flex items-center ">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPasswordTwo ? "text" : "password"}
                    required
                    autoComplete="newPassword"
                    className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base  outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    onChange={(event) =>
                      setChangePassData((prev) => ({
                        ...prev,
                        newPassword: event.target.value,
                      }))
                    }
                  />
                  <span
                    className="hover:cursor-pointer ms-1"
                    onClick={() => {
                      setShowPasswordTwo(!showPasswordTwo);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={showPasswordTwo ? faEye : faEyeSlash}
                    />
                  </span>
                </div>
              </div>
              {/* userId */}
              <div>
                <label htmlFor="userId" className="block text-sm/6 font-medium ">
                  {t("ResetPassword.id")}
                </label>
                <div className="mt-2">
                  <input
                    id="userId"
                    name="userId"
                    type="text"
                    required
                    autoComplete="userId"
                    className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base  outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    onChange={(event) =>
                      setChangePassData((prev) => ({
                        ...prev,
                        userId: +event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <button
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-500 hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-3"
                type="submit"
              >
                {userStore.loading ? (
                  <FontAwesomeIcon
                    className="text-xl font-bold"
                    icon={faSpinner}
                    spin
                  />
                ) : (
                  `${t("ResetPassword.change")}`
                )}
              </button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </ProtectedRoute>
  );
});

export default ResetPassModal;
