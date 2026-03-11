const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const parsePdf = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text || "";
};

const parseDocx = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value || "";
};

const parseResume = async (filePath, mimetype) => {
  if (!filePath || !mimetype) {
    throw new Error("File path and mimetype are required for parsing");
  }

  if (mimetype === "application/pdf") {
    return parsePdf(filePath);
  }

  if (mimetype === DOCX_MIME) {
    return parseDocx(filePath);
  }

  throw new Error("Unsupported file type. Only PDF and DOCX are supported.");
};

module.exports = { parseResume };

