// src/components/Cop/OffenceImage.jsx
import React, { useEffect, useState } from "react";

function OffenceImage({ offenceDetailId, style, onClick }) {
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    if (!offenceDetailId) return;

    fetch(`http://localhost:7777/api/offence-details/${offenceDetailId}/image`)
      .then(response => {
        if (!response.ok) throw new Error("Image not found");
        return response.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        setImgUrl(url);
      })
      .catch(() => setImgUrl(null));

    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl);
    };
  }, [offenceDetailId]);

  if (!imgUrl) return <span style={{ fontSize: 12, color: "#888" }}>No Image</span>;

  return (
    <img
      src={imgUrl}
      alt="Offence"
      style={style}
      onClick={onClick}
      title="Click to enlarge"
    />
  );
}

export default OffenceImage;
