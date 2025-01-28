import { Dispatch, SetStateAction, useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { ArtsObjectResponce } from "../../types/customType";

type ArtSearchProps = {
  setAllArtifacts: Dispatch<SetStateAction<ArtsObjectResponce[] | null>>;
};
export default function ArtSearch({ setAllArtifacts }: ArtSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    if (!searchQuery) {
      return;
    }

    try {
      const requestOptions = {
        method: "GET",
      };

      const response = await fetch(
        `http://localhost:5000/api/arts/artObjects/${searchQuery}`,
        requestOptions
      );
      if (response.ok) {
        const result = await response.json();
        setAllArtifacts(result.desiredArt);
        setSearchQuery("");
      }
    } catch (error) {
      console.log("error, we can show art objects desired style :>> ", error);
    }
  };

  return (
    <div className="art-search">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Find Art by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: "2px solid #cef1ce",
            background: "#f3fdf5",
            boxShadow:
              "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)",
          }}
        />
        <Button variant="success" onClick={handleSearch}>
          Search
        </Button>
      </InputGroup>
    </div>
  );
}
