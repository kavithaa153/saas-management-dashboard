import { X } from "lucide-react";

function Modal({
  open,
  title,
  description,
  children,
  onClose,
  size = "medium"
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`modal modal-${size}`}>
        <div className="modal-header">
          <div>
            <h2>{title}</h2>

            {description && (
              <p>{description}</p>
            )}
          </div>

          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;