import { FaBackspace } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { ArtsObjectResponce } from "../../types/customType";
import { useEffect, useState } from "react";
import CommentsSection from "../../components/commentsSection/CommentsSection";
import "./DetailsPage.css";
import { baseURL } from "../../utils/baseURL";

export default function DetailsPage() {
  const { artditail } = useParams();
  const navigate = useNavigate();
  const [artDetails, setArtDetails] = useState<ArtsObjectResponce | null>(null);

  const handleBackClick = () => {
    navigate(-1);
  };

  const fetchArtDetails = async () => {
    try {
      const requestOptions = {
        method: "GET",
      };
      const response = await fetch(
        `${baseURL}/api/arts/${artditail}`,
        requestOptions
      );
      if (response.ok) {
        const result = await response.json();
        setArtDetails(result.desiredArt);
      } else {
        console.error("Failed to fetch art details");
      }
    } catch (error) {
      console.error("Error fetching art details:", error);
    }
  };
  useEffect(() => {
    if (artditail) {
      fetchArtDetails();
    }
  }, [artditail]);

  return (
    <div className="container mt-4">
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
      {/* Main Layout */}
      <div className="row">
        {/* Artwork Image */}
        <div className="col-md-6">
          <img
            src={artDetails?.picture.secure_url}
            alt={artDetails?.nameOfThePainting}
            className="img-fluid rounded"
          />
        </div>

        {/* Artwork Details */}
        <div className="col-md-6">
          <h2 className="text-primary">{artDetails?.nameOfThePainting}</h2>
          <h5 className="text-muted">By {artDetails?.nameOfTheAuthor}</h5>
          <p>
            <strong>Style:</strong> {artDetails?.style}
          </p>
          <p>
            <strong>Year:</strong> {artDetails?.year}
          </p>
          <p>
            <strong>Location:</strong> {artDetails?.location}
          </p>
          <p>
            <strong>Description:</strong> {artDetails?.description}
          </p>
        </div>
      </div>
      <div className="comments-section">
        <CommentsSection artditail={artditail!} />
      </div>
    </div>
  );
}
