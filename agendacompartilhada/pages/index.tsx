import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import logo from "../public/calendario.png";
import React from "react";
import Dropdown from 'react-bootstrap/Dropdown'
import Link from "next/link";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';


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
          <div className={`container-fluid`}>
            <Link className={`navbar-brand yellowText`} href="/">Agenda Compartilhada</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarHome" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarHome">
              <ul className="navbar-nav ms-auto  mb-lg-2 mt-lg-2">
                <li className="nav-item">
                <Dropdown >
                  <Dropdown.Toggle variant="secondary" style={{backgroundColor: "#034078"}} id="dropdown-basic">
                    Login
                  </Dropdown.Toggle>

                  <Dropdown.Menu style={{backgroundColor:"#E3E5F7"}}>
                    <Dropdown.Item href="/">Sou cliente</Dropdown.Item>
                    <Dropdown.Item href="/login">Sou empresa</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                </li>
              </ul>

            </div>
          </div>
        </nav>
        <Navbar fixed="top" style={{backgroundColor: "#034078"}}  expand="lg" variant="dark">
          <Container fluid>
            <Navbar.Brand href="/" style={{color: "#FACE54"}}>
              <Image
                src={logo}
                alt="Logo do agenda compartilhada"
                height={40}
                width={40}
                style={{display:"inline-block", marginRight:"5px"}}
              /> 
              Agenda Compartilhada
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <NavDropdown align={{ lg: 'end' }} drop="down" title="Login" id="basic-nav-dropdown" >
                  <NavDropdown.Item   href="#">Sou cliente</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/login">
                    Sou empresa
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
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
