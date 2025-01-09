import { ChangeEvent, FormEvent, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import * as formik from "formik";
import * as yup from "yup";

export default function AddingArtObject() {
  const [selectedFile, setSelectedFile] = useState<File | string>("");
  const [artObject, setArtObject] = useState({
    firstName: "",
    lastName: "",
    username: "",
    art: "",
    author: "",
    style: "",
    year: "",
    location: "",
    description: "",
    terms: false,
    avatar: null,
  });

  console.log("artObject :>> ", artObject);
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
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setArtObject({
      ...artObject!,
      [event.target.name]: event.target.value,
    });
    console.log("artObject =>", artObject);
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
    avatar: yup
      .mixed()
      .required("A file is required")
      .test(
        "fileType",
        "Unsupported file format. Only PNG, JPEG, and WEBP are allowed.",
        (value) => {
          return (
            // value &&
            value.type &&
            ["image/png", "image/jpeg", "image/webp"].includes(value.type)
          );
        }
      ),
    terms: yup.bool().required().oneOf([true], "Terms must be accepted"),
  });

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Row className="w-100">
        <Col xs={12} md={8} lg={6} className="mx-auto">
          <div className="p-4 border rounded bg-light shadow">
            <h2 className="text-center mb-4">New Art Artifact</h2>
            {/* Start the form */}
            <Formik
              validationSchema={schema}
              onSubmit={console.log}
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
                    <Form.Group as={Col} md="10" controlId="validationFormik03">
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
                    <Form.Group as={Col} md="10" controlId="validationFormik04">
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
                    <Form.Group as={Col} md="10" controlId="validationFormik05">
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
                          <option value="Egyptian Style">Egyptian Style</option>
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
                          <option value="Impressionism">Impressionism</option>
                          <option value="Pointillism">Pointillism</option>
                          <option value="Expressionism">Expressionism</option>
                          <option value="Cubism">Cubism</option>
                          <option value="Fauvism">Fauvism</option>
                          <option value="Surrealism">Surrealism</option>
                        </optgroup>
                        {/* Contemporary Styles */}
                        <optgroup label="Contemporary Styles">
                          <option value="Abstract Art">Abstract Art</option>
                          <option value="Pop Art">Pop Art</option>
                          <option value="High-Tech">High-Tech</option>
                          <option value="Postmodernism">Postmodernism</option>
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
                    <Form.Group as={Col} md="10" controlId="validationFormik05">
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
                    <Form.Group as={Col} md="10" controlId="validationFormik05">
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
                    <Form.Group as={Col} md="10" controlId="validationFormik05">
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
                        isInvalid={touched.description && !!errors.description}
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
                    <Form.Group as={Col} md="10" controlId="validationFormik05">
                      <Form.Label>Upload your Foto here</Form.Label>
                      <Form.Control
                        type="file"
                        name="avatar"
                        onChange={(event) =>
                          setFieldValue("avatar", event.target.files[0])
                        }
                        accept="image/png, image/jpeg, image/png, image/webp"
                        isValid={touched.avatar && !errors.avatar}
                        isInvalid={!!errors.avatar && touched.avatar}
                      />
                      {touched.avatar && errors.avatar && (
                        <Form.Control.Feedback type="invalid">
                          {errors.avatar}
                        </Form.Control.Feedback>
                      )}
                      {touched.avatar && !errors.avatar && (
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
  );
}
