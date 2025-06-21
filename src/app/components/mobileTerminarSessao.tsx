import styles from "./mobileTerminarSessao.module.css";

interface MobileTerminarSessaoProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function MobileTerminarSessao({
  open,
  setOpen,
}: MobileTerminarSessaoProps) {
  return (
    <>
      <div
        className={`${styles.overlay} ${!open ? styles.overlayHidden : ""}`}
        style={{ pointerEvents: open ? "auto" : "none" }}
        onClick={() => setOpen(false)}
      >
        <div
          className={`${styles.modal} ${!open ? styles.modalHidden : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.closeButton}>
            <img
              src="/mobileX.svg"
              alt="Close"
              width={14}
              height={14}
              className={styles.closeIcon}
              onClick={() => setOpen(false)}
            />
          </button>
          <button
            className={styles.button}
            onClick={async () => {
              localStorage.removeItem("email");
              await fetch("/api/logout", { method: "POST" });
              window.location.reload();
            }}
          >
            Terminar Sessão
          </button>
        </div>
      </div>
    </>
  );
}
