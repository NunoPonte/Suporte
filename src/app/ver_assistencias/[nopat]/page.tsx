/* eslint-disable @typescript-eslint/no-explicit-any */

import { Raleway } from "next/font/google";
import Body from "@/app/ver_assistencias/[nopat]/components/body";
import Header from "@/app/components/header";
import NewsletterFooter from "@/app/components/newsletter-footer";
import { redirect } from "next/navigation";

import { getAssistencias } from "@/utils";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "900"],
});

import { cookies } from "next/headers";
import MobileNav from "@/app/components/mobile-nav";

type FetchMensagensParams = {
  token: string;
  assistenciaNumero: string;
};
async function fetchMensagens({
  token,
  assistenciaNumero,
}: FetchMensagensParams) {
  try {
    const res = await fetch(process.env.GET_INTERVENCOES || "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        InWebPublicKey: `${process.env.NEXT_PUBLIC_IN_WEB_PUBLIC_KEY}`,
      },
      body: JSON.stringify({ nopat: assistenciaNumero }),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Failed to fetch:", err);
    throw err;
  }
}
async function fetchFiles({ token, assistenciaNumero }: FetchMensagensParams) {
  try {
    const res = await fetch(process.env.GET_FILES_ENDPOINT || "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        InWebPublicKey: `${process.env.NEXT_PUBLIC_IN_WEB_PUBLIC_KEY}`,
      },
      body: JSON.stringify({ strTicket: assistenciaNumero }),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Failed to fetch:", err);
    throw err;
  }
}

export default async function Assistencias({
  params,
}: {
  params: Promise<{ nopat: string }>;
}) {
  let assistenciaData: {
    sobre: string;
    data: Date;
    estado: string;
    numero: string;
    isOpen: boolean;
  } = {
    sobre: "",
    data: new Date(),
    estado: "",
    numero: "",
    isOpen: false,
  };
  const { nopat } = await params;
  const token = (await cookies()).get("token");
  const assistencias = await getAssistencias(token?.value ?? "");
  const files = await fetchFiles({
    token: token?.value ?? "",
    assistenciaNumero: nopat,
  });
  if (
    !assistencias.some(
      (assistencia: { nopat: string | number }) =>
        String(assistencia.nopat) === String(nopat)
    )
  ) {
    redirect("/assistencias");
  }
  assistencias.map(
    (assistencia: {
      nopat: string;
      problema: any;
      pdata: string | number | Date;
      status: any;
      fechado: any;
    }) => {
      if (String(assistencia.nopat) === String(nopat)) {
        assistenciaData = {
          sobre: assistencia.problema,
          data: new Date(assistencia.pdata),
          estado: assistencia.status,
          numero: assistencia.nopat,
          isOpen: !assistencia.fechado,
        };
      }
    }
  );
  const mensagens = await fetchMensagens({
    token: token?.value ?? "",
    assistenciaNumero: nopat,
  });
  return (
    <main className={raleway.className} style={{ overflowY: "hidden" }}>
      <Header chat={true} />
      <MobileNav chat={true} />
      <Body
        token={token?.value ?? ""}
        mensagens={mensagens}
        assistenciaData={assistenciaData}
        files={files}
      />
      <NewsletterFooter chat={true} />
    </main>
  );
}
