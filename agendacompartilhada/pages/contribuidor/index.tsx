import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { TokenContext } from "../../src/context/TokenContext";
import { ContribuitorContext } from "../../src/context/ContribuitorContext";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import styles from "../../styles/Company.module.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import dayjs, { Dayjs } from "dayjs";
import Modal from "react-bootstrap/Modal";
import { Calendar, Client, Contribuitor, ScheduleTime } from "@prisma/client";
import internal from "stream";
require("dayjs/locale/pt");

interface DateToIntervals {
  [date: string]: Interval[];
}

interface Interval {
  time: string;
  scheduleTime: ScheduleTime | null;
}

const Contribuidor: NextPage = () => {
  const router = useRouter();
  const path = router.basePath;

  const { token, setToken } = React.useContext(TokenContext);
  const {
    contribuitor,
    setContribuitor,
  }: { contribuitor: Contribuitor | null; setContribuitor: any } =
    React.useContext(ContribuitorContext);

  const [menuItemSelected, setMenuItemSelected] =
    React.useState<string>("horarios");

  const [date, setDate] = React.useState<Dayjs>(dayjs(new Date()));

  const [intervalsAreUpdated, setIntervalsAreUpdated] =
    React.useState<boolean>(false);

  const [schedulesGroupByDay, setSchedulesGroupByDay] =
    React.useState<DateToIntervals>({});

  const [showModalScheduleTime, setShowModalScheduleTime] =
    React.useState(false);
  const [selectedScheduleTime, setSelectedScheduleTime] =
    React.useState<ScheduleTime | null>(null);
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(
    null
  );

  async function getClient(clientId: number) {
    try {
      const url = "api/client/" + clientId;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (response.status == 200) {
        const { client } = await response.json();
        setSelectedClient(client);
      } else {
        setSelectedClient(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteScheduleTime() {
    try {
      const url = path + "/api/scheduleTimes/" + selectedScheduleTime?.id;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (response.status != 200) {
        console.log(`error deleting scheduleTimes: reponse ${response.status}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleShowModalScheduleTime = (interval: Interval, day: string) => {
    if (interval.scheduleTime != null) {
      setShowModalScheduleTime(true);
      setSelectedScheduleTime(interval.scheduleTime);
      getClient(interval.scheduleTime.clientId);
    }
  };

  const handleModalDelete = async () => {
    if (selectedScheduleTime != null) {
      await deleteScheduleTime();
      setIntervalsAreUpdated(false);
    }
    handleModalClose();
  };

  const handleModalClose = () => {
    setShowModalScheduleTime(false);
    setSelectedScheduleTime(null);
    setSelectedClient(null);
  };

  function contribuitorMenuClick(e: any) {
    e.preventDefault();
    setMenuItemSelected("horarios");
  }
  async function onSubmitLogoutHandler(e: any) {
    e.preventDefault();
    try {
      window.localStorage.setItem("token", "");
      router.push("/login");
      setTimeout(setContribuitor(null), 2000);
      setTimeout(setToken(""), 2000);
    } catch (error) {
      throw error;
    }
  }

  const [viewIsReady, setViewIsReady] = React.useState<boolean>(false);

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
            return { time: x, scheduleTime: null };
          });
      }

      scheduleTimes.map((scheduleTime) => {
        const dateAsKey = dayjs(new Date(scheduleTime.date))
          .add(1, "day")
          .format("DD-MM-YYYY"); //necessario adicionar 1 dia

        const interval = weekIntervalTimesList[dateAsKey].find(
          (x) => x.time == scheduleTime.time
        );

        if (interval) {
          interval.scheduleTime = scheduleTime;
        }
      });

      setSchedulesGroupByDay(weekIntervalTimesList);
      setIntervalsAreUpdated(true);
    }

    async function getScheduleTimeNextFiveDaysByDate(
      initialDate: String,
      endDate: String,
      id: Number
    ): Promise<[ScheduleTime[], Calendar | null]> {
      let scheduleTimesList: [ScheduleTime[], Calendar | null] = [[], null];
      try {
        const data = {
          contribuitorId: id,
          initialDate,
          endDate,
        };
        const url = path + "/api/contribuitors/scheduleTimes";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(data),
        });
        if (response.status == 200) {
          const { scheduleTimes, calendar } = await response.json();
          scheduleTimesList[0] = scheduleTimes;
          scheduleTimesList[1] = calendar;
        }
      } finally {
        return scheduleTimesList;
      }
    }

    const initialDateFormatted = date.subtract(1, "day").format("YYYY-MM-DD");
    const endDateFormatted = date.add(5, "day").format("YYYY-MM-DD");
    if (contribuitor) {
      getScheduleTimeNextFiveDaysByDate(
        initialDateFormatted,
        endDateFormatted,
        contribuitor.id
      ).then(([scheduleTimesList, calendar]) => {
        if (!intervalsAreUpdated) {
          updateIntervals(calendar, scheduleTimesList);
        }
      });
    }
  }, [path, contribuitor, date, intervalsAreUpdated]);

  React.useEffect(() => {
    async function getContribuitorByEmail(email: string) {
      try {
        const url = "api/contribuitors/" + email;
        const response = await fetch(url, {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        if (response.status == 200) {
          const { contribuitor } = await response.json();
          setContribuitor(contribuitor);
        } else {
          setContribuitor(null);
        }
      } catch (error) {
        console.log(error);
      }
    }
    try {
      const token = window.localStorage.getItem("token");
      const contribuitorEmail = window.localStorage.getItem("email");
      if (token) {
        if (contribuitorEmail) {
          getContribuitorByEmail(contribuitorEmail).then(() => {
            setViewIsReady(true);
          });
        } else {
          setContribuitor(null);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  }, [router, setContribuitor]);

  if (!token || !contribuitor) {
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
        <div className={"tokenExpired"}>
          {viewIsReady ? (
            <div>
              <h1>Seu token expirou!</h1>
              <Link className={` yellowText`} href="/login">
                Voltar ao login{" "}
              </Link>
            </div>
          ) : (
            <div>
              <h1>Carregando ...</h1>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Head>
          <title>
            Agenda Compartilhada -{" "}
            {menuItemSelected.charAt(0).toUpperCase() +
              menuItemSelected.slice(1)}
          </title>
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
            <Navbar.Brand href="/contribuidor" style={{ color: "#FACE54" }}>
              {contribuitor.name}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mx-auto">
                <li className="nav-item">
                  <button
                    className={`nav-link mx-2 ${
                      menuItemSelected == "horarios" ? "active" : ""
                    } ${styles.menuButton}`}
                    type="button"
                    onClick={contribuitorMenuClick}
                  >
                    Horários
                  </button>
                </li>
              </Nav>
              <button
                className={`navbar-link ${styles.logoutButton} yellowText`}
                type="button"
                onClick={onSubmitLogoutHandler}
              >
                Sair
              </button>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <main className={styles.mainContainer}>
          <Modal
            show={showModalScheduleTime}
            onHide={handleModalClose}
            style={{ color: "#034078", fontWeight: "bold" }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Horário Agendado</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                {selectedScheduleTime == null || selectedClient == null ? (
                  <div>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label className="mt-2">
                        <b>Carregando...</b>
                      </Form.Label>
                    </Form.Group>
                  </div>
                ) : (
                  <Row>
                    <Col>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput2"
                      >
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                          className="bg-white"
                          value={dayjs(selectedScheduleTime.date).format(
                            "YYYY-MM-DD"
                          )}
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
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput3"
                    >
                      <Form.Label>Nome</Form.Label>
                      <Form.Control
                        className="bg-white"
                        value={selectedClient.name}
                        type="text"
                        disabled
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput3"
                    >
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        className="bg-white"
                        value={selectedClient?.email}
                        type="email"
                        disabled
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput3"
                    >
                      <Form.Label>Telefone</Form.Label>
                      <Form.Control
                        className="bg-white"
                        value={selectedClient?.phone}
                        type="tel"
                        disabled
                      />
                    </Form.Group>
                  </Row>
                )}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <div>
                {contribuitor.isAdmin && (
                  <Button variant="danger" onClick={handleModalDelete}>
                    Deletar Horário
                  </Button>
                )}
              </div>
            </Modal.Footer>
          </Modal>
          {menuItemSelected == "horarios" ? (
            <Container>
              <div className="d-flex justify-content-between">
                <h2 className="darkBlueText mb-5">Horários Agendados</h2>
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
                                    disabled={interval.scheduleTime == null}
                                    onClick={() => {
                                      handleShowModalScheduleTime(
                                        interval,
                                        date
                                          .add(num, "day")
                                          .format("YYYY-MM-DD")
                                      );
                                    }}
                                  >
                                    {`${interval.time}`}
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
          ) : (
            <div>
              <div className={styles.initialTeamContent}>
                <h1 className="darkBlueText ">Unkown</h1>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }
};

export default Contribuidor;
