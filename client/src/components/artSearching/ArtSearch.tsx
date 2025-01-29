import { Dispatch, SetStateAction, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { ArtsObjectResponce } from "../../types/customType";
import { SlMagnifier } from "react-icons/sl";
import "./ArtSearch.css";
import { baseURL } from "../../utils/baseURL";

type ArtSearchProps = {
  setAllArtifacts: Dispatch<SetStateAction<ArtsObjectResponce[] | null>>;
  setAlertMessage: Dispatch<SetStateAction<string>>;
  setAlert: Dispatch<SetStateAction<boolean>>;
};
export default function ArtSearch({
  setAllArtifacts,
  setAlertMessage,
  setAlert,
}: ArtSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    setAlert(false);
    if (!searchQuery) {
      return;
    }

    try {
      const requestOptions = {
        method: "GET",
      };

      const response = await fetch(
        `${baseURL}/api/arts/artObjects/${searchQuery}`,
        requestOptions
      );
      if (response.ok) {
        const result = await response.json();
        if (result.desiredArt.length !== 0) {
          setAllArtifacts(result.desiredArt);
          setSearchQuery("");
        } else {
          setAlertMessage(
            result.message +
              " you can be the first, who will post art object with this name."
          );
          setAlert(true);
          setSearchQuery("");
          setAllArtifacts(result.desiredArt);
        }
      }
    } catch (error) {
      console.log("error, we can show art objects desired style :>> ", error);
    }
  };

  return (
    <div className="art-search">
      <InputGroup
        style={{
          width: "250px",
          border: "2px solid #cef1ce",
          borderRadius: "10px",
          background: "#f3fdf5",
          boxShadow:
            "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)",
        }}
      >
        <Form.Control
          type="text"
          placeholder="Find Art by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="custom-button-art-search" onClick={handleSearch}>
          <SlMagnifier color="green" size={25} />
        </button>
      </InputGroup>
    </div>
  );
}
