import { useContext, useEffect, useState } from "react";
import { Alert, Container } from "react-bootstrap";
import "./CardsContainer.css";
import { useNavigate } from "react-router";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { ArtsObjectResponce } from "../../types/customType";
import ArtSelection from "../../components/selectSection/ArtSelection";
import ArtStyleDropdown from "../../components/artStyleDropdown/ArtStyleDropdown";
import ArtSearch from "../../components/artSearching/ArtSearch";
import Masonry from "react-masonry-css";
import ImageSkeleton from "../../components/imageSkeleton/ImageSkeleton";
import { baseURL } from "../../utils/baseURL";

export default function CardsContainer() {
  const { isAuthenticated } = useContext(AuthContext);
  const [allArtifacts, setAllArtifacts] = useState<ArtsObjectResponce[] | null>(
    null
  );
  const [favorites, setFavorites] = useState<string[]>([]);
  const navigate = useNavigate();
  const [goTotheCart, setGoTotheCart] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

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
        `${baseURL}/api/arts/addtofavorite`,
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
      const response = await fetch(`${baseURL}/api/arts/all`, requestOptions);
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
        `${baseURL}/api/arts/getAllFavorites`,
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
    setAlert(false);
    getAllArtifacts();
  }, []);

  useEffect(() => {
    if (isAuthenticated) getAllFavoritesFromUser();
  }, [isAuthenticated]);

  const handleCardClick = (artifact: ArtsObjectResponce) => {
    const scrollPosition = document.documentElement.scrollTop;
    sessionStorage.setItem("scrollPosition", scrollPosition.toString());
    //navigating to detailed page
    navigate(`/art/${artifact._id}`);
  };

  return (
    <Container fluid className="my-4 px-4">
      {/* Styling block */}
      <div className="custom-block">
        <div className="custom-block-item">
          <ArtSelection setAllArtifacts={setAllArtifacts} setAlert={setAlert} />
        </div>
        <div className="custom-block-item">
          <ArtSearch
            setAllArtifacts={setAllArtifacts}
            setAlertMessage={setAlertMessage}
            setAlert={setAlert}
          />
        </div>
        <div className="custom-block-item">
          <ArtStyleDropdown
            setAllArtifacts={setAllArtifacts}
            setAlertMessage={setAlertMessage}
            setAlert={setAlert}
          />
        </div>
      </div>

      {/* Alert Section */}
      {alert && (
        <Alert
          variant={"info"}
          style={{
            width: "80%",
            margin: "2rem auto",
          }}
        >
          {alertMessage}
        </Alert>
      )}

      {/* Artifacts with Masonry*/}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {allArtifacts &&
          allArtifacts.map((artifact) => (
            <div key={artifact._id} className="masonry-item">
              <div style={{ position: "relative" }}>
                {/* Image with skeleton loader */}
                <ImageSkeleton
                  src={artifact.picture.secure_url}
                  alt={artifact.nameOfThePainting || "Art"}
                  className="masonry-img"
                  onClick={() => handleCardClick(artifact)}
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
              <div className="masonry-text">
                <h5>{artifact.nameOfThePainting}</h5>
                <p>Year: {artifact.year}</p>
              </div>
            </div>
          ))}
      </Masonry>
    </Container>
  );
}
