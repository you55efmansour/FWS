import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import authStore from "../../../stores/AuthStore";
import userStore from "../../../stores/UsersStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react";
import createModal from "../../../stores/CreateModal";
import EditUserModal from "./EditUserModal";
import ProtectedRoute from "../../protected/ProtectedRoute";
import { useTranslation } from "react-i18next";

const UsersModal = observer((prop) => {
  const { t } = useTranslation(); 
  const [loading, setLoading] = useState(false);

  const displayAllUsers = useCallback(
    (usersArray) => {
      return usersArray.map((e, i) => (
        <TableRow
          key={i}
          className="bg-white dark:border-gray-700 dark:bg-gray-800"
        >
          <TableCell className="font-medium text-gray-900 dark:text-white">
            <Button
              onClick={() =>
                createModal.open(
                  <EditUserModal
                    close={() => createModal.close()}
                    usersArray={usersArray}
                    index={i}
                    element={e}
                  />
                )
              }
              className="my-3 modal-btn"
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </Button>
          </TableCell>
          <TableCell className="font-medium text-gray-900 dark:text-white">
            {e.name}
          </TableCell>
          <TableCell className="font-medium text-gray-900 dark:text-white">
            {e.userName}
          </TableCell>
          <TableCell className="font-medium text-gray-900 dark:text-white">
            {e.emailAddress}
          </TableCell>
          <TableCell className="font-medium text-gray-900 dark:text-white">
            {e.isActive
              ? t("usersModal.userStatus.active")
              : t("usersModal.userStatus.deactivate")}
          </TableCell>
        </TableRow>
      ));
    },
    [t]
  );

  useEffect(() => {
    setLoading(true);
    userStore.getAllUsers(authStore.token);
    setLoading(false);
  }, []);

  return (
    <ProtectedRoute permission={["Pages.Users"]}>
          <div className="show-users mt-10">
            <div className="overflow-x-auto">
              <Table hoverable>
                <TableBody className="divide-y">
                  <TableRow>
                    <TableCell> </TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {t("usersModal.table.headers.name")}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {t("usersModal.table.headers.userName")}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {t("usersModal.table.headers.email")}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {t("usersModal.table.headers.state")}
                    </TableCell>
                  </TableRow>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="flex justify-center items-center h-full">
                          {t("usersModal.table.loading")}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : userStore.allUsers ? (
                    displayAllUsers(userStore.allUsers)
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <FontAwesomeIcon
                          className="text-xl font-bold"
                          icon={faSpinner}
                          spin
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
    </ProtectedRoute>
  );
});

export default UsersModal;