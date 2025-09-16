import { observer } from "mobx-react";
import React, { useEffect, useMemo, useState } from "react";
import authStore from "../../../stores/AuthStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const CreateNewRoleModal = observer(() => {
  const { t } = useTranslation(); 

  console.log("from create new role");
  
  const initialFormValue = {
    name: "",
    displayName: "",
    description: "",
    grantedPermissions: [],
  };
  const [roleData, setRoleData] = useState(initialFormValue);
  const [loading, setLoading] = useState(false);

  async function getAllPermissions() {
    setLoading(true);
    await authStore.getAllPermissions(authStore.token);
    setLoading(false);
  }

  function handelPermissions(e) {
    const { value, checked } = e.target;
    setRoleData((prev) => ({
      ...prev,
      grantedPermissions: checked
        ? [...prev.grantedPermissions, value]
        : prev.grantedPermissions.filter((role) => role !== value),
    }));
  }

  function displayPermissions() {
    // Group permissions by category if they have one, otherwise show as "General"
    const groupedPermissions = authStore.allPermissions.reduce((acc, permission) => {
      const category = permission.category || t("createNewRoleModal.permissions.general");
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(permission);
      return acc;
    }, {});

    return Object.entries(groupedPermissions).map(([category, permissions]) => (
      <div key={category} className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-600">
          {category}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {permissions.map((permission, index) => (
            <div 
              key={`${category}-${index}`} 
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <input
                type="checkbox"
                checked={roleData.grantedPermissions.includes(permission.name)}
                value={permission.name}
                id={`${category}-${permission.name}`}
                onChange={handelPermissions}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label 
                className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer flex-1"
                htmlFor={`${category}-${permission.name}`}
              >
                <div className="font-medium">{permission.displayName || permission.name}</div>
                {permission.description && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {permission.description}
                  </div>
                )}
              </label>
            </div>
          ))}
        </div>
      </div>
    ));
  }

  async function createNewRole(data) {
    setLoading(true);
    await authStore.createNewRole(data, authStore.token);
    setLoading(false);
  }

  function handleCreateRole(e) {
    e.preventDefault();
    authStore.doneMsg = null;
    authStore.error = null;

    createNewRole(roleData);

    authStore.doneMsg ? (authStore.error = null) : (authStore.doneMsg = null);
    setRoleData(initialFormValue);
  }

  function closeModal() {
    authStore.doneMsg = null;
    authStore.error = null;
  }

  useEffect(()=>{
    return () => {
      closeModal();
  	};
  },[])

  const displayRoleInf = useMemo(() => {
    return (
      <>
        {/* role-name */}
        <div className="mt-2">
          <label htmlFor="role-name" className="block text-sm/6 font-medium">
            {t("createNewRoleModal.form.labels.roleName")}
          </label>
          <div className="mt-2">
            <input
              id="role-name"
              name="role-name"
              type="text"
              required
              autoComplete="role-name"
              className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={roleData.name}
              onChange={(event) =>
                setRoleData((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
            />
          </div>
        </div>
        {/* display-name */}
        <div className="mt-2">
          <label htmlFor="display-name" className="block text-sm/6 font-medium">
            {t("createNewRoleModal.form.labels.displayName")}
          </label>
          <div className="mt-2">
            <input
              id="display-name"
              name="display-name"
              type="text"
              required
              autoComplete="display-name"
              className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={roleData.displayName}
              onChange={(event) =>
                setRoleData((prev) => ({
                  ...prev,
                  displayName: event.target.value,
                }))
              }
            />
          </div>
        </div>
        {/* description */}
        <div className="mt-2">
          <label htmlFor="description" className="block text-sm/6 font-medium">
            {t("createNewRoleModal.form.labels.description")}
          </label>
          <div className="mt-2">
            <input
              id="description"
              name="description"
              type="text"
              required
              autoComplete="description"
              className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              value={roleData.description}
              onChange={(event) =>
                setRoleData((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
            />
          </div>
        </div>
      </>
    );
  }, [roleData.description, roleData.displayName, roleData.name]);

  useEffect(() => {
    getAllPermissions();
  }, []);

  return (
<div className="w-full">
  <div className="handel-actions">
    <div
      className={`font-bold text-red-600 mt-3 ${
        authStore.error ? "" : "hidden"
      } text-center`}
    >
      <FontAwesomeIcon
        icon={faTriangleExclamation}
        beat
        style={{ color: "#c70000" }}
      />{" "}
      {authStore.error}
    </div>
    <div
      className={`font-bold ${
        authStore.doneMsg ? "" : "hidden"
      } text-green-600 mt-3 text-center`}
    >
      {authStore.doneMsg && authStore.doneMsg}
    </div>
  </div>
  {authStore.allPermissions ? (
    <form className="px-3" onSubmit={(e) => handleCreateRole(e)}>
      <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            {t("createNewRoleModal.header")}
      </h3>
      <div className="flex justify-between items-center flex-col md:flex-row md:gap-[100px]">
      {/* role information */}
      <div className="flex-grow">{displayRoleInf}</div>
      
      {/* Permissions Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("createNewRoleModal.permissions.header")}
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t("createNewRoleModal.permissions.selected", { count: roleData.grantedPermissions.length, total: authStore.allPermissions?.length || 0 })}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setRoleData(prev => ({ ...prev, grantedPermissions: authStore.allPermissions?.map(p => p.name) || [] }))}
            className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200"
          >
            {t("createNewRoleModal.permissions.selectAll")}
          </button>
          <button
            type="button"
            onClick={() => setRoleData(prev => ({ ...prev, grantedPermissions: [] }))}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors duration-200"
          >
            {t("createNewRoleModal.permissions.clearAll")}
          </button>
        </div>

        {/* Permissions List */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
          {displayPermissions()}
        </div>
      </div>

      </div>

      <button
        className="flex w-full md:w-2/12 justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-500 hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-3"
        type="submit"
      >
        {loading ? (
          <FontAwesomeIcon
            className="text-xl font-bold"
            icon={faSpinner}
            spin
          />
        ) : (
          t("createNewRoleModal.form.submitButton.default")
        )}
      </button>
    </form>
  ) : (
    <FontAwesomeIcon icon={faSpinner} />
  )}
</div>
  );
});

export default CreateNewRoleModal;