import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import logo from "../public/calendario.png";
import React from "react";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { Card,Row,Col, } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useRouter } from "next/router";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import dayjs, { Dayjs } from 'dayjs';
const Home: NextPage = () => {

  const [companies, setCompanies] = React.useState<any[]>([])
  const [errorMessage, setErrorMessage] = React.useState<string[]>(["Pesquise o nome da empresa"]);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [date, setDate] = React.useState<Dayjs>(dayjs(new Date()));

  async function handleSearchCompany(event:any){
    event.preventDefault();

    try {
      const url = "api/companies/searchByName/" + searchValue;
      const response = await fetch(url, {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const json = await response.json();
      if(response.status == 200){
        setCompanies(json.companies);
        setErrorMessage((value) => [])
      }else {
        setCompanies([]);
        setErrorMessage([json.error])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const router = useRouter();
  function redirectToCompanyPage(id:Number){
    router.push(`/empresas/${id}`);
  }

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
                {/* <NavDropdown.Item   href="#">Sou cliente</NavDropdown.Item>
                <NavDropdown.Divider /> */}
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
          <Form onSubmit={handleSearchCompany}>
            <Form.Group className="mb-3">
              <Form.Label className="darkBlueText mb-4"><h2>Pesquisar empresa</h2></Form.Label>
              <Row  xs={12} md={12} sm={12}>
                <Col xs={8} md={10} sm={9} >
                  <Form.Control type="text" placeholder="Digite o nome da empresa" value={searchValue} onChange={({ target }) => setSearchValue(target.value)}/>
                </Col>
                <Col xs={4} md={2} sm={3} >
                  <Button style={{float:"right",}} variant="primary" className="ms-auto" onClick={handleSearchCompany}>Buscar</Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
          <hr />
          <h2 className="darkBlueText mt-4 mb-3">Resultados</h2>
          {errorMessage && errorMessage.map((errorMessage, index) => <p key={index} className={`${styles.errorMessage} my-3`}>{errorMessage}</p>)}
          <Row xs={1} md={1} className="g-4">
          {companies.map((company,index) => (
            <Col key={index}> 
              <Card style={{border: "1px solid #034078"}}>
                <Card.Body>
                  <Row xs={12} md={12}>
                    <Col xs={12} sm={4} md={2}>
                      <Card.Img variant="top" src="/avatarimage.jpg" style={{width: "130px", borderRadius: "80%"}} className="mx-auto"/>
                    </Col>
                    <Col  xs={12} sm={8} md={10}>
                      <Card.Title className="darkBlueText  mt-2 mb-3">{company.name}</Card.Title>
                      <Card.Text style={{float: "left",}}>
                        <p className="mb-2"><span className={`darkBlueText`}>Endereço:</span> Rua das amélias 999, Guarulhos-SP {company.address}</p>
                        <p className=""><span className={`darkBlueText`}>Telefone:</span> {company.phone}</p>
                      </Card.Text>
                      <Button style={{float:"right",}} variant="primary" className="ms-auto mt-3" onClick={() => redirectToCompanyPage(company.id)}>Acessar</Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card> 
            </Col>
          ))}
          </Row>
          <hr />
          <Row>
            <Col md={6}>
              <h2 className="darkBlueText my-4">Consulte seus horários</h2>
              <Form >
                <Form.Group className="mb-3">
                  <Form.Label className="darkBlueText"><b>Digite seu email</b></Form.Label>
                  <Row  xs={12} md={12} sm={12}>
                    <Col xs={12} md={9} sm={12} >
                      <Form.Control type="text" placeholder="Digite seu email" value={searchValue} onChange={({ target }) => setSearchValue(target.value)}/>
                    </Col>
                    <Col xs={12} md={12} sm={12} >

                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="darkBlueText" style={{display:"block"}}><b>Selecione a data</b> </Form.Label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={date}
                      onChange={(newValue) => {    
                        setDate(dayjs(newValue));
                      }}
                      renderInput={(params) => <TextField {...params} />}
                      inputFormat="DD/MM/YYYY"
                      className={styles.datePicker}
                    />
                  </LocalizationProvider>
                </Form.Group>
                <Button variant="success mt-2"  >Confirmar</Button>
              </Form>
            </Col>
            <Col md={6}>
              <Card className="my-4">
                <Card.Body>
                  <Card>
                    <Card.Body>
                      <Row xs={12} md={12}>
                        <Col  xs={12} sm={8} md={10}>
                          <Card.Title className="darkBlueText  mt-2 mb-3">Horário 1</Card.Title>
                          <Card.Text style={{float: "left",}}>
                            <p className="mb-2"><span className={`darkBlueText`}>Data:</span> 11/03/2023</p>
                            <p className="mb-2"><span className={`darkBlueText`}>Horário:</span> 8:00 </p>
                            <p><span className={`darkBlueText`}>Endereço</span> Rua das amélias 999, Guarulhos-SP </p>
                          </Card.Text>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card> 
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* <h2 className="darkBlueText mt-4 mb-3">Empresas recentes</h2>
          <Card style={{border: "1px solid #034078"}}>
            
          </Card> */}
        </Container> 
      </main>
    </div>
  );
};

export default Home;
