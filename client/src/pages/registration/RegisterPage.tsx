import "bootstrap/dist/css/bootstrap.min.css";
import { ChangeEvent, FormEvent, useState } from "react";
import "./RegisterPage.css";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { User } from "../../types/customType";
import { NavLink } from "react-router";

export default function RegisterPage() {
  // to think about tipe File |String
  const [selectedFile, setSelectedFile] = useState<File | string>("");
  const [newUser, setNewUser] = useState<User | null>(null);

  const handleAttachImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || "";
    setSelectedFile(file);
  };

  const hundleImageSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formdata = new FormData();
    formdata.append("avatar", selectedFile);

    const requestOptions = {
      method: "POST",
      body: formdata,
      /* redirect: "follow", */
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
        setNewUser({ ...newUser!, userImage: result.avatar.secure_url });
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const handleRegisterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewUser({
      ...newUser!,
      [event.target.name]: [event.target.value],
    });
    console.log(newUser);
  };

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("newUser from handleRegisterSubmit:>> ", newUser);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    if (newUser) {
      urlencoded.append("userName", newUser.userName);
      urlencoded.append("email", newUser.email);
      urlencoded.append("password", newUser.password);
      urlencoded.append(
        "avatar",
        newUser.userImage
          ? newUser.userImage
          : "https://www.vecteezy.com/vector-art/8442080-user-icon-in-trendy-flat-style-isolated-on-white-background"
      );
    }
    if (!newUser?.email) {
      alert("email is missing");
    }

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };
    try {
      const request = await fetch(
        "http://localhost:5000/api/user/register",
        requestOptions
      );

      const result = await request.json();
      console.log("result :>> ", result);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  return (
    <div>
      <div className="register-container">
        <h2 className="text-primary fw-bold text-center mb-4">Register</h2>
        {/* <Form onSubmit={hundleImageSubmit}>
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
        </Form> */}
        {/* <div className="avatar">
          {newUser && (
            <img
              src={newUser.userImage}
              alt="user avatar picture"
              style={{ width: "100px", height: "100px" }}
            />
          )}
        </div> */}
        <Form onSubmit={handleRegisterSubmit}>
          <Row>
            <Col>
              <InputGroup className="mb-3 mt-3">
                <Form.Control
                  name="userName"
                  placeholder="Your name"
                  aria-describedby="inputGroup-sizing-default"
                  onChange={handleRegisterChange}
                  className="ms-3 me-3"
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <InputGroup className="mb-3">
                <Form.Control
                  name="email"
                  placeholder="Email"
                  aria-describedby="inputGroup-sizing-default"
                  onChange={handleRegisterChange}
                  className="ms-3 me-3"
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <InputGroup className="mb-3">
                <Form.Control
                  name="password"
                  placeholder="Passwort"
                  aria-describedby="inputGroup-sizing-default"
                  type="password"
                  onChange={handleRegisterChange}
                  className="ms-3 me-3"
                />
              </InputGroup>
            </Col>
          </Row>
          <Row className="d-flex justify-content-end me-2">
            <Col xs="auto">
              <Button variant="primary" type="submit">
                Register
              </Button>
            </Col>
          </Row>
        </Form>
        <hr className="custom-hr" />
        <Row>
          <Col className="text-center">
            <p className="mt-3 text-muted">
              Do you have an account? <NavLink to="/login">Sign in</NavLink>
            </p>
          </Col>
        </Row>
      </div>
    </div>
  );
}
