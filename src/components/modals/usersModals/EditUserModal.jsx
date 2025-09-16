import React, { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { observer } from "mobx-react";
import authStore from "../../../stores/AuthStore";
import userStore from "../../../stores/UsersStore";
import createModal from "../../../stores/CreateModal";
import VerifyAction from "../../verifyAction/VerifyAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";


const EditUserModal = observer(
  ({ close, usersArray, index, element }) => {
    const { t } = useTranslation();

    console.log("from edit user");

    const [userRoles, setUserRoles] = useState(usersArray[index].roleNames);
    const [loading, setLoading] = useState(false);

    function handelRoles(e) {
      const { value, checked } = e.target;
      setUserRoles((prev) =>
        checked ? [...prev, value] : prev.filter((role) => role !== value)
      );
    }

    function displayRoles() {
      if (!authStore.roles) {
        return [];
      }

      // Group roles by category if they have one, otherwise show as "General"
      const groupedRoles = authStore.roles.reduce((acc, role) => {
        const category = role.category || t("editUserModal.roles.general");
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(role);
        return acc;
      }, {});

      return Object.entries(groupedRoles).map(([category, roles]) => (
        <div key={category} className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-600">
            {category}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {roles.map((role, index) => (
              <div 
                key={`${category}-${index}`} 
                className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <input
                  type="checkbox"
                  checked={userRoles.includes(role.normalizedName)}
                  value={role.normalizedName}
                  id={`${category}-${role.name}`}
                  onChange={handelRoles}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label 
                  className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer flex-1"
                  htmlFor={`${category}-${role.name}`}
                >
                  <div className="font-medium">{role.displayName || role.name}</div>
                  {role.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {role.description}
                    </div>
                  )}
                </label>
              </div>
            ))}
          </div>
        </div>
      ));
    }

    async function deleteUser(id) {
      setLoading(true);
      await userStore.deleteUser(id, authStore.token);
      close();
    }

    async function deactivate(id) {
      setLoading(true);
      await userStore.deactivate(id, authStore.token);
      userStore.getAllUsers(authStore.token);
      close();
    }

    async function active(id, token) {
      setLoading(true);
      await userStore.active(id, token);
      userStore.getAllUsers(authStore.token);
      close();
    }

    async function handleEditUser(e, usersArray, i) {
      e.preventDefault();
      setLoading(true);
      userStore.doneMsg = null;
      userStore.error = null;

      const form = e.target;

      const updatedUser = {
        name: form.name.value,
        surname: form.surname.value,
        emailAddress: form.emailAddress.value,
        userName: form.userName.value,
        roleNames: userRoles,
      };

      usersArray[i] = {
        ...usersArray[i],
        ...updatedUser,
      };

      await userStore.editUser(usersArray[i], authStore.token);

      userStore.doneMsg ? (userStore.error = null) : (userStore.doneMsg = null);
      setLoading(false);
      userStore.getAllUsers(authStore.token);
    }

    async function getAllRoles() {
      await authStore.getRoles(authStore.token);
    }

    function closeModal() {
      close();
      userStore.doneMsg = null;
      userStore.error = null;
    }

    useEffect(() => {
      getAllRoles();
    }, []);

    return (
      <Modal
        show={true}
        onClose={() => {
          closeModal();
        }}
        size="md"
        popup
        className="nav"
      >
        <Modal.Header />
        <Modal.Body className="min-h-[78vh]">
          {authStore.roles ? (
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                {t("editUserModal.header", { name: element.name })}
              </h3>

              <div className="handel-actions">
                <div
                  className={`font-bold text-red-600 mt-3 ${
                    userStore.error ? "" : "hidden"
                  } text-center`}
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

              <form onSubmit={(e) => handleEditUser(e, usersArray, index)}>
                {/* user-name */}
                <div>
                  <label>{t("editUserModal.form.labels.userName")}</label>
                  <div className="mt-2">
                    <input
                      id="user-name"
                      name="userName"
                      type="text"
                      required
                      autoComplete="user-name"
                      className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      defaultValue={element.userName}
                    />
                  </div>
                </div>
                {/* name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm/6 font-medium"
                  >
                    {t("editUserModal.form.labels.name")}
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
                {/* surname */}
                <div>
                  <label
                    htmlFor="surname"
                    className="block text-sm/6 font-medium"
                  >
                    {t("editUserModal.form.labels.surname")}
                  </label>
                  <div className="mt-2">
                    <input
                      id="surname"
                      name="surname"
                      type="text"
                      required
                      autoComplete="surname"
                      className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      defaultValue={element.surname}
                    />
                  </div>
                </div>
                {/* email */}
                <div>
                  <label
                    htmlFor="emailAddress"
                    className="block text-sm/6 font-medium"
                  >
                    {t("editUserModal.form.labels.email")}
                  </label>
                  <div className="mt-2">
                    <input
                      id="emailAddress"
                      name="emailAddress"
                      type="email"
                      required
                      autoComplete="emailAddress"
                      className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      defaultValue={element.emailAddress}
                    />
                  </div>
                </div>

                {/* Roles Section */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t("editUserModal.roles.header")}
                    </h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {t("editUserModal.roles.selected", {
                        count: userRoles.length,
                        total: authStore.roles?.length || 0,
                      })}
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setUserRoles(authStore.roles?.map(r => r.normalizedName) || [])}
                      className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200"
                    >
                      {t("editUserModal.roles.selectAll")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserRoles([])}
                      className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors duration-200"
                    >
                      {t("editUserModal.roles.clearAll")}
                    </button>
                  </div>

                  {/* Roles List */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                    {displayRoles()}
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
                      {t("editUserModal.form.buttons.done")}
                    </button>
                    {/* delete btn */}
                    <button
                      className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-red-500 hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-3"
                      type="button"
                      onClick={() => {
                        createModal.open(
                        <VerifyAction
                          close={() => createModal.close()}
                          action={"delete"}
                          actionFunc={(id) => deleteUser(id)}
                          id={element.id}
                          token={authStore.token}
                          afterActionFunc={(type) => userStore.getAllUsers(type)}
                          type={authStore.token}
                        />
                      );
                        
                        
                      }}
              
                    >
                      {t("editUserModal.form.buttons.delete")}
                    </button>
                    {/* activate btns */}
                    {element.isActive ? (
                      <button
                        className="flex w-full justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-yellow-500 hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-3"
                        type="button"
                        onClick={() => {
                          deactivate(element.id, authStore.token);
                        }}
                      >
                        {t("editUserModal.form.buttons.deactivate")}
                      </button>
                    ) : (
                      <button
                        className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-green-500 hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-3"
                        type="button"
                        onClick={() => {
                          active(element.id, authStore.token);
                        }}
                      >
                        {t("editUserModal.form.buttons.activate")}
                      </button>
                    )}
                  </div>
                )}
                {/* btns end */}
              </form>
            </div>
          ) : (
            <FontAwesomeIcon
              className="flex justify-center items-center"
              icon={faSpinner}
            />
          )}
        </Modal.Body>
      </Modal>
    );
  }
);

export default EditUserModal;