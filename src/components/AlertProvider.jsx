import { createContext, useContext, useState, useCallback } from 'react';
import '../styles/alert.css';

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alertConfig, setAlertConfig] = useState({
    message: '',
    buttons: [],
    visible: false,
  });

  const showAlert = useCallback((message, buttons = []) => {
    setAlertConfig({ message, buttons, visible: true });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}

      {alertConfig.visible && (
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
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}
