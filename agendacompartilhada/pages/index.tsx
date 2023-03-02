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
import { Card,Row,Col, } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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
        <Container>
          <Row xs={1} md={1} className="g-4">
              <Col>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label className="darkBlueText mb-3"><h2>Pesquisar empresa</h2></Form.Label>
                    <Form.Control type="text" placeholder="Digite o nome da empresa" />
                  </Form.Group>
                </Form>
                <div>
                  <hr className="mb-3" />
                  <h2 className="darkBlueText mt-4 mb-3">Resultados</h2>
                </div>
                <div>
                  <hr />
                  <h2 className="darkBlueText mt-4 mb-3">Empresas recentes</h2>
                </div>
              </Col>
              <Col >
                <Card style={{border: "1px solid #034078"}}>
                  <Card.Body>
                    <Row xs={12} md={12}>
                      <Col xs={2} md={2}>
                      <Card.Img variant="top" src="/avatarimage.jpg" style={{width: "130px", borderRadius: "80%"}} className="mx-auto"/>
                      </Col>
                      <Col  xs={10} md={10}>
                        <Card.Title className="darkBlueText  mt-2 mb-3">Special title treatment</Card.Title>
                        <Card.Text style={{float: "left",}}>
                          <p className="mb-2"><span className={`darkBlueText`}>Endereço:</span> Rua das amélias 999, Guarulhos-SP</p>
                          <p className=""><span className={`darkBlueText`}>Telefone:</span> 1199999999</p>
                          
                        </Card.Text>
                        <Button style={{float:"right",}} variant="primary" className="ms-auto">Acessar</Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
          </Row>
        </Container> 
      </main>
    </div>
  );
};

export default Home;
