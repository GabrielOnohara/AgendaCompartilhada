import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
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
import { useRouter } from "next/router";
import { menuItemUnstyledClasses } from "@mui/base";
require('dayjs/locale/pt')

const Company: NextPage = () => {

  const [errorMessage, setErrorMessage] = React.useState<string[]>(["Pesquise o nome da empresa"]);
  const [viewIsReady, setViewIsReady] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<Dayjs>(dayjs(new Date()));
  const [company, setCompany] = React.useState<any >({});
  const [calendar, setCalendar] = React.useState<any >({});
  const [scheduleTimes, setScheduleTimes] = React.useState<any[]>([])
  const [searchedScheduleTimes, setSearchedScheduleTimes] = React.useState<boolean>(false);
  const [intervalsWasCalculated, setIntervalsWasCalculated] = React.useState(false);
  const [intervalTimes, setIntervalTimes] = React.useState<any[]>([])
  const router = useRouter()
  const path =router.basePath;
  const queryId = router.query.id ?? '0';
  
  React.useEffect(()=>{
    const id = queryId as string;
    async function getCompanyByID(id:Number){
      try {
        const url = path + "/api/companies/searchById/" + id;
        const response = await fetch(url, {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        if(response.status == 200){
          const {newCompany, calendar} = await response.json();
          setCompany(newCompany);  
          setCalendar(calendar);
        }else {
          setCompany({});
        }
      } catch (error) {
        console.log(error)
      }
    }

    function calculateIntervals(calendar:any){
      const [startHour, startMinute] = (calendar.startTime.split(":"));
      const [finishHour, finishtMinute] = (calendar.finishTime.split(":"));
      const intervalTime = calendar.intervalTime;
      let hour  = parseInt(finishHour) - parseInt(startHour);
      let minute = parseInt(finishtMinute) - parseInt(startMinute);;
      let totalMinutesDifference = Math.floor(((hour*60) + minute)/(intervalTime));
      for (let index = 0; index < totalMinutesDifference; index++) {
        let hourAsNumber = parseInt(startHour) + Math.floor(index*intervalTime/60);
        let minuteAsNumber =  (index*intervalTime)%60;
        let hourString;
        let minuteString;
  
        if(hourAsNumber < 9){
          hourString = '0' + hourAsNumber.toString();
        }else{
          hourString = hourAsNumber.toString();
        }
  
        if(minuteAsNumber < 9){
          minuteString = '0' + minuteAsNumber.toString();
        }else{
          minuteString = minuteAsNumber.toString();
        }
  
        let lastString = hourString + ':' + minuteString;
        intervalTimes[index] = lastString; 
      }
      setIntervalsWasCalculated(true);
    }

    if(parseInt(id) > 0){
      getCompanyByID(parseInt(id)).then(()=>{
        calculateIntervals(calendar);  
        setViewIsReady(true);
      });
    }
  },[path, queryId,calendar,intervalTimes])
  
  React.useEffect(()=>{
    const id = queryId as string;
    async function getScheduleTimeNextFiveDaysByDate(initialDate:String, endDate:String, id:Number){
      try {
        const data = {
          companyId: id,
          initialDate,
          endDate,
        }
        const url = path + "/api/companies/scheduleTimes/show";
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(data)
        });
        if(response.status == 200){
          const {scheduleTimes} = await response.json();
          console.log(scheduleTimes);
          setScheduleTimes(scheduleTimes);   
        }else {
          setScheduleTimes([]);
        }
      } catch (error) {
        console.log(error)
      }
    }

    const initialDateFormatted = date.subtract(1,'day').format('YYYY-MM-DD');
    const endDateFormatted = date.add(5,'day').format('YYYY-MM-DD');
    
    getScheduleTimeNextFiveDaysByDate(initialDateFormatted, endDateFormatted, parseInt(id)).then(()=>{
      setSearchedScheduleTimes(true);
    })
  },[queryId,date,path])

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
      {company.hasOwnProperty('name')
      ?
      <main className={styles.mainContainer}>
        
        <Container >
          <h1 className={`mb-5 darkBlueText ${styles.principalTitle}`}>{company.name}</h1>
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
                    {
                      intervalsWasCalculated
                      ?
                        intervalTimes.map((timeString,index) => (
                          <Card.Text key={index} className="d-flex my-3">
                            <span className={`darkBlueText py-2`}>{timeString}</span>                     
                            <Button variant="outline-success" className="ms-auto" onClick={()=>{}}>agendar</Button>
                          </Card.Text>
                        ))
                      :
                      <Card.Text className="d-flex my-3">
                        <span className={`darkBlueText py-2`}>Verificando horarios</span>                     
                      </Card.Text>
                    }     
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
                    <Button style={{float:"right",}} variant="primary" className="m=>{}s-auto mt-3" onClick={()=>{}}>Acessar</Button>
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
                    <Button style={{float:"right",}} variant="primary" className="m=>{}s-auto mt-3" onClick={()=>{}}>Acessar</Button>
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
                    <Button style={{float:"right",}} variant="primary" className="m=>{}s-auto mt-3" onClick={()=>{}}>Acessar</Button>
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
                    <Button style={{float:"right",}} variant="primary" className="m=>{}s-auto mt-3" onClick={()=>{}}>Acessar</Button>
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
      :
      <div className={"tokenExpired"}>
        {viewIsReady 
          ?
          <div>
            <h1>Empresa não encontrada!</h1>
            <Link className={` yellowText`} href="/">Voltar </Link>
          </div>
          :
          <div>
            <h1>Carregando ...</h1>
          </div>
        }
      </div>
      }
    </div>
  );
};

export default Company;
