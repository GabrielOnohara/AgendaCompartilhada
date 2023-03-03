import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/CompanyView.module.css";
import logo from "../../public/calendario.png";
import React from "react";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { Card,Row,Col, } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import dayjs, { Dayjs } from 'dayjs';

const Company: NextPage = () => {

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
          <h1 className="mb-5 darkBlueText">Nome da empresa</h1>
          <div className="d-flex justify-content-between">
            <h2 className="darkBlueText mb-5">Agende seu horário</h2>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Selecione um dia"
                value={date}
                onChange={(newValue) => {         
                  console.log(dayjs(newValue));
                                           
                  setDate(dayjs(newValue));
                }}
                renderInput={(params) => <TextField {...params} />}
                inputFormat="DD/MM/YYYY"
                className={styles.datePicker}
              />
            </LocalizationProvider>
          </div>
          <Row className="g-4">
            <Col>
              <Card style={{border: "1px solid #034078"}}>
                <Card.Body>
                  <Card.Header className="darkBlueText text-center mb-4"><b>{date.locale('pt').format('ddd')} {date.format('DD/MM')}</b></Card.Header>
                    <Card.Title className="text-center my-4"> Horários</Card.Title>
                    <Card.Text className="d-flex my-3">
                      <span className={`darkBlueText py-2 t-bold`}>08:00</span>                     
                      <Button variant="outline-success" className="ms-auto" onClick={handleSearchCompany}>agendar</Button>
                    </Card.Text>
                    <Card.Text className="d-flex my-3">
                      <span className={`darkBlueText py-2`}>08:30</span>                     
                      <Button variant="outline-success" className="ms-auto" onClick={handleSearchCompany}>agendar</Button>
                    </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{border: "1px solid #034078"}}>
                <Card.Body>
                <Card.Header className="darkBlueText text-center">{date.add(1,'day').locale('pt').format('ddd')} {date.add(1,'day').format('DD/MM')}</Card.Header>
                    <Card.Img variant="top" src="/avatarimage.jpg" style={{width: "130px", borderRadius: "80%"}} className="mx-auto"/>
                    <Card.Title className="darkBlueText  mt-2 mb-3"></Card.Title>
                    <Card.Text style={{float: "left",}}>
                    </Card.Text>
                    <Button style={{float:"right",}} variant="primary" className="ms-auto mt-3" onClick={handleSearchCompany}>Acessar</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{border: "1px solid #034078"}}>
                <Card.Body>
                <Card.Header className="darkBlueText text-center">{date.add(2,'day').locale('pt').format('ddd')} {date.add(2,'day').format('DD/MM')}</Card.Header>
                    <Card.Img variant="top" src="/avatarimage.jpg" style={{width: "130px", borderRadius: "80%"}} className="mx-auto"/>
                    <Card.Title className="darkBlueText  mt-2 mb-3"></Card.Title>
                    <Card.Text style={{float: "left",}}>
                    </Card.Text>
                    <Button style={{float:"right",}} variant="primary" className="ms-auto mt-3" onClick={handleSearchCompany}>Acessar</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{border: "1px solid #034078"}}>
                <Card.Body>
                <Card.Header className="darkBlueText text-center">{date.add(3,'day').locale('pt').format('ddd')} {date.add(3,'day').format('DD/MM')}</Card.Header>
                    <Card.Img variant="top" src="/avatarimage.jpg" style={{width: "130px", borderRadius: "80%"}} className="mx-auto"/>
                    <Card.Title className="darkBlueText  mt-2 mb-3"></Card.Title>
                    <Card.Text style={{float: "left",}}>
                    </Card.Text>
                    <Button style={{float:"right",}} variant="primary" className="ms-auto mt-3" onClick={handleSearchCompany}>Acessar</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{border: "1px solid #034078"}}>
                <Card.Body>
                <Card.Header className="darkBlueText text-center">{date.add(4,'day').locale('pt').format('ddd')} {date.add(4,'day').format('DD/MM')}</Card.Header>
                    <Card.Img variant="top" src="/avatarimage.jpg" style={{width: "130px", borderRadius: "80%"}} className="mx-auto"/>
                    <Card.Title className="darkBlueText  mt-2 mb-3"></Card.Title>
                    <Card.Text style={{float: "left",}}>
                    </Card.Text>
                    <Button style={{float:"right",}} variant="primary" className="ms-auto mt-3" onClick={handleSearchCompany}>Acessar</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* <Form onSubmit={handleSearchCompany}>
            <Form.Group className="mb-3">
              <Form.Label className="darkBlueText mb-3"><h2>Agende seu horário</h2></Form.Label>
              <Row  xs={12} md={12} sm={12}>
                <Col xs={8} md={10} sm={9} >
                  <Form.Control type="text" placeholder="Digite o nome" value={searchValue} onChange={({ target }) => setSearchValue(target.value)}/>
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
                    <Button style={{float:"right",}} variant="primary" className="ms-auto mt-3" onClick={handleSearchCompany}>Acessar</Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card> 
            </Col>
          ))}
          </Row>
          <hr /> */}
          {/* <h2 className="darkBlueText mt-4 mb-3">Empresas recentes</h2>
          <Card style={{border: "1px solid #034078"}}>
            <Card.Body>
              <Row xs={12} md={12}>
                <Col xs={12} sm={3} md={2}>
                <Card.Img variant="top" src="/avatarimage.jpg" style={{width: "130px", borderRadius: "80%"}} className="mx-auto"/>
                </Col>
                <Col  xs={12} sm={9} md={10}>
                  <Card.Title className="darkBlueText  mt-2 mb-3">Special title treatment</Card.Title>
                  <Card.Text style={{float: "left",}}>
                    <p className="mb-2"><span className={`darkBlueText`}>Endereço:</span> Rua das amélias 999, Guarulhos-SP</p>
                    <p className=""><span className={`darkBlueText`}>Telefone:</span> 1199999999</p>
                    
                  </Card.Text>
                  <Button style={{float:"right",}} variant="primary" className="ms-auto mt-3">Acessar</Button>
                </Col>
              </Row>
            </Card.Body>
          </Card> */}
        </Container> 
      </main>
    </div>
  );
};

export default Company;
