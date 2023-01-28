import { NextPage } from "next";
import Head from "next/head";
import React from "react";
import styles from "../../styles/Register.module.css";
import logo from "../../public/calendario.png";
import Image from "next/image";
import { useRouter } from "next/router";

const RegisterPage: NextPage = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirmation, setPasswordConfirmation] = React.useState("");
  const [name, setName] = React.useState("");
  const [telefone, setTelefone] = React.useState("");
  const [acceptPrivacyPolitics, setAcceptPrivacyPolitics] = React.useState(false);
  const router = useRouter();

  function toggleCheckbox(event: any) {
    setAcceptPrivacyPolitics(event.target.checked);
    console.log(event.target.checked);
  }

  function handlerSubmit(){
    router.push('/empresa')
  }

  return (
    <div>
      <Head>
        <title>Agenda Compartilhada - Cadastro</title>
        <meta content="text/html;charset=UTF-8" />
        <meta
          name="description"
          content="Cadastre sua empresa e começe a utiliza o sistema da Agenda Compartilhada"
        />
        <link rel="icon" href="/calendario.ico" />
      </Head>
      <main className={styles.mainContainer}>
        <div className={styles.description}>
          <div className="centerHorizontal">
            <Image
              src={logo}
              alt="Logo do agenda compartilhada"
              height={150}
              width={150}
              style={{ margin: "10px auto" }}
            />
            <h1 className={`${styles.title2}  lightText cursive `}>
              Agenda Compartilhada
            </h1>
          </div>

          <fieldset className={`${styles.boxExplanation}`}>
            <legend>
              <h3 className={`${styles.title3} yellowText cursive `}>
                Por que usar a agenda compartilhada?
              </h3>
            </legend>
            <ul className={`${styles.lista} yellowText`}>
              <li>Meu negócio necessita de um sistema de agendamento</li>
              <li>
                Quero automatizar todo o processo da escolha de horário pelo
                cliente
              </li>
              <li>Desperdiço muito tempo para organizar minha agenda</li>
            </ul>
          </fieldset>
        </div>
        <div className={`${styles.login} darkBlueText `}>
          <div className="centerHorizontal">
            <h1 className={`title1 darkBlueText`}>Cadastro</h1>
          </div>
          <form autoComplete="off">
            <label htmlFor="name" className="title3">
              Nome da empresa
            </label>
            <input
              className={styles.input}
              type="name"
              name="name"
              id="name"
              value={name}
              onChange={({ target }) => setName(target.value)}
            />
            <label htmlFor="email" className="title3">
              Email
            </label>
            <input
              className={styles.input}
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />
            <label htmlFor="telefone" className="title3">
              Telefone
            </label>
            <input
              className={styles.input}
              type="telefone"
              name="telefone"
              id="telefone"
              value={telefone}
              onChange={({ target }) => setTelefone(target.value)}
            />
            <label htmlFor="password" className="title3">
              Senha
            </label>
            <input
              className={styles.input}
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
            <label htmlFor="password" className="title3">
              Confirmar Senha
            </label>
            <input
              className={styles.input}
              type="password"
              name="password"
              id="password"
              value={passwordConfirmation}
              onChange={({ target }) => setPasswordConfirmation(target.value)}
            />
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="saveUsername"
                id="saveUsername"
                onChange={toggleCheckbox}
                checked={acceptPrivacyPolitics}
              />
              <p>Manter-me conectado</p>
            </div>
            <div className="centerHorizontal">
              <button
                className="btnDarkBlue"
                onClick={() => handlerSubmit}
              >
                Confirmar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
