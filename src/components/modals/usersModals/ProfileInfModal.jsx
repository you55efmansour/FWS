import React, { useEffect } from "react";
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

const ProfileInfModal = observer(({ close }) => {
  const {t} = useTranslation()
  async function getUser() {
    userStore.loading = true;
    await userStore.getUser(authStore.userId, authStore.token);
  }

  async function handleEditUser(e) {
    e.preventDefault();
    userStore.loading = true;
    userStore.doneMsg = null;
    userStore.error = null;

    const form = e.target;

    const updatedUser = {
      name: form.name.value,
      id: form.id.value,
      emailAddress: form.emailAddress.value,
      userName: form.userName.value,
    };

    userStore.userData = {
      ...userStore.userData,
      ...updatedUser,
    };

    await userStore.editUser(userStore.userData, authStore.token);

    userStore.loading = false;
    userStore.doneMsg ? (userStore.error = null) : (userStore.doneMsg = null);
  }

  function closeModal() {
    close();
    userStore.doneMsg = null;
    userStore.error = null;
  }

  useEffect(() => {
    userStore.loading = true;
    getUser();
    userStore.loading = false;
  }, []);

  return (
    <div>
      {userStore.userData ? (
        <Modal
          show={true}
          onClose={() => {
            closeModal();
          }}
          size="md"
          popup
          className="nav"
        >
          <Modal.Header>{t("ProfileInformation.header")}</Modal.Header>

          {authStore.userId && (
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
                    } text-green-600 mt-3  text-center`}
                  >
                    {userStore.doneMsg && userStore.doneMsg}
                  </div>
                </div>
                <form onSubmit={(e) => handleEditUser(e)}>
                  {/* user-name  */}
                  <div>
                    <label
                      htmlFor="user-name"
                      className="block text-sm/6 font-medium "
                    >
                      {t("ProfileInformation.userName")}
                    </label>
                    <div className="mt-2">
                      <input
                        id="user-name"
                        name="userName"
                        type="text"
                        required
                        autoComplete="user-name"
                        className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base  outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        defaultValue={userStore.userData.userName}
                      />
                    </div>
                  </div>
                  {/* name  */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm/6 font-medium "
                    >
                      {t("ProfileInformation.name")}
                    </label>
                    <div className="mt-2">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base  outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        defaultValue={userStore.userData.name}
                      />
                    </div>
                  </div>
                  {/* Id */}
                  <div>
                    <label
                      htmlFor="id"
                      className="block text-sm/6 font-medium "
                    >
                      {t("ProfileInformation.id")}
                    </label>
                    <div className="mt-2">
                      <input
                        id="id"
                        name="id"
                        type="text"
                        required
                        autoComplete="id"
                        className="block w-full text-black rounded-md bg-slate-400 px-3 py-1.5 text-base  outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 hover:cursor-not-allowed"
                        defaultValue={userStore.userData.id}
                        disabled
                      />
                    </div>
                  </div>
                  {/* email */}
                  <div>
                    <label
                      htmlFor="emailAddress"
                      className="block text-sm/6 font-medium "
                    >
                      {t("ProfileInformation.email")}
                    </label>
                    <div className="mt-2">
                      <input
                        id="emailAddress"
                        name="emailAddress"
                        type="emailAddress"
                        required
                        autoComplete="emailAddress"
                        className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base  outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        defaultValue={userStore.userData.emailAddress}
                      />
                    </div>
                  </div>

                  {/* change btn start */}
                  {userStore.loading ? (
                    <FontAwesomeIcon
                      className="text-xl font-bold"
                      icon={faSpinner}
                      spin
                    />
                  ) : (
                    <button
                      className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-500 hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-3"
                      type="submit"
                    >
                      {t("ProfileInformation.change")}
                    </button>
                  )}
                  {/* change btn end */}
                </form>
              </div>
            </Modal.Body>
          )}
        </Modal>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
});

export default ProfileInfModal;
