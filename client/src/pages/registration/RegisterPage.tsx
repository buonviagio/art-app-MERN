import "bootstrap/dist/css/bootstrap.min.css";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import "./RegisterPage.css";
import { Alert, Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { LoginOkResponse, User } from "../../types/customType";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";

export default function RegisterPage() {
  // to think about tipe File |String
  const { login } = useContext(AuthContext);
  /*   const [selectedFile, setSelectedFile] = useState<File | string>("");*/
  const [newUser, setNewUser] = useState<User | null>(null);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  const handleRegisterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewUser({
      ...newUser!,
      [event.target.name]: event.target.value,
    });
  };

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const usernameRegEx = /^(?=.*[a-zA-Z])[\w!@#$%^&*()\-+?.]{2,20}$/;

    // to restart alert after previous showing
    setAlert(false);
    setAlertMessage("");

    if (!newUser) {
      setAlert(true);
      setAlertMessage("You have to fill out the registration form.");
      return;
    } else if (!usernameRegEx.test(newUser?.userName)) {
      console.log("TegExpr =>", usernameRegEx.test(newUser?.userName));
      setAlert(true);
      setAlertMessage("Please enter a valid name of the user.");
      return;
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      setAlert(true);
      setAlertMessage("Please enter a valid email address.");
      return;
    } else if (newUser.password.length < 6) {
      setAlert(true);
      setAlertMessage("Password must be at least 6 characters long.");
      return;
    }

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
          : "https://res.cloudinary.com/dzbkg3xj2/image/upload/v1733909667/projrct-app/d3dx8pyz9rqq9mzfkseb.webp"
      );
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
      if (result.user) {
        setAlert(true);
        setAlertMessage(result.message);
        loginNewlyRegisteredUser();
        return;
      } else {
        //to show alert, that password or email are not write
        setAlert(true);
        setAlertMessage(result.message);
        return;
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const loginNewlyRegisteredUser = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    if (newUser) {
      urlencoded.append("email", newUser.email);
      urlencoded.append("password", newUser.password);
    }

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
      if (result.token) {
        //If there is a token in the response, store token
        //localStorage.setItem("token", result.token);
        login(result.token);

        setTimeout(() => {
          // redirect to the login page
          navigate("/profile");
        }, 2000);
      }
    } catch (error) {
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
        <h2 className="text-primary fw-bold text-center mb-4">Register</h2>
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
