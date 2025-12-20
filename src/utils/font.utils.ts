import type { FontFamily } from "@/types/resume.type";

export const getFontFamilyName = (font: FontFamily): string => {
  switch (font) {
    case "ARIAL":
      return "Arial, sans-serif";
    case "BAI_JAMJUREE":
      return '"Bai Jamjuree", sans-serif';
    case "BARLOW":
      return "Barlow, sans-serif";
    case "BE_VIETNAM_PRO":
      return '"Be Vietnam Pro", sans-serif';
    case "INTER":
      return "Inter, sans-serif";
    case "LEXEND":
      return "Lexend, sans-serif";
    case "MAITREE":
      return "Maitree, serif";
    case "MONTSERRAT":
      return "Montserrat, sans-serif";
    case "MONTSERRAT_ALTERNATES":
      return '"Montserrat Alternates", sans-serif';
    case "MULISH":
      return "Mulish, sans-serif";
    case "PLUS_JAKARTA_SANS":
      return '"Plus Jakarta Sans", sans-serif';
    case "RALEWAY":
      return "Raleway, sans-serif";
    case "ROBOTO":
      return "Roboto, sans-serif";
    case "ROBOTO_CONDENSED":
      return '"Roboto Condensed", sans-serif';
    case "SOURCE_CODE_PRO":
      return '"Source Code Pro", monospace';
    default:
      return '"Plus Jakarta Sans", sans-serif';
  }
};
