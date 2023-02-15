import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { TokenContext } from "../../src/context/TokenContext";
import { CompanyContext } from "../../src/context/CompanyContext";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import styles from "../../styles/Company.module.css";
var bcrypt = require('bcryptjs');

const Empresa: NextPage = () => {

  const router = useRouter();
  const {token, setToken} = React.useContext(TokenContext)
  const {company, setCompany} = React.useContext(CompanyContext)
  const [menuItemSelected, setMenuItemSelected] = React.useState<string>("resumo");

  const [showAddModal, setShowAddModal] = React.useState(false);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [telefone, setTelefone] = React.useState("");
  const [admin, setAdmin] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<String[]>([]);
  const [errorMessageContribuitor, setErrorMessageContribuitor] = React.useState<String[]>([]);
  const [contribuitors, setContribuitors] = React.useState<any[]>([]);

  function toggleCheckbox(event: any) {
    setAdmin(event.target.checked);
  }

  function companyMenuClick(e:any){
    e.preventDefault();
    setMenuItemSelected("resumo")
  }
  function scheduleMenuClick(e:any){
    e.preventDefault();
    setMenuItemSelected("agenda")
  }
  function teamMenuClick(e:any){
    e.preventDefault();
    setMenuItemSelected("equipe")
  }

  async function onSubmitLogoutHandler(e:any){
    e.preventDefault();
    const url = "api/companies/logout";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
      });
      if(response.status == 200){
        window.localStorage.setItem(
          "token",
          ""
        );
        router.push("/login");
        setTimeout(setCompany({name: ""}),2000)
        setTimeout(setToken(""),2000)
        
      }else{
        console.log(response.statusText);
      }
    } catch (error) {
      throw error
    }
  }

  async function onSubmitAddContribuitor(e:any){
    e.preventDefault();
    const data = {
      email,
      name,
      phone: telefone,
      password,
      isAdmin: admin,
      companyId: company.id,
    }

    const validations = {
      emailIsValid: false,
      passwordLengthIsValid: false,
    }

    const validateEmail = (email:string) => {
      var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regexEmail.test(email)
    };

    if(password.length <= 5){
      validations.passwordLengthIsValid = false;
      setErrorMessageContribuitor((oldValue) => {
        const index = oldValue.indexOf("Senhas devem ter pelo menos seis dígitos");
        if(index >= 0){
          oldValue.splice(index, 1);
        }
        return ([...oldValue, "Senhas devem ter pelo menos seis dígitos"]);
      })
    }else{
      validations.passwordLengthIsValid = true;
      const index = errorMessage.indexOf("Senhas devem ter pelo menos seis dígitos");
      if(index >= 0)
      setErrorMessageContribuitor((oldValue) => {
        return oldValue.splice(index, 1);
      })
    }

    if(!validateEmail(email)){
      validations.emailIsValid = false;
      setErrorMessageContribuitor((oldValue) => {
        const index = oldValue.indexOf("Email inválido");
        if(index >= 0){
          oldValue.splice(index, 1);
        }
        return ([...oldValue, "Email inválido"]);
      })
    }else{
      validations.emailIsValid = true;
      const index = errorMessage.indexOf("Email inválido");
      if(index >= 0)
      setErrorMessageContribuitor((oldValue) => {
        return oldValue.splice(index, 1);
      })
    }

    if(validations.emailIsValid && validations.passwordLengthIsValid){
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(data.password, salt);
      data.password = hash;

      const url = "api/contribuitors/create";
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if(response.ok){
          const {newContribuitor} = await response.json();
          if(newContribuitor){
            refreshTeam(data.companyId);
            setShowAddModal(false);
          }
        }else{
          setErrorMessageContribuitor([response.statusText])
        }
      } catch (error) {
        throw error
      }
    }

  }

  async function refreshTeam(companyID:any) {
    const url = "api/contribuitors/list";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id:companyID}),
      });
      if(response.ok){
        const {contribuitors} = await response.json();
        if(contribuitors){
          setContribuitors(contribuitors)
        }
      }else{
        setErrorMessage([response.statusText])
      }
    } catch (error) {
      throw error
    }
  }

  React.useEffect(()=>{
    async function getCompanyByEmail(email:string){
      try {
        const url = "api/companies/" + email;
        const response = await fetch(url, {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        if(response.status == 200){
          const {company} = await response.json();
          setCompany(company);
        }else {
          setCompany({name: ""});
        }
      } catch (error) {
        console.log(error)
      }
    }
    const token =  window.localStorage.getItem("token");
    const companyEmail =  window.localStorage.getItem("email");
    if(token){
      if(companyEmail){
        getCompanyByEmail(companyEmail)
      }else{
        setCompany({});
      }
    }
  },[router,setCompany])  

  React.useEffect(()=>{
    switch (menuItemSelected) {
      case "resumo": 

        break;
      case "agenda":   
        break;
      case "equipe":  
        refreshTeam(company.id).then(()=>setShowAddModal(false)) 
        break;
      default:
        break;
    }
  },[menuItemSelected,company.id])

  if(token == ""){
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
          <h1>Seu token expirou!</h1>
          <Link className={` yellowText`} href="/login">Voltar ao login </Link>
        </div>
      </div> 
    )
  }else{
    return (
      <div >
        <Head>
          <title>Agenda Compartilhada - {menuItemSelected.charAt(0).toUpperCase() + menuItemSelected.slice(1)}</title>
          <meta content="text/html;charset=UTF-8" />
          <meta
            name="description"
            content="Aplicativo para sistema automatizado de agendamento"
          />
          <link rel="icon" href="/calendario.ico" />
        </Head>
  
        <nav className={`navbar navbar-dark navbar-expand-lg bg-body-tertiary ${styles.navbar}`} >
          <div className={`container-fluid ${styles.applySpaceBetween}`}>
            {company && <Link className={`navbar-brand ${styles.companyName} yellowText`} href="/empresa">{company.name}</Link>}
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mx-auto mb-2 mb-lg-2 mt-lg-2">
                <li className="nav-item">
                  <button
                    className={`nav-link mx-2 ${menuItemSelected == "resumo" ?'active':''} ${styles.menuButton}`}
                    type="button"
                    onClick={companyMenuClick}
                  >
                    Resumo
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link mx-2  ${menuItemSelected == "agenda" ?'active':''} ${styles.menuButton}`}
                    type="button"
                    onClick={scheduleMenuClick}
                  >
                    Agenda
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link mx-2  ${menuItemSelected == "equipe" ?'active':''} ${styles.menuButton}`}
                    type="button"
                    onClick={teamMenuClick}
                  >
                    Equipe
                  </button>
                </li>
              </ul>
              <button
                className={`navbar-link ${styles.logoutButton} yellowText`}
                type="button"
                onClick={onSubmitLogoutHandler}
              >
                Sair
              </button>
            </div>
          </div>
        </nav>
        <main className={styles.mainContainer}>
          {
            menuItemSelected == "resumo" 
            ?
            (
              <div>resumo</div>
            )
            :menuItemSelected == "agenda" 
            ?
            (
              <div>agenda</div>
            ) 
            :
            (
              <div>
                <div className={styles.initialTeamContent}>
                  <h1 className="darkBlueText ">Equipe</h1>
                  <div className={styles.actionContent}>
                    <Button variant="success" onClick={handleShowAddModal}>Adicionar</Button>
                  </div>
                </div>
                <div className="teamContent">
                  <Modal show={showAddModal} onHide={handleCloseAddModal} style={{color: "#034078", fontWeight: "bold"}}>
                    <Modal.Header closeButton >
                      <Modal.Title>Adicionar Contribuidor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                      <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="name@example.com"
                            autoFocus
                            className="bg-white"
                            value={email}
                            onChange={({ target }) => setEmail(target.value)}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                          <Form.Label>Nome</Form.Label>
                          <Form.Control
                            type="name"
                            placeholder="Nome Completo"
                            className="bg-white"
                            value={name}
                            onChange={({ target }) => setName(target.value)}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                          <Form.Label>Telefone</Form.Label>
                          <Form.Control
                            type="phone"
                            placeholder="11999999999"
                            className="bg-white"
                            value={telefone}
                            onChange={({ target }) => setTelefone(target.value)}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                          <Form.Label>Senha</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Senha"
                            className="bg-white"
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                          <Form.Check
                            type="checkbox" label="Usuário é administrador?"
                            onChange={toggleCheckbox}
                            checked={admin}  
                          />
                        </Form.Group>
                        {errorMessageContribuitor && errorMessageContribuitor.map((errorMessage, index) => <p key={index} className={styles.errorMessage}>{errorMessage}</p>)}
                      </Form>
                    </Modal.Body>
                    <Modal.Footer >
                      <Button variant="danger" onClick={handleCloseAddModal}>
                        Cancelar
                      </Button>
                      <Button variant="success" onClick={onSubmitAddContribuitor}>
                        Confirmar
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <Row xs={1} md={2} className="g-4">
                    {contribuitors.map((contribuitor, idx) => (
                      <Col key={idx}>
                        <Card style={{border: "1px solid #034078", color:"#034078"}}>
                          <div className={styles.logoSection}>
                            <Card.Img variant="top" src="/avatarimage.jpg" style={{width: "200px", margin: "20px auto 20x 0px", borderRadius: "50%"}}/>
                            <div className={styles.actionContent}>
                              <Button variant="warning">Editar</Button>
                              <Button variant="danger">Deletar</Button>
                            </div>
                          </div>
                          <Card.Body>
                            <Card.Title style={{fontWeight:"bold"}}>{contribuitor.name}</Card.Title>
                            <Card.Text>
                              <div className={styles.teamPhone}><span>Telefone:</span><p>{contribuitor.phone}</p></div>
                              <div className={styles.teamEmail}><span>Email:</span><p>{contribuitor.email}</p></div>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            )
          }
        </main>
      </div>
    );
  }
 
}

export default Empresa;