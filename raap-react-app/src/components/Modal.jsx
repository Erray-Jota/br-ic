import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, actions, type = 'default' }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const colors = {
    default: { bg: '#2D5A3D', light: '#F0FDF4', border: '#16A34A' },
    success: { bg: '#16A34A', light: '#F0FDF4', border: '#16A34A' },
    warning: { bg: '#F59E0B', light: '#FFFBEB', border: '#F59E0B' },
    danger: { bg: '#DC2626', light: '#FEF2F2', border: '#DC2626' },
  };

  const theme = colors[type] || colors.default;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        style={{
          background: 'white',
          padding: '28px',
          borderRadius: '12px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: `3px solid ${theme.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h3
            id="modal-title"
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#1F2937',
              marginBottom: '16px',
              margin: 0,
            }}
          >
            {title}
          </h3>
        )}

        <div style={{
          fontSize: '16px',
          color: '#4B5563',
          lineHeight: '1.6',
          marginBottom: actions ? '24px' : 0,
        }}>
          {children}
        </div>

        {actions && (
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            marginTop: '24px',
          }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'warning' }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type={type}
      actions={
        <>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: 'white',
              color: '#6B7280',
              border: '2px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              padding: '10px 20px',
              background: type === 'danger' ? '#DC2626' : '#2D5A3D',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {confirmText}
          </button>
        </>
      }
    >
      {message}
    </Modal>
  );
};

export const AlertModal = ({ isOpen, onClose, title, message, type = 'success' }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type={type}
      actions={
        <button
          onClick={onClose}
          style={{
            padding: '10px 24px',
            background: type === 'danger' ? '#DC2626' : '#2D5A3D',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          OK
        </button>
      }
    >
      {message}
    </Modal>
  );
};

export default Modal;
