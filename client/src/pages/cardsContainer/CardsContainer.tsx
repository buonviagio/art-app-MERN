import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import "./CardsContainer.css";
import { NavLink } from "react-router";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function CardsContainer() {
  const [allArtifacts, setAllArtifacts] = useState();

  const [isFavorite, setIsFavorite] = useState(true);

  const handleFavoriteToggle = async (artifactId: string) => {
    //setIsFavorite(!isFavorite);
    const token = localStorage.getItem("token");
  };

  const getAllArtifacts = async () => {
    const requestOptions = {
      method: "GET",
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/arts/all",
        requestOptions
      );
      if (response.ok) {
        const result = await response.json();
        setAllArtifacts(result.allArts);
      } else {
        console.log("We can not show you any of our artifacts");
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAllArtifacts();
  }, []);
  return (
    <Container fluid className="my-4 px-4">
      <Row>
        <Col>
          <NavLink to="/addart">Add new Art Object</NavLink>
        </Col>
      </Row>
      <Row xs={1} md={2} xl={3} className="g-4">
        {allArtifacts &&
          allArtifacts.map((artifact) => (
            <Col key={artifact._id}>
              <Card border="light" className="custom-card">
                <div style={{ position: "relative" }}>
                  <Card.Img
                    variant="top"
                    src={artifact.picture.secure_url}
                    className="custom-img"
                  />
                  <button
                    onClick={() => {
                      handleFavoriteToggle(artifact._id);
                    }}
                    style={{
                      position: "absolute",
                      bottom: "-70px",
                      right: "10px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      zIndex: 1,
                    }}
                  >
                    {isFavorite ? (
                      <FaHeart color="red" size={30} />
                    ) : (
                      <FaRegHeart color="grey" size={30} />
                    )}
                  </button>
                </div>
                <Card.Body>
                  <Card.Title>{artifact.nameOfThePainting}</Card.Title>
                  <Card.Text>Year {artifact.year}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
}
