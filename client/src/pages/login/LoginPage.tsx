import "bootstrap/dist/css/bootstrap.min.css";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { LoginOkResponse } from "../../types/customType";
import { Alert, Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { baseURL } from "../../utils/baseURL";

export default function LoginPage() {
  const { login } = useContext(AuthContext);

  //const isUserLOGEDIN = useUserStatus();

  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleLoginChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserCredentials({
      ...userCredentials!,
      [event.target.name]: event.target.value,
    });
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // to restart alert after previous showing
    setAlert(false);
    setAlertMessage("");

    if (!/\S+@\S+\.\S+/.test(userCredentials.email)) {
      setAlert(true);
      setAlertMessage("Please enter a valid email address.");
      return;
    } else if (userCredentials.password.length < 6) {
      setAlert(true);
      setAlertMessage("Password must be at least 6 characters long.");
      return;
    }

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
      const response = await fetch(`${baseURL}/api/user/login`, requestOptions);

      const result = (await response.json()) as LoginOkResponse;

      if (result.token) {
        //set the user in AuthContext
        login(result.token);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      //to show alert, that password or email are not write
      let errorMessage;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = "";
      }
      setAlert(true);
      setAlertMessage(errorMessage);
      console.log("error :>> ", error);
    }
  };

  return (
    <div>
      {alert && (
        <Alert
          variant={"primary"}
          style={{
            width: "80%",
            margin: "2rem auto",
          }}
        >
          {alertMessage}
        </Alert>
      )}
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
