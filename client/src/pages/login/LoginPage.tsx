import "bootstrap/dist/css/bootstrap.min.css";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { LoginOkResponse, User } from "../../types/customType";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import useUserStatus from "../../hooks/useUserStatus";
import { AuthContext } from "../../context/AuthContext";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const isUserLOGEDIN = useUserStatus();
  const [newUser, setNewUser] = useState<User | null>(null);
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  const handleLoginChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserCredentials({
      ...userCredentials!,
      [event.target.name]: event.target.value,
    });
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("userCredentials :>> ", userCredentials);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("email", userCredentials.email);
    urlencoded.append("password", userCredentials.password);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/user/login",
        requestOptions
      );
      const result = (await response.json()) as LoginOkResponse;
      console.log("result :>> ", result);

      if (result.token) {
        //If there is a token in the response, store token
        //localStorage.setItem("token", result.token);
        login(result.token);

        //2 Set user (probably in AuthContext with the user info)
        // Should to set User setNewUser({result.user })

        console.log("isUserLOGEDIN :>> ", isUserLOGEDIN);
      } else {
        throw new Error(
          "There wasn't recieved token from the server, try login again"
        );
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  return (
    <div>
      <div className="register-container">
        <h2 className="text-primary fw-bold text-center mb-4">Login</h2>
        <Form onSubmit={handleLoginSubmit}>
          <Row>
            <Col>
              <InputGroup className="mb-3">
                <Form.Control
                  name="email"
                  placeholder="Email"
                  aria-describedby="inputGroup-sizing-default"
                  value={userCredentials.email}
                  onChange={handleLoginChange}
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
                  value={userCredentials.password}
                  onChange={handleLoginChange}
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
