import "bootstrap/dist/css/bootstrap.min.css";
import { ChangeEvent, FormEvent, useState } from "react";
import { User } from "../../types/customType";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";

export default function LoginPage() {
  const [newUser, setNewUser] = useState<User | null>(null);

  const handleRegisterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewUser({
      ...newUser!,
      [event.target.name]: [event.target.value],
    });
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
        <h2 className="text-primary fw-bold text-center mb-4">Login</h2>
        <Form onSubmit={handleRegisterSubmit}>
          {/* <Row>
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
          </Row> */}
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
                Login
              </Button>
            </Col>
          </Row>
        </Form>
        <hr className="custom-hr" />
        <Row>
          <Col className="text-center">
            <p className="mt-3 text-muted">
              Forget your password? <a href="/signin">Click here</a>
            </p>
          </Col>
        </Row>
      </div>
    </div>
  );
}
