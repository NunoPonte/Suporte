import { Raleway } from "next/font/google";
import Header from "@/app/components/header";
import Body from "@/app/assistencias/components/body";
import NewsletterFooter from "@/app/components/newsletter-footer";
import { cookies } from "next/headers";
import { getAssistencias } from "@/utils";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "900"],
});

export default async function Assistencias() {
  const token = (await cookies()).get("token");
  const assistencias = await getAssistencias(token?.value ?? "");
  return (
    <main className={` ${raleway.className} `}>
      <Header />
      <Body token={token?.value ?? ""} assistencias={assistencias} />
      <NewsletterFooter />
    </main>
  );
}
