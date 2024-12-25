import Image from "next/image";
import styles from "./page.module.css";
import Header from "@/components/Header";
import TableComp from "@/components/TableComp";
import Graph from "@/components/Graph";

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
