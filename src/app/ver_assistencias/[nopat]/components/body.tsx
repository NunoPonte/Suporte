/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable-next-line @next/next/no-img-element */

"use client";

import { useState, useEffect } from "react";
import styles from "./body.module.css";
import Bubble from "./bubble";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

import PopupImage from "@/app/components/popupImage";
import OpenTicket from "./open-ticket";
import CloseTicket from "./close-ticket";
import {
  aceptedFormats,
  fileType,
  isMobile,
  sliceTitle,
  textAreaEmptyCheck,
} from "@/utils";

type FileWithPreview = File & {
  preview: string;
  mensagens?: string[];
};
function base64ToFileWithPreview(
  base64: string,
  name: string,
  type = "application/octet-stream"
): FileWithPreview {
  const byteString = atob(base64);
  const byteArray = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }
  if (
    name.match(
      /\.(png|jpg|jpeg|gif|bmp|webp|svg|pdf|docx?|xlsx?|pptx?|txt|csv|zip|rar|mp3|mp4|avi|mov|wmv|mkv)$/i
    )
  ) {
    type =
      {
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        gif: "image/gif",
        bmp: "image/bmp",
        webp: "image/webp",
        svg: "image/svg+xml",
        pdf: "application/pdf",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        xls: "application/vnd.ms-excel",
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ppt: "application/vnd.ms-powerpoint",
        pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        txt: "text/plain",
        csv: "text/csv",
        zip: "application/zip",
        rar: "application/vnd.rar",
        mp3: "audio/mpeg",
        mp4: "video/mp4",
        avi: "video/x-msvideo",
        mov: "video/quicktime",
        wmv: "video/x-ms-wmv",
        mkv: "video/x-matroska",
      }[name.split(".").pop()!.toLowerCase()] || type;
  }
  const file = new File([byteArray], name, { type });
  const preview = URL.createObjectURL(file);

  return Object.assign(file, { preview }) as FileWithPreview;
}
export default function Body(
  props: {
    token: string;
    mensagens: Array<any>;
    assistenciaData: {
      sobre: string;
      data: Date;
      estado: string;
      numero: string;
      isOpen: boolean;
    };
    files: any[];
  } = {
    token: "",
    mensagens: [],
    assistenciaData: {
      sobre: "",
      data: new Date(),
      estado: "",
      numero: "",
      isOpen: false,
    },
    files: [],
  }
) {
  const decodedFiles: FileWithPreview[] = props.files.map((f) =>
    base64ToFileWithPreview(f.strBase64, f.strFilename)
  );
  const [files, setFiles] = useState<FileWithPreview[]>(decodedFiles || []);
  const [filesChat, setFilesChat] = useState<FileWithPreview[]>([]);
  const [mensagens, setMensagens] = useState<Array<any>>([]);
  const [assistencia, setAssistencia] = useState<any>({});
  const [email, setEmail] = useState<string | null>(null);
  const [popupImage, setPopupImage] = useState<string | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState<string>("");
  const [expand, setExpand] = useState<boolean>(false);
  const mobile = isMobile();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    setEmail(storedEmail);
    setAssistencia(props.assistenciaData);
    setMensagens(props.mensagens);
  }, [props.mensagens, props.assistenciaData]);

  const onDrop = <T extends File>(acceptedFiles: T[]) => {
    const filesWithPreview = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    ) as FileWithPreview[];
    setFilesChat((prevFiles) => [...prevFiles, ...filesWithPreview]);
  };

  function handleFileDisplay(
    file: FileWithPreview | any,
    index: number,
    width: number,
    height: number,
    chat?: boolean
  ) {
    return (
      <div
        key={index}
        style={{ overflow: "hidden" }}
        className={chat ? styles.imageContainer : styles.imageContainerUpper}
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
      >
        {file.type.startsWith("image/") ? (
          <>
            <Image
              src={file.preview}
              alt="Preview"
              width={width}
              height={height}
              className={chat ? styles.previewImage : styles.previewImageUpper}
              onClick={() => setPopupImage(file.preview)}
              style={{ cursor: "pointer" }}
            />
            {chat && hovered == index && (
              <button
                className={styles.removeImageButton}
                onClick={() => {
                  setFilesChat((prevFiles) =>
                    prevFiles.filter((_, i) => i !== index)
                  );
                }}
              >
                <img
                  src="/blueX.svg"
                  alt="Remove"
                  width={16}
                  height={16}
                  className={styles.removeImageIcon}
                />
              </button>
            )}
            {chat && mobile && (
              <button
                className={styles.removeImageButton}
                onClick={() => {
                  setFilesChat((prevFiles) =>
                    prevFiles.filter((_, i) => i !== index)
                  );
                }}
              >
                <img
                  src="/blueX.svg"
                  alt="Remove"
                  width={16}
                  height={16}
                  className={styles.removeImageIcon}
                />
              </button>
            )}
          </>
        ) : (
          <>
            <div
              className={styles.fileIconContainer}
              onClick={() => {
                const link = document.createElement("a");
                link.href = file.preview;
                link.download = file.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              style={{
                width: chat ? width : width - 1,
                height: chat ? height : height - 1,
                cursor: "pointer",
                marginTop: chat ? "5px" : "0px",
              }}
            >
              <img
                src={fileType(file) || "/file.svg"}
                alt="File"
                width={width - (chat ? 2 : 10)}
                height={height - (chat ? 2 : 10)}
                className={styles.previewImage2}
              />
            </div>
            {chat && hovered == index && (
              <button
                className={styles.removeImageButton}
                onClick={() => {
                  setFilesChat((prevFiles) =>
                    prevFiles.filter((_, i) => i !== index)
                  );
                }}
              >
                <img
                  src="/blueX.svg"
                  alt="Remove"
                  width={16}
                  height={16}
                  className={styles.removeImageIcon}
                />
              </button>
            )}
            {chat && mobile && (
              <button
                className={styles.removeImageButton}
                onClick={() => {
                  setFilesChat((prevFiles) =>
                    prevFiles.filter((_, i) => i !== index)
                  );
                }}
              >
                <img
                  src="/blueX.svg"
                  alt="Remove"
                  width={16}
                  height={16}
                  className={styles.removeImageIcon}
                />
              </button>
            )}
          </>
        )}
      </div>
    );
  }
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: aceptedFormats(),
    multiple: true,
    noClick: true,
  });
  function handleSend() {
    const mensagemEmpty = textAreaEmptyCheck(mensagem);

    if (!mensagemEmpty) {
      const newMessage = {
        relatorio: mensagem,
        datahora: new Date().toISOString(),
      };

      fetch("/api/postMensagem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.token}`,
          InWebPublicKey: `${process.env.NEXT_PUBLIC_IN_WEB_PUBLIC_KEY}`,
        },
        body: JSON.stringify({
          nopat: assistencia.numero,
          mensagem: "teste",
          no: "60",
        }),
      });
      if (filesChat.length > 0) {
        const uploadFiles = async (files: File[], token: string) => {
          const readFileAsBase64 = (
            file: File
          ): Promise<{ name: string; base64: string }> => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                const result = reader.result as string;
                const base64 = result.split(",")[1];
                resolve({ name: file.name, base64 });
              };
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
          };

          try {
            const fileData = await Promise.all(files.map(readFileAsBase64));
            await Promise.all(
              fileData.map(({ name, base64 }) =>
                fetch("/api/postFile", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    InWebPublicKey: `${process.env.NEXT_PUBLIC_IN_WEB_PUBLIC_KEY}`,
                  },
                  body: JSON.stringify({
                    strTicket: String(assistencia.numero),
                    strFilename: name,
                    strBase64: base64,
                    strSacPatHash: "",
                  }),
                })
              )
            );
          } catch (error) {
            console.error("Upload failed:", error);
          }
        };
        uploadFiles(filesChat, props.token);
      }
      setMensagens([...mensagens, newMessage]);
      setFiles((prevFiles) => [...prevFiles, ...filesChat]);
      setFilesChat([]);
      setMensagem("");
    }
  }
  if (!assistencia || !mensagens) return;

  return (
    <>
      <div
        className={
          expand
            ? styles.containerExpanded
            : assistencia.isOpen === false
            ? styles.containerClosed
            : styles.container
        }
      >
        <div className={styles.header}>
          <div className={`${styles.column} ${styles.columnSpecial}`}>
            <h1>Pedido sobre</h1>
            <div className={styles.line}></div>
            <h1 className={styles.sobre}>
              {sliceTitle(assistencia.sobre, mobile ? 38 : 30)}
            </h1>
            <div className={styles.line2}></div>
          </div>
          <div className={styles.column}>
            <h1>Data do pedido</h1>
            <h1>{new Date(assistencia.data).toLocaleDateString("pt-PT")}</h1>
          </div>
          <div className={styles.column}>
            <h1>Estado</h1>
            <h1>{assistencia.estado}</h1>
          </div>
          <div className={styles.column}>
            <h1>Número do pedido</h1>
            <h1>{assistencia.numero}</h1>
          </div>
          <div className={`${styles.column} ${styles.columnSpecial2}`}>
            <h1>Ficheiros</h1>
            <div className={styles.filesContainer}>
              {files.map((file, index) =>
                handleFileDisplay(
                  file,
                  index,
                  mobile ? 48 : 90,
                  mobile ? 48 : 90
                )
              )}
            </div>
            <div className={styles.line3}></div>
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.chat}>
            <Bubble
              text={assistencia.sobre}
              data={new Date(assistencia.data)}
              tecnnm={""}
              i={1}
              nome={email || "Cliente"}
            />
            {mensagens.map((mensagem, index) => (
              <Bubble
                key={index}
                text={mensagem.relatorio}
                data={new Date(mensagem.datahora)}
                tecnnm={mensagem.tecnnm}
                i={mensagem.origem === "WIC" ? 0 : 1}
                nome={
                  mensagem.origem === "WIC"
                    ? mensagem.tecnnm
                    : email || "Cliente"
                }
                files={files}
                mhid={mensagem.mhid}
              />
            ))}
          </div>
        </div>
      </div>
      {assistencia.isOpen === true ? (
        <OpenTicket
          setMensagem={setMensagem}
          mensagem={mensagem}
          filesChat={filesChat}
          handleSend={handleSend}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          handleFileDisplay={handleFileDisplay}
          open={open}
          setExpand={setExpand}
          expand={expand}
        />
      ) : (
        <CloseTicket />
      )}

      <PopupImage popupImage={popupImage} setPopupImage={setPopupImage} />
    </>
  );
}
