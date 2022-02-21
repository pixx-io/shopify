import { de } from "../i18n/de";
import { en } from "../i18n/en";

const translationData = { locale: "en" };

export const setLocale = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const localeSegments = urlParams.get("locale").split("-");
  const primaryLocaleSegment = localeSegments[0];
  translationData.locale = primaryLocaleSegment;
};

export const getAvailableLocale = () => {
  const locale = translationData.locale;
  switch (locale) {
    case "de":
      return locale;
    default:
      return "en";
  }
};

// LANGUAGE TRANSLATION
export const tl = (key, variables = []) => {
  let translation = "";

  switch (translationData.locale) {
    case "de":
      translation = de[key] ? de[key] : key;
      break;
    default:
      translation = en[key] ? en[key] : key;
      break;
  }

  if (!variables.length || translation.search("%s") === -1) {
    return translation;
  } else {
    const words = translation.split(" ");
    let replaceIndex = 0;
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      if (word.search("%s") !== -1) {
        words[i] = word.replace("%s", variables[replaceIndex]);
        replaceIndex += 1;
      }
    }
    return words.join(" ");
  }
};

// BYTE TRANSLATION
const units = ["bytes", "KB", "MB", "GB", "TB", "PB"];
const defaultPrecisionMap = {
  bytes: 0,
  KB: 0,
  MB: 2,
  GB: 1,
  TB: 2,
  PB: 2,
};

export const tlByte = (bytes, precision = defaultPrecisionMap) => {
  let unitIndex = 0;

  while (bytes >= 1000) {
    bytes /= 1000;
    unitIndex++;
  }

  bytes = parseFloat(bytes.toString());

  const currentUnit = units[unitIndex];

  if (typeof precision === "number") {
    return `${bytes.toFixed(+precision)} ${currentUnit}`;
  }
  return `${bytes.toFixed(precision[currentUnit])} ${currentUnit}`;
};
