import React from "react";
import Header from "../componets/Header";
import Footer from "../componets/Footer";

export default function Layout({ children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>
      <Header />
      <main style={{ flex:1, background:"var(--bg-base)", position:"relative", zIndex:1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
