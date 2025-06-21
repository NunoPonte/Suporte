/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./nova-assistencia.module.css";
import Select from "./select";

import NovoPedidoIcon from "./svgs/novo-pedido-icon";

import PopupImage from "@/app/components/popupImage";
import TextArea from "@/app/components/text-area";

import {
  textAreaEmptyCheck,
  isMobile,
  aceptedFormats,
  fileType,
} from "@/utils";

type FileWithPreview = File & {
  preview: string;
  width?: number;
  height?: number;
};
const optionsPlataformas = [
  { value: "PHC", label: "PHC" },
  { value: "E-Commerce", label: "E-Commerce" },
  { value: "App", label: "App" },
  { value: "inSales", label: "inSales" },
  { value: "inLogys", label: "inLogys" },
  { value: "Outro", label: "Outro" },
];
const optionsPrioridades = [
  {
    value: "P1 - Urgente (Resolução < 1 dia útil)",
    label: "P1 - Urgente (Resolução < 1 dia útil)",
  },
  {
    value: "P2 - Importante (Resolução 1 a 3 dias úteis)",
    label: "P2 - Importante (Resolução 1 a 3 dias úteis)",
  },
  {
    value: "P3 - Média (Resolução 4 a 8 dias úteis)",
    label: "P3 - Média (Resolução 4 a 8 dias úteis)",
  },
  {
    value: "P4 - Normal (1 a 4 semanas)",
    label: "P4 - Normal (1 a 4 semanas)",
  },
];

function generateNumericHash(length = 20) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

