import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Login.module.css";
import logo from "../../public/calendario.png";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
var bcrypt = require('bcryptjs');

const Home: NextPage = () => {  

  const [maintainConnected, setMaintainConnected] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<String[]>([]);
  
  const router = useRouter();

  React.useEffect(() => {
    const lastMaintainChecked =
      window.localStorage.getItem("maintainConnected");
    if (lastMaintainChecked === "true") {
      const lastEmail = window.localStorage.getItem("email");
      const lastPassword = window.localStorage.getItem("password");
      setEmail(lastEmail ?? "");
      setPassword(lastPassword ?? "");
      setMaintainConnected(true);
    }
  }, []);

  function toggleCheckbox(event: any) {
    setMaintainConnected(event.target.checked);
  }

  async function onSubmitHandler(e:any){
    e.preventDefault();
    
    const validations = {
      emailIsValid: false,
      passwordIsValid: false,
    }

    let data = {
      email: email,
      password: password,
    }
    
    if(email.trim().length == 0) {
      validations.emailIsValid = false;
      setErrorMessage((oldValue) => {
        const index = oldValue.indexOf("Insira um email");
        if(index >= 0){
          oldValue.splice(index, 1);
        }
        return ([...oldValue, "Insira um email"]);
      })
    }else{
      validations.emailIsValid = true;
      const index = errorMessage.indexOf("Insira um email");
      if(index >= 0)
      setErrorMessage((oldValue) => {
        return oldValue.splice(index, 1);
      })
    }
    
    if(password.trim().length == 0) {
      validations.passwordIsValid = false;
      setErrorMessage((oldValue) => {
        const index = oldValue.indexOf("Insira uma senha");
        if(index >= 0){
          oldValue.splice(index, 1);
        }
        return ([...oldValue, "Insira uma senha"]);
      })
    }else{
      validations.passwordIsValid = true;
      const index = errorMessage.indexOf("Insira uma senha");
      if(index >= 0)
      setErrorMessage((oldValue) => {
        return oldValue.splice(index, 1);
      })
    }
    
    if(validations.emailIsValid && validations.passwordIsValid){
      const url = "api/companies/auth";
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          },
          body: JSON.stringify(data),
        });
        if(response.status == 200){
          router.push("/empresa")
        }else {
          setErrorMessage([response.statusText])
        }
      } catch (error) {
        console.log(error);
      }
    }

    window.localStorage.setItem(
      "maintainConnected",
      maintainConnected.toString()
    );
    if (maintainConnected) {
      window.localStorage.setItem("email", email);
      window.localStorage.setItem("password", password);
    }
    
  }

  return (
    <div>
      <Head>
        <title>Agenda Compartilhada - Login</title>
        <meta content="text/html;charset=UTF-8" />
        <meta
          name="description"
          content="Aplicativo para sistema automatizado de agendamento"
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
            <h1 className={`${styles.title2} lightText cursive `}>
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
          <h1 className={`${styles.title1}`}>Login</h1>
          <form autoComplete="off" method="POST" onSubmit={onSubmitHandler}>
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
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="saveUsername"
                id="saveUsername"
                onChange={toggleCheckbox}
                checked={maintainConnected}
              />
              <p>Manter-me conectado</p>
            </div>
            {errorMessage && errorMessage.map((errorMessage, index) => <p key={index} className={styles.errorMessage}>{errorMessage}</p>)}
            <div className="centerHorizontal">
              <button
                className="btnDarkBlue"
                type="submit"
                onClick={() => onSubmitHandler}
              >
                Confirmar
              </button>
            </div>
            <div className={styles.registerContainer}>
              <p>Não possui conta ainda?</p>
              <Link href={{pathname: "/cadastro"}} className={`darkBlueText apply-no-underline`}>
                Criar Conta
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Home;
