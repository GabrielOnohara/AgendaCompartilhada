import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import styles from "../../styles/Company.module.css";

const Empresa: NextPage = () => {
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
          <Link className={`navbar-brand ${styles.companyName} yellowText`} href="/empresa">Empresa</Link>
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
            <Link className={`navbar-link ${styles.logoutButton} yellowText`} href="/login">Sair</Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Empresa;