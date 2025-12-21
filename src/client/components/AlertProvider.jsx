import { createContext, useContext, useState, useCallback } from "react";
import "../styles/alert.css";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alertConfig, setAlertConfig] = useState({
    message: "",
    buttons: [],
    visible: false,
  });

  const [resolver, setResolver] = useState(null);

  const showAlert = useCallback((message, buttons = [], image_src = "") => {
    return new Promise((resolve) => {
      setResolver(() => resolve);

      const wrappedButtons = buttons.map((btn) => ({
        ...btn,
        onClick: () => {
          btn.onClick && btn.onClick();
          resolve(btn.label);
          hideAlert();
        },
      }));

      setAlertConfig({
        message,
        buttons: wrappedButtons,
        image_src: "../src/client/res/dancing.gif",
        // image_src,
        visible: true,
      });
      
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}

      {alertConfig.visible && (
        <div className="alert-overlay">
          <div className="alert-box">
            <p className="alert-message">{alertConfig.message}</p>
            <img src={alertConfig.image_src} alt=""/>
            <div className="alert-buttons">
              {alertConfig.buttons.map((btn, i) => (
                <button
                  key={i}
                  className="alert-button"
                  onClick={btn.onClick}
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
