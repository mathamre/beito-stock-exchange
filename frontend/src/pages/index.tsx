"use client";
import Header from "../components/Header";
import React from "react";
import styles from "@/src/styles/page.module.css";
import AddBusinessForm from "@/src/components/AddBusinessForm";

export default function Home() {
  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <AddBusinessForm />

        </main>
        <footer className={styles.footer}>Mathias Hamre</footer>
      </div>
    </>
  );
}
