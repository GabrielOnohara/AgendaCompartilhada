import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { TokenContext } from "../../src/context/TokenContext";
import { CompanyContext } from "../../src/context/CompanyContext";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import styles from "../../styles/Company.module.css";
import bcrypt from "bcryptjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import dayjs, { Dayjs } from "dayjs";
import { log } from "console";
const Empresa: NextPage = () => {
  const router = useRouter();
  const { token, setToken } = React.useContext(TokenContext);
  const { company, setCompany } = React.useContext(CompanyContext);
  const [menuItemSelected, setMenuItemSelected] =
    React.useState<string>("resumo");
  const [showModal, setShowModal] = React.useState(false);
  const [showModalCalendar, setShowModalCalendar] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false)
  const handleCloseModal = () => {
    setShowModal(false);
    setModalTitle("");
    setEmail("");
    setName("");
    setTelefone("");
    setAddress("");
    setPassword("");
    setAdmin(false);
    setErrorMessageContribuitor([]);
  };
  const handleShowAddModal = () => {
    setErrorMessageContribuitor([]);
    setModalTitle("Adicionar");
    setEmail("");
    setName("");
    setTelefone("");
    setAddress("");
    setPassword("");
    setAdmin(false);
    setShowModal(true);
  };
  const handleShowEditModal = (contributor: any) => {
    setErrorMessageContribuitor([]);
    setID(contributor.id ?? -1);
    setEmail(contributor.email ?? "");
    setName(contributor.name ?? "");
    setTelefone(contributor.phone ?? "");
    setAddress(contributor.address ?? "");
    setPassword(contributor.password ?? "");
    setAdmin(contributor.isAdmin ?? false);
    setModalTitle("Editar");
    setShowModal(true);
  };
  const handleShowDeleteModal = (contributor: any) => {
    setErrorMessageContribuitor([]);
    setID(contributor.id ?? -1);
    setEmail(contributor.email ?? "");
    setName(contributor.name ?? "");
    setTelefone(contributor.phone ?? "");
    setAddress(contributor.address ?? "");
    setModalTitle("Deletar");
    setShowModal(true);
  };

  const [ID, setID] = React.useState<number>(-1);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [telefone, setTelefone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [admin, setAdmin] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<String[]>([]);
  const [errorMessageContribuitor, setErrorMessageContribuitor] =
    React.useState<String[]>([]);
  const [errorMessageCalendar, setErrorMessageCalendar] = React.useState<
    String[]
  >([]);
  const [contribuitors, setContribuitors] = React.useState<any[]>([]);
  const [modalTitle, setModalTitle] = React.useState("Adicionar");
  const [modalCalendarTitle, setModalCalendarTitle] =
    React.useState("Adicionar");
  const [calendar, setCalendar] = React.useState<any>({});
  const [date, setDate] = React.useState<Dayjs>(dayjs(new Date));
  const handleCloseCalendarModal = () => {
    setShowModalCalendar(false);
    setInitialTime("");
    setFinishTime("");
    setIntervalTime("");
    setErrorMessageCalendar([]);
  };
  const handleShowAddCalendar = () => {
    setErrorMessageCalendar([]);
    setModalCalendarTitle("Adicionar");
    setShowModalCalendar(true);
  };
  const handleShowEditCalendar = (calendar: any) => {
    setErrorMessageCalendar([]);
    setInitialTime(calendar.startTime);
    setFinishTime(calendar.finishTime);
    setIntervalTime(calendar.intervalTime);
    setModalCalendarTitle("Editar");
    setShowModalCalendar(true);
  };
  const handleShowDeleteCalendar = (calendar: any) => {
    setErrorMessageCalendar([]);
    setInitialTime(calendar.startTime);
    setFinishTime(calendar.finishTime);
    setIntervalTime(calendar.intervalTime);
    setModalCalendarTitle("Deletar");
    setShowModalCalendar(true);
  };

  const [initialTime, setInitialTime] = React.useState("");
  const [finishTime, setFinishTime] = React.useState("");
  const [intervalTime, setIntervalTime] = React.useState("");

  function toggleCheckbox(event: any) {
    setAdmin(event.target.checked);
  }

  function companyMenuClick(e: any) {
    e.preventDefault();
    setMenuItemSelected("resumo");
  }
  function scheduleMenuClick(e: any) {
    e.preventDefault();
    setMenuItemSelected("agenda");
  }
  function teamMenuClick(e: any) {
    e.preventDefault();
    setMenuItemSelected("equipe");
  }

  async function onSubmitLogoutHandler(e: any) {
    e.preventDefault();
    const url = "api/companies/logout";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (response.status == 200) {
        window.localStorage.setItem("token", "");
        router.push("/login");
        setTimeout(setCompany({ name: "" }), 2000);
        setTimeout(setToken(""), 2000);
      } else {
        console.log(response.statusText);
      }
    } catch (error) {
      throw error;
    }
  }

  async function onSubmitModalConfirm(e: any) {
    e.preventDefault();
    const validations = {
      emailIsValid: false,
      passwordLengthIsValid: false,
    };

    const validateEmail = (email: string) => {
      var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regexEmail.test(email);
    };

    switch (modalTitle) {
      case "Adicionar":
        let dataADD = {
          email,
          name,
          phone: telefone,
          password,
          isAdmin: admin,
          companyId: company.id,
        };

        setModalTitle("Adicionar");

        if (password.length <= 5) {
          validations.passwordLengthIsValid = false;
          setErrorMessageContribuitor((oldValue) => {
            const index = oldValue.indexOf(
              "Senhas devem ter pelo menos seis dígitos"
            );
            if (index >= 0) {
              oldValue.splice(index, 1);
            }
            return [...oldValue, "Senhas devem ter pelo menos seis dígitos"];
          });
        } else {
          validations.passwordLengthIsValid = true;
          const index = errorMessage.indexOf(
            "Senhas devem ter pelo menos seis dígitos"
          );
          if (index >= 0)
            setErrorMessageContribuitor((oldValue) => {
              return oldValue.splice(index, 1);
            });
        }

        if (!validateEmail(email)) {
          validations.emailIsValid = false;
          setErrorMessageContribuitor((oldValue) => {
            const index = oldValue.indexOf("Insira um email válido");
            if (index >= 0) {
              oldValue.splice(index, 1);
            }
            return [...oldValue, "Insira um email válido"];
          });
        } else {
          validations.emailIsValid = true;
          const index = errorMessage.indexOf("Insira um email válido");
          if (index >= 0)
            setErrorMessageContribuitor((oldValue) => {
              return oldValue.splice(index, 1);
            });
        }

        if (validations.emailIsValid && validations.passwordLengthIsValid) {
          var salt = bcrypt.genSaltSync(10);
          var hash = bcrypt.hashSync(dataADD.password, salt);
          dataADD.password = hash;

          const url = "api/contribuitors/create";
          try {
            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataADD),
            });
            if (response.ok) {
              const { newContribuitor } = await response.json();
              if (newContribuitor) {
                refreshTeam(dataADD.companyId);
                handleCloseModal();
                setModalTitle("");
              }
            } else {
              setErrorMessageContribuitor([response.statusText]);
            }
          } catch (error) {
            throw error;
          }
        }
        break;
      case "Editar":
        let dataEDIT = {
          id: ID,
          email,
          name,
          phone: telefone,
          isAdmin: admin,
          companyId: company.id,
        };

        setModalTitle("Editar");
        if (password.length <= 5) {
          validations.passwordLengthIsValid = false;
          setErrorMessageContribuitor((oldValue) => {
            const index = oldValue.indexOf(
              "Senhas devem ter pelo menos seis dígitos"
            );
            if (index >= 0) {
              oldValue.splice(index, 1);
            }
            return [...oldValue, "Senhas devem ter pelo menos seis dígitos"];
          });
        } else {
          validations.passwordLengthIsValid = true;
          const index = errorMessage.indexOf(
            "Senhas devem ter pelo menos seis dígitos"
          );
          if (index >= 0)
            setErrorMessageContribuitor((oldValue) => {
              return oldValue.splice(index, 1);
            });
        }

        if (!validateEmail(email)) {
          validations.emailIsValid = false;
          setErrorMessageContribuitor((oldValue) => {
            const index = oldValue.indexOf("Email inválido");
            if (index >= 0) {
              oldValue.splice(index, 1);
            }
            return [...oldValue, "Email inválido"];
          });
        } else {
          validations.emailIsValid = true;
          const index = errorMessage.indexOf("Email inválido");
          if (index >= 0)
            setErrorMessageContribuitor((oldValue) => {
              return oldValue.splice(index, 1);
            });
        }

        if (validations.emailIsValid && validations.passwordLengthIsValid) {
          const url = "api/contribuitors/edit";
          try {
            const response = await fetch(url, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataEDIT),
            });
            if (response.ok) {
              const { contributorEdited } = await response.json();
              if (contributorEdited) {
                refreshTeam(dataEDIT.companyId);
                setModalTitle("");
                handleCloseModal();
              }
            } else {
              setErrorMessageContribuitor([response.statusText]);
            }
          } catch (error) {
            throw error;
          }
        }

        break;
      case "Deletar":
        setModalTitle("Deletar");
        let dataDELETE = {
          id: ID,
          companyId: company.id,
        };

        if (dataDELETE.id > 0) {
          const url = "api/contribuitors/delete/" + dataDELETE.id;
          try {
            const response = await fetch(url, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (response.ok) {
              const json = await response.json();
              if (json.contributorWasDeleted) {
                refreshTeam(dataDELETE.companyId);
                setShowModal(false);
                setModalTitle("");
                handleCloseModal();
              }
            } else {
              setErrorMessageContribuitor([response.statusText]);
            }
          } catch (error) {
            throw error;
          }
        }

        break;
      default:
        break;
    }
  }

  function handleInputError(value: string, type: string) {
    if (type === 'email') {
      setEmail(value)
      if (value)
        setErrorMessageContribuitor(errorMessageContribuitor.filter((mensagem) => mensagem !== "Insira um email válido"))
    } else if (type === 'password') {
      setPassword(value)
      if (value.length >= 6)
        setErrorMessageContribuitor(errorMessageContribuitor.filter((mensagem) => mensagem !== "Senhas devem ter pelo menos seis dígitos"))
    }
  }

  async function refreshTeam(companyID: any) {
    const url = "api/contribuitors/list";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: companyID }),
      });
      if (response.ok) {
        const { contribuitors } = await response.json();
        if (contribuitors) {
          setContribuitors(contribuitors);
          return contribuitors
        }
      } else {
        setErrorMessage([response.statusText]);
      }
    } catch (error) {
      throw error;
    }
  }

  async function refreshCalendar(companyID: any) {
    const url = "api/calendar/show";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: companyID }),
      });
      if (response.ok) {
        const { calendar } = await response.json();
        if (calendar) {
          setErrorMessageCalendar([response.statusText]);
          setCalendar(calendar);
        } else {
          setCalendar({});
        }
      } else {
        setCalendar({});
        setErrorMessageCalendar([response.statusText]);
      }
    } catch (error) {
      throw error;
    }
  }



  async function onSubmitCalendarModalConfirm(e: any) {
    e.preventDefault();
    switch (modalCalendarTitle) {
      case "Adicionar":
        const dataADD = {
          startTime: initialTime,
          finishTime: finishTime,
          intervalTime: parseInt(intervalTime),
          companyId: company.id,
        };

        if (initialTime == "" || finishTime == "" || intervalTime == "") {
          setErrorMessageCalendar((oldValue) => {
            const index = oldValue.indexOf("Preencha todos os campos");
            if (index >= 0) {
              oldValue.splice(index, 1);
            }
            return [...oldValue, "Preencha todos os campos"];
          });
        } else {
          const url = "api/calendar/create";
          try {
            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataADD),
            });
            if (response.ok) {
              const { newCalendar } = await response.json();
              if (newCalendar) {
                refreshCalendar(dataADD.companyId); // verificar uso
                setShowModalCalendar(false);
                setModalCalendarTitle("");
                handleCloseCalendarModal();
              }
            } else {
              setErrorMessageContribuitor([response.statusText]);
            }
          } catch (error) {
            throw error;
          }
        }
        break;
      case "Editar":
        const dataEDIT = {
          startTime: initialTime,
          finishTime: finishTime,
          intervalTime: parseInt(intervalTime),
          companyId: company.id,
        };

        if (initialTime == "" || finishTime == "" || intervalTime == "") {
          setErrorMessageCalendar((oldValue) => {
            const index = oldValue.indexOf("Preencha todos os campos");
            if (index >= 0) {
              oldValue.splice(index, 1);
            }
            return [...oldValue, "Preencha todos os campos"];
          });
        } else {
          const url = "api/calendar/edit";
          try {
            const response = await fetch(url, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataEDIT),
            });
            if (response.ok) {
              const { calendarEdited } = await response.json();
              if (calendarEdited) {
                refreshCalendar(dataEDIT.companyId); // verificar uso
                setShowModalCalendar(false);
                setModalCalendarTitle("");
                handleCloseCalendarModal();
              }
            } else {
              setErrorMessageContribuitor([response.statusText]);
            }
          } catch (error) {
            throw error;
          }
        }
        break;
      case "Deletar":
        const dataDELETE = {
          startTime: initialTime,
          finishTime: finishTime,
          intervalTime: parseInt(intervalTime),
          companyId: company.id,
        };
        const url = "api/calendar/delete/" + dataDELETE.companyId;
        try {
          const response = await fetch(url, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.ok) {
            const json = await response.json();
            if (json.deletedCalendar) {
              refreshCalendar(dataDELETE.companyId); // verificar uso
              setShowModalCalendar(false);
              setModalCalendarTitle("");
              handleCloseCalendarModal();
            }
          } else {
            setErrorMessageContribuitor([response.statusText]);
          }
        } catch (error) {
          throw error;
        }
        break;
      default:
        break;
    }
  }

  function handleInput() {
    if (initialTime == "" || finishTime == "" || intervalTime == "")
      setErrorMessageCalendar(errorMessageCalendar.filter((mensagem) => mensagem !== "Preencha todos os campos"))
  }

  const [scheduleTimeContributor, setScheduleTimeContributor] =
    React.useState("");

  async function setMessageAsReaded(message: any) {
    const data = {
      id: message.id,
      readed: true
    };
    const url = "api/companies/scheduleTimes/message/update";
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      setMessages((oldValue) => {
        return oldValue.map(m => {
          if (message == m) {
            m.readed = true;
          }
          return m
        })
      })
    }
  }

  async function searchScheduleTimes(e: any) {
    e.preventDefault()
    const data = {
      companyId: company.id,
      contributor: scheduleTimeContributor,
      date: date.subtract(1, 'hour').format("YYYY-MM-DD")
    }

    try {
      setIsLoading(true)
      const url = "api/contribuitors/scheduleTimes/show";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const json = await response.json()
        setScheduleTimes(json.scheduleTimes)
      } else {
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }


  }
  const [viewIsReady, setViewIsReady] = React.useState<boolean>(false);

  React.useEffect(() => {
    async function getCompanyByEmail(email: string) {
      try {
        const url = "api/companies/" + email;
        const response = await fetch(url, {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        if (response.status == 200) {
          const { company } = await response.json();
          setCompany(company);
        } else {
          setCompany({ name: "" });
        }
      } catch (error) {
        console.log(error);
      }
    }
    try {
      const token = window.localStorage.getItem("token");
      const companyEmail = window.localStorage.getItem("email");
      if (token) {
        if (companyEmail) {
          getCompanyByEmail(companyEmail).then(() => {
            setViewIsReady(true);
          });
        } else {
          setCompany({});
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  }, [router, setCompany]);

  React.useEffect(() => {
    async function refreshMessages(companyID: any, contributors: any) {
      const data = {
        date: dayjs(new Date()).format("YYYY-MM-DD"),
        companyId: companyID,
      };
      try {
        const url = "api/companies/scheduleTimes/message/show";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(data),
        });
        const json = await response.json();
        if (response.status == 200) {
          let messages = json.messages.map((message: any) => {
            let scheduleTimesList = json.scheduleTimes;
            scheduleTimesList.forEach((time: any) => {
              if (time.id == message.scheduleTimeId) {
                message.scheduleTime = time;
                contributors.forEach((contribuitor: any) => {
                  if (contribuitor.id == message.scheduleTime.contribuitorId) {
                    message.contributor = contribuitor
                  }
                })
                let clientList = json.clients;
                clientList.forEach((client: any) => {
                  if (client.id == message.scheduleTime.clientId) {
                    message.client = client;
                  }
                })
              }
            })

            return message
          })
          setMessages(messages);
          setAdviseErrorMessage([]);
        } else {
          setAdviseErrorMessage([json.error]);
        }
      } catch (error) {
        console.log(error);
      }
    }
    switch (menuItemSelected) {
      case "resumo":
        if (company.id > 0) {
          refreshTeam(company.id).then((contributors) => refreshMessages(company.id, contributors))
        }
        break;
      case "agenda":
        refreshCalendar(company.id).then(() => setShowModalCalendar(false));
        break;
      case "equipe":
        refreshTeam(company.id).then(() => setShowModal(false));
        break;
      default:
        break;
    }
  }, [menuItemSelected, company.id]);

  React.useEffect(() => {
    refreshCalendar(company.id).then(() => setShowModalCalendar(false));
    refreshTeam(company.id).then(() => setShowModal(false));
  }, [company.id]);

  const [messages, setMessages] = React.useState<any[]>([]);
  const [scheduleTimes, setScheduleTimes] = React.useState<any[]>([]);
  const [adviseErrorMessage, setAdviseErrorMessage] = React.useState<string[]>([
    "Sem avisos",
  ]);

  if (!token) {
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
            <Navbar.Brand href="/empresa" style={{ color: "#FACE54" }}>
              {company.name}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mx-auto">
                <li className="nav-item">
                  <button
                    className={`nav-link mx-2 ${menuItemSelected == "resumo" ? "active" : ""
                      } ${styles.menuButton}`}
                    type="button"
                    onClick={companyMenuClick}
                  >
                    Resumo
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link mx-2  ${menuItemSelected == "agenda" ? "active" : ""
                      } ${styles.menuButton}`}
                    type="button"
                    onClick={scheduleMenuClick}
                  >
                    Agenda
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link mx-2  ${menuItemSelected == "equipe" ? "active" : ""
                      } ${styles.menuButton}`}
                    type="button"
                    onClick={teamMenuClick}
                  >
                    Equipe
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
          {menuItemSelected == "resumo" ? (
            <div>
              <h1 className="darkBlueText">Resumo</h1>
              <Row>
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title
                        style={{ marginBottom: "20px", textAlign: "center" }}
                      >
                        Consultar agendamentos
                      </Card.Title>
                      <Card.Text>
                        <Form>
                          <Form.Group className="mb-3">
                            <Form.Label className="darkBlueText">
                              Selecione contribuidor
                            </Form.Label>
                            <Form.Select
                              onChange={({ target }) => {
                                setScheduleTimeContributor(target.value);
                              }}
                            >
                              <option></option>
                              {contribuitors.map((contribuitor) => (
                                <option
                                  className={styles.option}
                                  key={contribuitor.id}
                                >
                                  {contribuitor.name}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label
                              className="darkBlueText"
                              style={{ display: "block" }}
                            >
                              Selecione a data
                            </Form.Label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label=""
                                value={date}
                                onChange={(newValue) => {
                                  setDate(dayjs(newValue));
                                }}
                                renderInput={(params: any) => (
                                  <TextField {...params} />
                                )}
                                inputFormat="DD/MM/YYYY"
                              />
                            </LocalizationProvider>
                          </Form.Group>
                        </Form>
                      </Card.Text>
                      <Button variant="success" onClick={searchScheduleTimes} disabled={isLoading}>
                        Confirmar
                      </Button>
                    </Card.Body>
                    <hr />
                    <Card.Body>
                      <Card.Title
                        style={{ marginBottom: "20px", textAlign: "center" }}
                      >
                        Agendamentos
                      </Card.Title>
                      <Card.Text></Card.Text>
                      {
                        scheduleTimes.length <= 0
                          ? (
                            <Card>
                              <Card.Body >
                                <Card.Text>
                                  <p className="mb-1" style={{ textAlign: "center" }}>
                                    <span
                                      className="error"
                                      style={{ fontWeight: "bold" }}
                                    >
                                      Nenhum horário encontrado.
                                    </span>{" "}
                                  </p>
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          )
                          : scheduleTimes.map((s) => (
                            <Card key={s.id}>
                              <Card.Body >
                                <Card.Text>
                                  <p className="mb-1">
                                    <span
                                      className="darkBlueText"
                                      style={{ fontWeight: "bold" }}
                                    >
                                      Horário:
                                    </span>{" "}
                                    {s.time}
                                  </p>
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          ))
                      }
                    </Card.Body>
                  </Card>
                  {/* <Card>
                    <Card.Body>
                      <Card.Title
                        style={{ marginBottom: "20px", textAlign: "center" }}
                      >
                        Agendamentos
                      </Card.Title>
                      <Card.Text></Card.Text>
                      {
                        scheduleTimes.length <= 0
                          ? (
                            <Card>
                              <Card.Body >
                                <Card.Text>
                                  <p className="mb-1" style={{ textAlign: "center" }}>
                                    <span
                                      className="error"
                                      style={{ fontWeight: "bold" }}
                                    >
                                      Nenhum horário encontrado.
                                    </span>{" "}
                                  </p>
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          )
                          : scheduleTimes.map((s) => (
                            <Card key={s.id}>
                              <Card.Body >
                                <Card.Text>
                                  <p className="mb-1">
                                    <span
                                      className="darkBlueText"
                                      style={{ fontWeight: "bold" }}
                                    >
                                      Horário:
                                    </span>{" "}
                                    {s.time}
                                  </p>
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          ))
                      }
                    </Card.Body>
                  </Card> */}
                </Col>
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title
                        style={{ marginBottom: "20px", textAlign: "center" }}
                      >
                        Últimos avisos
                      </Card.Title>
                      <Card.Text></Card.Text>
                      {
                        messages.length && contribuitors.length <= 0
                          ? (
                            <Card>
                              <Card.Body >
                                <Card.Text>
                                  <p className="mb-1" style={{ textAlign: "center" }}>
                                    <span
                                      className="darkBlueText"
                                      style={{ fontWeight: "bold" }}
                                    >
                                      Não foram encontrados novos avisos.
                                    </span>{" "}
                                  </p>
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          )
                          : messages.map((m) => (
                            <Card key={m.id}>
                              <Card.Body >
                                <Card.Text>
                                  <p className="mb-1">
                                    <span
                                      className="darkBlueText"
                                      style={{ fontWeight: "bold" }}
                                    >
                                      Contribuidor:
                                    </span>{" "}
                                    {m.contributor.name}
                                  </p>
                                  <p className="mb-1">
                                    <span
                                      className="darkBlueText"
                                      style={{ fontWeight: "bold" }}
                                    >
                                      Data:
                                    </span>{" "}
                                    {dayjs(new Date(m.createdAt)).format("YYYY-MM-DD")}
                                  </p>
                                  <p className="mb-1">
                                    <span
                                      className="darkBlueText"
                                      style={{ fontWeight: "bold" }}
                                    >
                                      Cliente:
                                    </span>{" "}
                                    {m.client.name}
                                  </p>
                                  <p className="mb-1">
                                    <span
                                      className="darkBlueText"
                                      style={{ fontWeight: "bold" }}
                                    >
                                      Mensagem:
                                    </span>
                                    <br /> {m.content}
                                  </p>
                                  {!m.readed
                                    ? (
                                      <Button
                                        variant="primary"
                                        className="mt-3 btn-sm"
                                        style={{ float: "right" }}
                                        onClick={() => setMessageAsReaded(m)}
                                      >
                                        Marcar como lida
                                      </Button>
                                    )
                                    : (
                                      <Button
                                        variant="success"
                                        className="mt-3 btn-sm"
                                        style={{ float: "right" }}
                                        disabled
                                      >
                                        Lida
                                      </Button>
                                    )
                                  }
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          ))
                      }
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          ) : menuItemSelected == "agenda" ? (
            <div>
              <div className={styles.initialCalendarContent}>
                <h1 className="darkBlueText ">Agenda</h1>
                <div className={styles.actionContent}></div>
              </div>
              <div>
                <Modal
                  show={showModalCalendar}
                  onHide={handleCloseCalendarModal}
                  style={{ color: "#034078", fontWeight: "bold" }}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>{modalCalendarTitle} Agenda</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div
                      style={{ display: "block", padding: "0px 0px 10px 0px" }}
                    >
                      <p>Ex: 11:00 AM = 11:00</p>
                      <p>Ex: 11:00 PM = 23:00</p>
                    </div>
                    <Form>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Horário de Início</Form.Label>
                        <Form.Control
                          placeholder="ex: 8:00"
                          autoFocus
                          className="bg-white"
                          color="034078"
                          type="time"
                          value={initialTime}
                          onChange={({ target }) => {
                            setInitialTime(target.value)
                            handleInput()
                          }
                          }
                          disabled={modalCalendarTitle == "Deletar"}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput2"
                      >
                        <Form.Label>Horário de Término</Form.Label>
                        <Form.Control
                          placeholder="ex: 18:00"
                          className="bg-white"
                          type="time"
                          value={finishTime}
                          onChange={({ target }) => {
                            setFinishTime(target.value)
                            handleInput()
                          }
                          }
                          disabled={modalCalendarTitle == "Deletar"}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput3"
                      >
                        <Form.Label>
                          Duração média de agendamento (min)
                        </Form.Label>
                        <Form.Control
                          placeholder="ex: 30"
                          className="bg-white"
                          value={intervalTime}
                          type="number"
                          onChange={({ target }) => {
                            setIntervalTime(target.value)
                            handleInput()
                          }
                          }
                          disabled={modalCalendarTitle == "Deletar"}
                        />
                      </Form.Group>
                      {errorMessageCalendar &&
                        errorMessageCalendar.map((errorMessage, index) => (
                          <p key={index} className={styles.errorMessage}>
                            {errorMessage}
                          </p>
                        ))}
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseCalendarModal}>
                      Cancelar
                    </Button>
                    <Button
                      variant="success"
                      onClick={onSubmitCalendarModalConfirm}
                    >
                      Confirmar
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Card style={{ border: "1px solid #034078", color: "#034078" }}>
                  <Card.Body>
                    <Card.Title
                      style={{
                        fontWeight: "bold",
                        marginBottom: "20px",
                        display: "inline-block",
                      }}
                    >
                      Horário de funcionamento
                    </Card.Title>
                    {!calendar.hasOwnProperty("startTime") ? (
                      <Button
                        variant="success"
                        style={{ float: "right" }}
                        onClick={handleShowAddCalendar}
                      >
                        Adicionar
                      </Button>
                    ) : (
                      <div></div>
                    )}
                    {calendar.hasOwnProperty("startTime") && (
                      <div>
                        <div className={styles.calendarSection}>
                          <div className={styles.actionContent}>
                            <Button
                              variant="warning"
                              onClick={() => handleShowEditCalendar(calendar)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleShowDeleteCalendar(calendar)}
                            >
                              Deletar
                            </Button>
                          </div>
                        </div>
                        <Card.Text style={{ float: "left" }}>
                          <p className={styles.timeItem}>
                            <span>Horário de Início:</span>
                            <p>{calendar.startTime}</p>
                          </p>
                          <p className={styles.timeItem}>
                            <span>Horário de Término:</span>
                            <p>{calendar.finishTime}</p>
                          </p>
                          <p className={styles.timeItem}>
                            <span>Duração média de agendamento</span>
                            <p>{calendar.intervalTime} min</p>
                          </p>
                        </Card.Text>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </div>
            </div>
          ) : (
            <div>
              <div className={styles.initialTeamContent}>
                <h1 className="darkBlueText ">Equipe</h1>
                <div className={styles.actionContent}>
                  <Button variant="success" onClick={handleShowAddModal}>
                    Adicionar
                  </Button>
                </div>
              </div>
              <div className="teamContent">
                <Modal
                  show={showModal}
                  onHide={handleCloseModal}
                  style={{ color: "#034078", fontWeight: "bold" }}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>{modalTitle} Contribuidor</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="name@example.com"
                          autoFocus
                          className="bg-white"
                          value={email}
                          onChange={({ target }) => handleInputError(target.value, 'email')}
                          disabled={modalTitle == "Deletar"}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput2"
                      >
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                          type="name"
                          placeholder="Nome Completo"
                          className="bg-white"
                          value={name}
                          onChange={({ target }) => setName(target.value)}
                          disabled={modalTitle == "Deletar"}
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput3"
                      >
                        <Form.Label>Telefone</Form.Label>
                        <Form.Control
                          type="phone"
                          placeholder="11999999999"
                          className="bg-white"
                          value={telefone}
                          onChange={({ target }) => setTelefone(target.value)}
                          disabled={modalTitle == "Deletar"}
                        />
                      </Form.Group>
                      {modalTitle == "Adicionar" && (
                        <Form.Group
                          className="mb-3"
                          controlId="exampleForm.ControlInput4"
                        >
                          <Form.Label>Senha</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Senha"
                            className="bg-white"
                            value={password}
                            onChange={({ target }) => handleInputError(target.value, 'password')}
                          />
                        </Form.Group>
                      )}
                      {modalTitle != "Deletar" && (
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicCheckbox"
                        >
                          <Form.Check
                            type="checkbox"
                            label="Usuário é administrador?"
                            onChange={toggleCheckbox}
                            checked={admin}
                          />
                        </Form.Group>
                      )}
                      {errorMessageContribuitor &&
                        errorMessageContribuitor.map((errorMessage, index) => (
                          <p key={index} className={styles.errorMessage}>
                            {errorMessage}
                          </p>
                        ))}
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseModal}>
                      Cancelar
                    </Button>
                    <Button variant="success" onClick={onSubmitModalConfirm}>
                      Confirmar
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Row xs={1} md={2} className="g-4">
                  {contribuitors.map((contributor, idx) => (
                    <Col key={idx}>
                      <Card
                        style={{
                          border: "1px solid #034078",
                          color: "#034078",
                        }}
                      >
                        <div className={styles.logoSection}>
                          <Card.Img
                            variant="top"
                            src="/avatarimage.jpg"
                            style={{
                              width: "200px",
                              margin: "20px auto 20x 0px",
                              borderRadius: "50%",
                            }}
                          />
                          <div className={styles.actionContent}>
                            <Button
                              variant="warning"
                              onClick={() => handleShowEditModal(contributor)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleShowDeleteModal(contributor)}
                            >
                              Deletar
                            </Button>
                          </div>
                        </div>
                        <Card.Body>
                          <Card.Title style={{ fontWeight: "bold" }}>
                            {contributor.name}
                          </Card.Title>
                          <Card.Text>
                            <p className={styles.teamPhone}>
                              <span>Telefone:</span>
                              <p>{contributor.phone}</p>
                            </p>
                            <p className={styles.teamEmail}>
                              <span>Email:</span>
                              <p>{contributor.email}</p>
                            </p>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }
};

export default Empresa;
