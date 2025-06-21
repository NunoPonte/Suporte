/* eslint-disable @typescript-eslint/no-explicit-any */

export function isMobile(): boolean {
  return typeof window !== "undefined" && window.innerWidth < 1000;
}

export function textAreaEmptyCheck(text: string): boolean {
  return (
    !text ||
    text.replace(/<(.|\n)*?>/g, "").trim() === "" ||
    text === "<p></p>" ||
    text === "<p><br></p>"
  );
}
export function sliceTitle(title: string, maxLength: number): string {
  return title
    ? title.length > maxLength
      ? title.slice(0, maxLength).lastIndexOf(" ") > 0
        ? title.slice(0, title.slice(0, maxLength).lastIndexOf(" ")) + "..."
        : title.slice(0, maxLength) + "..."
      : title
    : "Loading...";
}
export function fileType(file: File): string {
  return file.type === "application/pdf"
    ? "/pdf.svg"
    : file.type === "application/vnd.ms-excel" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ? "/excel.svg"
    : "/file.svg";
}
export function aceptedFormats(): { [key: string]: any[] } {
  return {
    "image/*": [],
    "application/pdf": [],
    "application/msword": [], // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      [], // .docx
    "application/vnd.ms-excel": [], // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [], // .xlsx
    "text/plain": [], // .txt
    "application/zip": [], // .zip
    "application/x-rar-compressed": [], // .rar
  };
}
export async function getAssistencias(token: string) {
  const Url = process.env.GET_ASSISTENCIAS || "";
  const InWebPublicKey = process.env.IN_WEB_PUBLIC_KEY || "";
  const response = await fetch(Url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      InWebPublicKey: `${InWebPublicKey}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}
