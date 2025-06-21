import styles from "./close-ticket.module.css";
import { useRouter } from "next/navigation";

export default function OpenTicket() {
  const router = useRouter(); 
  return (
    <div className={styles.ticketResolvido}>
      <div className={styles.ticketResolvidoContent}>
        <img src="/certo.svg" alt="Certo resolvido" width={16} height={16} />
        <h1>Ticket resolvido com sucesso, obrigado pelo contacto.</h1>
      </div>
      <div className={styles.buttonsContainer}>
        <button
          className={styles.buttonSairF}
          onClick={() => router.push("/assistencias")}
        >
          Sair
        </button>
      </div>
    </div>
  );
}
