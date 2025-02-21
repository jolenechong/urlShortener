import { useContext, useRef } from "react";
import { ModelContext } from "../../../contexts/modal-context.jsx";

import LoginModal from "./login";
import SignUpModal from "./signup";
import { UserContext } from "../../../contexts/user-context.jsx";
import styles from "./index.module.scss";

function Modal() {
  const [ui, setUI] = useContext(UserContext);
  const modalRef = useRef();
  const { modalInfo, dispatchModalEvent } = useContext(ModelContext);

  window.onclick = function (event) {
    if (event.target === modalRef.current) {
      dispatchModalEvent("close");
    }
  };

  const handleClose = () => {
    dispatchModalEvent('close');
  };

  return (
    <>
      <div
        className={styles.modal}
        style={{ display: modalInfo?.state ? "block" : "none" }}
        ref={modalRef}
      >
        <div>
          <span className={styles.close} onClick={handleClose}>
            &times;
          </span>
          {modalInfo.modalType === 'login' ? (
            <LoginModal/>
          ) : modalInfo.modalType === 'signup' ? (
            <SignUpModal/>
          ) : modalInfo?.modalType === 'closed' ? (
            <ClosedModal/>
          ): (<p></p>)}

        </div>
      </div>
    </>
  );
}

export default Modal;