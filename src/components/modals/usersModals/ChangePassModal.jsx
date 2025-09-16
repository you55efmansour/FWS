import React, { useState } from "react";
import { Modal } from "flowbite-react";
import { observer } from "mobx-react";
import authStore from "../../../stores/AuthStore";
import userStore from "../../../stores/UsersStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const ChangePassModal = observer(({ close }) => {
  const {t} = useTranslation()
  const initialFormValue = {
    currentPassword: "",
    newPassword: "",
  };

  const [changePassData, setChangePassData] = useState(initialFormValue);

  async function handleChangeForm(e) {
    e.preventDefault();
    userStore.doneMsg = null;
    userStore.error = null;
    await userStore.changePassword(changePassData, authStore.token);
    userStore.doneMsg ? (userStore.error = null) : (userStore.doneMsg = null);
  }
  function closeModal() {
    close();
    userStore.doneMsg = null;
    userStore.error = null;
  }

  return (
    <Modal
      show={true}
      onClose={() => {
        closeModal();
      }}
      size="sm"
      popup
      className="nav"
    >
      <Modal.Header>{t("ChangePassword.header")}</Modal.Header>
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
              } text-green-600 mt-3 text-center`}
            >
              {userStore.doneMsg && userStore.doneMsg}
            </div>
          </div>
          <form onSubmit={(e) => handleChangeForm(e)}>
            {/* currentPassword  */}
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm/6 font-medium "
              >
                {t("ChangePassword.currentPassword")}
              </label>
              <div className="mt-2">
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="text"
                  required
                  autoComplete="currentPassword"
                  className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base  outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(event) =>
                    setChangePassData((prev) => ({
                      ...prev,
                      currentPassword: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* newPassword */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm/6 font-medium "
              >
                {t("ChangePassword.newPassword")}
              </label>
              <div className="mt-2">
                <input
                  id="newPassword"
                  name="newPassword"
                  type="text"
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
                "Change"
              )}
            </button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
});

export default ChangePassModal;
