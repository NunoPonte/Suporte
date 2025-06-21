import Image from "next/image";
import styles from "./page.module.css";
import { Raleway } from "next/font/google";
import LoginInputs from "@/app/components/login-inputs";

const raleway = Raleway({ subsets: ["latin"], weight: ["400", "900"] });

export default function Home() {
  return (
    <main className={`${styles.main} `}>
      <div className={styles.imageContainerHome}>
        <Image
          className={styles.homeImage}
          src="/LoginImage.png"
          alt="Webincode Home Image"
          fill={true}
          priority
        />
        <div className={`${styles.overlay} ${raleway.className}`}>
          <h3>
            “ O valor das coisas não está no tempo que elas duram, mas na
            intensidade com que acontecem.
            <br />
            Por isso existem momentos inesquecíveis, coisas inexplicáveis e
            pessoas incomparáveis. “
          </h3>
          <h2>Amália Rodrigues</h2>
        </div>
      </div>
      <div className={styles.authContainer}>
        <div className={styles.imageContainerLogo}>
          <Image
            src="/WebincodeLogo.png"
            alt="Webincode Logo"
            fill={true}
            priority
          />
        </div>
        <div className={` ${styles.authContainerText} ${raleway.className}`}>
          <h2>Bem-vindo!</h2>
          <p>Faça login introduzindo os seus dados de acesso:</p>
        </div>
        <LoginInputs />
      </div>
    </main>
  );
}
