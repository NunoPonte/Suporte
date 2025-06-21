"use client";

import { useState } from "react";
import styles from "./mobile-nav.module.css";
import MobileTerminarSessao from "./mobileTerminarSessao";
import { useRouter } from "next/navigation";

interface MobileNavProps {
  novaVariable?: boolean;
  setNovaVariable?: (value: boolean) => void;
  setHistoricoVariable?: (value: boolean) => void;
  chat?: boolean;
}

export default function MobileNav(
  {
    novaVariable,
    setNovaVariable,
    setHistoricoVariable,
    chat,
  }: MobileNavProps = {
    novaVariable: false,
    setNovaVariable: () => {},
    setHistoricoVariable: () => {},
    chat: false,
  }
) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <nav className={chat ? styles.navChat : styles.nav}>
        <div className={styles.navContent}>
          {novaVariable && (
            <div className={styles.returnArrow}>
              <img
                src="/returnArrow.svg"
                alt="Back Arrow"
                width={16}
                height={16}
                onClick={() => {
                  if (setNovaVariable) {
                    setNovaVariable(false);
                  }
                  if (setHistoricoVariable) {
                    setHistoricoVariable(true);
                  }
                }}
              />
            </div>
          )}
          {chat && (
            <div className={styles.returnArrow}>
              <img
                src="/returnArrow.svg"
                alt="Back Arrow"
                width={16}
                height={16}
                onClick={() => {
                  router.push("/assistencias");
                }}
              />
            </div>
          )}

          <div className={styles.logoContainer}>
            <img
              className={styles.logo}
              src="/HeaderLogo.svg"
              alt="Webincode Logo"
              width={138}
              height={20}
            />
          </div>
          <img
            src="/avatar.svg"
            alt="User Image"
            width={32}
            height={32}
            className={styles.userImage}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          />
        </div>
      </nav>
      <MobileTerminarSessao open={isOpen} setOpen={setIsOpen} />
    </>
  );
}
