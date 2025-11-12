# Hướng dẫn sử dụng i18n (Đa ngôn ngữ)

## Cấu trúc

- `src/i18n/config.ts` - Cấu hình i18next
- `src/i18n/locales/en.json` - Bản dịch tiếng Anh
- `src/i18n/locales/vi.json` - Bản dịch tiếng Việt
- `src/hooks/useTranslation.ts` - Hook để sử dụng translation

## Cách sử dụng

### 1. Sử dụng hook `useTranslation`

```tsx
import { useTranslation } from "@/hooks/useTranslation";

function MyComponent() {
  const { t, currentLanguage, changeLanguage } = useTranslation();

  return (
    <div>
      <h1>{t("home.hero.title")}</h1>
      <p>Current language: {currentLanguage}</p>
      <button onClick={() => changeLanguage("en")}>English</button>
      <button onClick={() => changeLanguage("vi")}>Tiếng Việt</button>
    </div>
  );
}
```

### 2. Sử dụng với Toast Messages

#### Cách 1: Sử dụng hook `useTranslation`

```tsx
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "react-toastify";

function MyComponent() {
  const { t } = useTranslation();

  const handleSuccess = () => {
    toast.success(t("toast.success.applicationSubmitted"));
  };

  const handleError = () => {
    toast.error(t("toast.error.applicationFailed"));
  };
}
```

#### Cách 2: Sử dụng helper `showToast`

```tsx
import { showToast } from "@/utils/toast";

function MyComponent() {
  const handleSuccess = () => {
    showToast.success("toast.success.applicationSubmitted");
  };

  const handleError = () => {
    showToast.error("toast.error.applicationFailed");
  };
}
```

### 3. Thêm translation mới

1. Mở file `src/i18n/locales/vi.json` hoặc `src/i18n/locales/en.json`
2. Thêm key mới vào object tương ứng:

```json
{
  "toast": {
    "success": {
      "myNewMessage": "Thông báo mới của tôi"
    }
  }
}
```

3. Sử dụng trong code:

```tsx
const { t } = useTranslation();
toast.success(t("toast.success.myNewMessage"));
```

## Language Switcher Component

Đã có sẵn component `LanguageSwitcher` để chuyển đổi ngôn ngữ:

```tsx
import LanguageSwitcher from "@/components/LanguageSwitcher";

function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  );
}
```

## Lưu ý

- Ngôn ngữ mặc định là tiếng Việt (`vi`)
- Ngôn ngữ được lưu trong `localStorage` với key `i18nextLng`
- Tất cả các toast messages nên sử dụng translation keys thay vì hardcode text
- Khi thêm translation mới, nhớ thêm vào cả 2 file `en.json` và `vi.json`
