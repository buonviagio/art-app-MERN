import { useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  ProgressBar,
  Row,
} from "react-bootstrap";
import * as formik from "formik";
import * as yup from "yup";
import ModalForSuccessfullyUploadArtObject from "../../components/modalWindows/ModalForSuccessfullyUploadArtObject";
import { FaBackspace } from "react-icons/fa";
import { useNavigate } from "react-router";
import "./AddindArtObject.css";
import { baseURL } from "../../utils/baseURL";

export default function AddingArtObject() {
  const [modalShow, setModalShow] = useState(false);
  const [returnedArtObject, setReturnedArtObject] = useState<{
    picture: { secure_url: string };
    nameOfThePainting: string;
    nameOfTheAuthor: string;
    style: string;
    year: number;
    location: string;
  } | null>(null);
  const [returnedMessage, setReturnedMessage] = useState("");
  // ProgressBar bootstrap
  const [progressVisible, setProgressVisible] = useState(false);
  // Track progress value
  const [progressValue, setProgressValue] = useState(0);
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

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
  const hundleSubmit = async (values: typeof artObject) => {
    const formdata = new FormData();
    formdata.append("artphoto", values.artphoto!);
    formdata.append("artname", values.art);
    formdata.append("author", values.author);
    formdata.append("style", values.style);
    formdata.append("year", values.year);
    formdata.append("location", values.location);
    formdata.append("description", values.description);

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
    const stepDuration = 50;
    // Increment per step
    const increment = 1;

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
    // My solution
    /* const progressInterval = setInterval(() => {
      setProgressValue((prev) => {
        if (prev >= 100) {
          // Stop animation at 100
          clearInterval(progressInterval);
          return 100;
        }
        // Increment progress
        return prev + 1;
      });
      // speed of animation
    }, 30); */
    try {
      const response = await fetch(
        `${baseURL}/api/arts/aploadArtObject`,
        requestOptions
      );

      // Wait for both the progress animation and the fetch request to complete
      await Promise.all([
        progressAnimation,
        response.ok ? null : Promise.reject(new Error("Response failed")),
      ]);

      /* if (!response.ok) {
        throw new Error("something went wrong in the resoponse");
      } */
      if (response.ok) {
        const result = await response.json();
        console.log("result :>> ", result);
        setReturnedArtObject(result.artObject);
        setReturnedMessage(result.message);
        // Show success modal
        setModalShow(true);
        // Hide progress bar
        setProgressVisible(false);
        // we have to save picture in the data base
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const { Formik } = formik;
  const errorMessage = "This Field is requered";
  const schema = yup.object().shape({
    art: yup.string().required(errorMessage),
    author: yup.string().required(errorMessage),
    style: yup.string().required(errorMessage),
    year: yup
      .number()
      .typeError("Year must be a valid number.")
      .required("It must be number"),
    location: yup.string().required(errorMessage),
    description: yup.string().required(errorMessage),
    artphoto: yup
      .mixed<File>()
      .required("A file is required")
      .test(
        "fileType",
        "Unsupported file format. Only PNG, JPEG, and WEBP are allowed.",
        (value) => {
          return (
            // value &&
            value instanceof File &&
            ["image/png", "image/jpeg", "image/webp"].includes(value.type)
          );
        }
      ),
    terms: yup.bool().required().oneOf([true], "Terms must be accepted"),
  });

  return (
    <div>
      {modalShow && (
        <ModalForSuccessfullyUploadArtObject
          setModalShow={setModalShow}
          returnedArtObject={returnedArtObject ?? undefined}
          returnedMessage={returnedMessage}
        />
      )}
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
          style={{ minHeight: "100vh" }}
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
            <Col xs={12} md={8} lg={6} xl={8} className="mx-auto">
              <div className="p-4 border rounded bg-light shadow">
                <h2 className="text-center mb-4">New Art Artifact</h2>

                {/* Start the form */}
                <Formik
                  validationSchema={schema}
                  onSubmit={hundleSubmit}
                  initialValues={artObject}
                >
                  {({
                    handleSubmit,
                    handleChange,
                    setFieldValue,
                    values,
                    touched,
                    errors,
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
                            isValid={touched.art && !errors.art}
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
                            isValid={touched.author && !errors.author}
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
                            isValid={touched.style && !errors.style}
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
                          {/* <Form.Control.Feedback type="invalid">
                        {errors.style}
                      </Form.Control.Feedback> */}
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
                            isValid={touched.year && !errors.year}
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
                            isValid={touched.location && !errors.location}
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
                            isValid={touched.description && !errors.description}
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
                            isValid={touched.artphoto && !errors.artphoto}
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
