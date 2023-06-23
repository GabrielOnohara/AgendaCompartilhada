import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Login.module.css";
import logo from "../../public/calendario.png";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { TokenContext } from "../../src/context/TokenContext";
import { CompanyContext } from "../../src/context/CompanyContext";
import { ContribuitorContext } from "../../src/context/ContribuitorContext";

const Home: NextPage = () => {
  const [remindeMe, setRemindeMe] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<String[]>([]);
  const { setToken } = React.useContext(TokenContext);
  const { setCompany } = React.useContext(CompanyContext);
  const { setContribuitor } = React.useContext(ContribuitorContext);
  const router = useRouter();
  const [autoLogin, setAutologin] = React.useState(false);

  React.useEffect(() => {
    const lastMaintainChecked = window.localStorage.getItem("remindeMe");
    if (lastMaintainChecked === "true") {
      const lastEmail = window.localStorage.getItem("email");
      setEmail(lastEmail ?? "");
      setRemindeMe(true);
    }
  }, []);

  // React.useEffect(() => {
  //   if (token) {
  //     setAutologin(true);
  //     try {
  //       setTimeout(() => {
  //         router.push("/empresa");
  //       }, 3000);
  //     } finally {
  //       setAutologin(false);
  //     }
  //   } else {
  //     setAutologin(false);
  //   }
  // }, [router, token]);

  function toggleCheckbox(event: any) {
    setRemindeMe(event.target.checked);
  }

  async function onSubmitHandler(e: any) {
    function showError(message: string) {
      setErrorMessage((oldValue) => {
        const index = oldValue.indexOf(message);
        if (index >= 0) {
          oldValue.splice(index, 1);
        }
        return [...oldValue, message];
      });
    }

    function hideError(message: string) {
      const index = errorMessage.indexOf(message);
      if (index >= 0)
        setErrorMessage((oldValue) => {
          return oldValue.splice(index, 1);
        });
    }

    e.preventDefault();

    const validations = {
      emailIsValid: false,
      passwordIsValid: false,
    };

    let data = {
      email: email,
      password: password,
    };

    if (email.trim().length == 0) {
      validations.emailIsValid = false;
      showError("Insira um email");
    } else {
      validations.emailIsValid = true;
      hideError("Insira um email");
    }

    if (password.trim().length == 0) {
      validations.passwordIsValid = false;
      showError("Insira uma senha");
    } else {
      validations.passwordIsValid = true;
      hideError("Insira uma senha");
    }

    if (validations.emailIsValid && validations.passwordIsValid) {
      const url = "api/auth";
      try {
        console.log(data);
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(data),
        });
        if (response.status == 200) {
          const { token, company, contribuitor } = await response.json();
          console.log(company);
          console.log(contribuitor);
          window.localStorage.setItem("token", token);
          setToken(token);
          if (company) {
            console.log("set company");
            setCompany(company);
            setContribuitor({});
            router.push("/empresa");
          } else if (contribuitor) {
            console.log("set contribuitor");
            setCompany({});
            setContribuitor(contribuitor);
            router.push("/contribuidor");
          } else {
            setErrorMessage([
              "Erro interno: usuário não é empresa nem contribuidor",
            ]);
          }
        } else {
          setErrorMessage([response.statusText]);
        }
      } catch (error) {
        console.log(error);
      }
    }
    window.localStorage.setItem("remindeMe", remindeMe.toString());
    window.localStorage.setItem("email", email);
  }

  function handleEmail(value: string) {
    setEmail(value)
    if (value) {
      setErrorMessage(errorMessage.filter((mensagem) => mensagem !== "Insira um email"))
    }
  }

  function handlePassword(value: string) {
    setPassword(value)
    if (value) {
      setErrorMessage(errorMessage.filter((mensagem) => mensagem !== "Insira uma senha"))
    } else {
      setErrorMessage(errorMessage.filter((mensagem) => mensagem !== "Senha inválida"))
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
              onChange={({ target }) => handleEmail(target.value)}
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
              onChange={({ target }) => handlePassword(target.value)}
            />
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="saveUsername"
                id="saveUsername"
                onChange={toggleCheckbox}
                checked={remindeMe}
              />
              <p>Lembrar de mim</p>
            </div>
            {errorMessage &&
              errorMessage.map((errorMessage, index) => (
                <p key={index} className={styles.errorMessage}>
                  {errorMessage}
                </p>
              ))}
            <div className="centerHorizontal">
              {autoLogin ? (
                <button className="btnDarkBlue" type="submit" disabled>
                  Carregando...
                </button>
              ) : (
                <button
                  className="btnDarkBlue"
                  type="submit"
                  onClick={() => onSubmitHandler}
                >
                  Confirmar
                </button>
              )}
            </div>
            <div className={styles.registerContainer}>
              <p>Não possui conta ainda?</p>
              <Link
                href={{ pathname: "/cadastro" }}
                className={`darkBlueText apply-no-underline`}
              >
                Criar conta
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Home;
