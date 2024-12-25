import Header from "../components/Header";
import Graph from "../components/Graph";
import React from "react";
import styles from "../styles/page.module.css";
import TableComp from "@/components/TableComp";
import MainComponent from "@/components/MainComponent";

export default function Home() {
  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <MainComponent />
        </main>
        <footer className={styles.footer}>Mathias Hamre</footer>
      </div>
    </>
  );
}
