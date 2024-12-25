import Header from "../components/Header";
import Graph from "../components/Graph";
import React from "react";
import TableComp from "../components/tableComp";
import styles from "../styles/page.module.css";

export default function Home() {
  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <TableComp />
          <Graph />
        </main>
        <footer className={styles.footer}>Mathias Hamre</footer>
      </div>
    </>
  );
}
