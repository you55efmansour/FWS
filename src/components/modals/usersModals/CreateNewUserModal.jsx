import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import authStore from "../../../stores/AuthStore";
import userStore from "../../../stores/UsersStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const CreateNewUserModal = observer(({ close }) => {
  const { t } = useTranslation(); 

  console.log("from create new user");

  const initialFormValue = {
    userName: "",
    name: "",
    surname: "",
    emailAddress: "",
    roleNames: [],
    password: "",
  };

  const [createUserData, setCreateUserData] = useState(initialFormValue);

  function handelRoles(e) {
    const { value, checked } = e.target;
    setCreateUserData((prev) => ({
      ...prev,
      roleNames: checked
        ? [...prev.roleNames, value]
        : prev.roleNames.filter((role) => role !== value),
    }));
  }


  async function handleCreateNewUser(e) {
    e.preventDefault();
    userStore.doneMsg = null;
    userStore.error = null;

    await userStore.createNewUser(createUserData, authStore.token);
    userStore.doneMsg ? (userStore.error = null) : (userStore.doneMsg = null);
    setCreateUserData(initialFormValue);
  }

  async function getAllRoles() {
    await authStore.getRoles(authStore.token);
  }

  function displayRoles() {
    if (!authStore.roles) {
      return [];
    }

    // Group roles by category if they have one, otherwise show as "General"
    const groupedRoles = authStore.roles.reduce((acc, role) => {
      const category = role.category || `${t("createNewUserModal.form.roles.General")}`;
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
                checked={createUserData.roleNames.includes(role.normalizedName)}
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

  function closeModal() {
    userStore.doneMsg = null;
    userStore.error = null;
  }

  useEffect(() => {
    getAllRoles();
    return () => {
      closeModal();
  	};
  }, []);

  return (
        <div className="w-full md:w-3/4">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            {t("createNewUserModal.header")}
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
          <form className="px-3" onSubmit={(e) => handleCreateNewUser(e)}>
            <div className="flex justify-between items-center flex-col md:flex-row md:gap-[100px]">
              {/* Inputs section  */}
              <div className="flex-grow">
                {/* name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm/6 font-medium"
                  >
                    {t("createNewUserModal.form.labels.name")}
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      value={createUserData.name}
                      onChange={(event) =>
                        setCreateUserData((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                {/* surname */}
                <div>
                  <label
                    htmlFor="surname"
                    className="block text-sm/6 font-medium"
                  >
                    {t("createNewUserModal.form.labels.surname")}
                  </label>
                  <div className="mt-2">
                    <input
                      id="surname"
                      name="surname"
                      type="text"
                      required
                      autoComplete="surname"
                      value={createUserData.surname}
                      className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      onChange={(event) =>
                        setCreateUserData((prev) => ({
                          ...prev,
                          surname: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                {/* email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium"
                  >
                    {t("createNewUserModal.form.labels.email")}
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      value={createUserData.emailAddress}
                      onChange={(event) =>
                        setCreateUserData((prev) => ({
                          ...prev,
                          emailAddress: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                {/* user name */}
                <div>
                  <label
                    htmlFor="user-name"
                    className="block text-sm/6 font-medium"
                  >
                    {t("createNewUserModal.form.labels.userName")}
                  </label>
                  <div className="mt-2">
                    <input
                      id="user-name"
                      name="user-name"
                      type="text"
                      required
                      autoComplete="user-name"
                      className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      value={createUserData.userName}
                      onChange={(event) =>
                        setCreateUserData((prev) => ({
                          ...prev,
                          userName: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                {/* password */}
                <div>
                  <label
                    htmlFor="Password"
                    className="block text-sm/6 font-medium"
                  >
                    {t("createNewUserModal.form.labels.password")}
                  </label>
                  <div className="mt-2">
                    <input
                      id="Password"
                      name="Password"
                      type="text"
                      required
                      autoComplete="Password"
                      className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      value={createUserData.password}
                      onChange={(event) =>
                        setCreateUserData((prev) => ({
                          ...prev,
                          password: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              {/* Roles Section */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t("createNewUserModal.form.roles.label")}
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {createUserData.roleNames.length} {t("createNewUserModal.form.roles.of")} {authStore.roles?.length || 0} {t("createNewUserModal.form.roles.selected")} 
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setCreateUserData(prev => ({ ...prev, roleNames: authStore.roles?.map(r => r.normalizedName) || [] }))}
                    className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200"
                  >
                    {t("createNewUserModal.form.roles.SelectAll")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateUserData(prev => ({ ...prev, roleNames: [] }))}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors duration-200"
                  >
                    {t("createNewUserModal.form.roles.ClearAll")}
                  </button>
                </div>

                {/* Roles List */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                  {authStore.roles && displayRoles()}
                </div>
              </div>
            </div>
            <button
              className="flex w-full md:w-2/12 justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-500 hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-3"
              type="submit"
            >
              {userStore.loading ? (
                <FontAwesomeIcon
                  className="text-xl font-bold"
                  icon={faSpinner}
                  spin
                />
              ) : (
                t("createNewUserModal.form.submitButton.default")
              )}
            </button>
          </form>
        </div>
  );
});

export default CreateNewUserModal;