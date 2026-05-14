import React, { useState } from "react";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaShareAlt } from "react-icons/fa";


const ShareButton = ({ product }) => {
  const [show, setShow] = useState(false);
  const url = window.location.origin + `/productdetails/${product._id}`;
  const text = encodeURIComponent(`Check out this product: ${product.name}`);

  return (
    <div className="share-btn-wrapper" style={{ position: "relative" }}>
      <FaShareAlt
        className="share-icon"
        style={{ cursor: "pointer" }}
        onClick={() => setShow((prev) => !prev)}
      />
      {show && (
        <div className="share-popup" style={{
          position: "absolute", top: "30px", right: 0, background: "#fff", border: "1px solid #ddd", borderRadius: "8px", padding: "8px", zIndex: 10, display: "flex", gap: "10px"
        }}>
          <a href={`https://wa.me/?text=${text}%20${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" title="Share on WhatsApp">
            <FaWhatsapp color="#25D366" size={22} />
          </a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" title="Share on Facebook">
            <FaFacebook color="#1877F3" size={22} />
          </a>
          <a href={`https://www.instagram.com/`} target="_blank" rel="noopener noreferrer" title="Share on Instagram">
            <FaInstagram color="#E4405F" size={22} />
          </a>
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`} target="_blank" rel="noopener noreferrer" title="Share on X">
            <FaXTwitter color="#000" size={22} />
          </a>
        </div>
      )}
    </div>
  );
};

export default ShareButton;