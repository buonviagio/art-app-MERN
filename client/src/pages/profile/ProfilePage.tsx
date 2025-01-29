import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { ArtsObjectResponce } from "../../types/customType";
import { Button, Form, Image } from "react-bootstrap";
import "./ProfilePage.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoPencil } from "react-icons/go";
import CarouseForFavoritesl from "../../components/carouselForFavoriteArtObjects/CarouseForFavoritesl";
import { AuthContext } from "../../context/AuthContext";
import Masonry from "react-masonry-css";
import { NavLink, useNavigate } from "react-router";
import { baseURL } from "../../utils/baseURL";

export default function ProfilePage() {
  const { user, setUser } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState<File | string>("");
  //const [newUser, setNewUser] = useState<User | null>(null);
  const [artsObjectsWhichPostedUser, setArtsObjectsWhichPostedUser] = useState<
    ArtsObjectResponce[] | null
  >(null);
  /* const [userProfile, setUserProfile] = useState<ExistingUserInDB>({
    userName: "Guest",
    email: "",
    userId: "",
  }); */
  const [favorites, setFavorites] = useState<ArtsObjectResponce[] | null>(null);
  const [showUploadSection, setShowUploadSection] = useState(false);
  const navigate = useNavigate();
  const [goTotheCart, setGoTotheCart] = useState(false);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    try {
      const response = await fetch(
        `${baseURL}/api/arts/getAllFavoritesForProfilePage`,
        requestOptions
      );
      if (response.ok) {
        const result = await response.json();
        setFavorites(result.favorites);
        setGoTotheCart(true);
      } else {
        setGoTotheCart(true);
      }
    } catch (error) {
      console.log("error during fetching favorites art objects :>> ", error);
    }
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
        //const result = await response.json();
        //setFavorites(result.favorites);
        if (favorites) {
          setFavorites((prevFavorites) => {
            return (
              prevFavorites &&
              prevFavorites.filter((artifact) => artifact._id !== artifactId)
            );
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteToggle = async (artifactId: string) => {
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
        `${baseURL}/api/arts/deleteArtObject`,
        requestOptions
      );

      if (response.ok) {
        console.log("art object was deleted");
        const result = await response.json();
        console.log("result after deleting:>> ", result);
        //setFavorites(result.favorites);
        //WE NEED TO UPDATE THE PAGE AFTER DELETE
        //fetchFavorites();
        getAllArtsObjectWhichUserPosted();
      } else {
        console.log("we can not delete this item object");
      }
    } catch (error) {
      console.log("Error was accures during deleting ArtObject :>> ", error);
    }
  };

  const handleAttachImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || "";
    setSelectedFile(file);
  };

  const hundleImageSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formdata = new FormData();
    formdata.append("avatar", selectedFile);

    const token = localStorage.getItem("token");

    const requestOptions = {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formdata,
    };
    try {
      const response = await fetch(
        `${baseURL}/api/user/avatarUpload`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error("something went wrong in the resoponse");
      }
      if (response.ok) {
        const result = await response.json();
        //set user variable for auth conext
        setUser((prevUser) => ({
          ...prevUser,
          avatar: { secure_url: result.avatar.secure_url },
        }));
        setShowUploadSection(!showUploadSection);
      }
    } catch (error) {
      console.log("error with uploading avatar foto:>> ", error);
    }
  };

  const getAllArtsObjectWhichUserPosted = async () => {
    const token = localStorage.getItem("token");
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    try {
      const response = await fetch(
        `${baseURL}/api/arts/allUserArts`,
        requestOptions
      );
      if (response.ok) {
        const result = await response.json();
        setArtsObjectsWhichPostedUser(result);
      } else {
        console.log("We can not show you any of our artifacts");
      }
    } catch (error) {}
  };

  const handleCardClick = (artifact: ArtsObjectResponce) => {
    const scrollPosition = document.documentElement.scrollTop;
    sessionStorage.setItem(
      "scrollPositionProgilePage",
      scrollPosition.toString()
    );
    //navigating to detailed page
    navigate(`/art/${artifact._id}`);
  };

  useEffect(() => {
    getAllArtsObjectWhichUserPosted();
    fetchFavorites();
  }, []);

  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem(
      "scrollPositionProgilePage"
    );

    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10));
      setTimeout(() => {
        sessionStorage.removeItem("scrollPositionProgilePage");
      }, 1000);
    }
  }, [goTotheCart]);

  return (
    <div className="profile-page-container text-center py-4">
      <h1 className="text-primary mb-4">Profile Page</h1>

      {/* User Information Section */}
      {user && (
        <div
          className="user-info-section card mx-auto p-4 mb-5"
          style={{ maxWidth: "500px" }}
        >
          <Image
            src={
              user.avatar?.secure_url ||
              "https://res.cloudinary.com/dzbkg3xj2/image/upload/v1737631272/projrct-app/woymynhnvyx2mn27lhxc.jpg"
            }
            roundedCircle
            className="mb-3"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
          <h3 className="text-muted mb-1">{user.userName}</h3>
          <p className="text-muted">{user.email}</p>

          {/* Button Container */}
          <div className="button-container">
            <NavLink to="/addart" className="custom-button-user-info">
              Add Art Object
            </NavLink>
            <Button
              /* variant="secondary" */
              className="custom-button-user-info"
              onClick={() => setShowUploadSection(!showUploadSection)}
            >
              {showUploadSection ? "Cancel" : "Change Avatar"}
            </Button>
          </div>
        </div>
      )}

      {/* Upload Avatar Section */}
      {showUploadSection && (
        <div
          className="upload-section card mx-auto p-4 mb-5"
          style={{ maxWidth: "500px" }}
        >
          <Form onSubmit={hundleImageSubmit}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload Your Photo</Form.Label>
              <Form.Control
                type="file"
                onChange={handleAttachImage}
                accept="image/png, image/jpeg, image/webp"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Upload Photo
            </Button>
          </Form>
        </div>
      )}

      {/* Favorites Carousel Section */}
      <div className="favorites-section mb-5">
        {favorites?.length != 0 ? (
          <h2 className="text-primary mb-3">Your Favorites</h2>
        ) : (
          <h2 className="text-primary mb-3">
            You do not have any favorite art objects
          </h2>
        )}

        <CarouseForFavoritesl
          favorites={favorites}
          handleFavoriteToggle={handleFavoriteToggle}
        />
      </div>

      {/* User's Posted Arts Section */}
      {artsObjectsWhichPostedUser && (
        <div className="posted-arts-section">
          {artsObjectsWhichPostedUser?.length != 0 ? (
            <h2 className="text-primary mb-4">Your Posted Arts</h2>
          ) : (
            <h2 className="text-primary mb-4">
              You didn't post any art object
            </h2>
          )}

          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {artsObjectsWhichPostedUser.map((artifact) => (
              <div key={artifact._id} className="masonry-item">
                <div style={{ position: "relative" }}>
                  <img
                    src={artifact.picture.secure_url}
                    alt={artifact.nameOfThePainting}
                    className="masonry-img"
                    onClick={() => {
                      handleCardClick(artifact);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                  <button
                    className="custom-button-posted-art"
                    onClick={() => handleDeleteToggle(artifact._id)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      zIndex: 1,
                    }}
                  >
                    <RiDeleteBin6Line size={30} />
                  </button>
                  <button
                    className="custom-button-posted-art"
                    onClick={() => {
                      navigate("/updateart", {
                        state: { artifactId: artifact._id },
                      });
                    }}
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      zIndex: 1,
                    }}
                  >
                    <GoPencil size={30} />
                  </button>
                </div>
                <div className="masonry-text">
                  <h5>{artifact.nameOfThePainting}</h5>
                  <p>Year: {artifact.year}</p>
                </div>
              </div>
            ))}
          </Masonry>
        </div>
      )}
      {/* Free Space at the Bottom */}
      <div style={{ height: "50px" }}></div>
    </div>
  );
}
