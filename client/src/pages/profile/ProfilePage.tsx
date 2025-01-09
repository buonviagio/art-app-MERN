import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { GetProfileOkResponse, User } from "../../types/customType";
import { Button, Col, Container, Form, Row, Image } from "react-bootstrap";

export default function ProfilePage() {
  const [selectedFile, setSelectedFile] = useState<File | string>("");
  const [newUser, setNewUser] = useState<User | null>(null);

  const [userProfile, setUserProfile] = useState<User | null>(null);

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
      } catch (error) {}
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

  useEffect(() => {
    getProfileInfo();
  }, [newUser]);

  return (
    <div>
      <h1 className="text-primary">ProfilePage</h1>
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
    </div>
  );
}
