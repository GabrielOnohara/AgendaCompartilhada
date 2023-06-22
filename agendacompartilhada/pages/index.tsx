import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import logo from "../public/calendario.png";
import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import { Card, Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import dayjs, { Dayjs } from "dayjs";
import Modal from "react-bootstrap/Modal";

const Home: NextPage = () => {
  const [companies, setCompanies] = React.useState<any[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string[]>([
    "Pesquise o nome da empresa",
  ]);
  const [searchErrorMessage, setSearchErrorMessage] = React.useState<string[]>([
    "Consulte seu horário",
  ]);
  const [adviseErrorMessage, setAdviseErrorMessage] = React.useState<string[]>(
    []
  );
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [searchClientEmail, setSearchClientEmail] = React.useState<string>("");
  const [date, setDate] = React.useState<Dayjs>(dayjs(new Date()));
  const [searchScheduleTimes, setSearchScheduleTimes] = React.useState<any[]>(
    []
  );
  const [showMessageModal, setShowMessageModal] = React.useState(false);
  const [messageContent, setMessageContent] = React.useState<string>("");
  const [messageIdSelected, setMessageIdSelected] = React.useState<Number>(0);
  const [messageSent, setMessageSent] = React.useState({});

  const handleCloseModal = () => {
    setShowMessageModal(false);
    setMessageContent("");
  };

  const handleModalConfirm = (id: Number) => {
    setShowMessageModal(true);
    setMessageIdSelected(id);
  };

  const handleCloseModaAfterCreated = () => {
    setShowMessageModal(false);
    setMessageSent({});
    setAdviseErrorMessage([]);
    setMessageIdSelected(0);
    setMessageContent("");
  };

  async function handleSearchCompany(event: any) {
    event.preventDefault();

    if (searchValue == "") {
      setErrorMessage(["Digite o nome da empresa no campo acima"]);
      return;
    }

    try {
      const url = "api/companies/searchByName/" + searchValue;
      const response = await fetch(url, {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const json = await response.json();
      if (response.status == 200) {
        setCompanies(json.companies);
        setErrorMessage((value) => []);
      } else {
        setCompanies([]);
        setErrorMessage([json.error]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSearchScheduleTime(event: any) {
    event.preventDefault();

    const data = {
      clientEmail: searchClientEmail,
      date: date.format("YYYY-MM-DD"),
    };

    const validateEmail = (email: string) => {
      var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regexEmail.test(email);
    };

    const validations = {
      emailIsValid: false,
    };

    if (!validateEmail(searchClientEmail)) {
      validations.emailIsValid = false;
      setSearchErrorMessage((oldValue) => {
        const index = oldValue.indexOf("Insira um email");
        if (index >= 0) {
          oldValue.splice(index, 1);
        }
        return [...oldValue, "Insira um email"];
      });
    } else {
      validations.emailIsValid = true;
      const index = errorMessage.indexOf("Insira um email");
      if (index >= 0)
        setSearchErrorMessage((oldValue) => {
          return oldValue.splice(index, 1);
        });
    }

    if (validations.emailIsValid) {
      try {
        const url = "api/companies/scheduleTimes/search";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(data),
        });
        const json = await response.json();
        if (response.status == 200) {
          let searchScheduleTimesWhithoutCompanyData: any[] =
            json.scheduleTimes;

          if (searchScheduleTimesWhithoutCompanyData.length > 0) {
            let companiesData: any[] = json.companies;
            let companiesIds = searchScheduleTimesWhithoutCompanyData.map(
              (scheduleTime) => {
                return scheduleTime.companyId;
              }
            );
            let searchScheduleTimesWithCompanyData: any[] =
              searchScheduleTimesWhithoutCompanyData;
            companiesIds.forEach((id, index) => {
              if (companiesIds.includes(id)) {
                searchScheduleTimesWithCompanyData[index].company =
                  companiesData.filter((company) => company.id == id).at(0);
              }
            });
            setSearchErrorMessage([]);
            setSearchScheduleTimes(searchScheduleTimesWithCompanyData);
          }
        } else {
          setSearchErrorMessage([json.error]);
          console.log(json.error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleConfirmMessage(event: any) {
    event.preventDefault();

    const data = {
      message: messageContent,
      scheduleTimeId: messageIdSelected,
    };

    const validations = {
      message: false,
    };

    if (messageContent.length <= 0) {
      validations.message = false;
      setAdviseErrorMessage((oldValue) => {
        const index = oldValue.indexOf("Mensagem Inválida");
        if (index >= 0) {
          oldValue.splice(index, 1);
        }
        return [...oldValue, "Mensagem Inválida"];
      });
    } else {
      validations.message = true;
      const index = errorMessage.indexOf("Mensagem Inválida");
      if (index >= 0)
        setAdviseErrorMessage((oldValue) => {
          return oldValue.splice(index, 1);
        });
    }

    if (validations.message) {
      try {
        const url = "api/companies/scheduleTimes/message/create";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(data),
        });
        const json = await response.json();
        if (response.status == 200) {
          setMessageSent(json.message);
          setAdviseErrorMessage([]);
        } else {
          setMessageSent({});
          setAdviseErrorMessage([json.error]);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const router = useRouter();
  function redirectToCompanyPage(id: Number) {
    router.push(`/empresas/${id}`);
  }

  function handleEmailInput(value: string) {
    setSearchClientEmail(value)
    console.log(adviseErrorMessage)
    if(value) {
      setSearchErrorMessage(searchErrorMessage.filter((mensagem) => mensagem !== "Insira um email"))
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
      <Navbar
        fixed="top"
        style={{ backgroundColor: "#034078" }}
        expand="lg"
        variant="dark"
      >
        <Container fluid>
          <Navbar.Brand href="/" style={{ color: "#FACE54" }}>
            <Image
              src={logo}
              alt="Logo do agenda compartilhada"
              height={40}
              width={40}
              style={{ display: "inline-block", marginRight: "5px" }}
            />
            Agenda Compartilhada
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/login">Login</Nav.Link>
              {/*
              <NavDropdown
                align={{ lg: "end" }}
                drop="down"
                title="Login"
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item   href="#">Sou cliente</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/login">Sou empresa</NavDropdown.Item>
              </NavDropdown>
              */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main className={styles.mainContainer}>
        <Modal
          show={showMessageModal}
          onHide={handleCloseModal}
          style={{ color: "#034078", fontWeight: "bold" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Adicione uma observação</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col>
                  {messageSent.hasOwnProperty("id") ? (
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label className="text-success mt-2">
                        <b>Mensagem enviada com sucesso</b>
                      </Form.Label>
                    </Form.Group>
                  ) : (
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput2"
                    >
                      <Form.Label>Mensagem</Form.Label>
                      <Form.Control
                        className="bg-white"
                        value={messageContent}
                        onChange={({ target }) =>
                          setMessageContent(target.value)
                        }
                        as="textarea"
                        rows={3}
                      />
                    </Form.Group>
                  )}
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {messageSent.hasOwnProperty("id") ? (
              <div>
                <Button variant="danger" onClick={handleCloseModaAfterCreated}>
                  Fechar
                </Button>
              </div>
            ) : (
              <div>
                <Button variant="danger" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button variant="success" onClick={handleConfirmMessage}>
                  Confirmar
                </Button>
              </div>
            )}
          </Modal.Footer>
        </Modal>
        <Container>
          <Form onSubmit={handleSearchCompany}>
            <Form.Group className="mb-3">
              <Form.Label className="darkBlueText mb-4">
                <h2>Pesquisar empresa</h2>
              </Form.Label>
              <Row xs={12} md={12} sm={12}>
                <Col xs={8} md={10} sm={9}>
                  <Form.Control
                    type="text"
                    placeholder="Digite o nome da empresa"
                    value={searchValue}
                    onChange={({ target }) => setSearchValue(target.value)}
                  />
                </Col>
                <Col xs={4} md={2} sm={3}>
                  <Button
                    style={{ float: "right" }}
                    variant="primary"
                    className="ms-auto"
                    onClick={handleSearchCompany}
                  >
                    Buscar
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
          <hr />
          <h2 className="darkBlueText mt-4 mb-3">Resultados</h2>
          {errorMessage &&
            errorMessage.map((errorMessage, index) => (
              <p key={index} className={`${styles.errorMessage} my-3`}>
                {errorMessage}
              </p>
            ))}
          <Row xs={1} md={1} className="g-4">
            {companies.map((company, index) => (
              <Col key={index}>
                <Card style={{ border: "1px solid #034078" }}>
                  <Card.Body>
                    <Row xs={12} md={12}>
                      <Col xs={12} sm={4} md={2}>
                        <Card.Img
                          variant="top"
                          src="/avatarimage.jpg"
                          style={{ width: "130px", borderRadius: "80%" }}
                          className="mx-auto"
                        />
                      </Col>
                      <Col xs={12} sm={8} md={10}>
                        <Card.Title className="darkBlueText  mt-2 mb-3">
                          {company.name}
                        </Card.Title>
                        <Card.Text style={{ float: "left" }}>
                          <p className="mb-2">
                            <span className={`darkBlueText`}>Endereço:</span>
                            {company.address}
                          </p>
                          <p className="">
                            <span className={`darkBlueText`}>Telefone:</span>{" "}
                            {company.phone}
                          </p>
                        </Card.Text>
                        <Button
                          style={{ float: "right" }}
                          variant="primary"
                          className="ms-auto mt-3"
                          onClick={() => redirectToCompanyPage(company.id)}
                        >
                          Acessar
                        </Button>
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
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="darkBlueText">
                    <b>Digite seu email</b>
                  </Form.Label>
                  <Row xs={12} md={12} sm={12}>
                    <Col xs={8} md={8} sm={8}>
                      <Form.Control
                        type="text"
                        placeholder="Digite seu email"
                        value={searchClientEmail}
                        onChange={({ target }) =>
                          handleEmailInput(target.value)
                        }
                      />
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label
                    className="darkBlueText"
                    style={{ display: "block" }}
                  >
                    <b>Selecione a data</b>{" "}
                  </Form.Label>
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
                <Button
                  variant="success mt-2"
                  onClick={handleSearchScheduleTime}
                >
                  Confirmar
                </Button>
              </Form>
            </Col>
            <Col md={6}>
              <Card className="my-4">
                <Card.Body>
                  {searchScheduleTimes.length > 0
                    ? searchScheduleTimes.map((scheduleTime, index) => (
                      <Card key={index}>
                        <Card.Body>
                          <Row xs={12} md={12}>
                            <Col xs={12} sm={12} md={12}>
                              <div className="apply-space-between">
                                <Card.Title className="darkBlueText  mt-2 mb-3">
                                  Horário {index + 1}
                                </Card.Title>
                                <Button
                                  variant="primary mt-2"
                                  onClick={() =>
                                    handleModalConfirm(scheduleTime.id)
                                  }
                                >
                                  Avisar
                                </Button>
                              </div>
                              <Card.Text className="mb-2">
                                <span className={`darkBlueText`}>
                                  Empresa:
                                </span>{" "}
                                {scheduleTime.company.name}
                              </Card.Text>
                              <Card.Text className="mb-2">
                                <span className={`darkBlueText`}>Data:</span>{" "}
                                {dayjs(scheduleTime.date)
                                  .add(1, "day")
                                  .format("DD/MM/YYYY")}
                              </Card.Text>
                              <Card.Text className="mb-2">
                                <span className={`darkBlueText`}>
                                  Horário:
                                </span>{" "}
                                {scheduleTime.time}
                              </Card.Text>
                              <Card.Text className="mb-2">
                                <span className={`darkBlueText`}>
                                  Endereço
                                </span>{" "}
                                {scheduleTime.company.address}
                              </Card.Text>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))
                    : searchErrorMessage.length > 0 &&
                    searchErrorMessage.map((searchErrorMessage, index) => (
                      <p
                        key={index}
                        className={`${styles.errorMessage} my-3`}
                      >
                        {searchErrorMessage}
                      </p>
                    ))}
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
