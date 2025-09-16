import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "flowbite-react";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import authStore from "../../../stores/AuthStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faSpinner } from "@fortawesome/free-solid-svg-icons";
import createModal from "../../../stores/CreateModal";
import EditRoleModal from "./EditRoleModal";
import { useTranslation } from "react-i18next"; // Assuming i18next for localization

const UsersRolesModal = observer((prop) => {
  const { t } = useTranslation(); // Hook to access translations

  async function getAllRoles() {
    await authStore.getAllRoles(authStore.token);
  }

  function displayRoles(roles) {
    return roles.map((e, i) => {
      return (
        <TableRow key={e.id} className="flex justify-between w-full">
          <TableCell className="col-12 whitespace-nowrap font-medium text-gray-900 dark:text-white">
            {e.name}
          </TableCell>
          <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            <Button
              onClick={() =>
                createModal.open(
                  <EditRoleModal
                    close={() => createModal.close()}
                    roles={roles}
                    index={i}
                    element={e}
                    getAllRoles={getAllRoles}
                  />
                )
              }
              className="my-3 modal-btn"
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </Button>
          </TableCell>
        </TableRow>
      );
    });
  }

  useEffect(() => {
    getAllRoles();
  }, []);

  return (<div className="display-roles">
          {authStore.allRoles ? (
            <div className="overflow-x-auto">
              <Table hoverable>
                <TableBody className="divide-y">
                  <TableRow>
                    <TableCell>{t("usersRolesModal.table.headers.roleName")}</TableCell>
                  </TableRow>
                  {displayRoles(authStore.allRoles)}
                </TableBody>
              </Table>
            </div>
          ) : (
            <FontAwesomeIcon
              data-testid="loading"
              className="text-xl font-bold"
              icon={faSpinner}
              spin
            />
          )}
        </div>
  );
});

export default UsersRolesModal;