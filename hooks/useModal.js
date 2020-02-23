import { useState } from "react";

const useModal = function() {
  const [modalOpen, setModalOpen] = useState(false);

  const onClickOpen = () => {
    setModalOpen(true);
  };

  const onClickClose = () => {
    setModalOpen(false);
  };

  return {
    modalOpen,
    onClickOpen,
    onClickClose
  };
};

export default useModal;
