import { NextPage } from "next";
import Head from "next/head";

import styles from "../styles/Company.module.css";

const Empresa: NextPage = () => {
  return (
    <div>
      <h1>Pagina Geral da empresa</h1>
      <Head>
        <title>Agenda Compartilhada</title>
        <meta content="text/html;charset=UTF-8" />
        <meta
          name="description"
          content="Aplicativo para sistema automatizado de agendamento"
        />
        <link rel="icon" href="/calendario.ico" />
      </Head>

    </div>
  );
}

export default Empresa;