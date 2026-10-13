import { AlertTriangle } from "lucide-react";

import Modal from "./Modal";

function ConfirmDialog({
  open,
  title = "Confirm action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = true,
  onConfirm,
  onCancel
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      size="small"
    >
      <div className="confirm-content">
        <div className="confirm-icon">
          <AlertTriangle size={22} />
        </div>

        <p>{message}</p>

        <div className="confirm-actions">
          <button
            className="secondary-button"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className={
              danger
                ? "danger-button"
                : "primary-button"
            }
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;