import { NextPage } from "next";
import Head from "next/head";
import React from "react";
import styles from "../../styles/Register.module.css";
import logo from "../../public/calendario.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { TokenContext } from "../../src/context/TokenContext";
import { CompanyContext } from "../../src/context/CompanyContext";
var bcrypt = require('bcryptjs');

const RegisterPage: NextPage = () => {
  
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirmation, setPasswordConfirmation] = React.useState("");
  const [name, setName] = React.useState("");
  const [telefone, setTelefone] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<String[]>([]);
  const [acceptPrivacyPolitics, setAcceptPrivacyPolitics] = React.useState(false);
  const {token, setToken} = React.useContext(TokenContext)
  const {company, setCompany} = React.useContext(CompanyContext)
  const router = useRouter();

  function toggleCheckbox(event: any) {
    setAcceptPrivacyPolitics(event.target.checked);
  }

  async function onSubmitHandler(e:any){
    e.preventDefault();

    const validations = {
      emailIsValid: false,
      passwordLengthIsValid: false,
      passwordsMatches: false,
      privacyPoliticIsAccepted: false
    }

    const validateEmail = (email:string) => {
      var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regexEmail.test(email)
    };

    let data = {
      email: email,
      password: password,
      name: name,
      phone: telefone,
    }

    if(password != passwordConfirmation){
      validations.passwordsMatches= false;
      setErrorMessage((oldValue) => {
        const index = oldValue.indexOf("Senhas não se correspondem");
        if(index >= 0){
          oldValue.splice(index, 1);
        }
        return ([...oldValue, "Senhas não se correspondem"]);
      })
    }else{
      validations.passwordsMatches= true;
      const index = errorMessage.indexOf("Senhas não se correspondem");
      if(index >= 0)
      setErrorMessage((oldValue) => {
        return oldValue.splice(index, 1);
      })
    }

    if(password.length <= 5){
      validations.passwordLengthIsValid = false;
      setErrorMessage((oldValue) => {
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
      setErrorMessage((oldValue) => {
        return oldValue.splice(index, 1);
      })
    }

    if(!validateEmail(email)){
      validations.emailIsValid = false;
      setErrorMessage((oldValue) => {
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
      setErrorMessage((oldValue) => {
        return oldValue.splice(index, 1);
      })
    }

    if(!acceptPrivacyPolitics){
      validations.privacyPoliticIsAccepted = false;
      setErrorMessage((oldValue) => {
        const index = oldValue.indexOf("É necessário aceitar a nossa política de privacidade");
        if(index >= 0){
          oldValue.splice(index, 1);
        }
        return ([...oldValue, "É necessário aceitar a nossa política de privacidade"])
      })
    }else{
      validations.privacyPoliticIsAccepted = true;
      const index = errorMessage.indexOf("É necessário aceitar a nossa política de privacidade");
      if(index >= 0)
      setErrorMessage((oldValue) => {
        return oldValue.splice(index, 1);
      })
    }
    
    if(validations.emailIsValid && validations.passwordsMatches && validations.passwordLengthIsValid && validations.privacyPoliticIsAccepted){
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(data.password, salt);
      data.password = hash;
      const url = "api/companies/create";
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
          if(response.ok){
            const json = await response.json();
          
          window.localStorage.setItem(
            "token",
            json.token,
          );
          setToken(json.token)
          setCompany(json.newCompany)
          router.push("/empresa")
        }else{
          setErrorMessage([response.statusText])
        }
      } catch (error) {
        throw error
      }
    }
    
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
          <form autoComplete="off" method="POST" onSubmit={onSubmitHandler}>
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
              name="passwordConfirmation"
              id="passwordConfirmation"
              value={passwordConfirmation}
              onChange={({ target }) => setPasswordConfirmation(target.value)}
            />
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="acceptPolitics"
                id="acceptPolitics"
                onChange={toggleCheckbox}
                checked={acceptPrivacyPolitics}
              />
              <p>Aceita a nossa política de privacidade</p>
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
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
