import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { FaHeart } from "react-icons/fa";
import { ArtsObjectResponce } from "../../types/customType";

type CarouseForFavoriteslProps = {
  favorites: ArtsObjectResponce[] | null;
  handleFavoriteToggle: (s: string) => Promise<void>;
};
export default function CarouseForFavoritesl({
  favorites,
  handleFavoriteToggle,
}: CarouseForFavoriteslProps) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      {favorites &&
        favorites.map((artifact) => (
          <Carousel.Item key={artifact._id}>
            <div style={{ position: "relative" }}>
              {/* Art Image */}
              <img
                src={artifact.picture.secure_url}
                alt={artifact.nameOfThePainting}
                style={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                }}
              />

              {/* Heart Icon */}
              <button
                onClick={() => handleFavoriteToggle(artifact._id)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  zIndex: 2,
                }}
              >
                <FaHeart color="red" size={30} />
              </button>
            </div>

            {/* Slide Caption */}
            <Carousel.Caption>
              <h3>{artifact.nameOfThePainting}</h3>
              <p>
                {artifact.style} ({artifact.year})
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
    </Carousel>
  );
}
