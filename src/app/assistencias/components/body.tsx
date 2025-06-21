/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import styles from "./body.module.css";

import Buttons from "./buttons";
import dynamic from "next/dynamic";
const Historico = dynamic(() => import("./historico"), { ssr: false });
import NovaAssistencia from "./nova-assistencia";
import MobileNav from "@/app/components/mobile-nav";

export default function Body(
  props: {
    assistencias: any;
    token: string;
  } = {
    assistencias: [],
    token: "",
  }
) {
  const [historicoVariable, setHistoricoVariable] = useState(true);
  const [novaVariable, setNovaVariable] = useState(false);
  const [assistencias, setAssistencias] = useState<any>(props.assistencias);

  return (
    <>
      <MobileNav
        novaVariable={novaVariable}
        setNovaVariable={setNovaVariable}
        setHistoricoVariable={setHistoricoVariable}
      />

      <div className={styles.container}>
        <Buttons
          historicoVariable={historicoVariable}
          setHistoricoVariable={setHistoricoVariable}
          novaVariable={novaVariable}
          setNovaVariable={setNovaVariable}
        />
        {historicoVariable && <Historico assistencias={assistencias} />}
        {novaVariable && (
          <NovaAssistencia
            token={props.token}
            setAssistencias={setAssistencias}
          />
        )}
      </div>
    </>
  );
}
