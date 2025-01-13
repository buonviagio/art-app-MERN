import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { GetProfileOkResponse, User } from "../../types/customType";
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Image,
  Card,
} from "react-bootstrap";
import "./ProfilePage.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { TbRuler } from "react-icons/tb";

export default function ProfilePage() {
  const [selectedFile, setSelectedFile] = useState<File | string>("");
  const [newUser, setNewUser] = useState<User | null>(null);
  const [artsObjectsWhichPostedUser, setArtsObjectsWhichPostedUser] =
    useState(null);

  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isFavorite, setIsFavorite] = useState(true);

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
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
          console.log("IMG :>> ", result.userProfile);
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
        console.log("result :>> ", result);
        // we have to save picture in the data base
        setNewUser({ ...newUser!, userImage: result.avatar.secure_url });
        console.log("newUser :>> ", newUser);
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
        console.log("Result art which posted user :>> ", result);
        //setAllArtifacts(result.allArts);
      } else {
        console.log("We can not show you any of our artifacts");
      }
    } catch (error) {}
  };

  useEffect(() => {
    getProfileInfo();
    getAllArtsObjectWhichUserPosted();
  }, [newUser]);

  return (
    <div>
      <h1 className="text-primary">Profile Page</h1>
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
                            onClick={handleFavoriteToggle}
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
          </div>
        </div>
      )}
    </div>
  );
}
