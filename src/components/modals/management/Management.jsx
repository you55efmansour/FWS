import {
  Modal,
  Sidebar,
  SidebarCollapse,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { CiRoute } from "react-icons/ci";
import { FaUsers } from "react-icons/fa";

import { observer } from "mobx-react";
import ProtectedRoute from "../../protected/ProtectedRoute";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import UsersModal from "../usersModals/UsersModal";
import CreateNewUserModal from "../usersModals/CreateNewUserModal";
import UsersRolesModal from "../rolesModals/UsersRolesModal";
import CreateNewRoleModal from "../rolesModals/CreateNewRoleModal";

const Management = observer((prop) => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("Users");

  const sectionComponents = {
    Users: <UsersModal />,
    Create_New_User: <CreateNewUserModal />,
    Roles: <UsersRolesModal />,
    Create_New_Role: <CreateNewRoleModal />,
  };

  return (
    <ProtectedRoute permission={["Pages.FloodWarnings", "Pages.Tenants"]}>
      <Modal size="max-w-xl" show={true} onClose={prop.close} className="nav">
        <Modal.Header>{t("usersModal.header")}</Modal.Header>
        <Modal.Body className="min-h-[78vh]">
          <div className="flex flex-col md:flex-row">
            <div>
              <Sidebar aria-label={t("management.sidebar.ariaLabel")} className="w-full">
                <SidebarItems>
                  <SidebarItemGroup>
                    <SidebarCollapse icon={FaUsers} label={t("management.sidebar.userManagement")} open={true}>
                      <SidebarItem href="#" onClick={() => setActiveSection("Users")}>
                        {t("management.sidebar.users")}
                      </SidebarItem>
                      <SidebarItem href="#" onClick={() => setActiveSection("Create_New_User")}>
                        {t("management.sidebar.createNewUser")}
                      </SidebarItem>
                    </SidebarCollapse>
                    <SidebarCollapse icon={CiRoute} label={t("management.sidebar.rolesManagement")}>
                      <SidebarItem href="#" onClick={() => setActiveSection("Roles")}>
                        {t("management.sidebar.roles")}
                      </SidebarItem>
                      <SidebarItem href="#" onClick={() => setActiveSection("Create_New_Role")}>
                        {t("management.sidebar.createNewRole")}
                      </SidebarItem>
                    </SidebarCollapse>
                  </SidebarItemGroup>
                </SidebarItems>
              </Sidebar>
            </div>
            <div className="overflow-x-auto p-3 flex-grow">
              {sectionComponents[activeSection]}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </ProtectedRoute>
  );
});

export default Management;
