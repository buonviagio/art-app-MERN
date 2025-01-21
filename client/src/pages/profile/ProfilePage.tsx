import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import {
  ArtsObjectResponce,
  GetProfileOkResponse,
  User,
} from "../../types/customType";
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Image,
  Card,
  Carousel,
} from "react-bootstrap";
import "./ProfilePage.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoPencil } from "react-icons/go";
import CarouseForFavoritesl from "../../components/carouselForFavoriteArtObjects/CarouseForFavoritesl";
import { AuthContext } from "../../context/AuthContext";
import UpdatingArtObject from "../../components/updatingArtObject/UpdatingArtObject";
import { FaHeart } from "react-icons/fa";

export default function ProfilePage() {
  const { setUser } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState<File | string>("");
  //const [newUser, setNewUser] = useState<User | null>(null);
  const [artsObjectsWhichPostedUser, setArtsObjectsWhichPostedUser] = useState<
    ArtsObjectResponce[] | null
  >(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<ArtsObjectResponce[] | null>(null);
  const [modalWindowForUpdatingArtObject, setModalWindowForUpdatingArtObject] =
    useState(false);
  const [selectedArtifactIDForUpdating, setSelectedArtifactIDForUpdating] =
    useState("");
  const [showUploadSection, setShowUploadSection] = useState(false);

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
        "http://localhost:5000/api/arts/getAllFavoritesForProfilePage",
        requestOptions
      );
      if (response.ok) {
        const result = await response.json();
        setFavorites(result.favorites);
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
        "http://localhost:5000/api/arts/addtofavorite",
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
        "http://localhost:5000/api/arts/deleteArtObject",
        requestOptions
      );

      if (response.ok) {
        console.log("art object was deleted");
        const result = await response.json();
        console.log("result after deleting:>> ", result);
        //setFavorites(result.favorites);
        //WE NEED TO UPDATE THE PAGE AFTER DELETE
        fetchFavorites();
      } else {
        console.log("we can not delete this item object");
      }
    } catch (error) {
      console.log("Error was accures during deleting ArtObject :>> ", error);
    }
  };

  const getProfileInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("you need login first");
    }
    if (token) {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      try {
        const response = await fetch(
          "http://localhost:5000/api/user/profile",
          requestOptions
        );
        if (!response.ok) {
          console.log("login again ... redirect user to user page ");
        }
        if (response.ok) {
          const result = (await response.json()) as GetProfileOkResponse;
          setUserProfile(result.userProfile);
        }
      } catch (error) {
        console.log(
          "Error, request to the server is not successfull :>> ",
          error
        );
      }
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
        "http://localhost:5000/api/user/avatarUpload",
        requestOptions
      );
      if (!response.ok) {
        throw new Error("something went wrong in the resoponse");
      }
      if (response.ok) {
        const result = await response.json();
        //setNewUser({ ...newUser!, userImage: result.avatar.secure_url });
        //console.log("newUser :>> ", newUser);
        console.log("RESULT AFTER UPLOADING AVATAR :>> ", result);
        setUser((prevUser) => ({
          ...prevUser,
          avatar: { secure_url: result.avatar.secure_url },
        }));
      }
    } catch (error) {
      console.log("error :>> ", error);
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
        "http://localhost:5000/api/arts/allUserArts",
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

  useEffect(() => {
    getProfileInfo();
    getAllArtsObjectWhichUserPosted();
    fetchFavorites();
  }, []);

  return (
    <div className="profile-page-container text-center py-4">
      <h1 className="text-primary mb-4">Profile Page</h1>

      {/* User Information Section */}
      {userProfile && (
        <div
          className="user-info-section card mx-auto p-4 mb-5"
          style={{ maxWidth: "500px" }}
        >
          <Image
            src={userProfile.avatar.secure_url}
            roundedCircle
            className="mb-3"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
          <h3 className="text-muted mb-1">{userProfile.userName}</h3>
          <p className="text-muted">{userProfile.email}</p>
          <Button
            variant="secondary"
            onClick={() => setShowUploadSection(!showUploadSection)}
          >
            {showUploadSection ? "Cancel" : "Add Avatar"}
          </Button>
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
        <h2 className="text-primary mb-3">Your Favorites</h2>
        <CarouseForFavoritesl
          favorites={favorites}
          handleFavoriteToggle={handleFavoriteToggle}
        />
      </div>

      {/* User's Posted Arts Section */}
      {artsObjectsWhichPostedUser && (
        <div className="posted-arts-section">
          <h2 className="text-primary mb-4">Your Posted Arts</h2>
          <Container fluid>
            <Row xs={1} md={2} xl={3} className="g-4">
              {artsObjectsWhichPostedUser.map((artifact) => (
                <Col key={artifact._id}>
                  <Card
                    className="custom-card border-0 shadow-sm"
                    key={"Primary"}
                  >
                    <div style={{ position: "relative" }}>
                      <Card.Img
                        variant="top"
                        src={artifact.picture.secure_url}
                        className="custom-img"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <button
                        className="custom-button"
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
                        className="custom-button"
                        onClick={() => {
                          setModalWindowForUpdatingArtObject((prev) => !prev);
                          setSelectedArtifactIDForUpdating(artifact._id);
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
                    <Card.Body>
                      <Card.Title>{artifact.nameOfThePainting}</Card.Title>
                      <Card.Text>Year: {artifact.year}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      )}

      {/* Free Space at the Bottom */}
      <div style={{ height: "50px" }}></div>
    </div>
  );

  /* return (
    <div>
      <h1 className="text-primary">Profile Page</h1>
      {modalWindowForUpdatingArtObject && (
        <UpdatingArtObject
          setModalWindowForUpdatingArtObject={
            setModalWindowForUpdatingArtObject
          }
          selectedArtifactIDForUpdating={selectedArtifactIDForUpdating}
        />
      )}
      <div>
        {userProfile && (
          <div>
            <p className="text-muted">Name: {userProfile.userName}</p>
            <p className="text-muted">Email: {userProfile.email}</p>
            <Container>
              <Row>
                <Col xs={6} md={4}>
                  <Image src={userProfile.avatar.secure_url} roundedCircle />
                </Col>
              </Row>
            </Container>
          </div>
        )}
      </div>
      <Form onSubmit={hundleImageSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload your Foto here</Form.Label>
              <Form.Control
                type="file"
                onChange={handleAttachImage}
                accept="image/png, image/jpeg, image/png, image/webp"
                className="w-100"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="primary" type="submit">
              Upload Foto
            </Button>
          </Col>
        </Row>
      </Form>
      {artsObjectsWhichPostedUser && (
        <div className="wrapper-for-container-with-arts-objects-of-user">
          <h3 className="text-primary">Arts that you posted</h3>
          <div className="container-with-arts-objects-of-user">
            <Container fluid className="my-4 px-4">
              <Row xs={1} md={2} xl={3} className="g-4">
                {artsObjectsWhichPostedUser &&
                  artsObjectsWhichPostedUser.map((artifact) => (
                    <Col key={artifact._id}>
                      <Card border="light" className="custom-card">
                        <div style={{ position: "relative" }}>
                          <Card.Img
                            variant="top"
                            src={artifact.picture.secure_url}
                            className="custom-img"
                          />
                          <button
                            className="custom-button"
                            onClick={() => {
                              handleDeleteToggle(artifact._id);
                            }}
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
                          {
                            <button
                              className="custom-button"
                              onClick={() => {
                                //handleFavoriteToggle(artifact._id);
                                setModalWindowForUpdatingArtObject(
                                  (prev) => !prev
                                );
                                setSelectedArtifactIDForUpdating(artifact._id);
                              }}
                              style={{
                                position: "absolute",
                                bottom: "-60px",
                                right: "10px",
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                zIndex: 1,
                              }}
                            >
                              <GoPencil size={30} />
                            </button>
                          }
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
          </div>
        </div>
      )}
      <CarouseForFavoritesl
        favorites={favorites}
        handleFavoriteToggle={handleFavoriteToggle}
      />
    </div>
  ); */
}
