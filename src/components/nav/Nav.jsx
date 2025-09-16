import { observer } from "mobx-react";
import authStore from "../../stores/AuthStore";
import createModal from "../../stores/CreateModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faGears } from "@fortawesome/free-solid-svg-icons";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import ChangePassModal from "../modals/usersModals/ChangePassModal";
import ProfileInfModal from "../modals/usersModals/ProfileInfModal";
import ResetPassModal from "../modals/usersModals/ResetPassModal";
import { useTranslation } from "react-i18next";
import Management from "../modals/management/Management";

const Nav = observer(() => {  
  const{t}= useTranslation()
  
  return (
    <div className="fixed left-0 bottom-0 flex justify-center items-center w-full" style={{zIndex:400}}>
      {/* logOut start */}
      <Link
        to={"/"}
        className="log-out fixed right-0 bottom-0 flex justify-center items-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-red-400 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:cursor-pointer hover:bg-red-500 text-white mb-3  me-3 p-3"
        onClick={() => authStore.logout()}
      >
        <FontAwesomeIcon className="text-3xl" icon={faRightFromBracket} />
      </Link>
      {/* logOut end */}
      <ul className="flex">
        <li className="ico relative p-3">
          <div className="my-icon flex justify-center items-center w-12 h-12 md:w-16 md:h-16 rounded-full hover:cursor-pointer  text-white  me-3">
            <FontAwesomeIcon className="text-3xl" icon={faGears} />
          </div>
          <div className="menu-box absolute bg-white left-2/4 p-3 w-44 rounded-md ">
            <h3>{t("List.header")}</h3>
            {/* Users Management start */}
            <div className="users-management">
              <Button
                className="w-full my-3 modal-btn"
                onClick={() =>
                  createModal.open(
                    <Management close={() => createModal.close()} />
                  )
                }
              >
                {t("List.usersManagement")}
              </Button>
            </div>
            {/* Users Management end */}

            {/* reset password start */}
            <div className="reset-password">
            <Button
                className="w-full my-3 modal-btn"
                onClick={() =>
                  createModal.open(
                    <ResetPassModal close={() => createModal.close()} />
                  )
                }
              >
                {t("List.resetPassModal")}
              </Button>
            </div>
            {/* reset password end */}

            {/* Profile Information start */}
            <div className="reset-password">
              <Button
                className="w-full my-3 modal-btn"
                onClick={() =>
                  createModal.open(
                    <ProfileInfModal close={() => createModal.close()} />
                  )
                }
              >
                {t("List.profileInformation")}
              </Button>
            </div>
            {/* Profile Information end */}

            {/* Change Password start */}
            <div className="change-password">
              <Button
                className="w-full my-3 modal-btn"
                onClick={() =>
                  createModal.open(
                    <ChangePassModal close={() => createModal.close()} />
                  )
                }
              >
                {t("List.changePassword")}
              </Button>
            </div>
            {/* Change Password end */}
          </div>
        </li>
      </ul>
    </div>
  );
});

export default Nav;
