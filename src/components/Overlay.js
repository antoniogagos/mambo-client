import { useEffect } from "react";
import { createPortal } from "react-dom";

const Overlay = ({children}) => {
  const mount = document.getElementById("overlay-root");
  useEffect(() => {
    requestAnimationFrame(_ => document.querySelector('body').classList.add('overlay-opened'));
    return () => {
      requestAnimationFrame(_ => {
        document.querySelector('body').classList.remove('overlay-opened');
      })
      
    }
  }, [children, mount]);

  return createPortal(children, mount)
};

export default Overlay;