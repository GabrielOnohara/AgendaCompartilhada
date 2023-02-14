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

import styles from "../../styles/Company.module.css";


const Empresa: NextPage = () => {

  const router = useRouter();
  const {token, setToken} = React.useContext(TokenContext)
  const {company, setCompany} = React.useContext(CompanyContext)
  const [menuItemSelected, setMenuItemSelected] = React.useState<string>("resumo");

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
        break;
      default:
        break;
    }
  },[menuItemSelected])

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
                    <Button variant="success">Adicionar</Button>
                  </div>
                </div>
                <div className="teamContent">
                  <Row xs={1} md={2} className="g-4">
                    {Array.from({ length: 4 }).map((_, idx) => (
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
                            <Card.Title>Card title {idx}</Card.Title>
                            <Card.Text>
                              This is a longer card with supporting text below as a natural
                              lead-in to additional content. This content is a little bit
                              longer.
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