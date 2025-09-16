import { Button, Modal } from "flowbite-react";
import { observer } from "mobx-react";
import React from "react";
import createModal from "../../stores/CreateModal";
import DoneMessage from "./DoneMessage";
import { useTranslation } from "react-i18next";  // ✅ i18n hook

const VerifyAction = observer(({ action, actionFunc, close, id, token, afterActionFunc, type }) => {
  const { t } = useTranslation();

  return (
    <Modal size="md" show={true} onClose={close} className="nav" popup>
      <Modal.Header />
      <Modal.Body className="flex flex-col items-center justify-center">
        <div className="font-bold">
          {t("verifyAction.title", { action })}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              close();
            }}
            className="my-3 modal-btn bg-gray-400"
          >
            {t("verifyAction.no")}
          </Button>
          <Button
            onClick={async () => {
              await actionFunc(id, token);
              await afterActionFunc(type);
              createModal.clear();
              createModal.open(
                  <DoneMessage
                  close={() => createModal.close()}
                  id = {id}
                  action = {action}
                  />
                )
            }}
            className="my-3 modal-btn bg-blue-600"
          >
            {t("verifyAction.yes")}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
});

export default VerifyAction;
