/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { JSX } from "react";

import { useRouter } from "next/navigation";
import TextArea from "../../../components/text-area";
import styles from "./open-ticket.module.css";
import AddFiles from "./svgs/add-files";
import { isMobile } from "@/utils";

type FileWithPreview = File & {
  preview: string;
  mensagens?: string[];
};
interface OpenTicketProps {
  setMensagem: React.Dispatch<React.SetStateAction<string>>;
  mensagem: string;
  filesChat: FileWithPreview[];
  handleSend: () => void;
  getRootProps: any;
  getInputProps: any;
  handleFileDisplay: (...args: any[]) => JSX.Element;
  open: () => void;
  setExpand: React.Dispatch<React.SetStateAction<boolean>>;
  expand: boolean;
}

export default function OpenTicket({
  setMensagem,
  mensagem,
  getRootProps,
  getInputProps,
  filesChat,
  handleFileDisplay,
  handleSend,
  open,
  setExpand,
  expand,
}: OpenTicketProps) {
  const router = useRouter();
  const mobile = isMobile();
  return mobile ? (
    <>
      <div
        className={
          expand ? styles.previewContainerExpanded : styles.previewContainer
        }
      >
        {filesChat.map((file, index) =>
          handleFileDisplay(file, index, 40, 40, true)
        )}
      </div>

      <div
        className={expand ? styles.chatContainerExpanded : styles.chatContainer}
      >
        <div className={styles.leftContainer}>
          <button
            className={styles.buttonExpand}
            onClick={() => setExpand(!expand)}
          >
            <img src="/expand.svg" alt="Expand" width={16} height={16} />
          </button>
          <input {...getInputProps()} />
          <button className={styles.buttonFicheiros} onClick={open}>
            <AddFiles />
          </button>
        </div>

        <div className={styles.textAreaContainer}>
          <TextArea
            setOutput={setMensagem}
            value={mensagem}
            className={styles.chatTextArea}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !mobile) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
        </div>

        <button
          id="buttonSend"
          className={styles.buttonSend}
          onClick={() => {
            handleSend();
          }}
        >
          <img src="/enviarMobile.svg" alt="Send" />
        </button>

        <button
          className={styles.buttonSair}
          onClick={() => router.push("/assistencias")}
        >
          Sair
        </button>
      </div>
    </>
  ) : (
    <div className={styles.flex}>
      <div className={styles.eightyPercent}>
        <div className={styles.chatContainer} {...getRootProps()}>
          <div className={styles.textAreaContainer}>
            <TextArea
              setOutput={setMensagem}
              value={mensagem}
              className={styles.chatTextArea}
            />
          </div>
          <div className={styles.bottomContainer}>
            <input {...getInputProps()} />
            <button className={styles.buttonFicheiros} onClick={open}>
              <AddFiles />
            </button>
            <div className={styles.previewContainer}>
              {filesChat.map((file, index) =>
                handleFileDisplay(file, index, 36, 36, true)
              )}
            </div>
            <button
              id="buttonSend"
              className={styles.buttonSend}
              onClick={() => {
                handleSend();
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
      <button
        className={styles.buttonSair}
        onClick={() => router.push("/assistencias")}
      >
        Sair
      </button>
    </div>
  );
}
