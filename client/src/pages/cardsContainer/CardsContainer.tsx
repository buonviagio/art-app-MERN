import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import "./CardsContainer.css";

export default function CardsContainer() {
  const [allArtifacts, setAllArtifacts] = useState();

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
      <Row xs={1} md={2} xl={3} className="g-4">
        {allArtifacts &&
          allArtifacts.map((artifact) => (
            <Col key={artifact._id}>
              <Card border="light" className="custom-card">
                <Card.Img
                  variant="top"
                  src={artifact.picture}
                  className="custom-img"
                />
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
