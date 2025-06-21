"use client";

import { Hanken_Grotesk } from "next/font/google";
import styles from "./header.module.css";

import { useEffect, useState } from "react";

const HankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-hanken",
});
interface HeaderProps {
  chat?: boolean;
}
export default function Header({ chat }: HeaderProps = { chat: false }) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    setEmail(storedEmail);
  }, []);

  return (
    <div
      className={`${styles.headerContainer} ${HankenGrotesk.className} ${
        chat ? styles.chat : ""
      }`}
    >
      <div className={styles.overlay}>
        <div className={styles.headerContent}>
          <div className={styles.headerUserContainer}>
            <div className={styles.headerUser}>
              <img
                src="/avatar.svg"
                alt="User Image"
                width={50}
                height={50}
                className={styles.userImage}
              />
              {email}
            </div>
            <button
              className={styles.logoutButton}
              onClick={async () => {
                localStorage.removeItem("email");
                await fetch("/api/logout", { method: "POST" });
                window.location.reload();
              }}
            >
              Terminar Sessão
            </button>
          </div>
          <img
            className={styles.headerLogo}
            src="/HeaderLogo.svg"
            alt="Webincode Logo"
            width={162.43}
            height={24}
          />
        </div>
        <h1>
          Olá, aqui pode fazer o seu{" "}
          <span className={styles.mobile}>pedido de suporte {""}</span>
          <span className={styles.desktop}>pedido de suporte {""} <br /></span>
          e acompanhar o seu estado.
        </h1>
      </div>
    </div>
  );
}
