import { useState } from "react";
import { Box, Button, ImageList, ImageListItem, Modal } from "@mui/material";
import { ImageURL } from "../services/api";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40rem",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16)",
  p: 4,
};


export default function Image({ images }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    const imageURL = `${ImageURL}${image.server}/${image.id}_${image.secret}_q.jpg`;

    setSelectedImage(imageURL);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalIsOpen(false);
  };

  return (
    <div className="mt-8 p-10">
      <ImageList
        sx={{ width: "100%", height: "100%" }}
        variant="quilted"
        cols={3}
        rowHeight={200}
      >
        {images.map((image) => (
          <ImageListItem
            key={image.id}
            cols={1}
            rows={1}
            className="m-1"
            onClick={() => openModal(image)}
          >
            <img
              src={`${ImageURL}/${image?.server}/${image?.id}_${image?.secret}_w.jpg`}
              alt=""
            />
          </ImageListItem>
        ))}
      </ImageList>
      <Modal
        open={modalIsOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Button onClick={closeModal}>Close Me</Button>
          <img src={selectedImage} alt="Modal" style={{ width: "100%" }} />
        </Box>
      </Modal>
    </div>
  );
}
