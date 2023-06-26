import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/CompanyView.module.css";
import logo from "../../public/calendario.png";
import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import { Card, Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/router";
require("dayjs/locale/pt");
import Modal from "react-bootstrap/Modal";
import { Calendar, Company, Contribuitor, ScheduleTime } from "@prisma/client";

interface DateToIntervals {
  [date: string]: Interval[];
}

interface Interval {
  time: string;
  freeContribuitors: Contribuitor[];
}

const CompanyPage: NextPage = () => {
  const [errorMessage, setErrorMessage] = React.useState<string[]>([""]);
  const [viewIsReady, setViewIsReady] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<Dayjs>(dayjs(new Date()));
  const [company, setCompany] = React.useState<Company | null>(null);
  const [calendar, setCalendar] = React.useState<Calendar | null>(null);
  const [scheduleTime, setScheduleTime] = React.useState<ScheduleTime | null>(
    null
  );
  const [contributors, setContributors] = React.useState<Contribuitor[]>([]);
  const [searchedScheduleTimes, setSearchedScheduleTimes] =
    React.useState<boolean>(false);
  const [intervalsAreUpdated, setIntervalsAreUpdated] =
    React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter();
  const path = router.basePath;
  const id = router.query.id as string | undefined;
  const [showModalScheduleTime, setShowModalScheduleTime] =
    React.useState(false);
  const [selectedScheduleTime, setSelectedScheduleTime] =
    React.useState<Interval | null>(null);
  const [selectedScheduleDay, setSelectedScheduleDay] =
    React.useState<string>("");
  const [selectedContributor, setSelectedContributor] =
    React.useState<string>("");
  const [clientEmail, setClientEmail] = React.useState<string>("");
  const [clientPhone, setClientPhone] = React.useState<string>("");
  const [clientName, setClientName] = React.useState<string>("");
  const [schedulesGroupByDay, setSchedulesGroupByDay] =
    React.useState<DateToIntervals>({});

  const handleCloseModal = () => {
    setShowModalScheduleTime(false);
    setScheduleTime(null);
    setErrorMessage([""]);
  };

  const handleCloseModaAfterCreated = () => {
    setShowModalScheduleTime(false);
    setSelectedScheduleTime(null);
    setSelectedScheduleDay("");
    setSelectedContributor("");
    setClientEmail("");
    setClientPhone("");
    setClientName("");
    setScheduleTime(null);
    setErrorMessage([""]);
  };

  const handleShowModalScheduleTime = (sheduleTime: Interval, day: string) => {
    setShowModalScheduleTime(true);
    setSelectedScheduleTime(sheduleTime);
    setSelectedScheduleDay(day);
  };

  const handleModalConfirm = async () => {
    function showError(message: string) {
      setErrorMessage((oldValue) => {
        const index = oldValue.indexOf(message);
        if (index >= 0) {
          oldValue.splice(index, 1);
        }
        return [...oldValue, message];
      });
    }

    function hideError(message: string) {
      const index = errorMessage.indexOf(message);
      if (index >= 0)
        setErrorMessage((oldValue) => {
          return oldValue.splice(index, 1);
        });
    }

    if (company === null) {
      showError("Erro Interno: compania não existe");
      return;
    }

    if (calendar === null) {
      showError("Erro Interno: calendário não existe");
      return;
    }

    if (selectedScheduleTime === null) {
      showError("Erro Interno: selectedScheduleTime não existe");
      return;
    }

    const validations = {
      emailIsValid: false,
      nameIsValid: false,
      phoneIsValid: false,
      contributorIsValid: false,
    };

    const validateEmail = (email: string) => {
      var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regexEmail.test(email);
    };

    if (!validateEmail(clientEmail)) {
      validations.emailIsValid = false;
      showError("Email inválido");
    } else {
      validations.emailIsValid = true;
      hideError("Email inválido");
    }

    if (!(clientPhone.length >= 10)) {
      showError("Telefone inválido");
    } else {
      validations.phoneIsValid = true;
      hideError("Telefone inválido");
    }

    if (!(clientName.length > 0)) {
      showError("Nome inválido");
    } else {
      validations.nameIsValid = true;
      hideError("Nome inválido");
    }

    if (!(selectedContributor.length > 0)) {
      showError("Contribuidor inválido");
    } else {
      validations.contributorIsValid = true;
      hideError("Contribuidor inválido");
    }

    if (
      validations.contributorIsValid &&
      validations.nameIsValid &&
      validations.emailIsValid &&
      validations.phoneIsValid
    ) {
      let contributorId = 0;
      contributors.forEach((contributor) => {
        if (contributor.name == selectedContributor) {
          contributorId = contributor.id;
        }
      });

      const data = {
        client: {
          email: clientEmail,
          name: clientName,
          phone: clientPhone,
        },
        companyId: company.id,
        contributorId: contributorId,
        scheduleTime: {
          date: dayjs(selectedScheduleDay).format("YYYY-MM-DD"),
          time: selectedScheduleTime.time,
          duration: calendar.intervalTime,
        },
      };

      try {
        setErrorMessage([]);
        const url = path + "/api/companies/scheduleTimes/create";
        setIsLoading(true)
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(data),
        });
        if (response.status == 200) {
          const json = await response.json();
          setScheduleTime(json.newScheduleTime);
          let thereAreFreeTimes = await thereAreTimesAvaliable(company);
          setIntervalsAreUpdated(false);
        } else {
          const json = await response.json();
          setErrorMessage([json.error]);
        }
      } catch (error) {
        console.log(error);
        showError(`Erro Interno: ${error}`);
      }finally{
        setIsLoading(false)
      }
    }
  };

  const thereAreTimesAvaliable = async (company: Company) => {
    let thereAreAvaliableTimes = false;
    if (selectedScheduleTime == null) return false;
    const data = {
      companyId: company.id,
      scheduleTime: {
        date: dayjs(selectedScheduleDay).format("YYYY-MM-DD"),
        time: selectedScheduleTime.time,
      },
    };

    try {
      const url = path + "/api/companies/scheduleTimes/verifyIsFree";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(data),
      });
      if (response.status == 200) {
        const json = await response.json();
        thereAreAvaliableTimes = json?.free;
      } else {
        const json = await response.json();
        setErrorMessage([json.error]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      return thereAreAvaliableTimes;
    }
  };

  React.useEffect(() => {
    async function getCompanyAndCalendarByID(id: string) {
      var company = null;
      try {
        if (parseInt(id) > 0) {
          const url = path + "/api/companies/searchById/" + id;
          const response = await fetch(url, {
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          });
          if (response.status == 200) {
            const { newCompany, calendar, contributors } =
              await response.json();
            company = newCompany;
            setCalendar(calendar);
            setContributors(contributors);
          }
        }
      } finally {
        setCompany(company);
        setViewIsReady(true);
      }
    }

    if (id) getCompanyAndCalendarByID(id);
  }, [id, path]);

  React.useEffect(() => {
    function updateIntervals(
      calendar: Calendar | null,
      scheduleTimes: ScheduleTime[]
    ) {
      let intervalTimesList: string[] = [];
      if (calendar) {
        const [startHour, startMinute] = calendar.startTime.split(":");
        const [finishHour, finishtMinute] = calendar.finishTime.split(":");
        const intervalTime = calendar.intervalTime;
        let hour = parseInt(finishHour) - parseInt(startHour);
        let minute = parseInt(finishtMinute) - parseInt(startMinute);
        let totalMinutesDifference = Math.floor(
          (hour * 60 + minute) / intervalTime
        );
        for (let index = 0; index < totalMinutesDifference; index++) {
          let hourAsNumber =
            parseInt(startHour) + Math.floor((index * intervalTime) / 60);
          let minuteAsNumber = (index * intervalTime) % 60;
          let hourString;
          let minuteString;

          if (hourAsNumber <= 9) {
            hourString = "0" + hourAsNumber.toString();
          } else {
            hourString = hourAsNumber.toString();
          }

          if (minuteAsNumber <= 9) {
            minuteString = "0" + minuteAsNumber.toString();
          } else {
            minuteString = minuteAsNumber.toString();
          }

          let lastString = hourString + ":" + minuteString;
          intervalTimesList[index] = lastString;
        }
      }

      let weekIntervalTimesList: DateToIntervals = {};

      for (let index = 0; index < 5; index++) {
        weekIntervalTimesList[date.add(index, "day").format("DD-MM-YYYY")] =
          intervalTimesList.map((x) => {
            return { time: x, freeContribuitors: [...contributors] };
          });
      }

      // remove os contribuidores ocupados da lista freeContribuitors.
      scheduleTimes.map((scheduleTime) => {
        const dateAsKey = dayjs(new Date(scheduleTime.date))
          .add(1, "day")
          .format("DD-MM-YYYY"); //necessario adicionar 1 dia

        const interval = weekIntervalTimesList[dateAsKey].find(
          (x) => x.time == scheduleTime.time
        );

        if (interval) {
          const index = interval.freeContribuitors.findIndex(
            (x) => x.id == scheduleTime.contribuitorId
          );
          if (index >= 0) interval.freeContribuitors.splice(index, 1);
        }
      });

      setSchedulesGroupByDay(weekIntervalTimesList);
      setIntervalsAreUpdated(true);
    }

    async function getScheduleTimeNextFiveDaysByDate(
      initialDate: String,
      endDate: String,
      id: Number
    ): Promise<ScheduleTime[]> {
      let scheduleTimesList: ScheduleTime[] = [];
      try {
        const data = {
          companyId: id,
          initialDate,
          endDate,
        };
        const url = path + "/api/companies/scheduleTimes/show";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(data),
        });
        if (response.status == 200) {
          const scheduleTimes: ScheduleTime[] = (await response.json())
            .scheduleTimes;
          setSearchedScheduleTimes(true);
          scheduleTimesList = scheduleTimes;
        }
      } finally {
        return scheduleTimesList;
      }
    }

    if (company != null) {
      const initialDateFormatted = date.subtract(1, "day").format("YYYY-MM-DD");
      const endDateFormatted = date.add(5, "day").format("YYYY-MM-DD");
      getScheduleTimeNextFiveDaysByDate(
        initialDateFormatted,
        endDateFormatted,
        company.id
      ).then((scheduleTimesList) => {
        if (!intervalsAreUpdated) {
          updateIntervals(calendar, scheduleTimesList);
        }
      });
    }
  }, [path, company, contributors, date, calendar, intervalsAreUpdated]);

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
      {company != null ? (
        <main className={styles.mainContainer}>
          <Modal
            show={showModalScheduleTime}
            onHide={handleCloseModal}
            style={{ color: "#034078", fontWeight: "bold" }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Agende seu horário</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row>
                  <Col>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput2"
                    >
                      <Form.Label>Data</Form.Label>
                      <Form.Control
                        className="bg-white"
                        value={selectedScheduleDay}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Horário</Form.Label>
                      <Form.Control
                        autoFocus
                        className="bg-white"
                        value={selectedScheduleTime?.time ?? ""}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>
                {scheduleTime != null ? (
                  <div>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label className="text-success mt-2">
                        <b>Horário marcado com sucesso</b>
                      </Form.Label>
                    </Form.Group>
                  </div>
                ) : (
                  <div>
                    <Form.Group className="mb-3">
                      <Form.Label className="darkBlueText">
                        Selecione profissional
                      </Form.Label>
                      <Form.Select
                        onChange={({ target }) => {
                          console.log(target.value);
                          setSelectedContributor(target.value);
                        }}
                      >
                        <option></option>
                        {selectedScheduleTime?.freeContribuitors.map(
                          (contribuitor, index) => (
                            <option className={styles.option} key={index}>
                              {contribuitor.name}
                            </option>
                          )
                        )}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput3"
                    >
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        placeholder="Digite seu email"
                        className="bg-white"
                        value={clientEmail}
                        type="email"
                        onChange={({ target }) => setClientEmail(target.value)}
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput3"
                    >
                      <Form.Label>Nome</Form.Label>
                      <Form.Control
                        placeholder="Digite seu nome"
                        className="bg-white"
                        value={clientName}
                        type="text"
                        onChange={({ target }) => setClientName(target.value)}
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput3"
                    >
                      <Form.Label>Telefone</Form.Label>
                      <Form.Control
                        placeholder="Digite seu telefone ex: 1199999999"
                        className="bg-white"
                        value={clientPhone}
                        type="tel"
                        onChange={({ target }) => setClientPhone(target.value)}
                      />
                    </Form.Group>
                  </div>
                )}
                {errorMessage &&
                  errorMessage.map((errorMessage, index) => (
                    <p key={index} className={styles.errorMessage}>
                      {errorMessage}
                    </p>
                  ))}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              {scheduleTime != null ? (
                <div>
                  <Button
                    variant="danger"
                    onClick={handleCloseModaAfterCreated}
                  >
                    Fechar
                  </Button>
                </div>
              ) : (
                <div>
                  <Button variant="danger" onClick={handleCloseModal}>
                    Cancelar
                  </Button>
                  <Button variant="success" onClick={handleModalConfirm} disabled={isLoading}>
                    Confirmar
                  </Button>
                </div>
              )}
            </Modal.Footer>
          </Modal>
          <Container>
            <h1 className={`mb-5 darkBlueText ${styles.principalTitle}`}>
              {company.name}
            </h1>
            <div className="d-flex justify-content-between">
              <h2 className="darkBlueText mb-5">Agende seu horário</h2>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Selecione um dia"
                  value={date}
                  onChange={(newValue) => {
                    setIntervalsAreUpdated(false);
                    setDate(dayjs(newValue));
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  inputFormat="DD/MM/YYYY"
                  className={styles.datePicker}
                />
              </LocalizationProvider>
            </div>
            <Row className="g-4">
              {Array.from(Array(5).keys()).map((num) => (
                <Col key={num}>
                  <Card style={{ border: "1px solid #034078" }}>
                    <Card.Header className="darkBlueBg text-white text-center">
                      <b>
                        {date.add(num, "day").locale("pt").format("ddd")}{" "}
                        {date.add(num, "day").format("DD/MM")}
                      </b>
                    </Card.Header>
                    <Card.Body>
                      <Card.Title className="text-center my-2">
                        {" "}
                        Horários
                      </Card.Title>
                      <div
                        className={`${styles.scrolledCardSection} text-center`}
                      >
                        {intervalsAreUpdated ? (
                          schedulesGroupByDay[
                            date.add(num, "day").format("DD-MM-YYYY")
                          ].length == 0 ? (
                            <Card.Text className="d-flex my-3">
                              <span className={`darkBlueText py-2`}>
                                Não há horários disponíveis
                              </span>
                            </Card.Text>
                          ) : (
                            schedulesGroupByDay[
                              date.add(num, "day").format("DD-MM-YYYY")
                            ].map((interval: Interval, index: any) => (
                              <Card.Text key={index} className="my-3">
                                <Button
                                  variant="outline-success"
                                  className="text-center"
                                  disabled={
                                    interval.freeContribuitors.length == 0
                                  }
                                  onClick={() => {
                                    handleShowModalScheduleTime(
                                      interval,
                                      date.add(num, "day").format("YYYY-MM-DD")
                                    );
                                  }}
                                >
                                  {`${interval.time} +${interval.freeContribuitors.length}`}
                                </Button>
                              </Card.Text>
                            ))
                          )
                        ) : (
                          <Card.Text className="d-flex my-3">
                            <span className={`darkBlueText py-2`}>
                              Verificando horários
                            </span>
                          </Card.Text>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </main>
      ) : (
        <div className={"tokenExpired"}>
          {viewIsReady ? (
            <div>
              <h1>Empresa não encontrada!</h1>
              <Link className={` yellowText`} href="/">
                Voltar{" "}
              </Link>
            </div>
          ) : (
            <div>
              <h1>Carregando ...</h1>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyPage;
