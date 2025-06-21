/* eslint-disable @next/next/no-img-element */
import styles from "./bubble.module.css";
import Image from "next/image";

type FileWithPreview = File & {
  preview: string;
};

export default function Bubble(props: {
  text: string;
  data: Date;
  tecnnm: string;
  i: number;
  nome: string;
  files?: FileWithPreview[];
  mhid?: string;
}) {
  return (
    <div className={props.i % 2 === 0 ? styles.bubbleLeft : styles.bubbleRight}>
      {props.i % 2 === 0 && (
        <div className={styles.imageContainer}>
          <Image
            className={styles.bubbleImage}
            src={`/${props.tecnnm.replace(/\s+/g, "")}.webp`}
            alt="Bubble Image"
            width={28}
            height={28}
            priority
          />
        </div>
      )}

      <div id={"bubble"} key={props.i}>
        <label
          htmlFor="bubble"
          className={props.i % 2 === 0 ? styles.padding : styles.textRight}
        >
          {props.data
            .toLocaleString("pt-PT", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
            .replace(",", " |") +
            " | " +
            props.nome +
            (props.i % 2 === 0 ? ` | ${props.mhid} ` : "")}
        </label>
        <div
          className={`${styles.text} ${
            props.i % 2 === 0
              ? styles.backgroundGray
              : styles.backgroundGrayStrong
          }`}
        >
          <div dangerouslySetInnerHTML={{ __html: props.text }}></div>
          {props.files && (
            <div className={styles.filesContainer} style={{ display: "none" }}>
              {props.files.map((file, index) => (
                <div key={index}>
                  {file.type.startsWith("image/") ? (
                    <Image
                      src={file.preview}
                      alt="Preview"
                      width={36}
                      height={36}
                      className={styles.image}
                    />
                  ) : (
                    <img
                      src="file.svg"
                      alt="Preview"
                      width={36}
                      height={36}
                      className={styles.image}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {props.i % 2 !== 0 && (
        <div className={styles.imageContainer}>
          <img
            className={styles.bubbleImage}
            src="/avatar.svg"
            alt="Bubble Image"
            width={28}
            height={28}
          />
        </div>
      )}
    </div>
  );
}
