"use client";
import Header from "../components/Header";
import React from "react";
import styles from "@/src/styles/page.module.css";

export default function Home() {
  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}></main>
        <footer className={styles.footer}>Mathias Hamre</footer>
      </div>
    </>
  );
}
