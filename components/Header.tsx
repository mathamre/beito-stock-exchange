import React from "react";
import Image from "next/image";

function Header() {
  return (
    <div
      style={{
        height: "80px",
        width: "100%",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div style={{ width: "5%", height: "100%" }}>
        <Image src={"/nordnet-logo.png"} alt={""} width={100} height={100} />
      </div>
      <div
        style={{
          border: "1px red solid",
          marginLeft: "2%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: "black" }}>Beito Stock Xchange</h1>
      </div>
    </div>
  );
}

export default Header;
