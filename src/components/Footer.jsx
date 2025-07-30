import React from "react";

const Footer = () => {
  return (
    <footer
      className="footer mt-auto py-3"
      style={{
        background: "linear-gradient(90deg, #0f2027 0%, #38b6ff 100%)",
        color: "#fff",
        textAlign: "center",
        position: "relative",
        bottom: 0,
        width: "100%",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.3)",
        zIndex: 100
      }}
    >
      <div>
        &copy; {new Date().getFullYear()} AuraNotes. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
