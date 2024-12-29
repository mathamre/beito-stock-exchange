import React from "react";
import Image from "next/image";

function Header() {
  return (
    <div
      style={{
        height: "80px",
        width: "100%",
        backgroundColor: "black",
        display: "flex",
        flexDirection: "row",
        alignItems: "center", // Vertically centers content
        justifyContent: "space-between", // Distributes space evenly
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          width: "5%",
          height: "100%",
          position: "relative",
          marginLeft: "3%",
        }}
      >
        <Image
          src="/nordnet-logo.png"
          alt=""
          fill
          style={{ objectFit: "contain" }}
          sizes="5vw"
        />
      </div>

      {/* Header Title Section */}
      <div
        style={{
          flex: 1, // Take up all available space
          display: "flex",
          justifyContent: "center", // Horizontally centers the title
          alignItems: "center", // Vertically centers the title
          marginLeft: "-5%",
        }}
      >
        <h1 style={{ color: "white" }}>Beito Stock Xchange</h1>
      </div>
    </div>
  );
}

export default Header;
