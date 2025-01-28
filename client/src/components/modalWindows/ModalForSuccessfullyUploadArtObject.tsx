import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router";

interface ModalForSuccessfullyUploadArtObjectProps {
  setModalShow: React.Dispatch<React.SetStateAction<boolean>>;
  returnedArtObject?: {
    picture: { secure_url: string };
    nameOfThePainting: string;
    nameOfTheAuthor: string;
    style: string;
    year: number;
    location: string;
  };
  returnedMessage?: string;
}

// Default values for props
const defaultArtObject = {
  picture: {
    secure_url:
      "https://res.cloudinary.com/dzbkg3xj2/image/upload/v1736759569/projrct-app/povynzsslajfqtoik0ov.jpg",
  },
  nameOfThePainting: "Untitled",
  nameOfTheAuthor: "Unknown",
  style: "Unknown",
  year: 0,
  location: "Unknown",
};

function ModalForSuccessfullyUploadArtObject({
  setModalShow,
  returnedArtObject = defaultArtObject,
  returnedMessage,
}: ModalForSuccessfullyUploadArtObjectProps) {
  const navigate = useNavigate();
  return (
    <Modal
      show={true}
      onHide={() => {
        setModalShow((prev) => !prev);
        navigate("/profile");
      }}
      centered
    >
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>{returnedMessage}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Card border="light">
            <Card.Img
              variant="top"
              src={returnedArtObject.picture.secure_url}
            />
            <Card.Body>
              <Card.Title>{returnedArtObject.nameOfThePainting}</Card.Title>
              <Card.Text>
                Name of the Author {returnedArtObject.nameOfTheAuthor}
              </Card.Text>
              <Card.Text>
                Style of the painting {returnedArtObject.style}
              </Card.Text>
              <Card.Text>Year {returnedArtObject.year}</Card.Text>
              <Card.Text>
                You can find this painting in {returnedArtObject.location}
              </Card.Text>
            </Card.Body>
          </Card>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setModalShow(false);
              navigate("/profile");
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </Modal>
  );
}

export default ModalForSuccessfullyUploadArtObject;
