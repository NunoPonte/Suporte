"use client";

import styles from "./buttons.module.css";
import HistoricoIcon from "./svgs/historico-icon";
import NovoPedidoIcon from "./svgs/novo-pedido-icon";

export default function Buttons({
  historicoVariable,
  setHistoricoVariable,
  novaVariable,
  setNovaVariable,
}: {
  historicoVariable: boolean;
  setHistoricoVariable: (value: boolean) => void;
  novaVariable: boolean;
  setNovaVariable: (value: boolean) => void;
}) {
  function scrollToTop(offsetDesktop: number, offsetMobile: number) {
    const offset = window.innerWidth >= 768 ? offsetDesktop : offsetMobile;
    window.scrollTo({ top: offset, behavior: "smooth" });
  }

  return (
    <div
      className={`${styles.buttonsContainer} ${
        novaVariable ? styles.novaVariable : ""
      }`}
    >
      <button
        onClick={() => {
          if (!historicoVariable) {
            setHistoricoVariable(!historicoVariable);
          }
          setNovaVariable(false);
          scrollToTop(563, 750);
        }}
        className={historicoVariable ? styles.active : ""}
      >
        Histórico de Pedidos de Assistência
        <HistoricoIcon className={styles.dimensions} />
      </button>
      <button
        onClick={() => {
          if (!novaVariable) {
            setNovaVariable(!novaVariable);
          }

          setHistoricoVariable(false);
        }}
        className={novaVariable ? styles.active : ""}
      >
        Novo Pedido de Assistência
        <NovoPedidoIcon className={styles.dimensions} />
      </button>
    </div>
  );
}
