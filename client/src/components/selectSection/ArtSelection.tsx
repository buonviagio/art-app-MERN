import { Dropdown } from "react-bootstrap";
import { Dispatch, SetStateAction, useState } from "react";
import "./ArtSelection.css";
import { ArtsObjectResponce } from "../../types/customType";
import { baseURL } from "../../utils/baseURL";

type ArtSelectionProps = {
  setAllArtifacts: Dispatch<SetStateAction<ArtsObjectResponce[] | null>>;
  setAlert: Dispatch<SetStateAction<boolean>>;
};
const ArtSelection = ({ setAllArtifacts, setAlert }: ArtSelectionProps) => {
  const [selectedOption, setSelectedOption] = useState("Sorting by");

  const options = [
    { name: "Newest Art Objects", value: "newest" },
    { name: "Oldest Art Objects", value: "oldest" },
    { name: "Most Commented", value: "commented" },
    { name: "Most Favorited", value: "favorited" },
  ];

  const handleSelect = async (value: string | null) => {
    setAlert(false);
    const selected = options.find((option) => option.value === value);
    if (selected) setSelectedOption(selected.name);
    console.log("selected :>> ", value);
    try {
      const requestOptions = {
        method: "GET",
      };

      if (value === "commented") {
        const response = await fetch(
          `${baseURL}/api/arts/artObjects/${value}`,
          requestOptions
        );
        if (response.ok) {
          const result = await response.json();
          setAllArtifacts(result.mostCommentedArts);
        }
      } else if (value === "favorited") {
        const response = await fetch(
          `${baseURL}/api/arts/artObjects/${value}`,
          requestOptions
        );
        if (response.ok) {
          const result = await response.json();
          setAllArtifacts(result.mostLikedArts);
        }
      } else if (value === "newest") {
        const response = await fetch(
          `${baseURL}/api/arts/artObjects/${value}`,
          requestOptions
        );
        if (response.ok) {
          const result = await response.json();
          setAllArtifacts(result.arts);
        }
      } else if (value === "oldest") {
        const response = await fetch(
          `${baseURL}/api/arts/artObjects/${value}`,
          requestOptions
        );
        if (response.ok) {
          const result = await response.json();
          setAllArtifacts(result.arts);
        }
      }
    } catch (error) {
      console.log("error, we can show art objects desired style :>> ", error);
    }
  };

  return (
    <Dropdown onSelect={handleSelect}>
      <Dropdown.Toggle id="dropdown-basic">{selectedOption}</Dropdown.Toggle>
      <Dropdown.Menu>
        {options.map((option, index) => (
          <Dropdown.Item key={index} eventKey={option.value}>
            {option.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ArtSelection;
