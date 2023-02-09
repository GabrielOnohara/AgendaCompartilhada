import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { CompanyContext } from "../../src/context/CompanyContext";
import styles from "../../styles/Company.module.css";

const Empresa: NextPage = () => {

  const router = useRouter();

  const {company} = React.useContext(CompanyContext)

  async function onSubmitLogoutHandler(e:any){
    e.preventDefault();
    console.log("Logout");
    
    const url = "api/companies/logout";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
      });
      if(response.status == 200){
        const {token} = await response.json();
          window.localStorage.setItem(
            "token",
            token,
          );
        router.push("/login")
      }else{
        console.log(response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <div >
      <Head>
        <title>Agenda Compartilhada</title>
        <meta content="text/html;charset=UTF-8" />
        <meta
          name="description"
          content="Aplicativo para sistema automatizado de agendamento"
        />
        <link rel="icon" href="/calendario.ico" />
      </Head>

      <nav className={`navbar navbar-dark navbar-expand-lg bg-body-tertiary ${styles.navbar}`} >
        <div className={`container-fluid ${styles.applySpaceBetween}`}>
          <Link className={`navbar-brand ${styles.companyName} yellowText`} href="/empresa">{company.name}</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-2 mt-lg-2">
              <li className="nav-item">
                <a className="nav-link active mx-2" aria-current="page" href="#">Resumo</a>
              </li>
              <li className="nav-item">
                <a className="nav-link mx-2" href="#">Horários</a>
              </li>
              <li className="nav-item">
                <a className="nav-link mx-2" href="#">Funcionários</a>
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
    </div>
  );
}

export default Empresa;