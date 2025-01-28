import { useState } from "react";
import "./ImageSkeleton.css";
type ImageSkeletonProps = {
  src: string;
  alt: string;
  className: string;
  onClick: (event: React.MouseEvent<HTMLImageElement>) => void;
};
export default function ImageSkeleton({
  src,
  alt,
  onClick,
  className,
}: ImageSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="image-container">
      {/* Skeleton loader */}
      {!isLoaded && <div className="skeleton-loader"></div>}

      {/* Image */}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? "loaded" : "loading"}`}
        onLoad={() => setIsLoaded(true)}
        onClick={onClick}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
}
