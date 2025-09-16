import { Button, Modal } from "flowbite-react";
import { observer } from "mobx-react";
import { faCheckCircle} from "@fortawesome/free-solid-svg-icons"; // Add this icon package if not present
import createModal from "../../stores/CreateModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useTranslation } from "react-i18next";

const DoneMessage = observer(({ action, close, id }) => {
  //   const { t } = useTranslation();

  return (
    <Modal size="md" show={true} onClose={close} className="nav" popup>
      <Modal.Header />
      <Modal.Body className="flex flex-col items-center justify-center py-6">
        {/* <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" /> */}
        <FontAwesomeIcon
            icon={faCheckCircle} className="w-16 h-16 text-green-500 mb-4"/>
        <div className="text-xl font-semibold text-center mb-2">
          Action <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded">{action}</span> completed successfully!
        </div>
        <div className="text-gray-500 text-sm mb-4">
          Reference ID: <span className="font-mono">{id}</span>
        </div>
        <Button
          onClick={async () => {
            createModal.clear();
          }}
          className="w-32 bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition"
        >
          OK
        </Button>
      </Modal.Body>
    </Modal>
  );
});

export default DoneMessage;