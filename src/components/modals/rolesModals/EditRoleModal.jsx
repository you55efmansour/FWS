import { Modal } from "flowbite-react";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import authStore from "../../../stores/AuthStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next"; // Assuming i18next for localization
import createModal from "../../../stores/CreateModal";
import VerifyAction from "../../verifyAction/VerifyAction";

const EditRoleModal = observer(
  ({ close, roles, index, element, getAllRoles }) => {
    const { t } = useTranslation(); // Hook to access translations
    
    const [roleData, setRoleData] = useState(roles[index].grantedPermissions);
    const [loading, setLoading] = useState(false);

    async function getAllPermissions() {
      setLoading(true);
      await authStore.getAllPermissions(authStore.token);
      setLoading(false);
    }

    async function deleteRole(id) {
      setLoading(true);
      await authStore.deleteRole(id, authStore.token);
      close();
    }

    function handelPermissions(e) {
      const { value, checked } = e.target;
      setRoleData((prev) =>
        checked ? [...prev, value] : prev.filter((role) => role !== value)
      );
    }

    function displayPermissions() {
      if (!authStore.allPermissions) {
        return [];
      }

      // Group permissions by category if they have one, otherwise show as "General"
      const groupedPermissions = authStore.allPermissions.reduce((acc, permission) => {
        const category = permission.category || t("editRoleModal.permissions.general");
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
                  checked={roleData.includes(permission.name)}
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

    async function handleEditRole(e, roles, i) {
      e.preventDefault();
      try {
        setLoading(true);
        authStore.doneMsg = null;
        authStore.error = null;

        const form = e.target;
        const updatedUser = {
          name: form.name.value,
          displayName: form.displayName.value,
          description: form.description.value,
          grantedPermissions: roleData,
        };

        roles[i] = {
          ...roles[i],
          ...updatedUser,
        };

        await authStore.editRole(roles[i], authStore.token);
        authStore.doneMsg = t("editRoleModal.alerts.success");
      } catch (error) {
        authStore.error = t("editRoleModal.alerts.error");
      } finally {
        setLoading(false);
      }
    }

    function closeModal() {
      close();
      authStore.doneMsg = null;
      authStore.error = null;
    }

    useEffect(() => {
      getAllPermissions();
    }, []);

    return (
      <Modal
        size="md"
        popup
        show={true}
        onClose={() => {
          closeModal();
        }}
        className="nav"
      >
        <Modal.Header>{t("editRoleModal.header", { name: element.name })}</Modal.Header>
        <Modal.Body className="min-h-[78vh]">
          <div className="handel-alerts">
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
          <form
            data-testid="edit-role-form"
            onSubmit={(e) => handleEditRole(e, roles, index)}
          >
            {authStore.allPermissions ? (
              <>
                {/* role-name */}
                <div>
                  <label
                    htmlFor="role-name"
                    className="block text-sm/6 font-medium"
                  >
                    {t("editRoleModal.form.labels.roleName")}
                  </label>
                  <div className="mt-2">
                    <input
                      data-testid="name-input"
                      id="role-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="role-name"
                      className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      defaultValue={element.name}
                    />
                  </div>
                </div>
                {/* display-name */}
                <div>
                  <label
                    htmlFor="display-name"
                    className="block text-sm/6 font-medium"
                  >
                    {t("editRoleModal.form.labels.displayName")}
                  </label>
                  <div className="mt-2">
                    <input
                      data-testid="displayName-input"
                      id="display-name"
                      name="displayName"
                      type="text"
                      required
                      autoComplete="display-name"
                      className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      defaultValue={element.displayName}
                    />
                  </div>
                </div>
                {/* description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm/6 font-medium"
                  >
                    {t("editRoleModal.form.labels.description")}
                  </label>
                  <div className="mt-2">
                    <input
                      data-testid="description-input"
                      id="description"
                      name="description"
                      type="text"
                      required
                      autoComplete="description"
                      className="block w-full text-black rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      defaultValue={element.description}
                    />
                  </div>
                </div>

                {/* Permissions Section */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t("editRoleModal.permissions.header")}
                    </h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {t("editRoleModal.permissions.selected", {
                        count: roleData.length,
                        total: authStore.allPermissions?.length || 0,
                      })}
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setRoleData(authStore.allPermissions?.map(p => p.name) || [])}
                      className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200"
                    >
                      {t("editRoleModal.permissions.selectAll")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoleData([])}
                      className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors duration-200"
                    >
                      {t("editRoleModal.permissions.clearAll")}
                    </button>
                  </div>

                  {/* Permissions List */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                    {displayPermissions()}
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
                      {t("editRoleModal.form.buttons.done")}
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
                          actionFunc={(id) => deleteRole(id)}
                          id={element.id}
                          token={authStore.token}
                          afterActionFunc={(type) => getAllRoles(type)}
                        />
                      );
                        
                      }}
                    >
                      {t("editRoleModal.form.buttons.delete")}
                    </button>
                  </div>
                )}
                {/* btns end */}
              </>
            ) : (
              <FontAwesomeIcon
                className="text-xl font-bold"
                icon={faSpinner}
                spin
              />
            )}
          </form>
        </Modal.Body>
      </Modal>
    );
  }
);

export default EditRoleModal;