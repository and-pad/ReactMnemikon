import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "../LocalTools/moment"

import {
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFileAlt,
  faFileCode,
} from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import { intervalToDuration } from "date-fns";

const getDiff = (from, to = new Date()) => {
  return intervalToDuration({
    start: new Date(from),
    end: to,
  });
};


export const formatTimeAgo = (date, language) => {
  const diff = getDiff(date);
  let timeAgo = "";

  if (language === "sp") {
    if (diff.years > 0) {
      timeAgo = `hace ${diff.years} ${diff.years === 1 ? "año" : "años"}`;
    } else if (diff.months > 0) {
      timeAgo = `hace ${diff.months} ${diff.months === 1 ? "mes" : "meses"}`;
    } else if (diff.days > 0) {
      timeAgo = `hace ${diff.days} ${diff.days === 1 ? "día" : "días"}`;
    } else if (diff.hours > 0) {
      timeAgo = `hace ${diff.hours} ${diff.hours === 1 ? "hora" : "horas"}`;
    } else if (diff.minutes > 0) {
      timeAgo = `hace ${diff.minutes} ${
        diff.minutes === 1 ? "minuto" : "minutos"
      }`;
    } else {
      timeAgo = `hace unos segundos`;
    }

  } else if (language === "en") {
    if (diff.years > 0) {
      timeAgo = `${diff.years} ${diff.years === 1 ? "year" : "years"} ago`;
    } else if (diff.months > 0) {
      timeAgo = `${diff.months} ${diff.months === 1 ? "month" : "months"} ago`;
    } else if (diff.days > 0) {
      timeAgo = `${diff.days} ${diff.days === 1 ? "day" : "days"} ago`;
    } else if (diff.hours > 0) {
      timeAgo = `${diff.hours} ${diff.hours === 1 ? "hour" : "hours"} ago`;
    } else if (diff.minutes > 0) {
      timeAgo = `${diff.minutes} ${
        diff.minutes === 1 ? "minute" : "minutes"
      } ago`;
    } else {
      timeAgo = `a few seconds ago`;
    }

  } else if (language === "fr") {
    if (diff.years > 0) {
      timeAgo = `il y a ${diff.years} ${diff.years === 1 ? "an" : "ans"}`;
    } else if (diff.months > 0) {
      timeAgo = `il y a ${diff.months} mois`; // mois no cambia
    } else if (diff.days > 0) {
      timeAgo = `il y a ${diff.days} ${diff.days === 1 ? "jour" : "jours"}`;
    } else if (diff.hours > 0) {
      timeAgo = `il y a ${diff.hours} ${diff.hours === 1 ? "heure" : "heures"}`;
    } else if (diff.minutes > 0) {
      timeAgo = `il y a ${diff.minutes} ${
        diff.minutes === 1 ? "minute" : "minutes"
      }`;
    } else {
      timeAgo = `il y a quelques secondes`;
    }
  }

  return timeAgo;
};


export const CopyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success("Texto copiado al portapapeles");
    })
    .catch((err) => {
      toast.error("Error al copiar al portapapeles");
    });
};

export const ClipboardButton = ({ btLabel, btId, btText }) => {
  const buttonRef = useRef(null);

  return (
    <div className="d-flex align-items-center">
      <h6 className="mb-0 me-2">{btLabel} </h6>
      <button
        style={{ fontSize: ".85rem" }}
        ref={buttonRef}
        className="btn btn-link btn-lg p-0 clipboard"
        data-toggle="tooltip"
        title="Copiar al portapapeles"
        data-clipboard-target={`#${btId}`}
      >
        <i className="fa fa-copy" onClick={() => CopyToClipboard(btText)}></i>
      </button>
      <span
        style={{ display: "none" }}
        id={btId}
        dangerouslySetInnerHTML={{ __html: btText.replace(/\n/g, "<br>") }}
      ></span>
    </div>
  );
};

export const toastShow = ({ message, type, id }) => {
  toast[type](message, { toastId: id });
};

export function formatSize(bytes) {
  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(2)} ${units[i]}`;
}

export const formatCurrency = (value) => {
  const formattedValue = parseFloat(value)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  return `$${formattedValue} USD`;
};

export const mimeIcons = {
  "text/plain": faFileAlt,
  "application/pdf": faFilePdf,
  "text/xml": faFileCode,
  "text/html": faFileCode,
  "application/msword": faFileWord,
  "application/vnd.ms-excel": faFileExcel,
  "application/vnd.ms-powerpoint": faFilePowerpoint,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    faFileWord,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    faFileExcel,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    faFilePowerpoint,
};

export const fileTypes = {
  "text/plain": "Text",
  "application/pdf": "PDF",
  "text/xml": "XML",
  "text/html": "HTML",
  "application/msword": "Word",
  "application/vnd.ms-excel": "Excel",
  "application/vnd.ms-powerpoint": "PowerPoint",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "Word",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "PowerPoint",

  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/gif": "GIF",
  "image/bmp": "BMP",
  "image/tiff": "TIFF",
  "image/svg+xml": "SVG",
  "image/webp": "WEBP",
};

export const colorFile = {
  Word: "primary",
  Texto: "secondary",
  Excel: "success",
  PDF: "danger",
  HTML: "cyan",
  XML: "indigo",
  PowerPoint: "pink",
};
