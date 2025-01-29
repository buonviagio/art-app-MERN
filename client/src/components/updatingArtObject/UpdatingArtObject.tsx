import { useState } from "react";
import { Alert, ProgressBar } from "react-bootstrap";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import * as formik from "formik";
import * as yup from "yup";
import ModalForSuccessfullyUploadArtObject from "../modalWindows/ModalForSuccessfullyUploadArtObject";
import { useLocation, useNavigate } from "react-router";
import { FaBackspace } from "react-icons/fa";
import { baseURL } from "../../utils/baseURL";

export default function UpdatingArtObject() {
  const [returnedArtObject, setReturnedArtObject] = useState<{
    picture: { secure_url: string };
    nameOfThePainting: string;
    nameOfTheAuthor: string;
    style: string;
    year: number;
    location: string;
  } | null>(null);
  // here we assign message from server responce and pass info to the modal window
  const [returnedMessage, setReturnedMessage] = useState("");
  //after successful response rom server open maodal window and showing art objevt which has been recently added
  const [modalShow, setModalShow] = useState(false);
  // show alert if the user try submit empty form
  const [alert, setAlert] = useState(false);
  // this object initialize Formic schema and (infare type - выводит тип) of the argument value in hundleSubmit(value)
  const artObject = {
    art: "",
    author: "",
    style: "",
    year: "",
    location: "",
    description: "",
    artphoto: null,
    terms: false,
  };
  // ProgressBar bootstrap
  const [progressVisible, setProgressVisible] = useState(false);
  // Track progress value
  const [progressValue, setProgressValue] = useState(0);
  //from react router, we take artId from state object
  const location = useLocation();
  const { artifactId } = location.state;
  //from react router, we navigate user to the profile page
  const navigate = useNavigate();
  // Formik
  const { Formik } = formik;

  // this function returns the user to the page where he came from
  const handleBackClick = () => {
    navigate(-1);
  };

  //typeof infere type of the object, we have
  // { art: "", artphoto: null, terms: false } it infers them to => {art: string; artphoto:null; terms: boolean}
  const hundleSubmit = async (values: typeof artObject) => {
    // We call this function in order to define, user type something in the form excluding terms
    // we make it in order to, not submit empty form, one of all fiedls must be filled out
    setAlert(false);
    if (compareObjects(values, artObject, ["terms"])) {
      setAlert(true);
      return;
    }

    const formdata = new FormData();
    // we check if user does not attach photo, it will be null, instaed we send empty string
    formdata.append("artphoto", values.artphoto ? values.artphoto : "");
    formdata.append("artname", values.art);
    formdata.append("author", values.author);
    formdata.append("style", values.style);
    formdata.append("year", values.year);
    formdata.append("location", values.location);
    formdata.append("description", values.description);
    formdata.append("artifactId", artifactId);

    const token = localStorage.getItem("token");

    const requestOptions = {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formdata,
    };

    // Show progress bar
    setProgressVisible(true);
    // Reset progress bar
    setProgressValue(0);
    // Animate progress bar from 1 to 100
    // we can define time of performing loader
    const stepDuration = 50;
    // increment per step
    const increment = 1;

    // we create promese, that returns nothing. In promise executor pass function with one argument resolve
    // in this function we use setInterval in order to every stepDuration time we set progressValue variable
    // with value wich user observes on the page as loader, when the value reach more then 100, resolve function
    // is called, and promise ends
    const progressAnimation = new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        setProgressValue((prev) => {
          const nextValue = prev + increment;
          if (nextValue >= 100) {
            clearInterval(interval);
            // Resolve when animation is complete
            resolve();
            return 100;
          }
          return nextValue;
        });
      }, stepDuration);
    });

    try {
      const response = await fetch(
        `${baseURL}/api/arts/updateArtObject`,
        requestOptions
      );

      // Wait for both the progress animation and the fetch request we are waiting, in case if the response comes
      // faster then loader ends, if
      await Promise.all([
        progressAnimation,
        response.ok ? null : Promise.reject(new Error("Response failed")),
      ]);

      if (response.ok) {
        const result = await response.json();
        setReturnedArtObject(result.artObject);
        setReturnedMessage(result.message);
        setModalShow(true);
      }
    } catch (error) {
      console.log("error in the method hundleSubmit() :>> ", error);
    }
  };

  // This is helper function compares two objects of the same type, while ignoring  a specific types,
  // in our case TERMS it can be diff.
  // <T extends Record<string, any>>: The function works with objects where keys are strings and values can be of any type.
  // Object.keys() generates an array of keys
  // filter() filters out keys that are in array excludeKeys
  // every() ensures that for all remaining keys, values are equal
  function compareObjects<T extends Record<string, any>>(
    obj1: T,
    obj2: T,
    excludeKeys: (keyof T)[] = []
  ): boolean {
    return (
      Object.keys(obj1)
        // Exclude specified keys
        .filter((key) => !excludeKeys.includes(key))
        // Compare remaining values
        .every((key) => obj1[key] === obj2[key])
    );
  }

  // this schema defines validation rules using YUP
  // if the object (violates-нарушить) any rules,YUP will throw an error
  const schema = yup.object().shape({
    art: yup.string().optional(),
    author: yup.string().optional(),
    style: yup.string().optional(),
    year: yup.number().typeError("Year must be a valid number.").optional(),
    location: yup.string().optional(),
    description: yup.string().optional(),
    artphoto: yup
      .mixed<File>()
      .optional()
      .nullable()
      .test(
        "fileType", // Test name.
        "Unsupported file format. Only PNG, JPEG, and WEBP are allowed.",
        (value) => {
          return (
            value === null ||
            (value instanceof File &&
              ["image/png", "image/jpeg", "image/webp"].includes(value.type))
          );
        }
      ),
    terms: yup.bool().required().oneOf([true], "Terms must be accepted"),
  });

  return (
    <div>
      {/* <Modal.Body> */}
      {modalShow && (
        <ModalForSuccessfullyUploadArtObject
          setModalShow={setModalShow}
          returnedArtObject={returnedArtObject ?? undefined}
          returnedMessage={returnedMessage}
        />
      )}
      {alert && <Alert variant={"warning"}>Fill in at least one field</Alert>}
      {/* Conditional rendering */}
      {progressVisible ? (
        <div className="progress-container">
          <div className="progress-container-child">
            <ProgressBar
              animated
              now={progressValue}
              label={`${progressValue}%`}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      ) : (
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh", minWidth: "100%", marginTop: "50px" }}
        >
          <Row className="w-100">
            {/* Back Button */}
            <div className="mb-3">
              <button
                onClick={handleBackClick}
                className="btn btn-outline-primary d-flex align-items-center"
              >
                <FaBackspace className="me-2" />
                Go Back
              </button>
            </div>
            <Col xs={12} md={10} lg={8} xl={8} className="mx-auto">
              <div className="p-4 border rounded bg-light shadow">
                <h2 className="text-center mb-4">Artifact update</h2>
                {/* Start the form */}
                {/* Formik is a wrappeer that handles form state, validation,
                submition, it take properties... Formik component uses RENDER PROPS PATTERN  - technique in React, 
                a component shares its state or logic with other components by passing a function as a prop.*/}
                <Formik
                  // Links the Yup validation schema for validating the form
                  validationSchema={schema}
                  // Function wich will be executed, when user submit form
                  onSubmit={hundleSubmit}
                  // Initial form values
                  initialValues={artObject}
                >
                  {({
                    handleSubmit, // Function to handle form submission
                    handleChange, // Function to handle field changes
                    setFieldValue, // Function to programmatically set field values
                    values, // Object containing the current values of all fields
                    touched, // Tracks whether fields have been "touched"
                    errors, // Object containing validation errors for fields
                  }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="10"
                          controlId="validationFormik01"
                        >
                          <Form.Label>The name of the art</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="The name of the art"
                            name="art"
                            value={values.art}
                            onChange={handleChange}
                            isValid={
                              touched.art && !errors.art && values.art !== ""
                            }
                            isInvalid={touched.art && !!errors.art}
                          />
                          {touched.art && errors.art && (
                            <Form.Control.Feedback type="invalid">
                              {errors.art}
                            </Form.Control.Feedback>
                          )}
                          {touched.art && !errors.art && (
                            <Form.Control.Feedback></Form.Control.Feedback>
                          )}
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="10"
                          controlId="validationFormik02"
                        >
                          <Form.Label>Name of the author</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Name of the author"
                            name="author"
                            value={values.author}
                            onChange={handleChange}
                            isValid={
                              touched.author &&
                              !errors.author &&
                              values.author !== ""
                            }
                            isInvalid={touched.author && !!errors.author}
                          />
                          {touched.author && errors.author && (
                            <Form.Control.Feedback type="invalid">
                              {errors.author}
                            </Form.Control.Feedback>
                          )}
                          {touched.author && !errors.author && (
                            <Form.Control.Feedback></Form.Control.Feedback>
                          )}
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="10"
                          controlId="validationFormik03"
                        >
                          <Form.Label>Choose style of the art</Form.Label>
                          <Form.Select
                            name="style"
                            value={values.style}
                            onChange={handleChange}
                            isValid={
                              touched.style &&
                              !errors.style &&
                              values.style !== ""
                            }
                            isInvalid={touched.style && !!errors.style}
                          >
                            <option value="">Select an art style...</option>
                            {/* Ancient Styles */}
                            <optgroup label="Ancient Styles">
                              <option value="Egyptian Style">
                                Egyptian Style
                              </option>
                              <option value="Greek Style">Greek Style</option>
                              <option value="Roman Style">Roman Style</option>
                            </optgroup>
                            {/* Medieval Styles */}
                            <optgroup label="Medieval Styles">
                              <option value="Romanesque">Romanesque</option>
                              <option value="Gothic">Gothic</option>
                            </optgroup>
                            {/* Renaissance */}
                            <optgroup label="Renaissance">
                              <option value="Renaissance">Renaissance</option>
                            </optgroup>
                            {/* Baroque and Rococo */}
                            <optgroup label="Baroque and Rococo">
                              <option value="Baroque">Baroque</option>
                              <option value="Rococo">Rococo</option>
                            </optgroup>
                            {/* Classicism and Romanticism */}
                            <optgroup label="Classicism and Romanticism">
                              <option value="Classicism">Classicism</option>
                              <option value="Romanticism">Romanticism</option>
                            </optgroup>
                            {/* Modernism */}
                            <optgroup label="Modernism">
                              <option value="Impressionism">
                                Impressionism
                              </option>
                              <option value="Pointillism">Pointillism</option>
                              <option value="Expressionism">
                                Expressionism
                              </option>
                              <option value="Cubism">Cubism</option>
                              <option value="Fauvism">Fauvism</option>
                              <option value="Surrealism">Surrealism</option>
                            </optgroup>
                            {/* Contemporary Styles */}
                            <optgroup label="Contemporary Styles">
                              <option value="Abstract Art">Abstract Art</option>
                              <option value="Pop Art">Pop Art</option>
                              <option value="High-Tech">High-Tech</option>
                              <option value="Postmodernism">
                                Postmodernism
                              </option>
                            </optgroup>
                          </Form.Select>

                          {touched.style && errors.style && (
                            <Form.Control.Feedback type="invalid">
                              {errors.style}
                            </Form.Control.Feedback>
                          )}
                          {touched.style && !errors.style && (
                            <Form.Control.Feedback></Form.Control.Feedback>
                          )}
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="10"
                          controlId="validationFormik04"
                        >
                          <Form.Label>Year of the Art creation</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Year of the Art creation"
                            name="year"
                            value={values.year}
                            onChange={handleChange}
                            isValid={
                              touched.year && !errors.year && values.year !== ""
                            }
                            isInvalid={touched.year && !!errors.year}
                          />
                          {touched.year && errors.year && (
                            <Form.Control.Feedback type="invalid">
                              {errors.year}
                            </Form.Control.Feedback>
                          )}
                          {touched.year && !errors.year && (
                            <Form.Control.Feedback></Form.Control.Feedback>
                          )}
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="10"
                          controlId="validationFormik05"
                        >
                          <Form.Label>Location of the Art</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Location of the Art"
                            name="location"
                            value={values.location}
                            onChange={handleChange}
                            isValid={
                              touched.location &&
                              !errors.location &&
                              values.location !== ""
                            }
                            isInvalid={touched.location && !!errors.location}
                          />

                          {touched.location && errors.location && (
                            <Form.Control.Feedback type="invalid">
                              {errors.location}
                            </Form.Control.Feedback>
                          )}
                          {touched.location && !errors.location && (
                            <Form.Control.Feedback></Form.Control.Feedback>
                          )}
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="10"
                          controlId="validationFormik06"
                        >
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            type="text"
                            as="textarea"
                            rows={3}
                            placeholder="Description"
                            name="description"
                            value={values.description}
                            onChange={handleChange}
                            isValid={
                              touched.description &&
                              !errors.description &&
                              values.description !== ""
                            }
                            isInvalid={
                              touched.description && !!errors.description
                            }
                          />

                          {touched.description && errors.description && (
                            <Form.Control.Feedback type="invalid">
                              {errors.description}
                            </Form.Control.Feedback>
                          )}
                          {touched.description && !errors.description && (
                            <Form.Control.Feedback></Form.Control.Feedback>
                          )}
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="10"
                          controlId="validationFormik07"
                        >
                          <Form.Label>Upload your Foto here</Form.Label>
                          <Form.Control
                            type="file"
                            name="artphoto"
                            onChange={(event) => {
                              const file = (event.target as HTMLInputElement)
                                .files?.[0];
                              setFieldValue("artphoto", file);
                            }}
                            accept="image/png, image/jpeg, image/png, image/webp"
                            isValid={
                              touched.artphoto &&
                              !errors.artphoto &&
                              values.artphoto !== null
                            }
                            isInvalid={!!errors.artphoto && touched.artphoto}
                          />
                          {touched.artphoto && errors.artphoto && (
                            <Form.Control.Feedback type="invalid">
                              {errors.artphoto}
                            </Form.Control.Feedback>
                          )}
                          {touched.artphoto && !errors.artphoto && (
                            <Form.Control.Feedback></Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Check
                          required
                          name="terms"
                          label="Agree to terms and conditions"
                          onChange={handleChange}
                          isInvalid={touched.terms && !!errors.terms}
                          feedback={errors.terms}
                          feedbackType="invalid"
                          id="validationFormik0"
                        />
                      </Form.Group>
                      <Button type="submit">Submit form</Button>
                    </Form>
                  )}
                </Formik>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
}