export default function NovaAssistencia(
  props: {
    setAssistencias: (assistencias: any) => void;
    token: string;
  } = {
    setAssistencias: () => {},
    token: "",
  }
) {
  useEffect(() => {
    const offset = window.innerWidth >= 768 ? 570 : 500;
    window.scrollTo({ top: offset, behavior: "smooth" });
  }, []);
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const [nome, setNome] = useState(
    JSON.parse(localStorage.getItem("autosave-nova-nome") || "{}").nome || ""
  );
  const [telemovel, setTelemovel] = useState(
    JSON.parse(localStorage.getItem("autosave-nova-telemovel") || "{}")
      .telemovel || ""
  );
  const [plataforma, setPlataforma] = useState(
    JSON.parse(localStorage.getItem("autosave-nova-plataforma") || "{}")
      .plataforma || null
  );
  const [prioridade, setPrioridade] = useState(
    JSON.parse(localStorage.getItem("autosave-nova-prioridade") || "{}")
      .prioridade || null
  );
  const [notas, setNotas] = useState(
    JSON.parse(localStorage.getItem("autosave-nova-notas") || "{}").notas || ""
  );

  const [nomeError, setNomeError] = useState(false);
  const [telemovelError, setTelemovelError] = useState(false);
  const [plataformaError, setPlataformaError] = useState(false);
  const [notasError, setNotasError] = useState(false);
  const [prioridadeError, setPrioridadeError] = useState(false);

  useEffect(() => {
    localStorage.setItem("autosave-nova-nome", JSON.stringify({ nome }));
  }, [nome]);
  useEffect(() => {
    localStorage.setItem(
      "autosave-nova-telemovel",
      JSON.stringify({ telemovel })
    );
  }, [telemovel]);
  useEffect(() => {
    localStorage.setItem(
      "autosave-nova-plataforma",
      JSON.stringify({ plataforma })
    );
  }, [plataforma]);
  useEffect(() => {
    localStorage.setItem(
      "autosave-nova-prioridade",
      JSON.stringify({ prioridade })
    );
  }, [prioridade]);
  useEffect(() => {
    localStorage.setItem("autosave-nova-notas", JSON.stringify({ notas }));
  }, [notas]);
  const onDrop = <T extends File>(acceptedFiles: T[]) => {
    acceptedFiles.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new window.Image();
          img.onload = () => {
            const fileWithPreview = Object.assign(file, {
              preview: URL.createObjectURL(file),
              width: img.width,
              height: img.height,
            });
            setFiles((prev) => [...prev, fileWithPreview as FileWithPreview]);
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
          width: 48,
          height: 48,
        });
        setFiles((prev) => [...prev, fileWithPreview as FileWithPreview]);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const notasIsEmpty = textAreaEmptyCheck(notas);

    if (
      nome === "" ||
      telemovel === "" ||
      plataforma == null ||
      notasIsEmpty ||
      prioridade == null
    ) {
      setNomeError(nome === "");
      if (telemovel.length !== 9) {
        setTelemovelError(true);
      } else {
        setTelemovelError(telemovel === "");
      }
      setPlataformaError(plataforma == null);
      setNotasError(notasIsEmpty);
      setPrioridadeError(prioridade == null);
      return;
    }
    if (telemovel.length != 9) {
      setTelemovelError(true);
      return;
    }
    if (plataforma == null) {
      setPlataformaError(true);
      return;
    }
    if (prioridade == null) {
      setPrioridadeError(true);
      return;
    }
    setNomeError(false);
    setTelemovelError(false);
    setPlataformaError(false);
    setNotasError(false);
    setPrioridadeError(false);

    const strSacPatHash = generateNumericHash();

    fetch("/api/postAssistencia", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
        InWebPublicKey: `${process.env.NEXT_PUBLIC_IN_WEB_PUBLIC_KEY}`,
      },
      body: JSON.stringify({
        strContactName: nome,
        strMobileNumber: telemovel,
        strPlatform: plataforma?.value,
        strPriority: prioridade?.value,
        strProblem: notas,
        strSacPatHash: strSacPatHash,
      }),
    });

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
          fileData.map(async ({ name, base64 }) => {
            const response = await fetch("/api/postFile", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                InWebPublicKey: `${process.env.NEXT_PUBLIC_IN_WEB_PUBLIC_KEY}`,
              },
              body: JSON.stringify({
              strFilename: name,
              strBase64: base64,
              strTicket: "",
              strSacPatHash: strSacPatHash,
              }),
            });
            const data = await response.json().catch(() => ({}));
            return data;
          })
        );
      } catch (error) {
        console.error("Upload failed:", error);
      }
    };
    if (files.length > 0) {
      uploadFiles(files, props.token);
    }

    fetch("/api/getAssistencias", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${props.token}`,
        InWebPublicKey: `${process.env.NEXT_PUBLIC_IN_WEB_PUBLIC_KEY}`,
        "Content-Type": "application/json",
      },
    });
    setNome("");
    setTelemovel("");
    setPlataforma(null);
    setPrioridade(null);
    setNotas("");
    setFiles([]);
    files.forEach((file) => URL.revokeObjectURL(file.preview));
  };

  const { getInputProps } = useDropzone({
    onDrop,
    accept: aceptedFormats(),
    multiple: true,
    noClick: true,
  });
  const [popupImage, setPopupImage] = useState<string | null>(null);
  const nomeInputRef = useRef<HTMLInputElement>(null);
  const scrollToNomeInput = () => {
    const input = nomeInputRef.current;
    if (input && input.offsetParent !== null) {
      const isMobile = window.innerWidth <= 768;
      const offset = isMobile ? 140 : 40;
      const y = input.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };
  return (
    <>
      <div className={styles.titleContainer}>
        <h1>Novo pedido de assistência</h1>
        <NovoPedidoIcon className={styles.dimensions} />
      </div>
      <form className={styles.nova} onSubmit={handleSubmit}>
        <div className={`${styles.inputsContainer} `}>
          <div className={styles.inputContainer}>
            <label htmlFor="nome">O seu nome</label>
            <input
              id="nome"
              type="text"
              ref={nomeInputRef}
              value={nome}
              onFocus={scrollToNomeInput}
              onChange={(e) => setNome(e.target.value)}
              className={` ${nomeError ? styles.error : ""}`}
            />
            <div
              className={`${styles.errorMessage} ${
                nomeError ? styles.show : ""
              }`}
              id="nomeErrorMessage"
            >
              <p>Por favor insira um nome </p>
            </div>
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="telemovel">Número de telemóvel</label>
            <input
              id="telemovel"
              type="text"
              value={telemovel}
              minLength={9}
              maxLength={9}
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/[^0-9]/g, "").slice(0, 9);
              }}
              onChange={(e) =>
                setTelemovel(e.target.value.replace(/[^0-9]/g, "").slice(0, 9))
              }
              onFocus={scrollToNomeInput}
              className={` ${telemovelError ? styles.error : ""}`}
            />
            <div
              className={`${styles.errorMessage} ${
                telemovelError ? styles.show : ""
              }`}
              id="telemovelErrorMessage"
            >
              <p>Por favor insira um numero de telemovel válido</p>
            </div>
          </div>
          <div className={styles.inputContainer} onFocus={scrollToNomeInput}>
            <label htmlFor="plataforma">Plataforma</label>
            <Select
              options={optionsPlataformas}
              value={plataforma}
              onChange={(option) => {
                setPlataforma(option);
              }}
              placeholder="Plataforma"
              error={plataformaError}
            />
            <div
              className={`${styles.errorMessage} ${
                plataformaError ? styles.show : ""
              }`}
              id="plataformaErrorMessage"
            >
              <p>Por favor insira uma plataforma</p>
            </div>
          </div>
          <div className={styles.inputContainer} onFocus={scrollToNomeInput}>
            <label htmlFor="prioridade">Prioridade</label>
            <Select
              options={optionsPrioridades}
              value={prioridade}
              onChange={(option) => {
                setPrioridade(option);
              }}
              placeholder="Prioridade"
              error={prioridadeError}
            />
            <div
              className={`${styles.errorMessage} ${
                prioridadeError ? styles.show : ""
              }`}
              id="prioridadeErrorMessage"
            >
              <p>Por favor selecione uma prioridade</p>
            </div>
          </div>
          <div className={styles.filePickerContainer}>
            <label htmlFor="filePicker" className={styles.filePickerLabel}>
              Adicionar Ficheiros
            </label>
            {files.length === 0 ? (
              <div className={styles.filePicker} id="filePicker">
                <button
                  type="button"
                  className={styles.customFileLabel}
                  onClick={() => {
                    const input = document.getElementById("fileInput");
                    if (input) (input as HTMLInputElement).click();
                  }}
                >
                  Adicionar Ficheiros
                </button>
                <input
                  {...getInputProps()}
                  id="fileInput"
                  style={{ display: "none" }}
                />
              </div>
            ) : (
              <div className={styles.filePicker2} id="filePicker">
                <div className={styles.previewContainer}>
                  {files.map((file, index) => (
                    <div key={index} className={styles.previewItem}>
                      <div
                        className={styles.previewThumb}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (file.type.startsWith("image/")) {
                            setPopupImage(file.preview);
                          } else {
                            window.open(file.preview, "_blank");
                          }
                        }}
                      >
                        <img
                          src={
                            file.type.startsWith("image/")
                              ? file.preview
                              : fileType(file)
                          }
                          alt="Preview"
                          width={24}
                          height={24}
                          className={styles.previewImage}
                        />
                      </div>
                      <div className={styles.previewInfo}>
                        <span className={styles.previewName}>{file.name}</span>
                      </div>
                      <button
                        type="button"
                        className={styles.previewRemove}
                        onClick={() =>
                          setFiles((prev) => prev.filter((_, i) => i !== index))
                        }
                      >
                        <img
                          src="/X.svg"
                          alt="Remover"
                          width={16}
                          height={16}
                        />
                      </button>
                    </div>
                  ))}
                </div>
                <div className={styles.escolherContainer}>
                  <button
                    type="button"
                    className={styles.customFileLabel}
                    onClick={() => {
                      const input = document.getElementById("fileInput");
                      if (input) (input as HTMLInputElement).click();
                    }}
                  >
                    Adicionar Ficheiros
                  </button>
                </div>
                <input
                  {...getInputProps()}
                  id="fileInput"
                  className={styles.none}
                />
              </div>
            )}
            <div
              className={`${styles.errorMessage} ${styles.none}`}
              id="ficheirosErrorMessage"
            >
              <p>Por favor insira ficheiros</p>
            </div>
          </div>
        </div>

        <div className={styles.textContainer}>
          <label htmlFor="Notas" className={styles.notaLabel}>
            Pedido
          </label>
          <div
            className={`${styles.textAreaContainer} ${
              notasError ? styles.error : ""
            }`}
          >
            <TextArea
              setOutput={setNotas}
              value={notas}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && isMobile()) {
                  e.preventDefault();
                  const form = e.currentTarget.closest("form");
                  if (form) {
                    form.requestSubmit();
                  }
                }
              }}
            />
          </div>
          <div
            className={`${styles.errorMessage} ${
              notasError ? styles.show : ""
            }`}
            id="notasErrorMessage"
          >
            <p>Por favor insira uma descrição</p>
          </div>
        </div>
        <button
          type="button"
          className={styles.buttonCancel2}
          onClick={() => {
            setNome("");
            setTelemovel("");
            setPlataforma(null);
            setPrioridade(null);
            setNotas("");
            setFiles([]);
            files.forEach((file) => URL.revokeObjectURL(file.preview));
          }}
        >
          Cancelar
        </button>
        <button type="submit" className={styles.buttonSubmitDesktop}>
          Enviar
        </button>
      </form>

      <div className={styles.buttonsContainer}>
        <button
          type="button"
          className={styles.buttonCancel}
          onClick={() => {
            setNome("");
            setTelemovel("");
            setPlataforma(null);
            setPrioridade(null);
            setNotas("");
            setFiles([]);
            files.forEach((file) => URL.revokeObjectURL(file.preview));
          }}
        >
          Cancelar
        </button>
        <button
          className={styles.buttonSubmit}
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
          }}
        >
          Enviar
        </button>
      </div>
      <PopupImage popupImage={popupImage} setPopupImage={setPopupImage} />
    </>
  );
}
