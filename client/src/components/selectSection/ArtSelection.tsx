import { Dropdown, Row, Col } from "react-bootstrap";
import { Dispatch, SetStateAction, useState } from "react";
import "./ArtSelection.css";
import { ArtsObjectResponce } from "../../types/customType";

type ArtSelectionProps = {
  setAllArtifacts: Dispatch<SetStateAction<ArtsObjectResponce[] | null>>;
};
const ArtSelection = ({ setAllArtifacts }: ArtSelectionProps) => {
  console.log("ArtSelection component");
  const [selectedOption, setSelectedOption] = useState("Sorting by");

  const options = [
    { name: "Year of creation", value: "year" },
    { name: "Most Commented", value: "commented" },
    { name: "Most Favorited", value: "favorited" },
  ];

  const handleSelect = async (value: string | null) => {
    const selected = options.find((option) => option.value === value);
    if (selected) setSelectedOption(selected.name);
    console.log("selected :>> ", value);
    try {
      const requestOptions = {
        method: "GET",
      };

      if (value === "commented") {
        const response = await fetch(
          `http://localhost:5000/api/arts/artObjects/${value}`,
          requestOptions
        );
        if (response.ok) {
          const result = await response.json();
          console.log(
            "result.mostCommentedArts :>> ",
            result.mostCommentedArts
          );
          setAllArtifacts(result.mostCommentedArts);
        }
      } else if (value === "favorited") {
        const response = await fetch(
          `http://localhost:5000/api/arts/artObjects/${value}`,
          requestOptions
        );
        if (response.ok) {
          const result = await response.json();
          console.log("result.mostLikedArts :>> ", result.mostLikedArts);
          setAllArtifacts(result.mostLikedArts);
        }
      } else if (value === "year") {
      }
      const response = await fetch(
        `http://localhost:5000/api/arts/artObjects/${value}`,
        requestOptions
      );
      if (response.ok) {
        const result = await response.json();
        // console.log("result.mostLikedArts :>> ", result.mostLikedArts);
        // setAllArtifacts(result.mostLikedArts);
      }
    } catch (error) {
      console.log("error, we can show art objects desired style :>> ", error);
    }
  };

  return (
    <Row className="my-3">
      <Col>
        <Dropdown onSelect={handleSelect}>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            {selectedOption}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {options.map((option, index) => (
              <Dropdown.Item key={index} eventKey={option.value}>
                {option.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  );
};

export default ArtSelection;
