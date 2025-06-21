/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";

import { useRouter } from "next/navigation";
import { Raleway } from "next/font/google";
import styles from "./login-inputs.module.css";
import PasswordIcon from "./svgs/password-icon";
import EmailIcon from "./svgs/email-icon";

const raleway = Raleway({ subsets: ["latin"], weight: ["400", "700"] });

export default function LoginInputs({}) {
  const router = useRouter();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (emailInput !== "" || passwordInput !== "") {
      if (emailInput.includes("@") && passwordInput.length > 0) {
        setErrorEmail(false);
        setErrorPassword(false);

        fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            user: emailInput,
            pwd: passwordInput,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setErrorEmail(false);
              setErrorPassword(false);
              localStorage.setItem("email", emailInput);
              router.push("/assistencias");
            } else {
              setErrorEmail(true);
              setErrorPassword(true);
            }
          })
          .catch((err) => {
            console.error("Failed to fetch:", err);
          });
      } else if (emailInput.includes("@")) {
        setErrorEmail(false);
        setErrorPassword(true);
      } else if (passwordInput.length > 0) {
        setErrorEmail(true);
        setErrorPassword(false);
      }
    } else {
      setErrorEmail(true);
      setErrorPassword(true);
    }
  }
  return (
    <form
      className={`${styles.formContainer} ${raleway.className}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className={styles.inputsContainer}>
        <div className={styles.inputContainer}>
          <label htmlFor="email" className={styles.labelEmail}>
            Email
          </label>
          <div
            className={`${styles.inputImageAppend} ${
              errorEmail ? styles.errorC : ""
            }`}
            id="emailContainer"
          >
            <input
              type="email"
              id="email"
              name="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className={errorEmail ? styles.error : ""}
            />
            <EmailIcon className={styles.inputIconEmail} />
          </div>
        </div>
        <div
          className={`${styles.errorMessage} ${errorEmail ? styles.show : ""}`}
          id="emailError"
        >
          <p>Por favor insira um email válido</p>
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="password">Password</label>
          <div
            className={`${styles.inputImageAppend} ${
              errorPassword ? styles.errorC : ""
            }`}
            id="passwordContainer"
          >
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className={errorPassword ? styles.error : ""}
              ref={passwordInputRef}
            />
            <button
              type="button"
              className={styles.inputIconButton}
              onClick={() => setShowPassword((v) => !v)}
            >
              <PasswordIcon
                visible={showPassword}
                className={styles.inputIconPassword}
              />
            </button>
          </div>
        </div>
        <div
          className={`${styles.errorMessage} ${
            errorPassword ? styles.show : ""
          }`}
          id="passwordError"
        >
          <p>Por favor insira uma password válida</p>
        </div>
      </div>
      <button type="submit" className={styles.button}>
        <div className={raleway.className}>
          INICIAR SESSÃO
          <img className={styles.buttonIcon} src="/lock.svg" alt="Lock Icon" />
        </div>
      </button>
    </form>
  );
}
