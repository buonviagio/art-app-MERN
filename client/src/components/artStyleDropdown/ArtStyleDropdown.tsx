import { Dropdown, Row, Col } from "react-bootstrap";
import { Dispatch, SetStateAction, useState } from "react";
import "./ArtStyleDropDropdown.css";
import { ArtsObjectResponce } from "../../types/customType";
type ArtStyleDropdownProps = {
  setAllArtifacts: Dispatch<SetStateAction<ArtsObjectResponce[] | null>>;
};
const ArtStyleDropdown = ({ setAllArtifacts }: ArtStyleDropdownProps) => {
  const [selectedStyle, setSelectedStyle] = useState("Select an art style");

  const artStyles = [
    { options: ["All styles"] },
    {
      label: "Ancient Styles",
      options: ["Egyptian Style", "Greek Style", "Roman Style"],
    },
    { label: "Medieval Styles", options: ["Romanesque", "Gothic"] },
    { label: "Renaissance", options: ["Renaissance"] },
    { label: "Baroque and Rococo", options: ["Baroque", "Rococo"] },
    {
      label: "Classicism and Romanticism",
      options: ["Classicism", "Romanticism"],
    },
    {
      label: "Modernism",
      options: [
        "Impressionism",
        "Pointillism",
        "Expressionism",
        "Cubism",
        "Fauvism",
        "Surrealism",
      ],
    },
    {
      label: "Contemporary Styles",
      options: ["Abstract Art", "Pop Art", "High-Tech", "Postmodernism"],
    },
  ];

  const handleSelect = async (style: string) => {
    setSelectedStyle(style);
    try {
      const requestOptions = {
        method: "GET",
      };

      const response = await fetch(
        `http://localhost:5000/api/arts/all/${style}`,
        requestOptions
      );
      if (response.ok) {
        const result = await response.json();
        setAllArtifacts(result.desiredArt);
      }
    } catch (error) {
      console.log("error, we can show art objects desired style :>> ", error);
    }
  };

  return (
    <Row className="my-3">
      <Col>
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="art-style-dropdown">
            {selectedStyle}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item disabled>Select an art style...</Dropdown.Item>
            {artStyles.map((group, groupIndex) => (
              <div key={groupIndex}>
                <Dropdown.Header>{group.label}</Dropdown.Header>
                {group.options.map((style, styleIndex) => (
                  <Dropdown.Item
                    key={styleIndex}
                    onClick={() => handleSelect(style)}
                  >
                    {style}
                  </Dropdown.Item>
                ))}
                {groupIndex < artStyles.length - 1 && <Dropdown.Divider />}
              </div>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  );
};

export default ArtStyleDropdown;
