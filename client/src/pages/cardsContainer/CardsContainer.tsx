import { useContext, useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import "./CardsContainer.css";
import { NavLink, useNavigate } from "react-router";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { ArtsObjectResponce } from "../../types/customType";
import ArtSelection from "../../components/selectSection/ArtSelection";
import ArtStyleDropdown from "../../components/artStyleDropdown/ArtStyleDropdown";

export default function CardsContainer() {
  console.log("CardsContainer component");
  const { isAuthenticated } = useContext(AuthContext);
  const [allArtifacts, setAllArtifacts] = useState<ArtsObjectResponce[] | null>(
    null
  );
  const [favorites, setFavorites] = useState<string[]>([]);
  const navigate = useNavigate();
  const [goTotheCart, setGoTotheCart] = useState(false);

  const handleFavoriteToggle = async (artifactId: string) => {
    const token = localStorage.getItem("token");
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append("artId", artifactId);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/arts/addtofavorite",
        requestOptions
      );
      if (response.ok) {
        const result = await response.json();
        setFavorites(result.favorites);
      }
    } catch (error) {
      console.log(
        "Error, we can not show favorites on the gallery page :>> ",
        error
      );
    }
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
        setGoTotheCart(true);
      } else {
        console.log("We can not show you any of our artifacts");
      }
    } catch (error) {
      console.log("faild to get all art objects");
    }
  };

  const getAllFavoritesFromUser = async () => {
    const token = localStorage.getItem("token");
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    try {
      const response = await fetch(
        "http://localhost:5000/api/arts/getAllFavorites",
        requestOptions
      );
      if (response.ok) {
        const result = await response.json();
        setFavorites(result.favorites);
        setGoTotheCart(true);
      } else {
        console.log("We can not show you any of our favorites artifacts");
      }
    } catch (error) {
      console.log("faild to get all your favorite art objects");
    }
  };

  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem("scrollPosition");
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10));
      setTimeout(() => {
        sessionStorage.removeItem("scrollPosition");
      }, 1000);
    }
  }, [goTotheCart]);

  useEffect(() => {
    getAllArtifacts();
  }, []);

  useEffect(() => {
    getAllFavoritesFromUser();
  }, [isAuthenticated]);

  const handleCardClick = (artifact: ArtsObjectResponce) => {
    const scrollPosition = document.documentElement.scrollTop;
    sessionStorage.setItem("scrollPosition", scrollPosition.toString());
    //navigating to detailed page
    navigate(`/art/${artifact._id}`);
  };

  return (
    <Container fluid className="my-4 px-4">
      <Row>
        <Col>
          <NavLink to="/addart">Add new Art Object</NavLink>
        </Col>
        <Col>
          <ArtSelection setAllArtifacts={setAllArtifacts} />
        </Col>

        <Col>
          <ArtStyleDropdown setAllArtifacts={setAllArtifacts} />
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
                    onClick={() => {
                      handleCardClick(artifact);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                  {isAuthenticated && (
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
                      {favorites.includes(artifact._id) ? (
                        <FaHeart color="red" size={30} />
                      ) : (
                        <FaRegHeart color="grey" size={30} />
                      )}
                    </button>
                  )}
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
