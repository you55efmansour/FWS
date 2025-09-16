import React from "react";
import createModal from "../../../stores/CreateModal";
import { observer } from "mobx-react";

const  ModalsDisplay = observer(()=>{  
    return (
      <div>
        {createModal.modalStack.map((modal, index) => (
          <div
            key={index}
            show={true}
            onClose={() => createModal.close()}
            popup
            size="md"
            style={{ zIndex: 1000 + index }}
          >
            {modal}
          </div>
        ))}
      </div>
    );
    
}) 
export default ModalsDisplay
