import { useState, useCallback } from 'react';
import '../styles/alert.css';

export function useAlert() {
  const [alertConfig, setAlertConfig] = useState({
    message: '',
    buttons: [],
    visible: false,
  });

  const showAlert = useCallback((message, buttons = []) => {
    setAlertConfig({ message, buttons, visible: true });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  }, []);

  return {
    alertConfig,
    showAlert,
    hideAlert,
  };
}

export default function Alert({ alertConfig, hideAlert }) {
  if (!alertConfig.visible) return null;

  return (
    <div className="alert-overlay">
      <div className="alert-box">
        <p className="alert-message">{alertConfig.message}</p>

        <div className="alert-buttons">
          {alertConfig.buttons.map((btn, i) => (
            <button
              key={i}
              className="alert-button"
              onClick={() => {
                btn.onClick && btn.onClick();
                hideAlert();
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

