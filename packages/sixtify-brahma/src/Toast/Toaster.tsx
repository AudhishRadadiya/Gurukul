import { Slide } from "react-toastify";

import { ToasterStyled } from "./Toaster.styled";

export const Toaster = () => {
  return (
    <ToasterStyled
      position="top-right"
      autoClose={5000}
      hideProgressBar
      newestOnTop
      closeButton={false}
      closeOnClick={false}
      rtl={false}
      draggable
      pauseOnHover
      transition={Slide}
      limit={5}
    />
  );
};
