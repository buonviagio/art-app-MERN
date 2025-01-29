import { Dropdown } from "react-bootstrap";
import { Dispatch, SetStateAction, useState } from "react";
import "./ArtStyleDropDropdown.css";
import { ArtsObjectResponce } from "../../types/customType";
import { baseURL } from "../../utils/baseURL";
type ArtStyleDropdownProps = {
  setAllArtifacts: Dispatch<SetStateAction<ArtsObjectResponce[] | null>>;
  setAlertMessage: Dispatch<SetStateAction<string>>;
  setAlert: Dispatch<SetStateAction<boolean>>;
};
const ArtStyleDropdown = ({
  setAllArtifacts,
  setAlertMessage,
  setAlert,
}: ArtStyleDropdownProps) => {
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
    setAlert(false);
    setSelectedStyle(style);
    try {
      const requestOptions = {
        method: "GET",
      };

      const response = await fetch(
        `${baseURL}/api/arts/all/${style}`,
        requestOptions
      );
      if (response.ok) {
        const result = await response.json();
        if (result.desiredArt.length !== 0) {
          setAllArtifacts(result.desiredArt);
        } else {
          setAlertMessage(
            result.message +
              " you can be the first, who will post art object in this style"
          );
          setAlert(true);
          setAllArtifacts(result.desiredArt);
        }
      }
    } catch (error) {
      console.log("error, we can show art objects desired style :>> ", error);
    }
  };

  return (
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
  );
};

export default ArtStyleDropdown;
