import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const VietnamFlag = () => (
  <svg
    width="20"
    height="15"
    viewBox="0 0 20 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="20" height="15" fill="#DA251D" />
    <polygon
      points="10,3.75 11.18,7.64 15.45,7.64 12.14,10.11 13.32,14 10,11.53 6.68,14 7.86,10.11 4.55,7.64 8.82,7.64"
      fill="#FFFF00"
    />
  </svg>
);

const USFlag = () => (
  <svg
    width="20"
    height="15"
    viewBox="0 0 20 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="20" height="15" fill="#B22234" />
    <rect width="20" height="1.15" fill="#FFFFFF" />
    <rect y="2.3" width="20" height="1.15" fill="#FFFFFF" />
    <rect y="4.6" width="20" height="1.15" fill="#FFFFFF" />
    <rect y="6.9" width="20" height="1.15" fill="#FFFFFF" />
    <rect y="9.2" width="20" height="1.15" fill="#FFFFFF" />
    <rect y="11.5" width="20" height="1.15" fill="#FFFFFF" />
    <rect y="13.85" width="20" height="1.15" fill="#FFFFFF" />
    <rect width="8.4" height="8.05" fill="#3C3B6E" />
    <polygon points="0,0 1.4,0 0,1.15" fill="#FFFFFF" />
    <polygon points="0,0 0,1.15 1.4,1.15" fill="#FFFFFF" />
    <polygon points="2.8,0 4.2,0 2.8,1.15" fill="#FFFFFF" />
    <polygon points="2.8,0 2.8,1.15 4.2,1.15" fill="#FFFFFF" />
    <polygon points="5.6,0 7,0 5.6,1.15" fill="#FFFFFF" />
    <polygon points="5.6,0 5.6,1.15 7,1.15" fill="#FFFFFF" />
    <polygon points="0,2.3 1.4,2.3 0,3.45" fill="#FFFFFF" />
    <polygon points="0,2.3 0,3.45 1.4,3.45" fill="#FFFFFF" />
    <polygon points="2.8,2.3 4.2,2.3 2.8,3.45" fill="#FFFFFF" />
    <polygon points="2.8,2.3 2.8,3.45 4.2,3.45" fill="#FFFFFF" />
    <polygon points="5.6,2.3 7,2.3 5.6,3.45" fill="#FFFFFF" />
    <polygon points="5.6,2.3 5.6,3.45 7,3.45" fill="#FFFFFF" />
    <polygon points="0,4.6 1.4,4.6 0,5.75" fill="#FFFFFF" />
    <polygon points="0,4.6 0,5.75 1.4,5.75" fill="#FFFFFF" />
    <polygon points="2.8,4.6 4.2,4.6 2.8,5.75" fill="#FFFFFF" />
    <polygon points="2.8,4.6 2.8,5.75 4.2,5.75" fill="#FFFFFF" />
    <polygon points="5.6,4.6 7,4.6 5.6,5.75" fill="#FFFFFF" />
    <polygon points="5.6,4.6 5.6,5.75 7,5.75" fill="#FFFFFF" />
  </svg>
);

export default function LanguageSwitcher() {
  const { currentLanguage, changeLanguage, t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          {currentLanguage === "vi" ? <VietnamFlag /> : <USFlag />}
          <span className="uppercase">{currentLanguage}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => changeLanguage("vi")}
          className={currentLanguage === "vi" ? "bg-accent" : ""}
        >
          <span className="mr-2">
            <VietnamFlag />
          </span>
          {t("common.vietnamese")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage("en")}
          className={currentLanguage === "en" ? "bg-accent" : ""}
        >
          <span className="mr-2">
            <USFlag />
          </span>
          {t("common.english")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
