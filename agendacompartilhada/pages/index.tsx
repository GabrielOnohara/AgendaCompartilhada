import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import logo from "../public/calendario.png";
import React from "react";
import Dropdown from 'react-bootstrap/Dropdown'
import Link from "next/link";


const Home: NextPage = () => {

  return (
    <div>
      <Head>
        <title>Agenda Compartilhada</title>
        <meta content="text/html;charset=UTF-8" />
        <meta
          name="description"
          content="Aplicativo para sistema automatizado de agendamento"
        />
        <link rel="icon" href="/calendario.ico" />
      </Head>
      <nav className={`navbar navbar-dark navbar-expand-lg bg-body-tertiary ${styles.navbar}`} >
          <div className={`container-fluid ${styles.applySpaceBetween}`}>
            <Link className={`navbar-brand yellowText`} href="/">Agenda Compartilhada</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <Dropdown className="navbar-nav ms-auto">
                <Dropdown.Toggle variant="secondary" style={{backgroundColor: "#034078"}} id="dropdown-basic">
                  Login
                </Dropdown.Toggle>
                <Dropdown.Menu style={{backgroundColor:"#E3E5F7"}}>
                  <Dropdown.Item href="#/action-1">Sou cliente</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Sou empresa</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </nav>
      <main className={styles.mainContainer}>
        <div className={styles.description}>
          <div className="centerHorizontal">
            <Image
              src={logo}
              alt="Logo do agenda compartilhada"
              height={150}
              width={150}
              style={{ margin: "10px auto" }}
            />
            <h1 className={`${styles.title2} lightText cursive `}>
              Agenda Compartilhada
            </h1>
          </div>
        </div>
        
      </main>
    </div>
  );
};

export default Home;
