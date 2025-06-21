import { Hanken_Grotesk } from "next/font/google";
import styles from "./newsletter-footer.module.css";

const HankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-hanken",
});

type InfoItem = { label: string; href?: string; title?: string };

function informacoes(title: string, items: InfoItem[]) {
  return (
    <div className={styles.informacoesContainer}>
      <h1>{title}</h1>
      <div>
        {items.map((item, index) =>
          item.href ? (
            <h6 key={index}>
              <a
                href={item.href}
                className={`${styles.addressLink}`}
                title={item.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label}
              </a>
            </h6>
          ) : (
            <h6 key={index}>{item.label}</h6>
          )
        )}
      </div>
    </div>
  );
}

interface NewsletterFooterProps {
  chat?: boolean;
}

export default function NewsletterFooter({ chat }: NewsletterFooterProps) {
  return (
    <div
      className={`${styles.newsletterFooter} ${HankenGrotesk.className} ${
        chat ? styles.chat : ""
      }`}
    >
      <div className={styles.container}>
        <div className={styles.informacoes}>
          <div className={styles.informacoesContainer}>
            <h1>Webincode</h1>
            <div>
              <h6>
                <a
                  target="_blank"
                  href="https://g.page/webincode?share"
                  className={styles.addressLink}
                  title="Abrir local no maps"
                >
                  R. Prior do Crato 1B, 4900-550
                  <br />
                  Viana do Castelo
                </a>
              </h6>
              <h6>
                <a
                  href="tel:+351258358539"
                  title="Fazer chamada para +351 258 358 539"
                  className={styles.addressLink}
                  target="_blank"
                >
                  +351 258 358 539
                </a>{" "}
                <br />
                <p className={styles.parentheses}>
                  (Chamada para a rede fixa nacional)
                </p>
              </h6>
              <h6>
                <a
                  href="mailto:info@webincode.com"
                  title="Enviar um e-mail para info@webincode.com"
                  className={styles.addressLink}
                  target="_blank"
                >
                  info@webincode.com
                </a>
              </h6>
            </div>
          </div>
          {informacoes("Produtos", [
            {
              label: "inWeb",
              href: "https://webincode.com/inweb",
              title: "inWeb",
            },
            {
              label: "inLogys",
              href: "https://webincode.com/inlogys",
              title: "inLogys",
            },
            {
              label: "inSales",
              href: "https://webincode.com/insales",
              title: "inSales",
            },
            // { label: "inFactory", href: "https://webincode.com/infactory", title: "inFactory" },
            {
              label: "inAnalytics",
              href: "https://webincode.com/inanalytics",
              title: "inAnalytics",
            },
          ])}
          {informacoes("Empresa", [
            {
              label: "Produtos",
              href: "https://webincode.com/produtos",
              title: "Produtos",
            },
            {
              label: "Serviços",
              href: "https://webincode.com/servicos",
              title: "Serviços",
            },
            {
              label: "Casos de sucesso",
              href: "https://webincode.com/casos-sucesso",
              title: "Casos de sucesso",
            },
            {
              label: "Quem somos",
              href: "https://webincode.com/quem-somos",
              title: "Quem somos",
            },
            {
              label: "Jornal",
              href: "https://webincode.com/jornal-digital",
              title: "Jornal",
            },
            {
              label: "Recrutamento",
              href: "https://webincode.com/recrutamento",
              title: "Recrutamento",
            },
            {
              label: "Contactos",
              href: "https://webincode.com/contactos",
              title: "Contactos",
            },
          ])}
          {informacoes("Serviços", [
            {
              label: "Parceiro PHC",
              href: "https://webincode.com/parceiro-phc",
              title: "Parceiro PHC",
            },
            {
              label: "Consultoria informática",
              href: "https://webincode.com/servicos",
              title: "Consultoria informática",
            },
            {
              label: "Desenvolvimento Web",
              href: "https://webincode.com/desenvolvimento-web",
              title: "Desenvolvimento Web",
            },
            {
              label: "Livro de Reclamações",
              href: "https://www.livroreclamacoes.pt/Inicio/",
              title: "Livro de Reclamações",
            },
            {
              label: "Resolução Alternativa de Litígios",
              href: "https://ciab.pt/contactos/",
              title: "Resolução Alternativa de Litígios",
            },
          ])}
        </div>
        <div className={styles.animatedImageWrapper}>
          <img
            className={styles.image}
            src="/WebincodeNewsletter.svg"
            alt="Logo"
            width={789}
            height={118}
          />
        </div>
      </div>
      <footer className={styles.footer}>
        <div className={styles.politicas}>
          <h6>
            <a
              href="https://webincode.com/politica-cookies"
              className={styles.addressLink}
              title="Política de cookies"
            >
              Política de cookies
            </a>
          </h6>
          <h6>
            <a
              href="https://webincode.com/politica-privacidade"
              title="Política de privacidade"
              className={styles.addressLink}
            >
              Política de privacidade
            </a>
          </h6>
        </div>
        <h6>Webincode © All rights reserved.</h6>
      </footer>
    </div>
  );
}
