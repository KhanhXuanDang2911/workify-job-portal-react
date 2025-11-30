# Workify API Docs (v1) (last updated: 30/11/2025)

Base URL: http://localhost:8080/workify

- Tiền tố phiên bản API: /api/v1
- Tất cả response đều bọc theo mẫu “Mẫu response chung”.
- Xác thực: gửi Bearer JWT trong header Authorization: Bearer <accessToken> (trừ các endpoint công khai).

## Mẫu response chung

```json
{
  "status": 200,
  "message": "...",
  "data": {}
}
```

- Lỗi (ErrorResponse)

```json
{
  "timestamp": "2025-10-08T11:03:00.7349508",
  "status": 400,
  "path": "/workify/api/v1/...",
  "error": "Bad Request",
  "message": "...",
  "errors": [{ "fieldName": "...", "message": "..." }]
}
```

- Phân trang (PageResponse<T>)

```json
{
  "status": 200,
  "message": "...",
  "data": {
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 1,
    "numberOfElements": 1,
    "items": [
      /* T[] */
    ]
  }
}
```

- JWT Access Token: Authorization: Bearer <token>
- Header riêng cho một số luồng:
  - Y-Token: Refresh Token
  - X-Token: Access Token (sign-out)
  - C-Token: Confirm Email Token
  - R-Token: Reset Password Token
  - CR-Token: Create Password Token
  - G-Code: Google OAuth2 Authorization Code
  - L-Code: LinkedIn OAuth2 Authorization Code
  - User-Agent: Dùng để suy luận thiết bị (mobile/web) trong gửi email. Ví dụ (mobile): ReactNativeApp/1.0 (Android; Mobile)

- Các endpoint permitAll (không yêu cầu JWT):
  - /api/v1/auth/\*\*
  - POST /api/v1/users/sign-up
  - POST /api/v1/employers/sign-up
  - GET /api/v1/employers, GET /api/v1/employers/{id}
  - GET /api/v1/provinces/\*\*
  - GET /api/v1/districts/\*\*
  - GET /api/v1/categories-post/\*\*
  - GET /api/v1/industries/\*\*
  - GET /api/v1/posts/public/\*\*, GET /api/v1/posts/{id}
  - GET /api/v1/jobs/advanced/\*\*
  - GET /api/v1/jobs/locations/popular/\*\*
  - GET /api/v1/jobs/industries/popular/\*\*

- Role-based (method-level): ghi rõ dưới từng API.

## Regex validate chuẩn hóa (Java <-> TypeScript)

- Email
  - Java (Annotation string):
    - `^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,63}[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]{0,253}[a-zA-Z0-9])?\.[a-zA-Z]{2,}$`
  - TypeScript (RegExp literal):
    - `/^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,63}[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]{0,253}[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/`

- Password (8–160, ≥1 hoa, ≥1 thường, ≥1 ký tự đặc biệt)
  - Java: `^(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).{8,160}$`
  - TypeScript: `/^(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).{8,160}$/`

- Verification Code (OTP 8 chữ số)
  - Java: `^[0-9]{8}$`
  - TypeScript: `/^[0-9]{8}$/`

- Số điện thoại VN (+84 hoặc 0, đầu 3/5/7/8/9, 10 số):
  - Java: `^(?:\+84|0)[35789][0-9]{8}$`
  - TypeScript: `/^(?:\+84|0)[35789][0-9]{8}$/`

Lưu ý: Java annotation dùng chuỗi nên phải escape `\`. Sang TypeScript dùng literal `/.../` nên giữ một dấu `\` cho các nhóm cần escape.

---

## 1) Xác thực (Authentication)

Base: /workify/api/v1/auth

### 1.1 Đăng nhập Người dùng

- Path: /users/sign-in
- Method: POST
- Body:

```json
{ "email": "workifyuser@gmail.com", "password": "Workify@123" }
```

- Validate:
  - email: regex Email ở trên
  - password: regex Password ở trên
- Response 200 (TokenResponse<UserResponse>):

```json
{
  "status": 200,
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "data": {
      "id": 1,
      "createdAt": "...",
      "updatedAt": "...",
      "fullName": "...",
      "email": "...",
      "phoneNumber": null,
      "birthDate": null,
      "gender": null,
      "province": {
        "id": 1,
        "createdAt": "2025-10-08T09:35:37.394856",
        "updatedAt": "2025-10-08T09:35:37.394856",
        "code": "1",
        "name": "Hà Nội",
        "engName": "Ha Noi",
        "provinceSlug": "hà-nội",
        "name": "Quận Hoàn Kiếm",
        "districtSlug": "quận-hoàn-kiếm"
      },
      "detailAddress": null,
      "avatarUrl": null,
      "industry": {
        "id": 1,
        "createdAt": "2025-11-29T18:08:24.640686",
        "updatedAt": "2025-11-29T18:08:24.640686",
        "name": "Biên phiên dịch / Thông dịch viên",
        "engName": "Translation / Interpretation",
        "description": null
      },
      "noPassword": false,
      "role": "ADMIN",
      "status": "ACTIVE"
    }
  }
}
```

- Error responses
  - 400 (validate body)

  ```json
  {
    "timestamp": "2025-10-08T11:03:00.7349508",
    "status": 400,
    "path": "/workify/api/v1/auth/users/sign-in",
    "error": "Bad Request",
    "message": "Dữ liệu trong request body không hợp lệ",
    "errors": [
      { "fieldName": "email", "message": "Định dạng email không hợp lệ" },
      {
        "fieldName": "password",
        "message": "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt, độ dài từ 8 đến 160 ký tự"
      }
    ]
  }
  ```

  - 401 (Email hoặc mật khẩu không hợp lệ)
    ```json
    {
      "timestamp": "2025-10-08T11:05:32.878249",
      "status": 401,
      "path": "/workify/api/v1/auth/users/sign-in",
      "error": "Unauthorized",
      "message": "Email hoặc mật khẩu không hợp lệ"
    }
    ```
  - 401 (Tài khoản bị vô hiệu hóa)
    ```json
    {
      "timestamp": "2025-10-08T11:06:32.878249",
      "status": 401,
      "path": "/workify/api/v1/auth/users/sign-in",
      "error": "Unauthorized",
      "message": "Tài khoản đã bị vô hiệu hóa"
    }
    ```
  - 401 (Tài khoản chưa xác nhận email)
    ```json
    {
      "timestamp": "2025-10-08T11:06:32.878249",
      "status": 401,
      "path": "/workify/api/v1/auth/users/sign-in",
      "error": "Unauthorized",
      "message": "Tài khoản đã bị vô hiệu hóa"
    }
    ```

### 1.2 Đăng nhập Nhà tuyển dụng

- Path: /employers/sign-in
- Method: POST
- Body:

```json
{ "email": "hr@example.com", "password": "Workify@123" }
```

- Validate:
  - email: regex Email ở trên
  - password: regex Password ở trên
- Response 200 (TokenResponse<EmployerResponse>):

```json
{
  "status": 200,
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "data": {
      "id": 10,
      "createdAt": "...",
      "updatedAt": "...",
      "email": "hr@example.com",
      "phoneNumber": null,
      "companyName": "ABC Corp",
      "companySize": "SMALL",
      "contactPerson": "Tran Thi C",
      "avatarUrl": null,
      "backgroundUrl": null,
      "employerSlug": "abc-corp",
      "aboutCompany": null,
      "websiteUrls": ["company1.com", "company2.com"],
      "facebookUrl": null,
      "twitterUrl": null,
      "linkedinUrl": null,
      "googleUrl": null,
      "youtubeUrl": null,
      "status": "ACTIVE",
      "province": {
        "id": 1,
        "createdAt": "2025-10-08T09:35:37.394856",
        "updatedAt": "2025-10-08T09:35:37.394856",
        "code": "1",
        "name": "Hà Nội",
        "engName": "Ha Noi",
        "provinceSlug": "hà-nội"
      },
      "district": {
        "id": 2,
        "createdAt": "2025-10-08T09:35:37.440364",
        "updatedAt": "2025-10-08T09:35:37.440364",
        "code": "2",
        "name": "Quận Hoàn Kiếm",
        "districtSlug": "quận-hoàn-kiếm"
      },
      "detailAddress": null
    }
  }
}
```

- Error responses
  - 400 (validate body)
    ```json
    {
      "timestamp": "2025-10-08T11:03:00.7349508",
      "status": 400,
      "path": "/workify/api/v1/auth/employers/sign-in",
      "error": "Bad Request",
      "message": "Dữ liệu trong request body không hợp lệ",
      "errors": [
        { "fieldName": "email", "message": "Định dạng email không hợp lệ" },
        {
          "fieldName": "password",
          "message": "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt, độ dài từ 8 đến 160 ký tự"
        }
      ]
    }
    ```
  - 401 (Email hoặc mật khẩu không hợp lệ)
    ```json
    {
      "timestamp": "2025-10-08T11:05:32.878249",
      "status": 401,
      "path": "/workify/api/v1/auth/employers/sign-in",
      "error": "Unauthorized",
      "message": "Email hoặc mật khẩu không hợp lệ"
    }
    ```
  - 401 (Tài khoản bị vô hiệu hóa)
    ```json
    {
      "timestamp": "2025-10-08T11:06:32.878249",
      "status": 401,
      "path": "/workify/api/v1/auth/employers/sign-in",
      "error": "Unauthorized",
      "message": "Tài khoản đã bị vô hiệu hóa"
    }
    ```
  - 401 (Tài khoản chưa xác nhận email)
    ```json
    {
      "timestamp": "2025-10-08T11:06:32.878249",
      "status": 401,
      "path": "/workify/api/v1/auth/users/sign-in",
      "error": "Unauthorized",
      "message": "Tài khoản đã bị vô hiệu hóa"
    }
    ```

### 1.3 Làm mới token Người dùng

- Path: /users/refresh-token
- Method: POST
- Headers: Y-Token: refreshToken (truyền refresh token thông qua Headers: Y-Token)
- Response 200:

  ```json
  {
    "status": 200,
    "message": "Refresh token thành công",
    "data": { "accessToken": "...", "refreshToken": "..." }
  }
  ```

- Error responses
  - 400 (Thiếu header Y-Token)
    ```json
    {
      "timestamp": "2025-10-08T11:10:00.000",
      "status": 400,
      "path": "/workify/api/v1/auth/employers/refresh-token",
      "error": "Bad Request",
      "message": "Thiếu header: Y-Token"
    }
    ```
  - 401 (Token không hợp lệ/hết hạn)
    ```json
    {
      "timestamp": "2025-10-08T11:11:00.000",
      "status": 401,
      "path": "/workify/api/v1/auth/employers/refresh-token",
      "error": "Unauthorized",
      "message": "Token không hợp lệ"
    }
    ```

### 1.4 Làm mới token Nhà tuyển dụng

- Path: /employers/refresh-token
- Method: POST
- Headers: Y-Token: refreshToken (truyền refresh token thông qua Headers: Y-Token)
- Response 200

```json
{
  "status": 200,
  "message": "Refresh token thành công",
  "data": { "accessToken": "...", "refreshToken": "..." }
}
```

- Error responses
  - 400 (Thiếu header Y-Token)
    ```json
    {
      "timestamp": "2025-10-08T11:10:00.000",
      "status": 400,
      "path": "/workify/api/v1/auth/employers/refresh-token",
      "error": "Bad Request",
      "message": "Thiếu header: Y-Token"
    }
    ```
  - 401 (Token không hợp lệ/hết hạn)
    ```json
    {
      "timestamp": "2025-10-08T11:11:00.000",
      "status": 401,
      "path": "/workify/api/v1/auth/employers/refresh-token",
      "error": "Unauthorized",
      "message": "Token không hợp lệ"
    }
    ```

### 1.5 Đăng xuất (dùng chung cho cả user lẫn employer)

- Path: /sign-out
- Method: POST
- Headers: X-Token: accessToken, Y-Token: refreshToken
  - Success 200
    ```json
    { "status": 200, "message": "Đăng xuất thành công" }
    ```

- Error responses
  - 400 (Thiếu X-Token hoặc Y-Token)
    ```json
    {
      "timestamp": "2025-10-08T11:12:00.000",
      "status": 400,
      "path": "/workify/api/v1/auth/sign-out",
      "error": "Bad Request",
      "message": "Thiếu header: X-Token"
    }
    ```
  - 401 (Token không hợp lệ)
    ```json
    {
      "timestamp": "2025-10-08T11:13:00.000",
      "status": 401,
      "path": "/workify/api/v1/auth/sign-out",
      "error": "Unauthorized",
      "message": "Token không hợp lệ"
    }
    ```
    Lưu ý: dù cho trả về thất bại thì front-end cũng phải thông báo thành công và set người dùng về trạng thái chưa login.

### 1.6 Xác nhận email Người dùng

- Path: /users/verify-email
- Method: PATCH
- Headers: C-Token: confirmToken (được trả về ở email, front-end có thể get qua param, khi tạo tài khoản sẽ có mail gửi về)
- Success 200

  ```json
  { "status": 200, "message": "Xác nhận email thành công" }
  ```

- Error responses
  - 400 (Thiếu C-Token)
    ```json
    {
      "timestamp": "2025-10-08T11:14:00.000",
      "status": 400,
      "path": "/workify/api/v1/auth/users/verify-email",
      "error": "Bad Request",
      "message": "Thiếu header: C-Token"
    }
    ```
  - 401 (Token không hợp lệ/hết hạn)

- Mobile (thay thế)
  - Với ứng dụng mobile, dùng API 1.15 “Xác nhận email Người dùng (mobile)” để xác nhận bằng mã OTP 8 chữ số thay vì link email.
    ```json
    {
      "timestamp": "2025-10-08T11:15:00.000",
      "status": 401,
      "path": "/workify/api/v1/auth/users/verify-email",
      "error": "Unauthorized",
      "message": "Token không hợp lệ"
    }
    ```

### 1.7 Xác nhận email Nhà tuyển dụng

- Path: /employers/verify-email
- Method: PATCH
- Headers: C-Token: confirmToken (được trả về ở email, front-end có thể get qua param, khi tạo tài khoản sẽ có mail gửi về)
- Success 200
  ```json
  { "status": 200, "message": "Xác nhận email thành công" }
  ```
- Error responses (tương tự như mục 1.6)
  - 400 (Thiếu C-Token)
  - 401 (Token không hợp lệ/hết hạn)

- Mobile (thay thế)
  - Với ứng dụng mobile, dùng API 1.16 “Xác nhận email Nhà tuyển dụng (mobile)” để xác nhận bằng mã OTP 8 chữ số thay vì link email.

### 1.8 Quên mật khẩu Người dùng

- Path: /users/forgot-password
- Method: POST
- Headers: User-Agent
- Body:

```json
{ "email": "..." }
```

- Validate: email regex như phần trên.
- Success 200

  ```json
  { "status": 200, "message": "Gửi email đặt lại mật khẩu thành công" }
  ```

- Error responses
  - 400 (validate body khi email không hợp lệ)
  - 411 khi tài khoản bị khoá (Lỗi api sẽ là 500 nhưng lỗi back-end trả về sẽ là 411 nha, lưu ý, nhớ lấy status ở back-end trả về, vì lỗi này tự config chứ k phải lỗi của http)
  - 500 (Lỗi hệ thống – xem mục "Lỗi 500 hệ thống (chung)" ở phần 10)

- Phân luồng theo User-Agent
  - Web (không phải mobile): hệ thống gửi email chứa link và token xác nhận/đặt lại mật khẩu. Người dùng dùng token trong email để gọi API 1.10 “Đặt lại mật khẩu Người dùng” (Header R-Token).
  - Mobile (User-Agent giữ nguyên: ReactNativeApp/1.0 (Android; Mobile)): hệ thống gửi mã OTP 8 chữ số qua email. Người dùng sử dụng API 1.17 “Đặt lại mật khẩu Người dùng (mobile)” với body gồm email, code, newPassword.

### 1.9 Quên mật khẩu Nhà tuyển dụng

- Path: /employers/forgot-password
- Method: POST
- Headers: User-Agent
- Body: { "email": "..." }
- Validate: email regex
- Success 200
  ```json
  { "status": 200, "message": "Gửi email đặt lại mật khẩu thành công" }
  ```
- Error responses: tương tự mục 1.8

  ```
  - 500 (Lỗi hệ thống – xem mục "Lỗi 500 hệ thống (chung)" ở phần 10)
  ```

- Phân luồng theo User-Agent
  - Web (không phải mobile): gửi email chứa link và token đặt lại mật khẩu. Gọi API 1.11 “Đặt lại mật khẩu Nhà tuyển dụng” (Header R-Token).
  - Mobile (User-Agent giữ nguyên: ReactNativeApp/1.0 (Android; Mobile)): hệ thống gửi mã OTP 8 chữ số qua email. Gọi API 1.18 “Đặt lại mật khẩu Nhà tuyển dụng (mobile)” với body gồm email, code, newPassword.

### 1.10 Đặt lại mật khẩu Người dùng

- Path: /users/reset-password
- Method: POST
- Headers: R-Token (lấy resetToken được trả về email khi gửi request lên forgot-password)
- Body:

  ```json
  { "newPassword": "Workify@123" }
  ```

- Validate: password regex
- Success 200

  ```json
  { "status": 200, "message": "Đặt lại mật khẩu thành công" }
  ```

- Error responses
  - 400 (Thiếu R-Token)
    ```json
    {
      "timestamp": "2025-10-08T11:22:00.000",
      "status": 400,
      "path": "/workify/api/v1/auth/users/reset-password",
      "error": "Bad Request",
      "message": "Thiếu header: R-Token"
    }
    ```
  - 400 (Body invalid)
    ```json
    {
      "timestamp": "2025-10-08T11:22:30.000",
      "status": 400,
      "path": "/workify/api/v1/auth/users/reset-password",
      "error": "Bad Request",
      "message": "Dữ liệu trong request body không hợp lệ",
      "errors": [
        {
          "fieldName": "newPassword",
          "message": "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt, độ dài từ 8 đến 160 ký tự"
        }
      ]
    }
    ```
  - 401 (Token không hợp lệ)
    ```json
    {
      "timestamp": "2025-10-08T11:23:00.000",
      "status": 401,
      "path": "/workify/api/v1/auth/users/reset-password",
      "error": "Unauthorized",
      "message": "Token không hợp lệ"
    }
    ```
  - 500 (Lỗi hệ thống – xem mục "Lỗi 500 hệ thống (chung)" ở phần 10)

- Mobile (thay thế)
  - Với ứng dụng mobile, dùng API 1.17 “Đặt lại mật khẩu Người dùng (mobile)” (body: email, code, newPassword).

### 1.11 Đặt lại mật khẩu Nhà tuyển dụng

- Path: /employers/reset-password
- Method: POST
- Headers: R-Token: R-Token (lấy resetToken được trả về email khi gửi request lên forgot-password)
- Body:

  ```json
  { "newPassword": "Workify@123" }
  ```

- Validate: password regex
- Success 200

  ```json
  { "status": 200, "message": "Đặt lại mật khẩu thành công" }
  ```

- Error responses
  - 400 (Thiếu R-Token)
    ```json
    {
      "timestamp": "2025-10-08T11:24:00.000",
      "status": 400,
      "path": "/workify/api/v1/auth/employers/reset-password",
      "error": "Bad Request",
      "message": "Thiếu header: R-Token"
    }
    ```
  - 400 (Body invalid)
    ```json
    {
      "timestamp": "2025-10-08T11:24:30.000",
      "status": 400,
      "path": "/workify/api/v1/auth/employers/reset-password",
      "error": "Bad Request",
      "message": "Dữ liệu trong request body không hợp lệ",
      "errors": [
        {
          "fieldName": "newPassword",
          "message": "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt, độ dài từ 8 đến 160 ký tự"
        }
      ]
    }
    ```
  - 401 (Token không hợp lệ)
    ```json
    {
      "timestamp": "2025-10-08T11:25:00.000",
      "status": 401,
      "path": "/workify/api/v1/auth/employers/reset-password",
      "error": "Unauthorized",
      "message": "Token không hợp lệ"
    }
    ```
  - 500 (Lỗi hệ thống – xem mục "Lỗi 500 hệ thống (chung)" ở phần 10)

- Mobile (thay thế)
  - Với ứng dụng mobile, dùng API 1.18 “Đặt lại mật khẩu Nhà tuyển dụng (mobile)” (body: email, code, newPassword).

### 1.15 Xác nhận email Người dùng (mobile)

- Path: /users/mobile/verify-email
- Method: PATCH
- Body:

  ```json
  { "email": "user@example.com", "code": "12345678" }
  ```

- Validate
  - email: regex Email ở trên
  - code: 8 chữ số (`^[0-9]{8}$`)

- Success 200

  ```json
  { "status": 200, "message": "Xác nhận email thành công" }
  ```

- Error responses
  - 400 (Body invalid)
  - 401 (Mã OTP không hợp lệ/hết hạn hoặc trạng thái tài khoản không phù hợp)

### 1.16 Xác nhận email Nhà tuyển dụng (mobile)

- Path: /employers/mobile/verify-email
- Method: PATCH
- Body:

  ```json
  { "email": "hr@example.com", "code": "12345678" }
  ```

- Validate: tương tự 1.15
- Success 200: `{ "status": 200, "message": "Xác nhận email thành công" }`
- Error responses: tương tự 1.15

### 1.17 Đặt lại mật khẩu Người dùng (mobile)

- Path: /users/mobile/reset-password
- Method: POST
- Body:

  ```json
  {
    "email": "user@example.com",
    "code": "12345678",
    "newPassword": "Workify@123"
  }
  ```

- Validate
  - email: regex Email
  - code: 8 chữ số
  - newPassword: regex Password

- Success 200: `{ "status": 200, "message": "Đặt lại mật khẩu thành công" }`
- Error responses
  - 400 (Body invalid)
  - 401 (Mã OTP không hợp lệ/hết hạn)

### 1.18 Đặt lại mật khẩu Nhà tuyển dụng (mobile)

- Path: /employers/mobile/reset-password
- Method: POST
- Body:

  ```json
  {
    "email": "hr@example.com",
    "code": "12345678",
    "newPassword": "Workify@123"
  }
  ```

- Validate: tương tự 1.17
- Success 200: `{ "status": 200, "message": "Đặt lại mật khẩu thành công" }`
- Error responses: tương tự 1.17

### 1.12 Đăng nhập bằng Google (USER)

- Path: /authenticate/google
- Method: POST
- Headers: G-Code: authorizationCode
- Success 200 (TokenResponse<UserResponse>):
  - Trường hợp A – đã có mật khẩu (noPassword = false): trả về accessToken, refreshToken và UserResponse
  - Trường hợp B – chưa có mật khẩu (noPassword = true): chỉ trả về data chứa createPasswordToken để gọi API 1.14

  ```json
  {
    "status": 200,
    "message": "Đăng nhập thành công",
    "data": {
      "accessToken": "...",
      "refreshToken": "...",
      "data": {
        "id": 2,
        "createdAt": "...",
        "updatedAt": "...",
        "fullName": "Nguyen Van A",
        "email": "user.google@example.com",
        "phoneNumber": null,
        "birthDate": null,
        "gender": null,
        "province": {
          "id": 1,
          "createdAt": "2025-10-08T09:35:37.394856",
          "updatedAt": "2025-10-08T09:35:37.394856",
          "code": "1",
          "name": "Hà Nội",
          "engName": "Ha Noi",
          "provinceSlug": "hà-nội"
        },
        "district": {
          "id": 2,
          "createdAt": "2025-10-08T09:35:37.440364",
          "updatedAt": "2025-10-08T09:35:37.440364",
          "code": "2",
          "name": "Quận Hoàn Kiếm",
          "districtSlug": "quận-hoàn-kiếm"
        },
        "detailAddress": null,
        "avatarUrl": null,
        "noPassword": false,
        "role": "JOB_SEEKER",
        "status": "ACTIVE"
      }
    }
  }
  ```

  ```json
  {
    "status": 200,
    "message": "Xác thực thành công, vui lòng tạo mật khẩu",
    "data": {
      "createPasswordToken": "eyJhbGciOi...CRToken..."
    }
  }
  ```

- Error responses
  - 400 (Thiếu G-Code)
    ```json
    {
      "timestamp": "2025-10-08T11:26:00.000",
      "status": 400,
      "path": "/workify/api/v1/auth/authenticate/google",
      "error": "Bad Request",
      "message": "Thiếu header: G-Code"
    }
    ```
  - 500 (Xác thực OAuth thất bại – lỗi từ nhà cung cấp hoặc xử lý nội bộ)
    ```json
    {
      "timestamp": "2025-10-08T11:29:00.000",
      "status": 500,
      "path": "/workify/api/v1/auth/authenticate/google",
      "error": "Internal Server Error",
      "message": "Xác thực thất bại"
    }
    ```
  - 500 (Lỗi hệ thống – ví dụ: không kết nối được OAuth; xem mục "Lỗi 500 hệ thống (chung)" ở phần 10)

### 1.13 Đăng nhập bằng LinkedIn (USER)

- Path: /authenticate/linkedin
- Method: POST
- Headers: L-Code: authorizationCode
- Success 200 (TokenResponse<UserResponse>):
  - Trường hợp A – đã có mật khẩu (noPassword = false): trả về accessToken, refreshToken và UserResponse
  - Trường hợp B – chưa có mật khẩu (noPassword = true): chỉ trả về data chứa createPasswordToken để gọi API 1.14

  ```json
  {
    "status": 200,
    "message": "Đăng nhập thành công",
    "data": {
      "accessToken": "...",
      "refreshToken": "...",
      "data": {
        "id": 3,
        "createdAt": "...",
        "updatedAt": "...",
        "fullName": "Tran Thi B",
        "email": "user.linkedin@example.com",
        "phoneNumber": null,
        "birthDate": null,
        "gender": null,
        "province": {
          "id": 1,
          "createdAt": "2025-10-08T09:35:37.394856",
          "updatedAt": "2025-10-08T09:35:37.394856",
          "code": "1",
          "name": "Hà Nội",
          "engName": "Ha Noi",
          "provinceSlug": "hà-nội"
        },
        "district": {
          "id": 2,
          "createdAt": "2025-10-08T09:35:37.440364",
          "updatedAt": "2025-10-08T09:35:37.440364",
          "code": "2",
          "name": "Quận Hoàn Kiếm",
          "districtSlug": "quận-hoàn-kiếm"
        },
        "detailAddress": null,
        "avatarUrl": null,
        "noPassword": false,
        "role": "JOB_SEEKER",
        "status": "ACTIVE"
      }
    }
  }
  ```

  ```json
  {
    "status": 200,
    "message": "Xác thực thành công, vui lòng tạo mật khẩu",
    "data": {
      "createPasswordToken": "eyJhbGciOi...CRToken..."
    }
  }
  ```

- Error responses
  - 400 (Thiếu L-Code)
    ```json
    {
      "timestamp": "2025-10-08T11:28:00.000",
      "status": 400,
      "path": "/workify/api/v1/auth/authenticate/linkedin",
      "error": "Bad Request",
      "message": "Thiếu header: L-Code"
    }
    ```
  - 500 (Xác thực OAuth thất bại – lỗi từ nhà cung cấp hoặc xử lý nội bộ)
    ```json
    {
      "timestamp": "2025-10-08T11:29:00.000",
      "status": 500,
      "path": "/workify/api/v1/auth/authenticate/linkedin",
      "error": "Internal Server Error",
      "message": "Xác thực thất bại"
    }
    ```
  - 500 (Lỗi hệ thống – ví dụ: không kết nối được OAuth; xem mục "Lỗi 500 hệ thống (chung)" ở phần 10)

### 1.14 Tạo mật khẩu (trường hợp đăng ký oauth2)

- Path: /create-password
- Method: POST
- Headers: CR-Token
- Body:

```json
{ "password": "Workify@123" }
```

- Success 200 (TokenResponse<UserResponse>):

  ```json
  {
    "status": 200,
    "message": "Tạo mật khẩu thành công",
    "data": {
      "accessToken": "...",
      "refreshToken": "...",
      "data": {
        "id": 2,
        "createdAt": "...",
        "updatedAt": "...",
        "fullName": "Nguyen Van A",
        "email": "user.google@example.com",
        "phoneNumber": null,
        "birthDate": null,
        "gender": null,
        "province": {
          "id": 1,
          "createdAt": "2025-10-08T09:35:37.394856",
          "updatedAt": "2025-10-08T09:35:37.394856",
          "code": "1",
          "name": "Hà Nội",
          "engName": "Ha Noi",
          "provinceSlug": "hà-nội"
        },
        "district": {
          "id": 2,
          "createdAt": "2025-10-08T09:35:37.440364",
          "updatedAt": "2025-10-08T09:35:37.440364",
          "code": "2",
          "name": "Quận Hoàn Kiếm",
          "districtSlug": "quận-hoàn-kiếm"
        },
        "detailAddress": null,
        "avatarUrl": null,
        "noPassword": false,
        "role": "JOB_SEEKER",
        "status": "ACTIVE"
      }
    }
  }
  ```

- Error responses
  - 400 (Thiếu CR-Token)
    ```json
    {
      "timestamp": "2025-10-08T11:30:00.000",
      "status": 400,
      "path": "/workify/api/v1/auth/create-password",
      "error": "Bad Request",
      "message": "Thiếu header: CR-Token"
    }
    ```
  - 400 (password không hợp lệ)
    ```json
    {
      "timestamp": "2025-10-08T11:30:30.000",
      "status": 400,
      "path": "/workify/api/v1/auth/create-password",
      "error": "Bad Request",
      "message": "Dữ liệu trong request body không hợp lệ",
      "errors": [
        {
          "fieldName": "password",
          "message": "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt, độ dài từ 8 đến 160 ký tự"
        }
      ]
    }
    ```
  - 401 (Token không hợp lệ)
    ```json
    {
      "timestamp": "2025-10-08T11:31:00.000",
      "status": 401,
      "path": "/workify/api/v1/auth/create-password",
      "error": "Unauthorized",
      "message": "Token không hợp lệ"
    }
    ```
  - 409 (Đã có mật khẩu trước đó)
    ```json
    {
      "timestamp": "2025-10-08T11:31:30.000",
      "status": 409,
      "path": "/workify/api/v1/auth/create-password",
      "error": "Conflict",
      "message": "Tài khoản đã thiết lập mật khẩu"
    }
    ```

---

## 2) Người dùng (Users)

Base: /workify/api/v1/users

### 2.1 Danh sách người dùng (ADMIN)

- Method: GET
- Query param:
  - pageNumber (>=1), pageSize (>=1)
  - sorts: danh sách trường theo cú pháp field:asc|desc; có thể truyền nhiều bằng dấu phẩy hoặc lặp tham số. Cho phép: fullName, email, phoneNumber, birthDate, gender, avatarUrl, role, status, createdAt, updatedAt
  - keyword: tìm theo fullName hoặc email (không phân biệt hoa thường)
- Auth: Bearer, role ADMIN
  Lưu ý: có thể sort theo fullName, email,phoneNumber, birthDate, gender, avatarUrl, role, status, createdAt, updatedAt
  - Ví dụ:
    - /workify/api/v1/users?pageNumber=1&pageSize=10&sorts=createdAt:desc,fullName:asc&keyword=admin
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách người dùng thành công",
    "data": {
      "pageNumber": 1,
      "pageSize": 10,
      "totalPages": 1,
      "numberOfElements": 1,
      "items": [
        {
          "id": 1,
          "createdAt": "2025-10-08T09:35:39.376171",
          "updatedAt": "2025-10-08T09:35:39.376171",
          "fullName": "System Administrator",
          "email": "admin@example.com",
          "phoneNumber": null,
          "birthDate": null,
          "gender": null,
          "province": {
            "id": 1,
            "createdAt": "2025-10-08T09:35:37.394856",
            "updatedAt": "2025-10-08T09:35:37.394856",
            "code": "1",
            "name": "Hà Nội",
            "engName": "Ha Noi",
            "provinceSlug": "hà-nội"
          },
          "district": {
            "id": 2,
            "createdAt": "2025-10-08T09:35:37.440364",
            "updatedAt": "2025-10-08T09:35:37.440364",
            "code": "2",
            "name": "Quận Hoàn Kiếm",
            "districtSlug": "quận-hoàn-kiếm"
          },
          "detailAddress": null,
          "avatarUrl": null,
          "noPassword": false,
          "role": "ADMIN",
          "status": "ACTIVE"
        }
      ]
    }
  }
  ```
- Error responses
  - 400 (pageNumber/pageSize không hợp lệ): xem mục 10 → “Lỗi 400 (chung)” với errors[pageNumber/pageSize]
  - 401 (Thiếu/Token không hợp lệ)
    ```json
    {
      "timestamp": "2025-10-08T12:05:30.000",
      "status": 401,
      "path": "/workify/api/v1/users",
      "error": "Unauthorized",
      "message": "Token không hợp lệ"
    }
    ```
  - 403 (Không có quyền ADMIN)
    ```json
    {
      "timestamp": "2025-10-08T12:06:00.000",
      "status": 403,
      "path": "/workify/api/v1/users",
      "error": "Forbidden",
      "message": "Không có quyền truy cập"
    }
    ```

### 2.2 Lấy người dùng theo id (ADMIN)

- Path: /{id}
- Method: GET
- Validate: id >= 1
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy thông tin người dùng thành công",
    "data": {
      "id": 1,
      "createdAt": "2025-10-08T09:35:39.376171",
      "updatedAt": "2025-10-08T09:35:39.376171",
      "fullName": "System Administrator",
      "email": "admin@example.com",
      "phoneNumber": null,
      "birthDate": null,
      "gender": null,
      "province": {
        "id": 1,
        "createdAt": "2025-10-08T09:35:37.394856",
        "updatedAt": "2025-10-08T09:35:37.394856",
        "code": "1",
        "name": "Hà Nội",
        "engName": "Ha Noi",
        "provinceSlug": "hà-nội"
      },
      "district": {
        "id": 2,
        "createdAt": "2025-10-08T09:35:37.440364",
        "updatedAt": "2025-10-08T09:35:37.440364",
        "code": "2",
        "name": "Quận Hoàn Kiếm",
        "districtSlug": "quận-hoàn-kiếm"
      },
      "detailAddress": null,
      "avatarUrl": null,
      "industry": {
        "id": 1,
        "createdAt": "2025-11-29T18:08:24.640686",
        "updatedAt": "2025-11-29T18:08:24.640686",
        "name": "Biên phiên dịch / Thông dịch viên",
        "engName": "Translation / Interpretation",
        "description": null
      },
      "noPassword": false,
      "role": "ADMIN",
      "status": "ACTIVE"
    }
  }
  ```
- Error responses
  - 400 (id không hợp lệ)
    ```json
    {
      "timestamp": "2025-10-08T11:40:00.000",
      "status": 400,
      "path": "/workify/api/v1/users/abc",
      "error": "Bad Request",
      "message": "Tham số id phải có kiểu Long"
    }
    ```
    ```json
    {
      "timestamp": "2025-10-08T13:47:48.0340146",
      "status": 400,
      "path": "/workify/api/v1/users/-1",
      "error": "Bad Request",
      "message": "Dữ liệu trong request parameters không hợp lệ",
      "errors": [
        {
          "fieldName": "id",
          "message": "Id phải lớn hơn 0"
        }
      ]
    }
    ```
  - 401 (Thiếu/Token không hợp lệ)
    ```json
    {
      "timestamp": "2025-10-08T12:05:30.000",
      "status": 401,
      "path": "/workify/api/v1/users",
      "error": "Unauthorized",
      "message": "Token không hợp lệ"
    }
    ```
  - 403 (Không có quyền ADMIN)
    ```json
    {
      "timestamp": "2025-10-08T12:06:00.000",
      "status": 403,
      "path": "/workify/api/v1/users",
      "error": "Forbidden",
      "message": "Không có quyền truy cập"
    }
    ```
  - 404 (không tìm thấy): xem mục 10 → “Lỗi 404 (chung)”

### 2.3 Tạo người dùng (ADMIN, multipart form data)

- Method: POST
- Content-Type: multipart/form-data
- Parts:
  - avatar (file ảnh, optional)
  - user (JSON) – UserRequest
- Validate:
  - fullName: 3–160 (bắt buộc)
  - email: regex (bắt buộc)
  - password: regex như trên (bắt buộc)
  - phoneNumber: regex như trên (không bắt buộc, có thể null, nếu có phải đúng regex phone, chuỗi rỗng sẽ gây lỗi)
  - birthDate: dd/MM/yyyy (không bắt buộc, có thể null; nếu có phải đúng định dạng và không được lớn hơn ngày hiện tại)
  - gender: MALE|FEMALE|OTHER (có thể null nhưng nếu truyền phải thoả mãn các giá trị gender)
  - provinceId, districtId: >=1 (nếu có)
  - industryId: >=1 (nếu có)
  - detailAddress: có thể null
  - status: ACTIVE|PENDING|BANNED (bắt buộc)
  - role: ADMIN|JOB_SEEKER (bắt buộc)
  - Body (part `user`) ví dụ
    ```json
    {
      "fullName": "Nguyen Van B",
      "email": "user2@example.com",
      "password": "Workify@123",
      "phoneNumber": "+84912345678",
      "birthDate": "01/01/2000",
      "gender": "MALE",
      "provinceId": 1,
      "districtId": 1,
      "industryId": 1,
      "detailAddress": "123 Đường ABC",
      "status": "ACTIVE",
      "role": "JOB_SEEKER"
    }
    ```
  - Success 201
    ```json
    {
      "status": 201,
      "message": "Tạo người dùng thành công",
      "data": {
        "id": 2,
        "createdAt": "2025-10-08T13:53:46.304282",
        "updatedAt": "2025-10-08T13:53:46.304282",
        "fullName": "Nguyen Van B",
        "email": "user2@example.com",
        "phoneNumber": "+84912345678",
        "birthDate": "2000-01-01",
        "gender": "MALE",
        "province": {
          "id": 1,
          "createdAt": "2025-10-08T09:35:37.394856",
          "updatedAt": "2025-10-08T09:35:37.394856",
          "code": "1",
          "name": "Hà Nội",
          "engName": "Ha Noi",
          "provinceSlug": "hà-nội"
        },
        "district": {
          "id": 2,
          "createdAt": "2025-10-08T09:35:37.440364",
          "updatedAt": "2025-10-08T09:35:37.440364",
          "code": "2",
          "name": "Quận Hoàn Kiếm",
          "districtSlug": "quận-hoàn-kiếm"
        },
        "detailAddress": "123 Đường ABC",
        "avatarUrl": "https://cloudclavis.blob.core.windows.net/workify/0e73306c-d948-4ec9-b6f9-941a509d7736-gaucute.jpg",
        "industry": {
          "id": 1,
          "createdAt": "2025-11-29T18:08:24.640686",
          "updatedAt": "2025-11-29T18:08:24.640686",
          "name": "Biên phiên dịch / Thông dịch viên",
          "engName": "Translation / Interpretation",
          "description": null
        },
        "noPassword": false,
        "role": "JOB_SEEKER",
        "status": "ACTIVE"
      }
    }
    ```
  - Error responses
    - 400 (thiếu part user; avatar không hợp lệ; body invalid)
    - 401, 403 (không có quyền)
    - 409 (Email đã tồn tại)
      ```json
      {
        "timestamp": "2025-10-08T14:02:43.8626344",
        "status": 409,
        "path": "/workify/api/v1/users/1",
        "error": "Conflict",
        "message": "Email user2@example.com đã tồn tại"
      }
      ```
  - 500 (Lỗi hệ thống – xem mục "Lỗi 500 hệ thống (chung)" ở phần 10)

### 2.4 Cập nhật người dùng (ADMIN, multipart form data)

- Path: /{id}
- Method: PUT
- Content-Type: multipart/form-data
- Validate: id >= 1; Body: như mục 2.3 (UserRequest) nhưng password/email không bắt buộc
- Parts: avatar (file, không bắt buộc), user (JSON, bắt buộc)
- Success 200
  ```json
  {
    "status": 200,
    "message": "Cập nhật người dùng thành công",
    "data": {
      "id": 2,
      "createdAt": "2025-10-08T13:53:46.304282",
      "updatedAt": "2025-10-08T14:06:49.053278",
      "fullName": "Nguyen Van B",
      "email": "user2@example.com",
      "phoneNumber": "+84912345678",
      "birthDate": "2000-01-01",
      "gender": "MALE",
      "province": {
        "id": 1,
        "createdAt": "2025-10-08T09:35:37.394856",
        "updatedAt": "2025-10-08T09:35:37.394856",
        "code": "1",
        "name": "Hà Nội",
        "engName": "Ha Noi",
        "provinceSlug": "hà-nội"
      },
      "district": {
        "id": 2,
        "createdAt": "2025-10-08T09:35:37.440364",
        "updatedAt": "2025-10-08T09:35:37.440364",
        "code": "2",
        "name": "Quận Hoàn Kiếm",
        "districtSlug": "quận-hoàn-kiếm"
      },
      "detailAddress": "123 Đường ABC",
      "avatarUrl": "https://cloudclavis.blob.core.windows.net/workify/8d60d9a5-b81b-4409-8ee2-d05203130bda-avatar.jpg",
      "industry": {
        "id": 1,
        "createdAt": "2025-11-29T18:08:24.640686",
        "updatedAt": "2025-11-29T18:08:24.640686",
        "name": "Biên phiên dịch / Thông dịch viên",
        "engName": "Translation / Interpretation",
        "description": null
      },
      "noPassword": false,
      "role": "JOB_SEEKER",
      "status": "ACTIVE"
    }
  }
  ```
- Error responses
  - 400 (thiếu part user; avatar không hợp lệ; body invalid)
  - 400 (id invalid khi id k phải number, id < 1)
  - 401 khi access token k hợp lệ, 403 khi k có quyền admin
  - 404 (không tìm thấy)
    ```json
    {
      "timestamp": "2025-10-08T14:06:59.1812246",
      "status": 404,
      "path": "/workify/api/v1/users/3",
      "error": "Not Found",
      "message": "Không tìm thấy người dùng"
    }
    ```
  - 409 (Email đã tồn tại)
    ```json
    {
      "timestamp": "2025-10-08T14:02:43.8626344",
      "status": 409,
      "path": "/workify/api/v1/users/1",
      "error": "Conflict",
      "message": "Email user2@example.com đã tồn tại"
    }
    ```
  - 500 (Lỗi hệ thống – xem mục "Lỗi 500 hệ thống (chung)" ở phần 10

### 2.5 Xóa người dùng (ADMIN)

- Path: /{id}
- Method: DELETE
- Success 200
  ```json
  { "status": 200, "message": "Xóa người dùng thành công" }
  ```
- Error responses
  - 400 (id invalid khi id k phải number, id < 1)
  - 401 khi access token k hợp lệ, 403 khi k có quyền admin
  - 404 (không tìm thấy)
    ```json
    {
      "timestamp": "2025-10-08T14:06:59.1812246",
      "status": 404,
      "path": "/workify/api/v1/users/3",
      "error": "Not Found",
      "message": "Không tìm thấy người dùng"
    }
    ```

### 2.6 Đăng ký người dùng (public)

- Path: /sign-up
- Method: POST
- Headers: User-Agent
- Body: UserRequest (nhóm OnCreate)

  ```json
  {
    "fullName": "Nguyen Van C",
    "email": "user3@example.com",
    "password": "Workify@123"
  }
  ```

  Tùy chọn: có thể truyền `industryId` để đặt ngành ưu tiên cho người dùng, ví dụ:

  ```json
  {
    "fullName": "Nguyen Van C",
    "email": "user3@example.com",
    "password": "Workify@123",
    "industryId": 1
  }
  ```

- Phân luồng theo User-Agent
  - Web (không phải mobile): hệ thống gửi email kèm link xác nhận. Người dùng xác nhận qua API 1.6 (Header C-Token lấy từ link email).
  - Mobile (User-Agent giữ nguyên: ReactNativeApp/1.0 (Android; Mobile)): hệ thống gửi mã OTP 8 chữ số qua email. Người dùng xác nhận qua API 1.15 (body: email, code).

- Success 201
  ```json
  {
    "status": 201,
    "message": "Đăng ký người dùng thành công, vui lòng kiểm tra email để xác nhận",
    "data": {
      "id": 3,
      "createdAt": "2025-10-08T14:14:13.373689",
      "updatedAt": "2025-10-08T14:14:13.373689",
      "fullName": "Khanh dang",
      "email": "caubesuuca123@gmail.com",
      "phoneNumber": null,
      "birthDate": null,
      "gender": null,
      "province": null,
      "district": null,
      "detailAddress": null,
      "avatarUrl": null,
      "industry": {
        "id": 1,
        "createdAt": "2025-11-29T18:08:24.640686",
        "updatedAt": "2025-11-29T18:08:24.640686",
        "name": "Biên phiên dịch / Thông dịch viên",
        "engName": "Translation / Interpretation",
        "description": null
      },
      "noPassword": false,
      "role": "JOB_SEEKER",
      "status": "PENDING"
    }
  }
  ```
- Error responses
  - 400 (body invalid)
    ```json
    {
      "timestamp": "2025-10-08T12:12:00.000",
      "status": 400,
      "path": "/workify/api/v1/users/sign-up",
      "error": "Bad Request",
      "message": "Dữ liệu trong request body không hợp lệ",
      "errors": [
        { "fieldName": "email", "message": "Định dạng email không hợp lệ" }
      ]
    }
    ```
  - 409 (email tồn tại)
    ```json
    {
      "timestamp": "2025-10-08T14:15:50.1815969",
      "status": 409,
      "path": "/workify/api/v1/users/sign-up",
      "error": "Conflict",
      "message": "Email caubesuuca123@gmail.com đã tồn tại"
    }
    ```
  - 500 (Lỗi hệ thống – xem mục "Lỗi 500 hệ thống (chung)" ở phần 10)

### 2.7 Lấy hồ sơ bản thân (JOB_SEEKER hoặc ADMIN)

- Path: /me
- Method: GET
- Auth: Bearer
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy thông tin người dùng thành công",
    "data": {
      "id": 1,
      "createdAt": "2025-10-08T09:35:39.376171",
      "updatedAt": "2025-10-08T09:35:39.376171",
      "fullName": "System Administrator",
      "email": "admin@example.com",
      "phoneNumber": null,
      "birthDate": null,
      "gender": null,
      "province": null,
      "district": null,
      "detailAddress": null,
      "avatarUrl": null,
      "industry": {
        "id": 1,
        "createdAt": "2025-11-29T18:08:24.640686",
        "updatedAt": "2025-11-29T18:08:24.640686",
        "name": "Biên phiên dịch / Thông dịch viên",
        "engName": "Translation / Interpretation",
        "description": null
      },
      "noPassword": false,
      "role": "ADMIN",
      "status": "ACTIVE"
    }
  }
  ```
- Error responses
  - 401 (chưa đăng nhập/Token không hợp lệ)
    ```json
    {
      "timestamp": "2025-10-08T12:15:00.000",
      "status": 401,
      "path": "/workify/api/v1/users/me",
      "error": "Unauthorized",
      "message": "Token không hợp lệ"
    }
    ```

### 2.8 Cập nhật hồ sơ bản thân (JOB_SEEKER hoặc ADMIN)

- Path: /me
- Method: PUT
- Content-type: application/json
- Body: UserRequest (không chứa file)
  ```json
  {
    "fullName": "string",
    "phoneNumber": "+84774442137",
    "birthDate": "2025-10-08",
    "gender": "string",
    "provinceId": 1,
    "industryId": 1,
    "districtId": 1,
    "detailAddress": "string"
  }
  ```
  Lưu ý: không update được email và password ở api này, chỉ có fullName là bắt buộc, những trường khác có thể có hoặc không, có thể để null, nhưng nếu có thì phải validate đúng như đề cập ở trên
- Success 200
  ```json
  {
    "status": 200,
    "message": "Cập nhật thông tin người dùng thành công",
    "data": {
      "id": 1,
      "createdAt": "2025-10-08T09:35:39.376171",
      "updatedAt": "2025-10-08T09:35:39.376171",
      "fullName": "khanh",
      "email": "admin@example.com",
      "phoneNumber": null,
      "birthDate": "2000-09-08",
      "gender": "FEMALE",
      "province": null,
      "district": null,
      "detailAddress": null,
      "avatarUrl": null,
      "industry": {
        "id": 1,
        "createdAt": "2025-11-29T18:08:24.640686",
        "updatedAt": "2025-11-29T18:08:24.640686",
        "name": "Biên phiên dịch / Thông dịch viên",
        "engName": "Translation / Interpretation",
        "description": null
      },
      "noPassword": false,
      "role": "ADMIN",
      "status": "ACTIVE"
    }
  }
  ```
- Error responses
  - 401 (chưa đăng nhập)
    ```json
    {
      "timestamp": "2025-10-08T12:16:30.000",
      "status": 401,
      "path": "/workify/api/v1/users/me",
      "error": "Unauthorized",
      "message": "Token không hợp lệ"
    }
    ```

### 2.9 Cập nhật ảnh đại diện bản thân (JOB_SEEKER hoặc ADMIN)

- Path: /me/avatar
- Method: PATCH
- Content-Type: multipart/form-data
- Parts: avatar (file, bắt buộc)
- Success 200
  ```json
  {
    "status": 200,
    "message": "Cập nhật ảnh đại diện thành công",
    "data": {
      "id": 1,
      "createdAt": "2025-10-08T09:35:39.376171",
      "updatedAt": "2025-10-08T14:22:34.49648",
      "fullName": "khanh",
      "email": "admin@example.com",
      "phoneNumber": null,
      "birthDate": "2000-09-08",
      "gender": "FEMALE",
      "province": null,
      "district": null,
      "detailAddress": null,
      "avatarUrl": "https://cloudclavis.blob.core.windows.net/workify/5147a43f-2c94-4ec8-9269-5fe5baf8ba0d-princess-mononoke-and-wolf-desktop-wallpaper-4k.jpg",
      "industry": {
        "id": 1,
        "createdAt": "2025-11-29T18:08:24.640686",
        "updatedAt": "2025-11-29T18:08:24.640686",
        "name": "Biên phiên dịch / Thông dịch viên",
        "engName": "Translation / Interpretation",
        "description": null
      },
      "noPassword": false,
      "role": "ADMIN",
      "status": "ACTIVE"
    }
  }
  ```
- Error responses
  - 400 (thiếu part avatar hoặc file không hợp lệ)
    ```json
    {
      "timestamp": "2025-10-08T14:23:50.8530673",
      "status": 500,
      "path": "/workify/api/v1/users/me/avatar",
      "error": "Internal Server Error",
      "message": "Lỗi máy chủ nội bộ"
    }
    ```
  - 401
    ```json
    {
      "timestamp": "2025-10-08T12:09:30.000",
      "status": 401,
      "path": "/workify/api/v1/users/me/avatar",
      "error": "Unauthorized",
      "message": "Token không hợp lệ"
    }
    ```

### 2.10 Đổi mật khẩu bản thân (JOB_SEEKER hoặc ADMIN)

- Path: /me/password
- Method: PATCH
- Body:

```json
{ "currentPassword": "...", "newPassword": "..." }
```

- Validate: cả 2 theo regex Password
- Success 200
  ```json
  { "status": 200, "message": "Cập nhật mật khẩu thành công" }
  ```
- Error responses
  - 400 (body invalid)
    ```json
    {
      "timestamp": "2025-10-08T12:17:00.000",
      "status": 400,
      "path": "/workify/api/v1/users/me/password",
      "error": "Bad Request",
      "message": "Dữ liệu trong request body không hợp lệ",
      "errors": [
        { "fieldName": "newPassword", "message": "Mật khẩu không hợp lệ" }
      ]
    }
    ```
  - 401 (chưa đăng nhập)
    ```json
    {
      "timestamp": "2025-10-08T12:17:30.000",
      "status": 401,
      "path": "/workify/api/v1/users/me/password",
      "error": "Unauthorized",
      "message": "Token không hợp lệ"
    }
    ```
  - 411 (mật khẩu hiện tại không khớp)
  ```json
  {
    "timestamp": "2025-10-08T12:17:30.000",
    "status": 411,
    "path": "/workify/api/v1/users/me/password",
    "error": "Mật khẩu hiện tại không khớp",
    "message": "Mật khẩu hiện tại không khớp"
  }
  ```

---

## 3) Nhà tuyển dụng (Employers)

Base: /workify/api/v1/employers

### 3.1 Danh sách NTD (public sẽ get được danh sách employer có status active, còn admin sẽ get được all trạng thái)

- Method: GET
- Query:
  - pageNumber (>=1), pageSize (>=1)
  - sorts: cú pháp field:asc|desc; whitelist: companyName, companySize, status, email, createdAt, updatedAt, province.name, district.name
  - keyword: tìm theo companyName hoặc email (không phân biệt hoa thường)
  - companySize: enum theo label, hợp lệ: LESS_THAN_10, FROM_10_TO_24, FROM_25_TO_99, FROM_100_TO_499, FROM_500_TO_999, FROM_1000_TO_4999, FROM_5000_TO_9999, FROM_10000_TO_19999, FROM_20000_TO_49999, MORE_THAN_50000
  - provinceId: >=1 (lọc theo tỉnh)
- Giá trị companySize hợp lệ
  LESS_THAN_10,
  FROM_10_TO_24,
  FROM_25_TO_99,
  FROM_100_TO_499,
  FROM_500_TO_999,
  FROM_1000_TO_4999,
  FROM_5000_TO_9999,
  FROM_10000_TO_19999,
  FROM_20000_TO_49999,
  MORE_THAN_50000;

* sorts: ví dụ: sorts=createdAt:desc,updatedAt:asc,province.name:asc
* keyword: tìm theo companyName hoặc email
  Lưu ý: có thể sort theo companyName, companySize, status, email, createdAt, updatedAt, province.name, district.name
* Ví dụ truy vấn:
  - /workify/api/v1/employers?pageNumber=1&pageSize=10&sorts=createdAt:desc,province.name:asc&keyword=company
  - /workify/api/v1/employers?companySize=FROM_100_TO_499&provinceId=1

- Auth: Public xem chỉ các employer ACTIVE; ADMIN xem được tất cả trạng thái
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách nhà tuyển dụng thành công",
    "data": {
      "pageNumber": 1,
      "pageSize": 10,
      "totalPages": 1,
      "numberOfElements": 1,
      "items": [
        {
          "id": 1,
          "createdAt": "2025-10-08T14:26:46.006378",
          "updatedAt": "2025-10-08T14:26:46.006378",
          "email": "caubesuuca32@gmail.com",
          "phoneNumber": "0975704208",
          "companyName": "string",
          "companySize": "LESS_THAN_10",
          "contactPerson": "string",
          "avatarUrl": null,
          "backgroundUrl": null,
          "employerSlug": "string",
          "aboutCompany": "string",
          "websiteUrls": ["facebook", "google"],
          "facebookUrl": "string",
          "twitterUrl": "string",
          "linkedinUrl": "string",
          "googleUrl": "string",
          "youtubeUrl": "string",
          "status": "ACTIVE",
          "province": {
            "id": 1,
            "createdAt": "2025-10-08T09:35:37.394856",
            "updatedAt": "2025-10-08T09:35:37.394856",
            "code": "1",
            "name": "Hà Nội",
            "engName": "Ha Noi",
            "provinceSlug": "hà-nội"
          },
          "district": {
            "id": 1,
            "createdAt": "2025-10-08T09:35:37.434183",
            "updatedAt": "2025-10-08T09:35:37.434183",
            "code": "1",
            "name": "Quận Ba Đình",
            "districtSlug": "quận-ba-đình"
          },
          "detailAddress": "string"
        }
      ]
    }
  }
  ```
- Error responses
  - 400 (pageNumber/pageSize không hợp lệ): xem mục 9 → “Lỗi 400 (chung)” với errors[pageNumber/pageSize]
    ```json
    {
      "timestamp": "2025-10-08T14:33:32.3069585",
      "status": 400,
      "path": "/workify/api/v1/employers",
      "error": "Bad Request",
      "message": "Dữ liệu trong request parameters không hợp lệ",
      "errors": [
        {
          "fieldName": "companySize",
          "message": "Quy mô công ty không hợp lệ"
        }
      ]
    }
    ```
  - 401 (Thiếu/Token không hợp lệ)
    ```json
    {
      "timestamp": "2025-10-08T12:05:30.000",
      "status": 401,
      "path": "/workify/api/v1/users",
      "error": "Unauthorized",
      "message": "Token không hợp lệ"
    }
    ```
  - 403 (Không có quyền ADMIN)
    ```json
    {
      "timestamp": "2025-10-08T12:06:00.000",
      "status": 403,
      "path": "/workify/api/v1/users",
      "error": "Forbidden",
      "message": "Không có quyền truy cập"
    }
    ```

### 3.2 Lấy nhà tuyển dụng theo id (public)

- Path: /{id}
- Method: GET
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy thông tin nhà tuyển dụng thành công",
    "data": {
      "id": 1,
      "createdAt": "2025-10-08T14:26:46.006378",
      "updatedAt": "2025-10-08T14:26:46.006378",
      "email": "caubesuuca32@gmail.com",
      "phoneNumber": "0975704208",
      "companyName": "string",
      "companySize": "LESS_THAN_10",
      "contactPerson": "string",
      "avatarUrl": null,
      "backgroundUrl": null,
      "employerSlug": "string",
      "aboutCompany": "string",
      "websiteUrls": ["facebook", "google"],
      "facebookUrl": "string",
      "twitterUrl": "string",
      "linkedinUrl": "string",
      "googleUrl": "string",
      "youtubeUrl": "string",
      "status": "ACTIVE",
      "province": {
        "id": 1,
        "createdAt": "2025-10-08T09:35:37.394856",
        "updatedAt": "2025-10-08T09:35:37.394856",
        "code": "1",
        "name": "Hà Nội",
        "engName": "Ha Noi",
        "provinceSlug": "hà-nội"
      },
      "district": {
        "id": 1,
        "createdAt": "2025-10-08T09:35:37.434183",
        "updatedAt": "2025-10-08T09:35:37.434183",
        "code": "1",
        "name": "Quận Ba Đình",
        "districtSlug": "quận-ba-đình"
      },
      "detailAddress": "string"
    }
  }
  ```
- Với role admin sẽ lấy được cả nhà tuyển dụng tất cả trạng thái, còn k phải role admin hoặc chưa login chỉ lấy dc nhà tuyển dụng active thôi.
- Error responses
  - 400 (id invalid): xem mục 9 → “Lỗi 400 (chung)” (MethodArgumentTypeMismatch/ConstraintViolation id)
  - 404 (không tìm thấy): xem mục 9 → “Lỗi 404 (chung)”

### 3.3 Xem hồ sơ bản thân nhà tuyển dụng (EMPLOYER)

- Path: /me
- Method: GET
- Auth: Bearer EMPLOYER
- Success 200 (tương tự như mục 3.2)

- Error responses
  - 401 (chưa đăng nhập hoặc không phải EMPLOYER)
    ```json
    {
      "timestamp": "2025-10-08T12:20:00.000",
      "status": 401,
      "path": "/workify/api/v1/employers/me",
      "error": "Unauthorized",
      "message": "Token không hợp lệ"
    }
    ```

### 3.4 Đăng ký NTD (public)

- Path: /sign-up
- Method: POST
- Headers: User-Agent
- Body: EmployerRequest (OnCreate):
  - email: bắt buộc, validate theo regex trên
  - password: bắt buộc, validate theo regex trên
  - companyName: bắt buộc, không dc rỗng
  - companySize giá trị như đề cập ở mục 3.1,
  - contactPerson: bắt buộc, k dc rỗng
  - phoneNumber: bắt buộc, validate theo regex trên
  - provinceId, districtId: required, >=1
  - detailAddress: không bắt buộc

- Request mẫu:

```json
{
  "email": "caubesuuca123@gmail.com",
  "password": "Xuankhanh2911@",
  "companyName": "Van Duc COMPANY",
  "companySize": "FROM_20000_TO_49999",
  "contactPerson": "Van Duc",
  "phoneNumber": "+84729666306",
  "provinceId": 1,
  "districtId": 10,
  "detailAddress": "string"
}
```

- Phân luồng theo User-Agent
  - Web (không phải mobile): hệ thống gửi email kèm link xác nhận. Xác nhận qua API 1.7 (Header C-Token lấy từ link email).
  - Mobile (User-Agent giữ nguyên: ReactNativeApp/1.0 (Android; Mobile)): hệ thống gửi mã OTP 8 chữ số qua email. Xác nhận qua API 1.16 (body: email, code).

- Success 201
  ```json
  {
    "status": 201,
    "message": "Đăng ký nhà tuyển dụng thành công, vui lòng kiểm tra email để xác nhận",
    "data": {
      "id": 2,
      "createdAt": "2025-10-08T15:09:35.065031",
      "updatedAt": "2025-10-08T15:09:35.065031",
      "email": "caubesuuca123@gmail.com",
      "phoneNumber": "+84729666306",
      "companyName": "Van Duc COMPANY",
      "companySize": "FROM_20000_TO_49999",
      "contactPerson": "Van Duc",
      "avatarUrl": null,
      "backgroundUrl": null,
      "employerSlug": "van-duc-company",
      "aboutCompany": null,
      "websiteUrls": null,
      "facebookUrl": null,
      "twitterUrl": null,
      "linkedinUrl": null,
      "googleUrl": null,
      "youtubeUrl": null,
      "status": "PENDING",
      "province": {
        "id": 1,
        "createdAt": "2025-10-08T09:35:37.394856",
        "updatedAt": "2025-10-08T09:35:37.394856",
        "code": "1",
        "name": "Hà Nội",
        "engName": "Ha Noi",
        "provinceSlug": "hà-nội"
      },
      "district": {
        "id": 10,
        "createdAt": "2025-10-08T09:35:37.465135",
        "updatedAt": "2025-10-08T09:35:37.465135",
        "code": "16",
        "name": "Huyện Sóc Sơn",
        "districtSlug": "huyện-sóc-sơn"
      },
      "detailAddress": "string"
    }
  }
  ```
- Error responses
  - 400 (body invalid, tương tự như mấy phần trên)

  ```json
  {
    "timestamp": "2025-10-08T15:12:13.3742983",
    "status": 400,
    "path": "/workify/api/v1/employers/sign-up",
    "error": "Bad Request",
    "message": "Dữ liệu trong request body không hợp lệ",
    "errors": [
      {
        "fieldName": "email",
        "message": "Định dạng email không hợp lệ"
      },
      {
        "fieldName": "password",
        "message": "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt, độ dài từ 8 đến 160 ký tự"
      }
    ]
  }
  ```

  - 409 (email đã tồn tại)
    ```json
    {
      "timestamp": "2025-10-08T15:11:44.7293578",
      "status": 409,
      "path": "/workify/api/v1/employers/sign-up",
      "error": "Conflict",
      "message": "Email nhà tuyển dụng caubesuuca123@gmail.com đã tồn tại"
    }
    ```
  - 500 (gửi mail thất bại)
    ```json
    {
      "timestamp": "2025-10-08T12:22:00.000",
      "status": 500,
      "path": "/workify/api/v1/employers/sign-up",
      "error": "Internal Server Error",
      "message": "Không thể gửi email, vui lòng thử lại sau"
    }
    ```

### 3.5 Tạo NTD (ADMIN, multipart)

- Method: POST
- Content-type: multi-part form-data
- Parts:
  - employer (JSON)
  - avatar (file, k bắt buộc)
  - background (file, k bắt buộc)
- Body (part `employer`) ví dụ
  ```json
  {
    "email": "employer@gmail.com",
    "password": "Employer@123",
    "companyName": "Company1",
    "companySize": "LESS_THAN_10",
    "contactPerson": "string",
    "phoneNumber": "+84365971950",
    "provinceId": 1,
    "districtId": 1,
    "detailAddress": "string",
    "aboutCompany": "string",
    "facebookUrl": "string",
    "twitterUrl": "string",
    "linkedinUrl": "string",
    "googleUrl": "string",
    "youtubeUrl": "string",
    "websiteUrls": ["string"],
    "status": "ACTIVE"
  }
  ```
  Validate:
  Các field bắt buộc như đăng ký nhà tuyển dụng ở mục 3.4 nhưng đây là admin tạo nên cần phải truyền status: ACTIVE|PENDING|BANNED, và có thêm phần k bắt buộc là aboutCompany, facebookUrl, twitterUrl, linkedinUrl, googleUrl, youtubeUrl, websiteUrls có thể truyền lên hoặc không.
- Success 200
  ```json
  {
    "status": 201,
    "message": "Tạo nhà tuyển dụng thành công",
    "data": {
      "id": 1,
      "createdAt": "2025-10-08T14:26:46.006378",
      "updatedAt": "2025-10-08T14:26:46.006378",
      "email": "caubesuuca32@gmail.com",
      "phoneNumber": "0975704208",
      "companyName": "string",
      "companySize": "LESS_THAN_10",
      "contactPerson": "string",
      "avatarUrl": null,
      "backgroundUrl": null,
      "employerSlug": "string",
      "aboutCompany": "string",
      "websiteUrls": ["facebook", "google"],
      "facebookUrl": "string",
      "twitterUrl": "string",
      "linkedinUrl": "string",
      "googleUrl": "string",
      "youtubeUrl": "string",
      "status": "ACTIVE",
      "province": {
        "id": 1,
        "createdAt": "2025-10-08T09:35:37.394856",
        "updatedAt": "2025-10-08T09:35:37.394856",
        "code": "1",
        "name": "Hà Nội",
        "engName": "Ha Noi",
        "provinceSlug": "hà-nội"
      },
      "district": {
        "id": 1,
        "createdAt": "2025-10-08T09:35:37.434183",
        "updatedAt": "2025-10-08T09:35:37.434183",
        "code": "1",
        "name": "Quận Ba Đình",
        "districtSlug": "quận-ba-đình"
      },
      "detailAddress": "string"
    }
  }
  ```
- Error responses
  - Lỗi tương tự như đăng ký nhà tuyển dụng

### 3.6 Cập nhật NTD (ADMIN, multipart)

- Path: /{id}

- Method: PUT
- Content-type: multi-part form-data
- Parts:
  - employer (JSON)
  - avatar (file, k bắt buộc)
  - background (file, k bắt buộc)
- Body (part `employer`) ví dụ request và response tương tự như mục 3.5, nhưng phần password có thể không truyền (truyền null), nhưng nếu truyền thì phải hợp lý (nếu truyền chuỗi rỗng thì sẽ bị validate k hợp lệ)

- Error responses
  - 400 (id/parts/body invalid)
  - 401 (token k có, hoặc k hợp lệ), 403 (k có role là admin nên k đủ quyền)
  - 404 (không tìm thấy)

### 3.7 Cập nhật hồ sơ NTD bản thân (EMPLOYER)

- Path: /me
- Method: PUT
- Body: tương tự phần đăng ký nhà tuyển dụng nhưng có thể update about company ở phần này, và không thể update password, email nhà tuyển dụng ở phần này
  ```json
  {
    "companyName": "string",
    "companySize": "FROM_100_TO_499",
    "contactPerson": "string",
    "phoneNumber": "0323887266",
    "provinceId": 1,
    "districtId": 1,
    "detailAddress": "string",
    "aboutCompany": "string"
  }
  ```
- Success 200
  ```json
  {
    "status": 200,
    "message": "Cập nhật nhà tuyển dụng thành công",
    "data": {
      "id": 1,
      "createdAt": "2025-10-08T14:26:46.006378",
      "updatedAt": "2025-10-08T14:26:46.006378",
      "email": "caubesuuca32@gmail.com",
      "phoneNumber": "0323887266",
      "companyName": "string",
      "companySize": "FROM_100_TO_499",
      "contactPerson": "string",
      "avatarUrl": null,
      "backgroundUrl": null,
      "employerSlug": "string",
      "aboutCompany": "string 1",
      "websiteUrls": ["facebook", "google"],
      "facebookUrl": "string",
      "twitterUrl": "string",
      "linkedinUrl": "string",
      "googleUrl": "string",
      "youtubeUrl": "string",
      "status": "ACTIVE",
      "province": {
        "id": 1,
        "createdAt": "2025-10-08T09:35:37.394856",
        "updatedAt": "2025-10-08T09:35:37.394856",
        "code": "1",
        "name": "Hà Nội",
        "engName": "Ha Noi",
        "provinceSlug": "hà-nội"
      },
      "district": {
        "id": 1,
        "createdAt": "2025-10-08T09:35:37.434183",
        "updatedAt": "2025-10-08T09:35:37.434183",
        "code": "1",
        "name": "Quận Ba Đình",
        "districtSlug": "quận-ba-đình"
      },
      "detailAddress": "string 2"
    }
  }
  ```
- Error responses
  - 400 (body invalid)
  - 401, 403

### 3.8 Xóa NTD (ADMIN)

- Path: /{id}
- Method: DELETE
- Success 200
  ```json
  { "status": 200, "message": "Xóa nhà tuyển dụng thành công" }
  ```
- Error responses
  - 400 (id invalid)
  - 404 (không tìm thấy)

### 3.9 Cập nhật avatar NTD bản thân (EMPLOYER)

- Path: /me/avatar
- Method: PATCH
- Content-type: multi-part form-data
- Parts: avatar (file)
- Success 200
  ```json
  {
    "status": 200,
    "message": "Cập nhật avatar thành công",
    "data": {
      "id": 10,
      "..."
      "avatarUrl": "https://cdn.example.com/e/10/avatar.png"
    }
  }
  ```

### 3.10 Cập nhật background NTD bản thân (EMPLOYER)

- Path: /me/background
- Method: PATCH
- Content-type: multi-part form-data
- Parts: background (file)
- Success 200
  ```json
  {
    "status": 200,
    "message": "Cập nhật background thành công",
    "data": {
      "id": 10,
      "..."
      "backgroundUrl": "https://cdn.example.com/e/10/bg.png"
    }
  }
  ```

### 3.11 Cập nhật website/social urls (EMPLOYER)

- Path: /me/website-urls
- Method: PATCH
- Body: EmployerWebsiteUpdateRequest
  ```json
  {
    "websiteUrls": [
      "https://abc.example.com",
      "https://career.abc.example.com"
    ],
    "linkedinUrl": "https://linkedin.com/company/abc"
  }
  ```
- Success 200
  ```json
  {
    "status": 200,
    "message": "Cập nhật liên kết thành công",
    "data": {
      "id": 10,
      "..."
      "websiteUrls": [
        "https://abc.example.com",
        "https://career.abc.example.com"
      ],
      "linkedinUrl": "https://linkedin.com/company/abc"
    }
  }
  ```

### 3.12 Đổi mật khẩu bản thân (EMPLOYER)

- Path: /me/password
- Method: PATCH
- Body: UpdatePasswordRequest (currentPassword/newPassword đều regex Password)
  ```json
  { "currentPassword": "Old@12345", "newPassword": "Workify@123" }
  ```
- Success 200
  ```json
  { "status": 200, "message": "Cập nhật mật khẩu thành công" }
  ```
- Error responses
  - 400 (body invalid)
  - 401

### 3.13 Top hiring employers (public)

- Path: /top-hiring
- Method: GET
- Query: limit (>=1, mặc định 10)
- Success 200 (List<EmployerResponse>) – ví dụ rút gọn:

```json
{
  "status": 200,
  "message": "Lấy danh sách nhà tuyển dụng tuyển nhiều việc nhất thành công",
  "data": [
    {
      "id": 10,
      "createdAt": "2025-10-19T13:20:07.673165",
      "updatedAt": "2025-10-19T13:20:07.673165",
      "email": "hr@bigcorp.vn",
      "phoneNumber": "+84912345678",
      "companyName": "BigCorp",
      "companySize": "FROM_10000_TO_19999",
      "contactPerson": "Nguyen Van B",
      "avatarUrl": null,
      "backgroundUrl": null,
      "employerSlug": "bigcorp",
      "aboutCompany": "Leading tech company",
      "websiteUrls": ["https://bigcorp.vn"],
      "facebookUrl": null,
      "twitterUrl": null,
      "linkedinUrl": null,
      "googleUrl": null,
      "youtubeUrl": null,
      "status": "ACTIVE",
      "province": { "id": 1, "name": "Hà Nội" },
      "district": { "id": 2, "name": "Quận Ba Đình" },
      "detailAddress": "99 Tran Hung Dao",
      "numberOfHiringJobs": 128
    }
  ]
}
```

- Error 400 (limit invalid)

## 4) Danh mục bài viết (Category Posts)

Base: /workify/api/v1/categories-post

### 4.0 Danh sách tất cả (public, không phân trang)

- Path: /all
- Method: GET
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách danh mục bài viết thành công",
    "data": [
      { "id": 1, "title": "Tin tức", "description": "Danh mục tin tức" },
      { "id": 2, "title": "Kinh nghiệm", "description": "Chia sẻ kinh nghiệm" }
    ]
  }
  ```
- Ghi chú: dùng cho dropdown/filter ở FE; nếu cần phân trang/tìm kiếm/sắp xếp dùng API 4.1.

### 4.1 Danh sách (public)

- Method: GET
- Query:
  - pageNumber (>=1), pageSize (>=1)
  - sorts: cú pháp field:asc|desc; whitelist: title, createdAt, updatedAt
  - keyword: tìm theo title hoặc description (không phân biệt hoa thường)
- Ví dụ: /workify/api/v1/categories-post?pageNumber=1&pageSize=10&sorts=title:asc&keyword=tin
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách danh mục bài viết thành công",
    "data": {
      "pageNumber": 1,
      "pageSize": 10,
      "totalPages": 1,
      "numberOfElements": 1,
      "items": [
        { "id": 3, "title": "Tin tức", "description": "Danh mục tin tức" }
      ]
    }
  }
  ```

### 4.2 Lấy theo id (public)

- Path: /{id}
- Method: GET
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy danh mục bài viết thành công",
    "data": { "id": 3, "title": "Tin tức", "description": "Danh mục tin tức" }
  }
  ```
- Error responses
  - 400 (id invalid)
  - 404

### 4.3 Tạo (ADMIN)

- Method: POST
- Body: CategoryPostRequest
- Success 201
  ```json
  {
    "status": 201,
    "message": "Tạo danh mục bài viết thành công",
    "data": { "id": 3, "title": "Tin tức", "description": "Danh mục tin tức" }
  }
  ```
- Error responses
  - 400 (body invalid)
  - 409 (trùng tiêu đề)
    ```json
    {
      "timestamp": "2025-10-08T12:32:30.000",
      "status": 409,
      "path": "/workify/api/v1/categories-post",
      "error": "Conflict",
      "message": "Danh mục đã tồn tại"
    }
    ```

### 4.4 Cập nhật (ADMIN)

- Path: /{id}
- Method: PUT
- Body: CategoryPostRequest
- Success 200
  ```json
  {
    "status": 200,
    "message": "Cập nhật danh mục bài viết thành công",
    "data": {
      "id": 3,
      "title": "Tin tức (updated)",
      "description": "Danh mục tin tức"
    }
  }
  ```
- Error responses
  - 400 (id/body invalid)
  - 404 (không tìm thấy)
  - 409 (trùng tiêu đề)

### 4.5 Xóa (ADMIN)

- Path: /{id}
- Method: DELETE
- Success 200
  ```json
  { "status": 200, "message": "Xóa danh mục bài viết thành công" }
  ```
- Error responses
  - 400 (id invalid)
  - 404 (không tìm thấy)

---

## 5) Bài viết (Posts)

Base: /workify/api/v1/posts

- Ghi chú chung cho Posts
- Trả về PostResponse đầy đủ: xem "PostResponse (đầy đủ)" ở phần 10; các ví dụ bên dưới có thể rút gọn nhưng API thực tế trả đủ các field.
- Enum StatusPost: PENDING | PUBLIC | DRAFT
  - Tạo/Cập nhật: behavior phụ thuộc vào vai trò caller
    - ADMIN: khi tạo hoặc cập nhật có thể đặt `status` (validated theo enum StatusPost). Nếu status không hợp lệ sẽ trả 400.
    - EMPLOYER: khi tạo bài, hệ thống sẽ mặc định `status = PENDING` (trường `status` trong request của employer sẽ bị bỏ qua). Khi cập nhật, employer chỉ được cập nhật bài do chính họ tạo (owner) và **không được** cập nhật `status` (status chỉ có thể thay đổi bởi ADMIN).
  - GET public chỉ trả các bài có `status = PUBLIC`.
  - GET theo id: nếu bài không phải `PUBLIC` thì chỉ ADMIN hoặc chính employer tác giả (employerAuthor) xem được; các caller khác (chưa đăng nhập hoặc không phải admin/employer author) sẽ nhận 403.
- Sorts whitelist cho Posts: chỉ hỗ trợ createdAt, updatedAt
- Lưu ý về tác giả trả về: trong `PostResponse` chỉ có **một** trong hai trường `userAuthor` hoặc `employerAuthor` tuỳ theo bài được tạo bởi user cá nhân hay employer (frontend phải kiểm tra và hiển thị phù hợp).

### 5.1 Danh sách (ADMIN)

- Method: GET
- Query:
  - pageNumber (>=1), pageSize (>=1)
  - sorts: cú pháp field:asc|desc; whitelist: createdAt, updatedAt
  - keyword: tìm theo title, content hoặc author.fullName (không phân biệt hoa thường)
  - categoryId: lọc theo danh mục (>=1)
- Ví dụ: /workify/api/v1/posts?pageNumber=1&pageSize=10&sorts=createdAt:desc&keyword=workify&categoryId=1
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách bài viết thành công",
    "data": {
      "pageNumber": 1,
      "pageSize": 10,
      "totalPages": 1,
      "numberOfElements": 1,
      "items": [
        {
          "id": 100,
          "createdAt": "2025-10-08T12:30:11.000",
          "updatedAt": "2025-10-08T12:35:05.000",
          "title": "Giới thiệu Workify",
          "excerpt": "Nền tảng việc làm...",
          "content": "<p>Nội dung HTML đã được xử lý...</p>",
          "contentText": "Noi dung HTML da duoc xu ly...",
          "thumbnailUrl": "https://cdn.example.com/posts/100/thumbnail.jpg",
          "tags": "workify|viec-lam",
          "slug": "gioi-thieu-workify",
          "readingTimeMinutes": 3,
          "category": {
            "id": 1,
            "createdAt": "2025-10-08T19:20:11.929921",
            "updatedAt": "2025-10-08T19:20:11.929921",
            "title": "Ngữ pháp",
            "description": "Ngữ pháp",
            "slug": "ngữ-pháp"
          },
          "userAuthor": {
            "id": 1,
            "fullName": "System Administrator",
            "avatarUrl": null,
            "email": "admin@example.com",
            "role": "ADMIN"
          },
          "employerAuthor": null,
          "status": "PUBLIC"
        }
      ]
    }
  }
  ```
- Error responses
  - 400 (params invalid)
  - 401/403 (không đủ quyền)
    ```json
    {
      "timestamp": "2025-10-08T12:36:30.000",
      "status": 403,
      "path": "/workify/api/v1/posts",
      "error": "Forbidden",
      "message": "Không có quyền truy cập"
    }
    ```
  - Ghi chú: Sorts chỉ hỗ trợ các trường: createdAt, updatedAt

### 5.2 Danh sách công khai (public)

- Path: /public
- Method: GET
- Query: giống 5.1, nhưng chỉ trả về các bài có status=PUBLIC
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách bài viết thành công",
    "data": {
      "pageNumber": 1,
      "pageSize": 10,
      "totalPages": 1,
      "numberOfElements": 1,
      "items": [
        {
          "id": 100,
          "createdAt": "2025-10-08T12:30:11.000",
          "updatedAt": "2025-10-08T12:35:05.000",
          "title": "Giới thiệu Workify",
          "excerpt": "Nền tảng việc làm...",
          "content": "<p>Nội dung HTML đã được xử lý...</p>",
          "contentText": "Noi dung HTML da duoc xu ly...",
          "thumbnailUrl": "https://cdn.example.com/posts/100/thumbnail.jpg",
          "tags": "workify|viec-lam",
          "slug": "gioi-thieu-workify",
          "readingTimeMinutes": 3,
          "category": {
            "id": 1,
            "createdAt": "2025-10-08T19:20:11.929921",
            "updatedAt": "2025-10-08T19:20:11.929921",
            "title": "Ngữ pháp",
            "description": "Ngữ pháp",
            "slug": "ngữ-pháp"
          },
          "userAuthor": {
            "id": 1,
            "fullName": "System Administrator",
            "avatarUrl": null,
            "email": "admin@example.com",
            "role": "ADMIN"
          },
          "employerAuthor": null,
          "status": "PUBLIC"
        }
      ]
    }
  }
  ```
- Error responses
  - 400 (params invalid)

### 5.3 Lấy theo id (public)

- Path: /{id}
- Method: GET
- Success 200

  ```json
  {
    "status": 200,
    "message": "Lấy bài viết thành công",
    "data": {
      "id": 101,
      "createdAt": "2025-11-30T10:00:00.000",
      "updatedAt": "2025-11-30T10:00:00.000",
      "title": "Thông báo tuyển dụng",
      "excerpt": "Công ty cần tuyển...",
      "content": "<p>Nội dung...</p>",
      "contentText": "Nội dung...",
      "thumbnailUrl": "https://cdn.example.com/posts/101/thumbnail.jpg",
      "tags": "tuyen-dung|nhatuyendung",
      "slug": "thong-bao-tuyen-dung",
      "readingTimeMinutes": 2,
      "category": {
        "id": 2,
        "title": "Tin tức",
        "description": "Danh mục tin tức"
      },
      "userAuthor": null,
      "employerAuthor": {
        "id": 10,
        "email": "hr@example.com",
        "backgroundUrl": null,
        "avatarUrl": null,
        "companyName": "ABC Corp",
        "createdAt": "2025-10-01T08:00:00.000",
        "updatedAt": "2025-10-01T08:00:00.000",
        "employerSlug": "abc-corp"
      },
      "status": "PUBLIC"
    }
  }
  ```

  - Ví dụ 2 (bài do User tạo — `userAuthor` xuất hiện, `employerAuthor` = null):
    ```json
    {
      "status": 200,
      "message": "Lấy bài viết thành công",
      "data": {
        "id": 100,
        "createdAt": "2025-10-08T12:30:11.000",
        "updatedAt": "2025-10-08T12:35:05.000",
        "title": "Giới thiệu Workify",
        "excerpt": "Nền tảng việc làm...",
        "content": "<p>Nội dung HTML đã được xử lý...</p>",
        "contentText": "Noi dung HTML da duoc xu ly...",
        "thumbnailUrl": "https://cdn.example.com/posts/100/thumbnail.jpg",
        "tags": "workify|viec-lam",
        "slug": "gioi-thieu-workify",
        "readingTimeMinutes": 3,
        "category": {
          "id": 1,
          "createdAt": "2025-10-08T19:20:11.929921",
          "updatedAt": "2025-10-08T19:20:11.929921",
          "title": "Ngữ pháp",
          "description": "Ngữ pháp",
          "slug": "ngữ-pháp"
        },
        "userAuthor": {
          "id": 1,
          "fullName": "System Administrator",
          "avatarUrl": null,
          "email": "admin@example.com",
          "role": "ADMIN"
        },
        "employerAuthor": null,
        "status": "PUBLIC"
      }
    }
    ```

- Error responses
  - 400 (id invalid)
    ```json
    {
      "timestamp": "2025-10-08T12:37:30.000",
      "status": 400,
      "path": "/workify/api/v1/posts/abc",
      "error": "Bad Request",
      "message": "Tham số id phải có kiểu Long"
    }
    ```
  - 404 (không tìm thấy)
    ```json
    {
      "timestamp": "2025-10-08T12:38:00.000",
      "status": 404,
      "path": "/workify/api/v1/posts/9999",
      "error": "Not Found",
      "message": "Không tìm thấy tài nguyên"
    }
    ```
  - 403 (bài viết chưa PUBLIC)
    ```json
    {
      "timestamp": "2025-10-08T12:38:15.000",
      "status": 403,
      "path": "/workify/api/v1/posts/100",
      "error": "Forbidden",
      "message": "Không có quyền truy cập"
    }
    ```

### 5.4 Bài viết liên quan (public)

- Path: /public/{id}/related
- Method: GET
- Query: limit (>=1, tối đa 20)
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách bài viết liên quan thành công",
    "data": [
      {
        "id": 101,
        "title": "Tin liên quan 1",
        "excerpt": "...",
        "thumbnailUrl": "https://cdn.example.com/posts/101/thumbnail.jpg",
        "slug": "tin-lien-quan-1",
        "readingTimeMinutes": 2,
        "category": {
          "id": 1,
          "createdAt": "2025-10-08T19:20:11.929921",
          "updatedAt": "2025-10-08T19:20:11.929921",
          "title": "Ngữ pháp",
          "description": "Ngữ pháp",
          "slug": "ngữ-pháp"
        },
        "userAuthor": {
          "id": 2,
          "fullName": "Nguyen Van A",
          "avatarUrl": null,
          "email": "user@example.com",
          "role": "JOB_SEEKER"
        },
        "employerAuthor": null,
        "status": "PUBLIC"
      }
    ]
  }
  ```
- Error responses
  - 400 (id/limit invalid): xem mục 10 → “Lỗi 400 (chung)” (type mismatch/params invalid)
  - 404 (nếu id không tồn tại): xem mục 10 → “Lỗi 404 (chung)”

### 5.5 Bài viết mới nhất (public)

- Path: /public/latest
- Method: GET
- Query: limit (>=1, tối đa 50)
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách bài viết mới nhất thành công",
    "data": [
      {
        "id": 110,
        "title": "Bài viết mới 1",
        "excerpt": "...",
        "thumbnailUrl": "https://cdn.example.com/posts/110/thumbnail.jpg",
        "slug": "bai-viet-moi-1",
        "readingTimeMinutes": 1,
        "category": {
          "id": 1,
          "createdAt": "2025-10-08T19:20:11.929921",
          "updatedAt": "2025-10-08T19:20:11.929921",
          "title": "Ngữ pháp",
          "description": "Ngữ pháp",
          "slug": "ngữ-pháp"
        },
        "userAuthor": {
          "id": 1,
          "fullName": "System Administrator",
          "avatarUrl": null,
          "email": "admin@example.com",
          "role": "ADMIN"
        },
        "employerAuthor": null,
        "status": "PUBLIC"
      }
    ]
  }
  ```
- Error responses
  - 400 (limit invalid)

### 5.6 Tạo bài viết (ADMIN hoặc EMPLOYER, multipart)

- Method: POST
- Roles: `ADMIN` or `EMPLOYER` (public: no)
- Parts:
  - post (JSON) – PostRequest (title/excerpt/content/categoryId bắt buộc)
    - Lưu ý: `status` trong `post` chỉ có hiệu lực khi caller là `ADMIN`.
    - Nếu caller là `EMPLOYER`, hệ thống sẽ tự động đặt `status = PENDING` sau khi tạo (frontend không cần, và giá trị `status` nếu có sẽ bị bỏ qua).
  - thumbnail (file ảnh, bắt buộc)
- Validate PostRequest:
- title: bắt buộc, not blank, max 255 ký tự
- excerpt: bắt buộc, not blank, max 1000 ký tự
- content: bắt buộc, not blank (có thể chứa HTML; hệ thống sẽ upload ảnh nhúng và chuẩn hóa nội dung)
- categoryId: notNull, phải tồn tại (nếu không 404)
- status: nếu caller là `ADMIN` thì phải thuộc {PENDING, PUBLIC, DRAFT}; nếu caller là `EMPLOYER` trường `status` sẽ bị bỏ qua và mặc định là `PENDING`.
- thumbnail: image hợp lệ (jpeg/png/webp...), bắt buộc
- Success 201
  ```json
  {
    "status": 201,
    "message": "Tạo bài viết thành công",
    "data": {
      "id": 100,
      "createdAt": "2025-10-08T12:30:11.000",
      "updatedAt": "2025-10-08T12:30:11.000",
      "title": "Giới thiệu Workify",
      "excerpt": "Nền tảng việc làm...",
      "content": "<p>Nội dung HTML đã được xử lý...</p>",
      "contentText": "Noi dung HTML da duoc xu ly...",
      "thumbnailUrl": "https://cdn.example.com/posts/100/thumbnail.jpg",
      "tags": "workify|viec-lam",
      "slug": "gioi-thieu-workify",
      "readingTimeMinutes": 3,
      "category": {
        "id": 1,
        "title": "Tin tức",
        "description": "Danh mục tin tức"
      },
      "userAuthor": {
        "id": 1,
        "fullName": "System Administrator",
        "avatarUrl": null,
        "email": "admin@example.com",
        "role": "ADMIN"
      },
      "employerAuthor": null,
      "status": "PUBLIC"
    }
  }
  ```
- Error responses
  - 400 (thiếu part/ảnh không hợp lệ/body invalid)
    ```json
    {
      "timestamp": "2025-10-08T12:40:00.000",
      "status": 400,
      "path": "/workify/api/v1/posts",
      "error": "Bad Request",
      "message": "Thiếu part post hoặc thumbnail không hợp lệ"
    }
    ```
  - 409 (trùng tiêu đề/slug)
    ```json
    {
      "timestamp": "2025-10-08T12:40:30.000",
      "status": 409,
      "path": "/workify/api/v1/posts",
      "error": "Conflict",
      "message": "Tiêu đề hoặc slug đã tồn tại"
    }
    ```
  - 404 (categoryId không tồn tại)
    ```json
    {
      "timestamp": "2025-10-08T12:40:45.000",
      "status": 404,
      "path": "/workify/api/v1/posts",
      "error": "Not Found",
      "message": "Không tìm thấy danh mục bài viết"
    }
    ```

### 5.7 Cập nhật bài viết (ADMIN hoặc EMPLOYER, multipart)

- Path: /{id}
- Method: PUT
- Roles: `ADMIN` or `EMPLOYER`
- Behaviour:
  - `ADMIN`: có thể cập nhật bất kỳ bài viết nào và có thể cập nhật `status`.
  - `EMPLOYER`: chỉ được cập nhật bài viết do chính họ tạo (owner). Employer **không được** cập nhật trường `status` (nếu request có `status`, backend sẽ bỏ qua phần này).
- Parts:
  - post (JSON) – PostRequest (OnUpdate)
  - thumbnail (file ảnh, optional)
- Success 200
  ```json
  {
    "status": 200,
    "message": "Cập nhật bài viết thành công",
    "data": {
      "id": 100,
      "createdAt": "2025-10-08T12:30:11.000",
      "updatedAt": "2025-10-08T12:45:22.000",
      "title": "Giới thiệu Workify (updated)",
      "excerpt": "Nền tảng việc làm...",
      "content": "<p>Nội dung HTML đã được xử lý...</p>",
      "contentText": "Noi dung HTML da duoc xu ly...",
      "thumbnailUrl": "https://cdn.example.com/posts/100/thumbnail-v2.jpg",
      "tags": "workify|viec-lam",
      "slug": "gioi-thieu-workify-updated",
      "readingTimeMinutes": 3,
      "category": {
        "id": 1,
        "createdAt": "2025-10-08T19:20:11.929921",
        "updatedAt": "2025-10-08T19:20:11.929921",
        "title": "Ngữ pháp",
        "description": "Ngữ pháp",
        "slug": "ngữ-pháp"
      },
      "userAuthor": {
        "id": 1,
        "fullName": "System Administrator",
        "avatarUrl": null,
        "email": "admin@example.com",
        "role": "ADMIN"
      },
      "employerAuthor": null,
      "status": "PUBLIC"
    }
  }
  ```
- Error responses
  - 400 (id/body/ảnh invalid)
    ```json
    {
      "timestamp": "2025-10-08T12:41:00.000",
      "status": 400,
      "path": "/workify/api/v1/posts/abc",
      "error": "Bad Request",
      "message": "Tham số id phải có kiểu Long hoặc dữ liệu không hợp lệ"
    }
    ```
  - 404 (không tìm thấy)
    ```json
    {
      "timestamp": "2025-10-08T12:41:30.000",
      "status": 404,
      "path": "/workify/api/v1/posts/9999",
      "error": "Not Found",
      "message": "Không tìm thấy tài nguyên"
    }
    ```
  - 409 (trùng tiêu đề/slug)
    ```json
    {
      "timestamp": "2025-10-08T12:42:00.000",
      "status": 409,
      "path": "/workify/api/v1/posts/100",
      "error": "Conflict",
      "message": "Tiêu đề đã tồn tại"
    }
    ```
  - 404 (categoryId không tồn tại khi cập nhật category)
    ```json
    {
      "timestamp": "2025-10-08T12:42:15.000",
      "status": 404,
      "path": "/workify/api/v1/posts/100",
      "error": "Not Found",
      "message": "Không tìm thấy danh mục bài viết"
    }
    ```

### 5.8 Xóa bài viết (ADMIN hoặc EMPLOYER)

- Path: /{id}
- Method: DELETE
- Roles: `ADMIN` or `EMPLOYER`
- Behaviour:
  - `ADMIN`: có thể xóa bất kỳ bài viết nào.
  - `EMPLOYER`: chỉ được xóa bài viết do chính họ tạo (owner). Nếu cố xóa bài của người khác sẽ trả 403.
- Success 200
  ```json
  { "status": 200, "message": "Xóa bài viết thành công" }
  ```
- Error responses
- - 400 (id invalid)
  ```json
  {
    "timestamp": "2025-10-08T12:42:30.000",
    "status": 400,
    "path": "/workify/api/v1/posts/abc",
    "error": "Bad Request",
    "message": "Tham số id phải có kiểu Long"
  }
  ```
- 404 (không tìm thấy)

  ```json
  {
    "timestamp": "2025-10-08T12:43:00.000",
    "status": 404,
    "path": "/workify/api/v1/posts/9999",
    "error": "Not Found",
    "message": "Không tìm thấy tài nguyên"
  }
  ```

  ### 5.9 Cập nhật trạng thái bài viết (ADMIN)

- Path: `/workify/api/v1/posts/{id}/{status}`
- Method: `PATCH`
- Roles: `ADMIN` (EMPLOYER không có quyền cập nhật `status` - backend sẽ bỏ qua nếu caller là employer)
- Description: Cho phép ADMIN cập nhật `status` của một bài viết. `status` phải là một trong `PENDING`, `PUBLIC`, `DRAFT`.

- Success 200

  ```json
  { "status": 200, "message": "Cập nhật trạng thái thành công" }
  ```

- Example curl (ADMIN):

```bash
curl -X PATCH \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  https://your-api.example.com/workify/api/v1/posts/123/PUBLIC
```

- Error responses:
  - 400 (status không hợp lệ)
  - 401/403 (không đủ quyền)
  - 404 (bài viết không tồn tại)

- Frontend recommendation:
  - Sau khi update status thành công, refetch chi tiết bài `GET /workify/api/v1/posts/{id}` và refetch danh sách (giữ `pageNumber` + `sorts=createdAt:desc`) để giao diện đồng bộ.

---

## 6) Tỉnh thành (Provinces)

### 5.10 Lấy bài viết của chính employer (My posts)

- Path: `/workify/api/v1/posts/my`
- Method: `GET`
- Roles: `EMPLOYER` (chỉ trả về các bài do employer đang đăng nhập tạo). `ADMIN` có thể dùng endpoint quản lý chung (`GET /workify/api/v1/posts`).
- Query params:
  - `pageNumber` (>=1), `pageSize` (>=1)
  - `sorts`: cú pháp `field:asc|desc` (whitelist: `createdAt`, `updatedAt`) — khuyến nghị mặc định `sorts=createdAt:desc`
  - `status` (optional): lọc theo `PENDING|PUBLIC|DRAFT` (nếu cần)

- Example: `/workify/api/v1/posts/my?pageNumber=1&pageSize=10&sorts=createdAt:desc`

- Success 200

  ```json
  {
    "status": 200,
    "message": "Lấy danh sách bài viết thành công",
    "data": {
      "pageNumber": 1,
      "pageSize": 10,
      "totalPages": 1,
      "numberOfElements": 1,
      "items": [
        {
          "id": 101,
          "createdAt": "2025-11-30T10:00:00.000",
          "updatedAt": "2025-11-30T10:00:00.000",
          "title": "Thông báo tuyển dụng",
          "excerpt": "Công ty cần tuyển...",
          "content": "<p>Nội dung...</p>",
          "contentText": "Nội dung...",
          "thumbnailUrl": "https://cdn.example.com/posts/101/thumbnail.jpg",
          "tags": "tuyen-dung|nhatuyendung",
          "slug": "thong-bao-tuyen-dung",
          "readingTimeMinutes": 2,
          "category": {
            "id": 2,
            "title": "Tin tức",
            "description": "Danh mục tin tức"
          },
          "userAuthor": null,
          "employerAuthor": {
            "id": 10,
            "email": "hr@example.com",
            "backgroundUrl": null,
            "avatarUrl": null,
            "companyName": "ABC Corp",
            "createdAt": "2025-10-01T08:00:00.000",
            "updatedAt": "2025-10-01T08:00:00.000",
            "employerSlug": "abc-corp"
          },
          "status": "PENDING"
        }
      ]
    }
  }
  ```

- Error responses
  - 400 (params invalid)
  - 401/403 (không có quyền hoặc token hết hạn)

- Frontend notes:
  - Sử dụng mặc định `sorts=createdAt:desc` để hiển thị bài mới nhất lên đầu.
  - Sau khi tạo/cập nhật/xóa bài, refetch trang hiện tại (`/workify/api/v1/posts/my?...`) để đồng bộ giao diện.

---

## 6) Tỉnh thành (Provinces)

Base: /workify/api/v1/provinces

### 6.1 Danh sách (public)

- Method: GET
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách tỉnh thành thành công",
    "data": [{ "id": 1, "code": "HNI", "name": "Hà Nội", "engName": "Ha Noi" }]
  }
  ```
- Error responses
  - 500 (Lỗi hệ thống – xem mục "Lỗi 500 hệ thống (chung)" ở phần 10)

Ghi chú: Hệ thống có hỗ trợ API phân trang/tìm kiếm/sắp xếp nội bộ (service) với keyword (name/engName/code) và sorts whitelist (name, createdAt, updatedAt). Phiên bản public trong controller hiện trả về toàn bộ danh sách đã sắp xếp theo tên (ASC).

### 6.2 Lấy theo id (public)

- Path: /{id}
- Method: GET
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy tỉnh thành thành công",
    "data": { "id": 1, "code": "HNI", "name": "Hà Nội", "engName": "Ha Noi" }
  }
  ```
- Error responses
  - 400 (id invalid): xem mục 10 → “Lỗi 400 (chung)” (type mismatch/params invalid)
  - 404 (không tìm thấy): message theo messages_vi: "Tỉnh thành không tồn tại"

### 6.3 Tạo (ADMIN)

- Method: POST
- Body: ProvinceRequest (code,name bắt buộc; engName optional)
- Body ví dụ
  ```json
  { "code": "HCM", "name": "Hồ Chí Minh", "engName": "Ho Chi Minh" }
  ```
- Success 201
  ```json
  {
    "status": 201,
    "message": "Tạo tỉnh thành công",
    "data": {
      "id": 2,
      "code": "HCM",
      "name": "Hồ Chí Minh",
      "engName": "Ho Chi Minh"
    }
  }
  ```
- Error responses
  - 400 (body invalid)
    ```json
    {
      "timestamp": "2025-10-08T12:44:30.000",
      "status": 400,
      "path": "/workify/api/v1/provinces",
      "error": "Bad Request",
      "message": "Dữ liệu trong request body không hợp lệ"
    }
    ```
  - 409 (mã/code đã tồn tại)
    ```json
    {
      "timestamp": "2025-10-08T12:45:00.000",
      "status": 409,
      "path": "/workify/api/v1/provinces",
      "error": "Conflict",
      "message": "Mã tỉnh thành đã tồn tại"
    }
    ```

### 6.4 Cập nhật (ADMIN)

- Path: /{id}
- Method: PUT
- Body: ProvinceRequest
- Body ví dụ
  ```json
  { "code": "HCM", "name": "TP Hồ Chí Minh", "engName": "Ho Chi Minh City" }
  ```
- Success 200
  ```json
  {
    "status": 200,
    "message": "Cập nhật tỉnh thành công",
    "data": {
      "id": 2,
      "code": "HCM",
      "name": "TP Hồ Chí Minh",
      "engName": "Ho Chi Minh City"
    }
  }
  ```
- Error responses
  - 400 (id/body invalid)
  - 404 (không tìm thấy)
    ```json
    {
      "timestamp": "2025-10-08T12:45:30.000",
      "status": 404,
      "path": "/workify/api/v1/provinces/9999",
      "error": "Not Found",
      "message": "Không tìm thấy tài nguyên"
    }
    ```
  - 409 (mã/code đã tồn tại)
    ```json
    {
      "timestamp": "2025-10-08T12:46:00.000",
      "status": 409,
      "path": "/workify/api/v1/provinces/2",
      "error": "Conflict",
      "message": "Mã tỉnh thành đã tồn tại"
    }
    ```

### 6.5 Xóa (ADMIN)

- Path: /{id}
- Method: DELETE
- Success 200
  ```json
  { "status": 200, "message": "Xóa tỉnh thành công" }
  ```
- Error responses
  - 400 (id invalid)
    ```json
    {
      "timestamp": "2025-10-08T12:46:30.000",
      "status": 400,
      "path": "/workify/api/v1/provinces/abc",
      "error": "Bad Request",
      "message": "Tham số id phải có kiểu Long"
    }
    ```
  - 404 (không tìm thấy)
    ```json
    {
      "timestamp": "2025-10-08T12:47:00.000",
      "status": 404,
      "path": "/workify/api/v1/provinces/9999",
      "error": "Not Found",
      "message": "Không tìm thấy tài nguyên"
    }
    ```

---

## 7) Quận/Huyện (Districts)

Base: /workify/api/v1/districts

### 7.1 Danh sách (public)

- Method: GET
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách quận/huyện thành công",
    "data": [{ "id": 10, "code": "Q1", "name": "Quận 1" }]
  }
  ```
- Error responses
  - 500 (Lỗi hệ thống – xem mục "Lỗi 500 hệ thống (chung)" ở phần 10)

### 7.2 Danh sách theo tỉnh (public)

- Path: /province/{provinceId}
- Method: GET
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách quận/huyện thành công",
    "data": [{ "id": 10, "code": "Q1", "name": "Quận 1" }]
  }
  ```
- Error responses
  - 400 (provinceId invalid): xem mục 10 → “Lỗi 400 (chung)” (type mismatch)
  - 404 (provinceId không tồn tại): message theo messages_vi: "Tỉnh thành không tồn tại"

### 7.3 Lấy theo id (public)

- Path: /{id}
- Method: GET
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy quận/huyện thành công",
    "data": { "id": 10, "code": "Q1", "name": "Quận 1" }
  }
  ```
- Error responses
  - 400 (id invalid): xem mục 10 → “Lỗi 400 (chung)”
  - 404 (không tìm thấy): message theo messages_vi: "Quận/huyện không tồn tại"

### 7.4 Tạo (ADMIN)

- Method: POST
- Body: DistrictRequest (code,name,provinceId)
- Body ví dụ
  ```json
  { "code": "Q1", "name": "Quận 1", "provinceId": 2 }
  ```
- Success 201
  ```json
  {
    "status": 201,
    "message": "Tạo quận/huyện thành công",
    "data": { "id": 10, "code": "Q1", "name": "Quận 1" }
  }
  ```
- Error responses
  - 400 (body invalid)
    ```json
    {
      "timestamp": "2025-10-08T12:50:00.000",
      "status": 400,
      "path": "/workify/api/v1/districts",
      "error": "Bad Request",
      "message": "Dữ liệu trong request body không hợp lệ"
    }
    ```
  - 409 (trùng code)
    ```json
    {
      "timestamp": "2025-10-08T12:50:30.000",
      "status": 409,
      "path": "/workify/api/v1/districts",
      "error": "Conflict",
      "message": "Mã quận/huyện đã tồn tại"
    }
    ```

### 7.5 Cập nhật (ADMIN)

- Path: /{id}
- Method: PUT
- Body: DistrictRequest
- Body ví dụ
  ```json
  { "code": "Q1", "name": "Quận 1 (updated)", "provinceId": 2 }
  ```
- Success 200
  ```json
  {
    "status": 200,
    "message": "Cập nhật quận/huyện thành công",
    "data": { "id": 10, "code": "Q1", "name": "Quận 1 (updated)" }
  }
  ```
- Error responses
  - 400 (id/body invalid)
  - 404 (không tìm thấy)
    ```json
    {
      "timestamp": "2025-10-08T12:51:00.000",
      "status": 404,
      "path": "/workify/api/v1/districts/9999",
      "error": "Not Found",
      "message": "Không tìm thấy tài nguyên"
    }
    ```
  - 409 (trùng code)
    ```json
    {
      "timestamp": "2025-10-08T12:51:30.000",
      "status": 409,
      "path": "/workify/api/v1/districts/10",
      "error": "Conflict",
      "message": "Mã quận/huyện đã tồn tại"
    }
    ```

### 7.6 Xóa (ADMIN)

- Path: /{id}
- Method: DELETE
- Success 200
  ```json
  { "status": 200, "message": "Xóa quận/huyện thành công" }
  ```
- Error responses
  - 400 (id invalid)
    ```json
    {
      "timestamp": "2025-10-08T12:52:00.000",
      "status": 400,
      "path": "/workify/api/v1/districts/abc",
      "error": "Bad Request",
      "message": "Tham số id phải có kiểu Long"
    }
    ```
  - 404 (không tìm thấy)
    ```json
    {
      "timestamp": "2025-10-08T12:52:30.000",
      "status": 404,
      "path": "/workify/api/v1/districts/9999",
      "error": "Not Found",
      "message": "Không tìm thấy tài nguyên"
    }
    ```

---

## 8) Vai trò (Roles)

Base: /workify/api/v1/roles

Lưu ý: Trong cấu hình bảo mật, nhóm /roles yêu cầu ADMIN.

### 8.1 Danh sách vai trò (ADMIN)

- Method: GET
- Response: List<RoleResponse>
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách vai trò thành công",
    "data": [
      { "id": 1, "name": "ADMIN" },
      { "id": 2, "name": "JOB_SEEKER" }
    ]
  }
  ```
- Error responses
  - 401/403 (không đủ quyền)
    ```json
    {
      "timestamp": "2025-10-08T12:34:00.000",
      "status": 403,
      "path": "/workify/api/v1/roles",
      "error": "Forbidden",
      "message": "Không có quyền truy cập"
    }
    ```

### 8.2 Lấy theo tên (ADMIN)

- Path: /{name}
- Method: GET
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy vai trò thành công",
    "data": { "id": 1, "name": "ADMIN" }
  }
  ```
- Error responses
  - 401/403 (không đủ quyền)
  - 404 (không tìm thấy)
    ```json
    {
      "timestamp": "2025-10-08T12:34:30.000",
      "status": 404,
      "path": "/workify/api/v1/roles/UNKNOWN",
      "error": "Not Found",
      "message": "Không tìm thấy tài nguyên"
    }
    ```

### 8.3 Tạo (ADMIN)

- Method: POST
- Body: RoleRequest
- Body ví dụ
  ```json
  { "name": "EMPLOYER" }
  ```
- Success 201
  ```json
  {
    "status": 201,
    "message": "Tạo vai trò thành công",
    "data": { "id": 3, "name": "EMPLOYER" }
  }
  ```
- Error responses
  - 400 (body invalid)
  - 409 (trùng tên vai trò)
    ```json
    {
      "timestamp": "2025-10-08T12:35:00.000",
      "status": 409,
      "path": "/workify/api/v1/roles",
      "error": "Conflict",
      "message": "Vai trò đã tồn tại"
    }
    ```

### 8.4 Cập nhật (ADMIN)

- Method: PUT
- Query param: id (>=1)
- Body: RoleRequest
- Body ví dụ
  ```json
  { "name": "EMPLOYER" }
  ```
- Success 200
  ```json
  {
    "status": 200,
    "message": "Cập nhật vai trò thành công",
    "data": { "id": 3, "name": "EMPLOYER" }
  }
  ```
- Error responses
  - 400 (id/body invalid)
  - 404 (không tìm thấy)
    ```json
    {
      "timestamp": "2025-10-08T12:53:00.000",
      "status": 404,
      "path": "/workify/api/v1/roles",
      "error": "Not Found",
      "message": "Không tìm thấy tài nguyên"
    }
    ```
  - 409 (trùng tên vai trò)
    ```json
    {
      "timestamp": "2025-10-08T12:53:30.000",
      "status": 409,
      "path": "/workify/api/v1/roles",
      "error": "Conflict",
      "message": "Vai trò đã tồn tại"
    }
    ```

### 8.5 Xóa (ADMIN)

- Path: /{id}
- Method: DELETE
- Success 200
  ```json
  { "status": 200, "message": "Xóa vai trò thành công" }
  ```
- Error responses
  - 400 (id invalid)
    ```json
    {
      "timestamp": "2025-10-08T12:54:00.000",
      "status": 400,
      "path": "/workify/api/v1/roles/abc",
      "error": "Bad Request",
      "message": "Tham số id phải có kiểu Long"
    }
    ```
  - 404 (không tìm thấy)
    ```json
    {
      "timestamp": "2025-10-08T12:54:30.000",
      "status": 404,
      "path": "/workify/api/v1/roles/9999",
      "error": "Not Found",
      "message": "Không tìm thấy tài nguyên"
    }
    ```

---

## 9) Ngành nghề (Industries)

Base: /workify/api/v1/industries

Lưu ý chung:

- Public endpoints: GET /all, GET /, GET /{id}
- ADMIN endpoints: POST, PUT /{id}, DELETE /{id}
- Sorts whitelist: name, engName, createdAt, updatedAt
- keyword: tìm theo name, engName, description (không phân biệt hoa thường)

### 9.0 Danh sách tất cả (public, không phân trang)

- Path: /all
- Method: GET
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách ngành nghề thành công",
    "data": [
      {
        "id": 1,
        "name": "CNTT - Phần mềm",
        "engName": "IT - Software",
        "description": null
      },
      {
        "id": 2,
        "name": "Ngân hàng / Chứng khoán",
        "engName": "Banking / Securities",
        "description": null
      }
    ]
  }
  ```

### 9.1 Danh sách (public, có phân trang)

- Method: GET
- Query:
  - pageNumber (>=1), pageSize (>=1)
  - sorts: `field:asc|desc`; whitelist: name, engName, createdAt, updatedAt
  - keyword: tìm theo name/engName/description
- Ví dụ: /workify/api/v1/industries?pageNumber=1&pageSize=10&sorts=name:asc&keyword=it
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách ngành nghề thành công",
    "data": {
      "pageNumber": 1,
      "pageSize": 10,
      "totalPages": 1,
      "numberOfElements": 2,
      "items": [
        {
          "id": 1,
          "name": "CNTT - Phần mềm",
          "engName": "IT - Software",
          "description": null
        },
        {
          "id": 3,
          "name": "CNTT - Phần cứng / Mạng",
          "engName": "IT - Hardware / Networking",
          "description": null
        }
      ]
    }
  }
  ```
- Error responses
  - 400 (params invalid)

### 9.2 Lấy theo id (public)

- Path: /{id}
- Method: GET
- Success 200
  ```json
  {
    "status": 200,
    "message": "Lấy ngành nghề thành công",
    "data": {
      "id": 1,
      "name": "CNTT - Phần mềm",
      "engName": "IT - Software",
      "description": null
    }
  }
  ```
- Error responses
  - 400 (id invalid)
  - 404 (không tìm thấy)

### 9.3 Tạo (ADMIN)

- Method: POST
- Body: IndustryRequest
  ```json
  {
    "name": "Tiếp thị",
    "engName": "Marketing",
    "description": "Mảng marketing tổng hợp",
    "categoryJobId": 1
  }
  ```
- Success 201
  ```json
  {
    "status": 201,
    "message": "Tạo ngành nghề thành công",
    "data": {
      "id": 100,
      "name": "Tiếp thị",
      "engName": "Marketing",
      "description": "Mảng marketing tổng hợp",
      "categoryJobId": 1
    }
  }
  ```
- Error responses
  - 400 (body invalid)
  - 409 (trùng name hoặc engName)

### 9.4 Cập nhật (ADMIN)

- Path: /{id}
- Method: PUT
- Body: IndustryRequest
  - Lưu ý: từ phiên bản này, cập nhật yêu cầu truyền đầy đủ các trường hợp lệ như khi tạo (không còn OnUpdate bỏ qua null).
  - Các ràng buộc validate giống phần tạo.

  - Ví dụ body:

  ```json
  {
    "name": "Tiếp thị (updated)",
    "engName": "Marketing",
    "description": "Updated",
    "categoryJobId": 2
  }
  ```

- Success 200

```json
{
  "status": 200,
  "message": "Cập nhật ngành nghề thành công",
  "data": {
    "id": 100,
    "name": "Tiếp thị (updated)",
    "engName": "Marketing",
    "description": "Updated"
  }
}
```

- Error responses
  - 400 (id/body invalid)
  - 404 (không tìm thấy)
  - 409 (trùng name hoặc engName)

### 9.5 Xóa (ADMIN)

- Path: /{id}
- Method: DELETE
- Success 200
  ```json
  { "status": 200, "message": "Xóa ngành nghề thành công" }
  ```
- Error responses
  - 400 (id invalid)
  - 404 (không tìm thấy)

### 9.6 Models

- IndustryRequest

  ```json
  {
    "name": "string (required, max 255)",
    "engName": "string (required, max 255)",
    "description": "string (optional, max 1000)",
    "categoryJobId": "number (required, >= 1)"
  }
  ```

- IndustryResponse
  ```json
  {
    "id": 1,
    "createdAt": "2025-10-13T10:00:00.000",
    "updatedAt": "2025-10-13T10:00:00.000",
    "name": "CNTT - Phần mềm",
    "engName": "IT - Software",
    "description": null
  }
  ```

Ghi chú validation:

- name: notBlank, length ≤ 255; unique
- engName: notBlank, length ≤ 255; unique
- description: length ≤ 1000
- categoryJobId: notNull, min 1; phải tồn tại trong Category Job

---

## 10) Danh mục công việc (Category Jobs)

Base: /workify/api/v1/categories-job

### 10.1 Lấy tất cả

- Path: /all
- Method: GET
- Success 200 (List<CategoryJobResponse>) – ví dụ rút gọn:
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách danh mục công việc thành công",
    "data": [
      {
        "id": 1,
        "name": "CNTT",
        "engName": "IT",
        "description": null,
        "createdAt": "2025-10-13T10:00:00",
        "updatedAt": "2025-10-13T10:00:00"
      }
    ]
  }
  ```

### 10.2 Phân trang + tìm kiếm + sắp xếp

- Path: ""
- Method: GET
- Query:
  - pageNumber: number (>=1, default 1)
  - pageSize: number (>=1, default 10)
  - sorts: list field,dir (cho phép: name, createdAt, updatedAt)
  - keyword: string (tìm theo name/engName/description – không phân biệt hoa thường)
- Success 200 (PageResponse<List<CategoryJobResponse>>)
  - Ví dụ response rút gọn:
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách danh mục công việc thành công",
    "data": {
      "pageNumber": 1,
      "pageSize": 10,
      "totalPages": 2,
      "numberOfElements": 10,
      "items": [
        {
          "id": 1,
          "name": "CNTT",
          "engName": "IT",
          "description": null,
          "createdAt": "2025-10-13T10:00:00",
          "updatedAt": "2025-10-13T10:00:00"
        }
      ]
    }
  }
  ```

### 10.3 Lấy theo id

- Path: /{id}
- Method: GET
- Success 200 (CategoryJobResponse)
  ```json
  {
    "status": 200,
    "message": "Lấy danh mục công việc thành công",
    "data": {
      "id": 1,
      "name": "CNTT",
      "engName": "IT",
      "description": null,
      "createdAt": "2025-10-13T10:00:00.000",
      "updatedAt": "2025-10-13T10:00:00.000"
    }
  }
  ```
- Error responses: 400 (id invalid), 404 (không tìm thấy)

### 10.4 Tạo (ADMIN)

- Method: POST
- Body: CategoryJobRequest
  ```json
  {
    "name": "CNTT",
    "engName": "IT",
    "description": "Danh mục CNTT"
  }
  ```
- Success 201 (CategoryJobResponse)
  ```json
  {
    "status": 201,
    "message": "Tạo danh mục công việc thành công",
    "data": {
      "id": 10,
      "name": "CNTT",
      "engName": "IT",
      "description": "Danh mục CNTT",
      "createdAt": "2025-10-13T10:05:00.000",
      "updatedAt": "2025-10-13T10:05:00.000"
    }
  }
  ```
- Error responses: 400 (body invalid), 409 (trùng name hoặc engName)

### 10.5 Cập nhật (ADMIN)

- Path: /{id}
- Method: PUT
- Body: CategoryJobRequest (yêu cầu truyền đầy đủ các trường hợp lệ như khi tạo)
  ```json
  {
    "name": "Công nghệ thông tin",
    "engName": "Information Technology",
    "description": "Danh mục CNTT (cập nhật)"
  }
  ```
- Success 200 (CategoryJobResponse)
  ```json
  {
    "status": 200,
    "message": "Cập nhật danh mục công việc thành công",
    "data": {
      "id": 10,
      "name": "Công nghệ thông tin",
      "engName": "Information Technology",
      "description": "Danh mục CNTT (cập nhật)",
      "createdAt": "2025-10-13T10:05:00.000",
      "updatedAt": "2025-10-13T10:10:00.000"
    }
  }
  ```
- Error responses: 400 (id/body invalid), 404 (không tìm thấy), 409 (trùng name hoặc engName)

### 10.6 Xóa (ADMIN)

- Path: /{id}
- Method: DELETE
- Success 200: { "status": 200, "message": "Xóa danh mục công việc thành công" }
- Error responses: 400 (id invalid), 404 (không tìm thấy)

### 10.7 Models

- CategoryJobRequest

  ```json
  {
    "name": "string (required, max 255)",
    "engName": "string (required, max 255)",
    "description": "string (optional, max 1000)"
  }
  ```

- CategoryJobResponse
  ```json
  {
    "id": 1,
    "createdAt": "2025-10-13T10:00:00.000",
    "updatedAt": "2025-10-13T10:00:00.000",
    "name": "CNTT",
    "engName": "IT",
    "description": null,
    "industries": "List<PopularIndustryResponse> (optional, chỉ có ở một số API tổng hợp)"
  }
  ```

Ghi chú validation:

- name: notBlank, length ≤ 255; unique
- engName: notBlank, length ≤ 255; unique
- description: length ≤ 1000

---

### 10.8 Ngành nghề theo từng danh mục kèm số job đang tuyển (public)

- Path: /industries/job-count
- Method: GET
- Mô tả: Trả về danh sách CategoryJob, mỗi phần tử có trường industries là List<PopularIndustryResponse> gồm id, name, engName, description và jobCount (số job APPROVED của ngành đó trong danh mục).
- Success 200 (List<CategoryJobResponse>) – ví dụ:

```json
{
  "status": 200,
  "message": "Lấy danh sách danh mục công việc thành công",
  "data": [
    {
      "id": 1,
      "createdAt": "2025-10-13T10:00:00.000",
      "updatedAt": "2025-10-13T10:00:00.000",
      "name": "CNTT",
      "engName": "IT",
      "description": null,
      "industries": [
        {
          "id": 3,
          "name": "Lập trình Backend",
          "engName": "Backend Development",
          "description": null,
          "jobCount": 124
        },
        {
          "id": 5,
          "name": "Kiểm thử phần mềm",
          "engName": "Software Testing",
          "description": null,
          "jobCount": 78
        }
      ]
    },
    {
      "id": 2,
      "createdAt": "2025-10-13T10:00:00.000",
      "updatedAt": "2025-10-13T10:00:00.000",
      "name": "Giáo dục",
      "engName": "Education",
      "description": null,
      "industries": [
        {
          "id": 8,
          "name": "Giảng dạy CNTT",
          "engName": "IT Teaching",
          "description": null,
          "jobCount": 35
        }
      ]
    }
  ]
}
```

## 11) Công việc (Jobs)

Base: /workify/api/v1/jobs

### 11.0 Enum và mô tả tiếng Việt

- LevelCompanySize
  - LESS_THAN_10: Dưới 10 nhân sự
  - FROM_10_TO_24: 10–24 nhân sự
  - FROM_25_TO_99: 25–99 nhân sự
  - FROM_100_TO_499: 100–499 nhân sự
  - FROM_500_TO_999: 500–999 nhân sự
  - FROM_1000_TO_4999: 1.000–4.999 nhân sự
  - FROM_5000_TO_9999: 5.000–9.999 nhân sự
  - FROM_10000_TO_19999: 10.000–19.999 nhân sự
  - FROM_20000_TO_49999: 20.000–49.999 nhân sự
  - MORE_THAN_50000: Trên 50.000 nhân sự

- SalaryType
  - RANGE: Khoảng lương (cần minSalary, maxSalary, salaryUnit)
  - GREATER_THAN: Trên mức (cần minSalary, salaryUnit)
  - NEGOTIABLE: Thỏa thuận
  - COMPETITIVE: Cạnh tranh

- SalaryUnit
  - VND: Việt Nam Đồng
  - USD: Đô la Mỹ

- EducationLevel
  - HIGH_SCHOOL: THPT
  - COLLEGE: Cao đẳng
  - UNIVERSITY: Đại học
  - POSTGRADUATE: Sau đại học
  - MASTER: Thạc sĩ
  - DOCTORATE: Tiến sĩ
  - OTHER: Khác

- ExperienceLevel
  - LESS_THAN_ONE_YEAR: Dưới 1 năm
  - ONE_TO_TWO_YEARS: 1–2 năm
  - TWO_TO_FIVE_YEARS: 2–5 năm
  - FIVE_TO_TEN_YEARS: 5–10 năm
  - MORE_THAN_TEN_YEARS: Trên 10 năm

- JobLevel
  - INTERN: Thực tập
  - ENTRY_LEVEL: Mới ra trường/Junior
  - STAFF: Nhân viên
  - ENGINEER: Kỹ sư
  - SUPERVISOR: Giám sát
  - MANAGER: Quản lý
  - DIRECTOR: Giám đốc
  - SENIOR_MANAGER: Quản lý cấp cao
  - EXECUTIVE: Lãnh đạo cấp cao

- JobType
  - FULL_TIME: Toàn thời gian
  - TEMPORARY_FULL_TIME: Toàn thời gian thời vụ
  - PART_TIME: Bán thời gian
  - TEMPORARY_PART_TIME: Bán thời gian thời vụ
  - CONTRACT: Hợp đồng
  - OTHER: Khác

- JobGender
  - MALE: Nam
  - FEMALE: Nữ
  - ANY: Bất kỳ

- AgeType
  - NONE: Không yêu cầu độ tuổi
  - ABOVE: Trên một độ tuổi (cần minAge)
  - BELOW: Dưới một độ tuổi (cần maxAge)
  - INPUT: Trong khoảng (cần cả minAge và maxAge, minAge <= maxAge)

- JobStatus
  - DRAFT: Nháp
  - PENDING: Chờ duyệt
  - APPROVED: Đã duyệt (công khai)
  - REJECTED: Bị từ chối
  - CLOSED: Đã đóng
  - EXPIRED: Hết hạn
- BenefitType
  - TRAVEL_OPPORTUNITY: Cơ hội du lịch
  - BONUS_GIFT: Thưởng/Quà
  - SHUTTLE_BUS: Xe đưa đón
  - INSURANCE: Bảo hiểm
  - LAPTOP_MONITOR: Laptop/Monitor
  - HEALTH_CARE: Chăm sóc sức khỏe
  - PAID_LEAVE: Nghỉ phép có lương
  - FLEXIBLE_REMOTE_WORK: Làm việc từ xa linh hoạt
  - SALARY_REVIEW: Xét lương
  - TEAM_BUILDING: Team Building
  - TRAINING: Đào tạo
  - SNACKS_PANTRY: Đồ ăn nhẹ/Pantry
  - WORK_ENVIRONMENT: Môi trường làm việc
  - CHILD_CARE: Chăm sóc trẻ
  - OTHER: Khác

### 11.1 Tìm kiếm nâng cao (public)

- Path: /advanced
- Method: GET
- Query parameters:
  - keyword: Từ khóa tìm kiếm theo jobTitle/companyName/nội dung
  - industryIds: danh sách id ngành (List<Long> dạng query lặp: industryIds=1&industryIds=2 hoặc industryIds=1,2,3)
  - provinceIds: danh sách id tỉnh/thành (List<Long>)
  - jobLevels: List<JobLevel>
  - jobTypes: List<JobType>
  - experienceLevels: List<ExperienceLevel>
  - educationLevels: List<EducationLevel>
  - postedWithinDays (>=1): Lọc theo ngày tạo gần đây (vd 7 ngày gần nhất)
  - minSalary (>=0), maxSalary (>=0), salaryUnit (SalaryUnit)
  - sort: createdAt|updatedAt|expirationDate (tương đương đương với mới nhất|mới cập nhật|sắp hết hạn, chỉ truyền 1 trong 3, hoặc k truyền.)
  - pageNumber (>=1), pageSize (>=1)
- Ví dụ URL:

```text
/workify/api/v1/jobs/advanced?keyword=java%20developer&provinceIds=1,2,3&jobLevels=STAFF&jobTypes=FULL_TIME,PART_TIME&experienceLevels=TWO_TO_FIVE_YEARS&educationLevels=UNIVERSITY&minSalary=1500&maxSalary=3000&sort=updatedAt
```

- Success 200 (ví dụ):

```json
{
  "status": 200,
  "message": "Lấy danh sách công việc thành công",
  "data": {
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 5,
    "numberOfElements": 10,
    "items": [
      {
        "id": 1,
        "createdAt": "2025-10-19T13:20:28.225794",
        "updatedAt": "2025-10-19T13:45:05.13037",
        "companyName": "GreenFarm Co., Ltd",
        "companySize": "FROM_10000_TO_19999",
        "companyWebsite": "https://greenfarm.vn",
        "aboutCompany": "Doanh nghiệp nông nghiệp công nghệ cao, cung cấp sản phẩm hữu cơ sạch.",
        "jobTitle": "Kỹ sư Nông nghiệp - Quản lý Trang trại",
        "jobLocations": [
          {
            "id": 2,
            "createdAt": "2025-10-19T13:20:28.233341",
            "updatedAt": "2025-10-19T13:20:28.233341",
            "province": {
              "id": 5,
              "createdAt": "2025-10-19T13:18:40.216562",
              "updatedAt": "2025-10-19T13:18:40.216562",
              "code": "8",
              "name": "Tuyên Quang",
              "engName": "Tuyen Quang",
              "provinceSlug": "tuyên-quang"
            },
            "district": {
              "id": 3,
              "createdAt": "2025-10-19T13:18:40.008265",
              "updatedAt": "2025-10-19T13:18:40.008265",
              "code": "3",
              "name": "Quận Tây Hồ",
              "districtSlug": "quận-tây-hồ"
            },
            "detailAddress": "Thị trấn Bến Lức"
          }
        ],
        "salaryType": "RANGE",
        "minSalary": 7000000.0,
        "maxSalary": 1.2e7,
        "salaryUnit": "VND",
        "jobDescription": "Giám sát trồng trọt, thu hoạch và quy trình chăm sóc cây trồng.",
        "requirement": "Tốt nghiệp ngành nông học hoặc công nghệ sinh học.",
        "jobBenefits": [
          {
            "type": "TRAVEL_OPPORTUNITY",
            "description": "Du lich cong ty"
          },
          {
            "type": "TRAINING",
            "description": "Dao tao bai ban"
          }
        ],
        "educationLevel": "COLLEGE",
        "experienceLevel": "TWO_TO_FIVE_YEARS",
        "jobLevel": "SUPERVISOR",
        "jobType": "TEMPORARY_FULL_TIME",
        "gender": "MALE",
        "jobCode": "JOB003",
        "industries": [
          {
            "id": 8,
            "createdAt": "2025-10-19T13:18:42.097223",
            "updatedAt": "2025-10-19T13:18:42.097223",
            "name": "Bất động sản",
            "engName": "Real Estate",
            "description": null
          }
        ],
        "ageType": "ABOVE",
        "minAge": 25,
        "maxAge": 40,
        "contactPerson": "Trần Văn Minh",
        "phoneNumber": "+84984455678",
        "contactLocation": {
          "id": 1,
          "createdAt": "2025-10-19T13:20:28.221573",
          "updatedAt": "2025-10-19T13:20:28.221573",
          "province": {
            "id": 5,
            "createdAt": "2025-10-19T13:18:40.216562",
            "updatedAt": "2025-10-19T13:18:40.216562",
            "code": "8",
            "name": "Tuyên Quang",
            "engName": "Tuyen Quang",
            "provinceSlug": "tuyên-quang"
          },
          "district": {
            "id": 3,
            "createdAt": "2025-10-19T13:18:40.008265",
            "updatedAt": "2025-10-19T13:18:40.008265",
            "code": "3",
            "name": "Quận Tây Hồ",
            "districtSlug": "quận-tây-hồ"
          },
          "detailAddress": "Thị trấn Bến Lức"
        },
        "description": "Chế độ đãi ngộ tốt, có chỗ ở tại trang trại.",
        "expirationDate": "2025-12-15",
        "status": "APPROVED",
        "author": {
          "id": 1,
          "createdAt": "2025-10-19T13:20:07.673165",
          "updatedAt": "2025-10-19T13:20:07.673165",
          "email": "caubesuuca123@gmail.com",
          "companyName": "string",
          "avatarUrl": null,
          "backgroundUrl": null,
          "employerSlug": "string"
        }
      }
    ]
  }
}
```

- Error responses
  - 400 (params invalid/type mismatch/enum sai)
  - Ghi chú: chỉ trả các job status=APPROVED.

### 11.2 Danh sách tất cả (ADMIN)

- Path: /all
- Method: GET
- Role: ADMIN
- Query:
  - pageNumber, pageSize
  - industryId (Long>=1), provinceId (Long>=1)
  - sorts: field:asc|desc; whitelist: jobTitle, createdAt, updatedAt, expirationDate, status
  - keyword: tìm theo jobTitle, companyName, jobDescription, requirement
- Ví dụ:

```text
/workify/api/v1/jobs/all?pageNumber=1&pageSize=10&sorts=createdAt:desc&keyword=spring&industryId=1&provinceId=1
```

- Success 200: PageResponse<List<JobResponse>>
- Error 400/401/403

### 11.3 Danh sách công việc của tôi (EMPLOYER)

- Path: /me
- Method: GET
- Role: EMPLOYER
- Query: giống 12.2 (industryId, provinceId, sorts, keyword, pageNumber, pageSize)
- Ví dụ:

```text
/workify/api/v1/jobs/me?pageNumber=1&pageSize=10&sorts=updatedAt:desc&keyword=intern
```

- Success 200: PageResponse<List<JobResponse>> (chỉ job của employer hiện tại)
- Error 400/401/403

### 11.4 Ngành nghề đang tuyển của tôi (EMPLOYER)

- Path: /me/industries/current
- Method: GET
- Role: EMPLOYER
- Success 200 (List<IndustryResponse>) – ví dụ rút gọn:

```json
{
  "status": 200,
  "message": "Lấy danh sách địa điểm làm việc thành công",
  "data": [
    {
      "id": 4,
      "createdAt": "2025-10-19T13:18:40.186487",
      "updatedAt": "2025-10-19T13:18:40.186487",
      "code": "6",
      "name": "Bắc Kạn",
      "engName": "Bac Kan",
      "provinceSlug": "bắc-kạn"
    },
    {
      "id": 5,
      "createdAt": "2025-10-19T13:18:40.216562",
      "updatedAt": "2025-10-19T13:18:40.216562",
      "code": "8",
      "name": "Tuyên Quang",
      "engName": "Tuyen Quang",
      "provinceSlug": "tuyên-quang"
    }
  ]
}
```

- Error 401/403

### 11.5 Địa điểm đang tuyển của tôi (EMPLOYER)

- Path: /me/locations/current
- Method: GET
- Role: EMPLOYER
- Success 200 (List<ProvinceResponse>) – ví dụ rút gọn:

```json
{
  "status": 200,
  "message": "Lấy danh sách địa điểm làm việc thành công",
  "data": [
    {
      "id": 1,
      "code": "1",
      "name": "Hà Nội",
      "engName": "Ha Noi",
      "provinceSlug": "hà-nội"
    },
    {
      "id": 79,
      "code": "79",
      "name": "TP. Hồ Chí Minh",
      "engName": "Ho Chi Minh City",
      "provinceSlug": "tp-hồ-chí-minh"
    }
  ]
}
```

- Error 401/403

### 11.6 Lấy công việc theo id (public)

- Path: /{id}
- Method: GET
- Quy tắc truy cập:
  - Nếu job.status = APPROVED: ai cũng xem được (public)
  - Ngược lại: chỉ ADMIN hoặc EMPLOYER là tác giả job mới xem được; nếu không sẽ lỗi 403
- Success 200: JobResponse (đầy đủ – ví dụ rút gọn)

```json
{
  "status": 200,
  "message": "Lấy thông tin công việc thành công",
  "data": {
    "id": 5,
    "createdAt": "2025-10-19T13:45:45.88274",
    "updatedAt": "2025-10-19T13:50:51.989907",
    "companyName": "NextGen Robotics",
    "companySize": "FROM_10000_TO_19999",
    "companyWebsite": "https://nextgenrobotics.com",
    "aboutCompany": "A global leader in autonomous robotics solutions.",
    "jobTitle": "Embedded System Engineer",
    "jobLocations": [
      {
        "id": 18,
        "createdAt": "2025-10-19T13:53:59.032868",
        "updatedAt": "2025-10-19T13:53:59.032868",
        "province": {
          "id": 4,
          "createdAt": "2025-10-19T13:18:40.186487",
          "updatedAt": "2025-10-19T13:18:40.186487",
          "code": "6",
          "name": "Bắc Kạn",
          "engName": "Bac Kan",
          "provinceSlug": "bắc-kạn"
        },
        "district": {
          "id": 1,
          "createdAt": "2025-10-19T13:18:39.999151",
          "updatedAt": "2025-10-19T13:18:39.999151",
          "code": "1",
          "name": "Quận Ba Đình",
          "districtSlug": "quận-ba-đình"
        },
        "detailAddress": "99 Vo Nguyen Giap"
      }
    ],
    "salaryType": "RANGE",
    "minSalary": 2000.0,
    "maxSalary": 3000.0,
    "salaryUnit": "USD",
    "jobDescription": "Develop firmware for industrial robots.",
    "requirement": "C/C++ and microcontroller experience required.",
    "jobBenefits": [
      {
        "type": "TRAVEL_OPPORTUNITY",
        "description": "Du lich cong ty"
      },
      {
        "type": "TRAINING",
        "description": "Dao tao bai ban"
      }
    ],
    "educationLevel": "MASTER",
    "experienceLevel": "MORE_THAN_TEN_YEARS",
    "jobLevel": "SUPERVISOR",
    "jobType": "FULL_TIME",
    "gender": "MALE",
    "jobCode": "JOB004",
    "industries": [
      {
        "id": 3,
        "createdAt": "2025-10-19T13:18:42.063384",
        "updatedAt": "2025-10-19T13:18:42.063384",
        "name": "Bán hàng / Kinh doanh",
        "engName": "Sales / Business",
        "description": null
      },
      {
        "id": 5,
        "createdAt": "2025-10-19T13:18:42.079498",
        "updatedAt": "2025-10-19T13:18:42.079498",
        "name": "Báo chí / Biên tập viên / Xuất bản",
        "engName": "Journalism / Editing / Publishing",
        "description": null
      }
    ],
    "ageType": "ABOVE",
    "minAge": 28,
    "maxAge": 45,
    "contactPerson": "Pham Van D",
    "phoneNumber": "+84987651234",
    "contactLocation": {
      "id": 9,
      "createdAt": "2025-10-19T13:45:45.880198",
      "updatedAt": "2025-10-19T13:50:51.975537",
      "province": {
        "id": 4,
        "createdAt": "2025-10-19T13:18:40.186487",
        "updatedAt": "2025-10-19T13:18:40.186487",
        "code": "6",
        "name": "Bắc Kạn",
        "engName": "Bac Kan",
        "provinceSlug": "bắc-kạn"
      },
      "district": {
        "id": 2,
        "createdAt": "2025-10-19T13:18:40.004465",
        "updatedAt": "2025-10-19T13:18:40.004465",
        "code": "2",
        "name": "Quận Hoàn Kiếm",
        "districtSlug": "quận-hoàn-kiếm"
      },
      "detailAddress": "15 Ly Thai To"
    },
    "description": "Join world-class robotics R&D team.",
    "expirationDate": "2025-12-01",
    "status": "APPROVED",
    "author": {
      "id": 1,
      "createdAt": "2025-10-19T13:20:07.673165",
      "updatedAt": "2025-10-19T13:20:07.673165",
      "email": "caubesuuca123@gmail.com",
      "companyName": "string",
      "avatarUrl": null,
      "backgroundUrl": null,
      "employerSlug": "string"
    }
  }
}
```

- Error responses
  - 400 (id invalid)
  - 403 (không đủ quyền khi job chưa APPROVED)
  - 404 (không tìm thấy job)

### 11.7 Công việc đang tuyển dụng của một employer (public)

- Path: /openings/{employerId}
- Method: GET
- Query:
  - pageNumber (>=1, default 1)
  - pageSize (>=1, default 10)
  - sorts: field:asc|desc (ví dụ: createdAt,desc)
- Validate:
  - employerId: Long >= 1
- Success 200: PageResponse<List<JobResponse>> – ví dụ URL

```text
/workify/api/v1/jobs/openings/123?pageNumber=1&pageSize=10&sorts=createdAt,desc
```

- Ví dụ response đầy đủ (PageResponse<List<JobResponse>>):

```json
{
  "status": 200,
  "message": "Lấy danh sách công việc đang tuyển của employer thành công",
  "data": {
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 1,
    "numberOfElements": 1,
    "items": [
      {
        "id": 5,
        "createdAt": "2025-10-19T13:45:45.88274",
        "updatedAt": "2025-10-19T13:50:51.989907",
        "companyName": "NextGen Robotics",
        "companySize": "FROM_10000_TO_19999",
        "companyWebsite": "https://nextgenrobotics.com",
        "aboutCompany": "A global leader in autonomous robotics solutions.",
        "jobTitle": "Embedded System Engineer",
        "jobLocations": [
          {
            "id": 18,
            "createdAt": "2025-10-19T13:53:59.032868",
            "updatedAt": "2025-10-19T13:53:59.032868",
            "province": {
              "id": 4,
              "createdAt": "2025-10-19T13:18:40.186487",
              "updatedAt": "2025-10-19T13:18:40.186487",
              "code": "6",
              "name": "Bắc Kạn",
              "engName": "Bac Kan",
              "provinceSlug": "bắc-kạn"
            },
            "district": {
              "id": 1,
              "createdAt": "2025-10-19T13:18:39.999151",
              "updatedAt": "2025-10-19T13:18:39.999151",
              "code": "1",
              "name": "Quận Ba Đình",
              "districtSlug": "quận-ba-đình"
            },
            "detailAddress": "99 Vo Nguyen Giap"
          }
        ],
        "salaryType": "RANGE",
        "minSalary": 2000.0,
        "maxSalary": 3000.0,
        "salaryUnit": "USD",
        "jobDescription": "Develop firmware for industrial robots.",
        "requirement": "C/C++ and microcontroller experience required.",
        "jobBenefits": [
          { "type": "TRAVEL_OPPORTUNITY", "description": "Du lich cong ty" },
          { "type": "TRAINING", "description": "Dao tao bai ban" }
        ],
        "educationLevel": "MASTER",
        "experienceLevel": "MORE_THAN_TEN_YEARS",
        "jobLevel": "SUPERVISOR",
        "jobType": "FULL_TIME",
        "gender": "MALE",
        "jobCode": "JOB004",
        "industries": [
          {
            "id": 3,
            "createdAt": "2025-10-19T13:18:42.063384",
            "updatedAt": "2025-10-19T13:18:42.063384",
            "name": "Bán hàng / Kinh doanh",
            "engName": "Sales / Business",
            "description": null
          },
          {
            "id": 5,
            "createdAt": "2025-10-19T13:18:42.079498",
            "updatedAt": "2025-10-19T13:18:42.079498",
            "name": "Báo chí / Biên tập viên / Xuất bản",
            "engName": "Journalism / Editing / Publishing",
            "description": null
          }
        ],
        "ageType": "ABOVE",
        "minAge": 28,
        "maxAge": 45,
        "contactPerson": "Pham Van D",
        "phoneNumber": "+84987651234",
        "contactLocation": {
          "id": 9,
          "createdAt": "2025-10-19T13:45:45.880198",
          "updatedAt": "2025-10-19T13:50:51.975537",
          "province": {
            "id": 4,
            "createdAt": "2025-10-19T13:18:40.186487",
            "updatedAt": "2025-10-19T13:18:40.186487",
            "code": "6",
            "name": "Bắc Kạn",
            "engName": "Bac Kan",
            "provinceSlug": "bắc-kạn"
          },
          "district": {
            "id": 2,
            "createdAt": "2025-10-19T13:18:40.004465",
            "updatedAt": "2025-10-19T13:18:40.004465",
            "code": "2",
            "name": "Quận Hoàn Kiếm",
            "districtSlug": "quận-hoàn-kiếm"
          },
          "detailAddress": "15 Ly Thai To"
        },
        "description": "Join world-class robotics R&D team.",
        "expirationDate": "2025-12-01",
        "status": "APPROVED",
        "author": {
          "id": 1,
          "createdAt": "2025-10-19T13:20:07.673165",
          "updatedAt": "2025-10-19T13:20:07.673165",
          "email": "caubesuuca123@gmail.com",
          "companyName": "string",
          "avatarUrl": null,
          "backgroundUrl": null,
          "employerSlug": "string"
        }
      }
    ]
  }
}
```

- Error 400 (id invalid)/404 (không tìm thấy dữ liệu phù hợp)

### 11.8 Địa điểm tuyển dụng phổ biến (public)

- Path: /locations/popular
- Method: GET
- Query: limit (>=1, mặc định 10)
- Success 200 (List<PopularLocationResponse>) – ví dụ rút gọn:

```json
{
  "status": 200,
  "message": "Lấy danh sách địa điểm làm việc phổ biến thành công",
  "data": [
    {
      "id": 1,
      "code": "1",
      "name": "Hà Nội",
      "engName": "Ha Noi",
      "provinceSlug": "hà-nội",
      "jobCount": 256
    }
  ]
}
```

- Error 400 (limit invalid)

### 11.9 Ngành nghề phổ biến (public)

- Path: /industries/popular
- Method: GET
- Query: limit (>=1, mặc định 10)
- Success 200 (List<PopularIndustryResponse>) – ví dụ:

```json
{
  "status": 200,
  "message": "Lấy danh sách ngành nghề phổ biến thành công",
  "data": [
    {
      "id": 1,
      "name": "CNTT",
      "engName": "Information Technology",
      "jobCount": 340
    }
  ]
}
```

- Error 400 (limit invalid)

### 11.10 Tạo công việc (EMPLOYER)

- Path: /
- Method: POST
- Role: EMPLOYER
- Body: JobRequest

```json
{
  "companyName": "EduSmart Academy",
  "companySize": "FROM_500_TO_999",
  "companyWebsite": "https://edusmart.vn",
  "aboutCompany": "Trung tâm đào tạo công nghệ hàng đầu, cung cấp khóa học lập trình và thiết kế.",
  "jobTitle": "Giảng viên Lập trình Web - Không yêu cầu kinh nghiệm giảng dạy",
  "jobLocations": [
    { "provinceId": 1, "districtId": 1, "detailAddress": "25 Trần Hưng Đạo" }
  ],
  "salaryType": "RANGE",
  "minSalary": 800,
  "maxSalary": 1500,
  "salaryUnit": "USD",
  "jobDescription": "Giảng dạy lập trình web front-end và back-end cho sinh viên.",
  "requirement": "Thành thạo HTML, CSS, JavaScript, có tinh thần học hỏi cao.",
  "jobBenefits": [
    {
      "type": "TRAVEL_OPPORTUNITY",
      "description": "Du lich cong ty"
    },
    {
      "type": "TRAINING",
      "description": "Dao tao bai ban"
    }
  ],
  "educationLevel": "UNIVERSITY",
  "experienceLevel": "ONE_TO_TWO_YEARS",
  "jobLevel": "STAFF",
  "jobType": "FULL_TIME",
  "gender": "ANY",
  "jobCode": "JOB001",
  "industryIds": [1, 4],
  "ageType": "ABOVE",
  "minAge": 22,
  "maxAge": 35,
  "contactPerson": "Nguyễn Thị Mai",
  "phoneNumber": "+84987776655",
  "contactLocation": {
    "provinceId": 1,
    "districtId": 1,
    "detailAddress": "25 Trần Hưng Đạo"
  },
  "description": "Môi trường năng động, hỗ trợ đào tạo nội bộ cho nhân viên mới.",
  "expirationDate": "28/11/2025"
}
```

- Validate JobRequest:
  - companyName: notBlank, max 1000
  - companySize: enum LevelCompanySize
  - companyWebsite: max 1000
  - aboutCompany: notBlank
  - jobTitle: notBlank, max 1000
  - jobLocations: notEmpty; từng phần tử LocationRequest: provinceId notNull, districtId notNull, detailAddress max 1000
  - salaryType: enum SalaryType
  - minSalary, maxSalary: >= 0 nếu gửi
  - salaryUnit: enum SalaryUnit (tùy SalaryType – xem dưới)
  - jobDescription: notBlank
  - requirement: notBlank
  - jobBenefits: type: enum BenefitType, desctipion: max 1000, not blank
  - educationLevel: enum EducationLevel
  - experienceLevel: enum ExperienceLevel
  - jobLevel: enum JobLevel
  - jobType: enum JobType
  - gender: enum JobGender
  - industryIds: notEmpty, từng phần tử Long notNull
  - ageType: enum AgeType
  - minAge/maxAge: 15–100 (khi gửi), theo AgeType
  - contactPerson: notBlank
  - phoneNumber: regex VN `^(?:\+84|0)[35789][0-9]{8}$`
  - contactLocation: LocationRequest notNull
  - expirationDate: notNull, Future, format dd/MM/yyyy

- Ràng buộc theo SalaryType (ValidSalary):
  - RANGE: bắt buộc minSalary, maxSalary, salaryUnit
  - GREATER_THAN: bắt buộc minSalary, salaryUnit
  - NEGOTIABLE/COMPETITIVE: không bắt buộc min/max/unit

- Ràng buộc theo AgeType (ValidAge):
  - ABOVE: bắt buộc minAge
  - BELOW: bắt buộc maxAge
  - INPUT: bắt buộc cả minAge và maxAge, và minAge <= maxAge
  - NONE: không bắt buộc min/max

- Success 201: JobResponse (đầy đủ)
- Error responses
  - 400: body invalid (vi phạm validate hoặc enum sai)
  - 401/403: không đủ quyền/không có JWT
  - 404: provinceId/districtId/industryIds không tồn tại

Ví dụ lỗi 400 (rút gọn):

```json
{
  "timestamp": "2025-10-19T10:30:00",
  "status": 400,
  "path": "/workify/api/v1/jobs",
  "error": "Bad Request",
  "message": "Dữ liệu trong request body không hợp lệ",
  "errors": [
    {
      "fieldName": "minSalary",
      "message": "Mức lương tối thiểu bắt buộc cho kiểu RANGE"
    },
    {
      "fieldName": "industryIds",
      "message": "Danh sách ngành nghề không được để trống"
    }
  ]
}
```

### 11.11 Cập nhật công việc (EMPLOYER)

- Path: /{id}
- Method: PUT
- Role: EMPLOYER (chỉ tác giả job mới cập nhật được)
- Body: JobRequest (các validate tương tự tạo mới; hệ thống cập nhật lại locations/industries theo dữ liệu gửi lên)
- Success 200: JobResponse
- Error 400/401/403 (không phải tác giả)/404 (job hoặc id liên quan không tồn tại)

### 11.12 Đóng tin tuyển dụng (EMPLOYER)

- Path: /close/{id}
- Method: PATCH
- Role: EMPLOYER (chỉ tác giả job)
- Hành vi: cập nhật status = CLOSED
- Success 200: { status, message }
- Error 400/401/403/404

### 11.13 Cập nhật trạng thái (ADMIN)

- Path: /status/{id}
- Method: PATCH
- Role: ADMIN
- Query: status (JobStatus) – ví dụ: APPROVED | REJECTED | CLOSED | PENDING | DRAFT | EXPIRED
- Success 200: { status, message }
- Error 400 (enum sai)/401/403/404

### 11.14 Xóa công việc (ADMIN hoặc EMPLOYER)

- Path: /{id}
- Method: DELETE
- Role: ADMIN hoặc EMPLOYER (chỉ tác giả mới xóa được nếu là EMPLOYER)
- Success 200

```json
{ "status": 200, "message": "Xóa công việc thành công" }
```

- Error 400/401/403/404

### 11.15 Top attractive jobs (public)

- Path: /top-attractive
- Method: GET
- Query: `limit` (>=1, mặc định 10), `industryId` (Long>=1, tùy chọn)
  - Ví dụ: `/api/v1/jobs/top-attractive?limit=10&industryId=1` sẽ trả các job hấp dẫn trong ngành có id = 1
- Success 200 (List<JobResponse>) – có trường mới `numberOfApplications`:

```json
{
  "status": 200,
  "message": "Lấy danh sách công việc hấp dẫn hàng đầu thành công",
  "data": [
    {
      "id": 5,
      "createdAt": "2025-10-19T13:45:45.88274",
      "updatedAt": "2025-10-19T13:50:51.989907",
      "companyName": "NextGen Robotics",
      "companySize": "FROM_10000_TO_19999",
      "companyWebsite": "https://nextgenrobotics.com",
      "aboutCompany": "A global leader in autonomous robotics solutions.",
      "jobTitle": "Embedded System Engineer",
      "jobLocations": [
        {
          "id": 18,
          "province": { "id": 4, "name": "Bắc Kạn" },
          "district": { "id": 1, "name": "Quận Ba Đình" },
          "detailAddress": "99 Vo Nguyen Giap"
        }
      ],
      "salaryType": "RANGE",
      "minSalary": 2000.0,
      "maxSalary": 3000.0,
      "salaryUnit": "USD",
      "jobDescription": "Develop firmware for industrial robots.",
      "requirement": "C/C++ and microcontroller experience required.",
      "jobBenefits": [{ "type": "TRAINING", "description": "Dao tao bai ban" }],
      "educationLevel": "MASTER",
      "experienceLevel": "MORE_THAN_TEN_YEARS",
      "jobLevel": "SUPERVISOR",
      "jobType": "FULL_TIME",
      "gender": "ANY",
      "jobCode": "JOB004",
      "industries": [{ "id": 3, "name": "Bán hàng / Kinh doanh" }],
      "ageType": "ABOVE",
      "minAge": 28,
      "maxAge": 45,
      "contactPerson": "Pham Van D",
      "phoneNumber": "+84987651234",
      "contactLocation": {
        "id": 9,
        "province": { "id": 4, "name": "Bắc Kạn" },
        "district": { "id": 2, "name": "Quận Hoàn Kiếm" },
        "detailAddress": "15 Ly Thai To"
      },
      "description": "Join world-class robotics R&D team.",
      "expirationDate": "2025-12-01",
      "status": "APPROVED",
      "author": {
        "id": 1,
        "email": "hr@nextgenrobotics.com",
        "companyName": "NextGen Robotics",
        "avatarUrl": null,
        "backgroundUrl": null,
        "employerSlug": "nextgen-robotics"
      },
      "numberOfApplications": 432
    }
  ]
}
```

- Error 400 (limit invalid)

### 11.16 Công việc cá nhân hóa (public)

- Path: /personalized
- Method: GET
- Query: `limit` (>=1, mặc định 10)
- Xác thực: công khai (JWT tùy chọn)
- Hành vi:
  - Nếu caller đã xác thực và có role `JOB_SEEKER` hoặc `ADMIN`, và `industry` của user được thiết lập, endpoint trả về các job thuộc ngành đó (tối đa `limit`)
  - Nếu caller chưa xác thực, hoặc `industry` của user không được thiết lập, endpoint trả về danh sách fallback (jobs top-attractive) tối đa `limit`
- Success 200 (List<JobResponse>) – cùng cấu trúc như response của `/top-attractive`. Khóa i18n: `job.get.personalized.success`.

```json
{
  "status": 200,
  "message": "Lấy danh sách công việc theo cá nhân hóa thành công",
  "data": [
    /* JobResponse[] */
  ]
}
```

- Lỗi 400 (limit không hợp lệ)

## 12) Ứng tuyển (Applications)

Base: /workify/api/v1/applications

### 12.0 Enum ApplicationStatus

- UNREAD: Hồ sơ mới gửi, chưa được nhà tuyển dụng đọc.
- VIEWED: Nhà tuyển dụng đã mở và xem hồ sơ.
- EMAILED: Đã liên hệ ứng viên qua email.
- SCREENING: Đang sàng lọc hồ sơ.
- SCREENING_PENDING: Đã sàng lọc, đang chờ quyết định tiếp theo.
- INTERVIEW_SCHEDULING: Đang lên lịch phỏng vấn.
- INTERVIEWED_PENDING: Đã phỏng vấn, chờ quyết định.
- OFFERED: Đã gửi offer cho ứng viên.
- REJECTED: Từ chối hồ sơ.

### 12.1 Ứng tuyển kèm file CV (JOB_SEEKER, ADMIN)

- Method: POST (multipart/form-data)
- Role: JOB_SEEKER hoặc ADMIN
- Parts:
  - application (JSON: ApplicationRequest)
  - cv (file) – bắt buộc, `@ValidDocFile`
- Ràng buộc & quyền:
  - Chỉ job `APPROVED` mới cho phép apply.
  - Mỗi user tối đa 3 lần apply cho 1 job; lần thứ 4 sẽ bị từ chối.
  - Service: đếm `countByUserIdAndJobId(userId, jobId)`; nếu >=3 ném 409.
- Ví dụ body (part `application`):

```json
{
  "fullName": "Nguyen Van A",
  "email": "candidate@example.com",
  "phoneNumber": "+84912345678",
  "coverLetter": "Rất mong được hợp tác",
  "jobId": 5
}
```

- Success 201: ApplicationResponse

```json
{
  "status": 201,
  "message": "Ứng tuyển thành công",
  "data": {
    "id": 101,
    "createdAt": "2025-10-20T10:00:00",
    "updatedAt": "2025-10-20T10:00:00",
    "fullName": "Nguyen Van A",
    "email": "candidate@example.com",
    "phoneNumber": "+84912345678",
    "coverLetter": "Rất mong được hợp tác",
    "cvUrl": "https://cdn.example.com/applications/101/cv.pdf",
    "applyCount": 1,
    "status": "UNREAD",
    "job": {
      "id": 5,
      "jobTitle": "Embedded System Engineer",
      "status": "APPROVED",
      "employer": {
        "email": "employer@example.com",
        "companyName": "NextGen Robotics",
        "avatarUrl": null,
        "backgroundUrl": null,
        "employerSlug": "nextgen-robotics"
      }
    }
  }
}
```

- Error responses
  - 400: body/parts invalid (file không hợp lệ, thiếu trường bắt buộc)
  - 401: chưa đăng nhập
  - 403: không đủ quyền
  - 404: job không tồn tại hoặc không ở trạng thái cho phép
  - 409: "Bạn đã đạt giới hạn số lần ứng tuyển cho công việc này"

### 12.2 Ứng tuyển bằng link CV (không upload file) (JOB_SEEKER, ADMIN)

- Method: POST (application/json)
- Role: JOB_SEEKER hoặc ADMIN
- Path: /link
- Body: ApplicationRequest với group `OnLinkApply` (bắt buộc `cvUrl`)
- Quyền & ràng buộc: giống 12.1 (giới hạn 3 lần, job phải APPROVED) và BẮT BUỘC đã có ít nhất 1 application trước đó cho cùng job (đây là API cho lần apply thứ 2 hoặc 3)
- Service: kiểm tra `countByUserIdAndJobId(userId, jobId)`; nếu `== 0` → 409.

```json
{
  "fullName": "Nguyen Van A",
  "email": "candidate@example.com",
  "phoneNumber": "+84912345678",
  "coverLetter": "Rất mong được hợp tác",
  "jobId": 5,
  "cvUrl": "https://drive.google.com/..."
}
```

- Success 201: ApplicationResponse (giữ nguyên `cvUrl` từ body)
- Thông điệp trả về (ví dụ):
  - 201: "Ứng tuyển thành công"
  - 409 (vượt giới hạn 3 lần): "Bạn đã đạt giới hạn số lần ứng tuyển cho công việc này"
  - 409 (chưa có ứng tuyển trước đó): "Bạn cần có ứng tuyển trước đó để sử dụng tính năng nộp bằng đường dẫn CV"
  - 409/403 (job chưa APPROVED): "Công việc chưa được duyệt, không thể ứng tuyển"
- Lỗi: 400/401/403/404/409 (như 12.1)

### 12.3 Lấy application theo id (JOB_SEEKER, EMPLOYER, ADMIN)

- Path: /{id}
- Method: GET
- Role:
  - JOB_SEEKER hoặc ADMIN: chỉ xem được application của chính mình (service kiểm tra ownership)
  - EMPLOYER: chỉ xem được application thuộc job mà mình là tác giả
- Hành vi: trả về ApplicationResponse kèm thông tin job + employer lồng bên trong.
- Success 200: ApplicationResponse
- Ví dụ response:

```json
{
  "status": 200,
  "message": "Lấy hồ sơ ứng tuyển thành công",
  "data": {
    "id": 1,
    "createdAt": "2025-11-08T00:25:55.613267",
    "updatedAt": "2025-11-08T00:25:55.613267",
    "fullName": "Nguyễn Văn A",
    "email": "caubesuuca123@gmail.com",
    "phoneNumber": "0989289090",
    "coverLetter": "Người quen giới thiệu",
    "cvUrl": "https://cloudclavis.blob.core.windows.net/workify/11a3d24b-ffeb-4fb8-a0a8-5b9e345177c6-Chuong-01-Gioithieu.pdf",
    "applyCount": 1,
    "status": "UNREAD",
    "job": {
      "id": 1,
      "jobTitle": "Kỹ sư Nông nghiệp - Quản lý Trang trại",
      "status": "APPROVED",
      "employer": {
        "email": "employer@example.com",
        "companyName": "GreenFarm Co., Ltd",
        "avatarUrl": null,
        "backgroundUrl": null,
        "employerSlug": "company-example"
      }
    }
  }
}
```

- Error: 400 (id invalid)/401/403 (không thuộc quyền xem)/404 (không tìm thấy)

### 12.4 Lấy application gần nhất theo job (JOB_SEEKER, ADMIN)

- Path: /latest/{jobId}
- Method: GET
- Role: JOB_SEEKER hoặc ADMIN
- Hành vi: trả bản ghi mới nhất theo (user, job)
- Success 200: ApplicationResponse
- Error: 400/401/403/404

### 12.5 Danh sách application của tôi (JOB_SEEKER, ADMIN)

- Path: /me
- Method: GET – phân trang (pageNumber, pageSize, sorts: createdAt, updatedAt)
- Success 200: PageResponse<List<ApplicationResponse>>
- Ví dụ phần tử trong `items` (ApplicationResponse):

```json
{
  "id": 1,
  "createdAt": "2025-11-08T00:25:55.613267",
  "updatedAt": "2025-11-08T00:25:55.613267",
  "fullName": "Nguyễn Văn A",
  "email": "caubesuuca123@gmail.com",
  "phoneNumber": "0989289090",
  "coverLetter": "Người quen giới thiệu",
  "cvUrl": "https://cloudclavis.blob.core.windows.net/workify/11a3d24b-ffeb-4fb8-a0a8-5b9e345177c6-Chuong-01-Gioithieu.pdf",
  "applyCount": 1,
  "status": "UNREAD",
  "job": {
    "id": 1,
    "jobTitle": "Kỹ sư Nông nghiệp - Quản lý Trang trại",
    "status": "APPROVED",
    "employer": {
      "email": "employer@example.com",
      "companyName": "GreenFarm Co., Ltd",
      "avatarUrl": null,
      "backgroundUrl": null,
      "employerSlug": "company-example"
    }
  }
}
```

- Error: 400/401/403

- Path: /me
- Method: GET – phân trang (pageNumber, pageSize, sorts với whitelist: createdAt, updatedAt)
- Role: JOB_SEEKER hoặc ADMIN
- Success 200: PageResponse<List<ApplicationResponse>>
- Error: 400/401/403

### 12.6 Danh sách application theo job (EMPLOYER)

- Path: /job/{jobId}
- Method: GET – phân trang (pageNumber, pageSize), filter `receivedWithin` (days), `status` (ApplicationStatus)
- Role: EMPLOYER (chỉ tác giả job)
- Service authorization: so khớp `job.author.id == employerId` – sai → 403.
- Success 200: PageResponse<List<ApplicationResponse>>
- Error: 400 (param invalid)/401/403 (không phải tác giả – "Không có quyền truy cập")/404

### 12.7 Đổi trạng thái application (EMPLOYER)

- Path: /{id}/status
- Method: PATCH
- Role: EMPLOYER (chỉ tác giả job của application mới đổi được)
- Query: `status` (ApplicationStatus) – validate bằng `@ValueOfEnum`
- Service authorization: kiểm tra `application.job.author.id == employerId` – sai → 403.
- Success 200: ResponseData<ApplicationResponse> với message "Cập nhật trạng thái ứng tuyển thành công"
- Error: 400 (enum sai)/401/403 (không phải tác giả – "Không có quyền truy cập")/404

### 12.8 Xoá application (ADMIN)

- Path: /{id}
- Method: DELETE
- Role: ADMIN
- Success 200: { status: 200, message: "Xóa ứng tuyển thành công" }
- Error: 400/401/403/404

Ghi chú thêm (service rules):

- Mỗi lần apply tạo 1 bản ghi mới, `applyCount` = số lần hiện tại + 1.
- Giới hạn apply theo (user, job) tối đa 3 bản ghi; vượt quá → 409.
- Các API get-by-job dành cho employer bắt buộc employer là tác giả job.

## 13) Saved Jobs (Lưu công việc)

Base: `/workify/api/v1/saved-jobs`

Yêu cầu xác thực: `Authorization: Bearer <accessToken>`

Role: `JOB_SEEKER` hoặc `ADMIN`

### 13.1 Toggle lưu/bỏ lưu công việc

- Path: `/toggle/{jobId}`
- Method: `POST`
- Path params:
  - `jobId` (Long ≥ 1)
- Mô tả: Nếu người dùng đã lưu job này thì bỏ lưu; nếu chưa lưu thì tạo bản ghi mới. Chỉ cho phép khi `job.status = APPROVED`. Khi không APPROVED trả 403.
- Response 200:

```json
{
  "status": 200,
  "message": "Chuyển trạng thái lưu công việc thành công"
}
```

- Lỗi thường gặp:
  - 400: Tham số không hợp lệ
  - 401: Chưa đăng nhập / thiếu JWT
  - 403: Không có quyền hoặc công việc chưa được phê duyệt
  - 404: Không tìm thấy công việc

### 13.2 Lấy danh sách công việc đã lưu (phân trang)

- Path: `/`
- Method: `GET`
- Query params:
  - `pageNumber` (mặc định 1, ≥1)
  - `pageSize` (mặc định 10, ≥1)
- Response 200 (PageResponse<List<JobResponse>>):

```json
{
  "status": 200,
  "message": "Lấy danh sách công việc đã lưu thành công",
  "data": {
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 1,
    "numberOfElements": 1,
    "items": [
      {
        "id": 5,
        "createdAt": "2025-10-19T13:45:45.88274",
        "updatedAt": "2025-10-19T13:50:51.989907",
        "companyName": "NextGen Robotics",
        "companySize": "FROM_10000_TO_19999",
        "companyWebsite": "https://nextgenrobotics.com",
        "aboutCompany": "A global leader in autonomous robotics solutions.",
        "jobTitle": "Embedded System Engineer",
        "jobLocations": [
          {
            "id": 18,
            "createdAt": "2025-10-19T13:53:59.032868",
            "updatedAt": "2025-10-19T13:53:59.032868",
            "province": {
              "id": 4,
              "createdAt": "2025-10-19T13:18:40.186487",
              "updatedAt": "2025-10-19T13:18:40.186487",
              "code": "6",
              "name": "Bắc Kạn",
              "engName": "Bac Kan",
              "provinceSlug": "bắc-kạn"
            },
            "district": {
              "id": 1,
              "createdAt": "2025-10-19T13:18:39.999151",
              "updatedAt": "2025-10-19T13:18:39.999151",
              "code": "1",
              "name": "Quận Ba Đình",
              "districtSlug": "quận-ba-đình"
            },
            "detailAddress": "99 Vo Nguyen Giap"
          }
        ],
        "salaryType": "RANGE",
        "minSalary": 2000.0,
        "maxSalary": 3000.0,
        "salaryUnit": "USD",
        "jobDescription": "Develop firmware for industrial robots.",
        "requirement": "C/C++ and microcontroller experience required.",
        "jobBenefits": [
          { "type": "TRAVEL_OPPORTUNITY", "description": "Du lich cong ty" },
          { "type": "TRAINING", "description": "Dao tao bai ban" }
        ],
        "educationLevel": "MASTER",
        "experienceLevel": "MORE_THAN_TEN_YEARS",
        "jobLevel": "SUPERVISOR",
        "jobType": "FULL_TIME",
        "gender": "MALE",
        "jobCode": "JOB004",
        "industries": [
          {
            "id": 3,
            "createdAt": "2025-10-19T13:18:42.063384",
            "updatedAt": "2025-10-19T13:18:42.063384",
            "name": "Bán hàng / Kinh doanh",
            "engName": "Sales / Business",
            "description": null
          }
        ],
        "ageType": "ABOVE",
        "minAge": 28,
        "maxAge": 45,
        "contactPerson": "Pham Van D",
        "phoneNumber": "+84987651234",
        "contactLocation": {
          "id": 9,
          "createdAt": "2025-10-19T13:45:45.880198",
          "updatedAt": "2025-10-19T13:50:51.975537",
          "province": {
            "id": 4,
            "createdAt": "2025-10-19T13:18:40.186487",
            "updatedAt": "2025-10-19T13:18:40.186487",
            "code": "6",
            "name": "Bắc Kạn",
            "engName": "Bac Kan",
            "provinceSlug": "bắc-kạn"
          },
          "district": {
            "id": 2,
            "createdAt": "2025-10-19T13:18:40.004465",
            "updatedAt": "2025-10-19T13:18:40.004465",
            "code": "2",
            "name": "Quận Hoàn Kiếm",
            "districtSlug": "quận-hoàn-kiếm"
          },
          "detailAddress": "15 Ly Thai To"
        },
        "description": "Join world-class robotics R&D team.",
        "expirationDate": "2025-12-01",
        "status": "APPROVED",
        "author": {
          "id": 1,
          "createdAt": "2025-10-19T13:20:07.673165",
          "updatedAt": "2025-10-19T13:20:07.673165",
          "email": "caubesuuca123@gmail.com",
          "companyName": "NextGen Robotics",
          "avatarUrl": null,
          "backgroundUrl": null,
          "employerSlug": "nextgen-robotics"
        },
        "numberOfApplications": 5
      }
    ]
  }
}
```

- Lỗi thường gặp:
  - 400: Tham số phân trang không hợp lệ
  - 401: Chưa đăng nhập

### 13.3 Kiểm tra đã lưu công việc

- Path: `/check/{jobId}`
- Method: `GET`
- Path params: `jobId` (Long ≥ 1)
- Mô tả: Trả về boolean cho biết người dùng hiện tại đã lưu công việc này chưa.
- Response 200:

```json
{
  "status": 200,
  "message": "Kiểm tra trạng thái lưu công việc thành công",
  "data": true
}
```

- Lỗi thường gặp:
  - 400: jobId không hợp lệ
  - 401: Chưa đăng nhập
  - 404: Không tìm thấy công việc

## 14) Mô tả Response Models (rút gọn)

- ResponseData<T>

```json
{
  "status": 200,
  "message": "...",
  "data": {
    /* T */
  }
}
```

- TokenResponse<T>

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "data": {
    /* T */
  },
  "createPasswordToken": "..."
}
```

- ErrorResponse

```json
{
  "timestamp": "2025-10-08T11:03:00.7349508",
  "status": 400,
  "path": "/workify/api/v1/...",
  "error": "Bad Request",
  "message": "...",
  "errors": [{ "fieldName": "...", "message": "..." }]
}
```

### Lỗi 500 hệ thống (chung)

Các lỗi 500 là lỗi chung của hệ thống (không phụ thuộc từng API cụ thể), thường xuất hiện khi có sự cố bất ngờ như lỗi kết nối dịch vụ ngoài, lỗi hạ tầng, v.v.

Ví dụ response 500 chung:

```json
{
  "timestamp": "2025-10-08T12:59:59.000",
  "status": 500,
  "path": "/workify/api/v1/...",
  "error": "Internal Server Error",
  "message": "Đã có lỗi xảy ra, vui lòng thử lại sau"
}
```

### Lỗi 400 (chung) – dữ liệu/params không hợp lệ

Áp dụng khi body không đúng schema hoặc query/path params sai định dạng/giá trị.

```json
{
  "timestamp": "2025-10-08T12:59:59.000",
  "status": 400,
  "path": "/workify/api/v1/...",
  "error": "Bad Request",
  "message": "Dữ liệu trong request body không hợp lệ",
  "errors": [{ "fieldName": "...", "message": "..." }]
}
```

- Các biến thể 400 thường gặp (tham khảo theo GlobalExceptionHandler)
  - Sai kiểu tham số (MethodArgumentTypeMismatch): message = "Tham số {name} phải có kiểu {RequiredType}"
  - Thiếu tham số bắt buộc (MissingServletRequestParameter/Part): message = "Tham số {paramName} không được để trống"
  - Thiếu header (MissingRequestHeader): message = "Thiếu header: {Header-Name}"
  - Params invalid (ConstraintViolation): message = "Dữ liệu trong request parameters không hợp lệ", kèm errors[]
  - Body not readable (HttpMessageNotReadable): message = "Dữ liệu trong request body không hợp lệ"; nếu đích type là số/ngày → message cụ thể theo field
  - Phân trang: pageNumber >= 1, pageSize >= 1 (vi phạm → trả về như trên với errors[pageNumber/pageSize])

### Lỗi 401 (chung) – chưa xác thực/Token không hợp lệ

Sử dụng khi thiếu/bạn gửi sai Access/Refresh token hoặc token hết hạn.

```json
{
  "timestamp": "2025-10-08T12:59:59.000",
  "status": 401,
  "path": "/workify/api/v1/...",
  "error": "Unauthorized",
  "message": "Token không hợp lệ"
}
```

- Các biến thể 401 thường gặp
  - Chưa xác thực đủ (InsufficientAuthentication): "Cần xác thực đầy đủ để truy cập tài nguyên này"
  - Sai email/mật khẩu (BadCredentials/UsernameNotFound): "Email hoặc mật khẩu không hợp lệ"
  - Tài khoản bị khoá (AccountStatusException): "Tài khoản bị khoá" (hoặc "Chưa xác nhận email" tuỳ cấu hình)

### Lỗi 403 (chung) – không đủ quyền

Áp dụng khi tài khoản không có quyền truy cập endpoint.

```json
{
  "timestamp": "2025-10-08T12:59:59.000",
  "status": 403,
  "path": "/workify/api/v1/...",
  "error": "Forbidden",
  "message": "Không có quyền truy cập"
}
```

- Do @PreAuthorize/AccessDeniedException và PostAuthorize lỗi khi không thoả điều kiện (ví dụ xem bài viết không PUBLIC)

### Lỗi 404 (chung) – không tìm thấy tài nguyên

```json
{
  "timestamp": "2025-10-08T12:59:59.000",
  "status": 404,
  "path": "/workify/api/v1/...",
  "error": "Not Found",
  "message": "Không tìm thấy tài nguyên"
}
```

- Theo từng tài nguyên (message cụ thể từ bundle):
  - Province: "Tỉnh thành không tồn tại"
  - District: "Quận/huyện không tồn tại"
  - CategoryPost: "Không tìm thấy danh mục bài viết"
  - User/Employer: "Không tìm thấy người dùng/nhà tuyển dụng" (tuỳ context)

### Lỗi 409 (chung) – xung đột dữ liệu

Áp dụng khi vi phạm unique (email/slug/code/role name…).

```json
{
  "timestamp": "2025-10-08T12:59:59.000",
  "status": 409,
  "path": "/workify/api/v1/...",
  "error": "Conflict",
  "message": "Tài nguyên đã tồn tại"
}
```

- UserResponse (trích yếu)

```json
{
  "id": 1,
  "createdAt": "...",
  "updatedAt": "...",
  "fullName": "...",
  "email": "...",
  "phoneNumber": "...",
  "birthDate": "2024-01-01",
  "gender": "MALE",
  "province": { "id": 1, "name": "..." },
  "district": { "id": 2, "name": "..." },
  "detailAddress": "...",
  "avatarUrl": "...",
  "noPassword": false,
  "role": "ADMIN",
  "status": "ACTIVE"
}
```

- EmployerResponse (trích yếu)

```json
{
  "id": 10,
  "createdAt": "...",
  "updatedAt": "...",
  "email": "...",
  "phoneNumber": "...",
  "companyName": "...",
  "companySize": "MEDIUM",
  "contactPerson": "...",
  "avatarUrl": "...",
  "backgroundUrl": "...",
  "employerSlug": "...",
  "aboutCompany": "...",
  "websiteUrls": ["..."],
  "facebookUrl": "...",
  "twitterUrl": "...",
  "linkedinUrl": "...",
  "googleUrl": "...",
  "youtubeUrl": "...",
  "status": "ACTIVE",
  "province": { "id": 1, "name": "..." },
  "district": { "id": 2, "name": "..." },
  "detailAddress": "...",
  "numberOfHiringJobs": 25
}
```

- JobResponse (bổ sung)

```json
{
  "id": 5,
  "createdAt": "...",
  "updatedAt": "...",
  "companyName": "...",
  "companySize": "...",
  "companyWebsite": "...",
  "aboutCompany": "...",
  "jobTitle": "...",
  "jobLocations": [
    {
      "id": 1,
      "province": { "id": 1, "name": "..." },
      "district": { "id": 2, "name": "..." },
      "detailAddress": "..."
    }
  ],
  "salaryType": "...",
  "minSalary": 0,
  "maxSalary": 0,
  "salaryUnit": "...",
  "jobDescription": "...",
  "requirement": "...",
  "jobBenefits": [{ "type": "TRAINING", "description": "..." }],
  "educationLevel": "...",
  "experienceLevel": "...",
  "jobLevel": "...",
  "jobType": "...",
  "gender": "...",
  "jobCode": "...",
  "industries": [{ "id": 1, "name": "..." }],
  "ageType": "...",
  "minAge": 0,
  "maxAge": 0,
  "contactPerson": "...",
  "phoneNumber": "...",
  "contactLocation": {
    "id": 9,
    "province": { "id": 4, "name": "..." },
    "district": { "id": 2, "name": "..." },
    "detailAddress": "..."
  },
  "description": "...",
  "expirationDate": "2025-12-01",
  "status": "APPROVED",
  "author": {
    "id": 1,
    "email": "...",
    "companyName": "...",
    "avatarUrl": null,
    "backgroundUrl": null,
    "employerSlug": "..."
  },
  "numberOfApplications": 100
}
```

- PostResponse (đầy đủ)

```json
{
  "id": 100,
  "createdAt": "2025-10-08T12:30:11.000",
  "updatedAt": "2025-10-08T12:35:05.000",
  "title": "Giới thiệu Workify",
  "excerpt": "Nền tảng việc làm...",
  "content": "<p>Nội dung HTML đã được xử lý...</p>",
  "contentText": "Noi dung HTML da duoc xu ly...",
  "thumbnailUrl": "https://cdn.example.com/posts/100/thumbnail.jpg",
  "tags": "workify|viec-lam",
  "slug": "gioi-thieu-workify",
  "readingTimeMinutes": 3,
  "category": {
    "id": 1,
    "title": "Tin tức",
    "description": "Danh mục tin tức"
  },
  "author": {
    "id": 1,
    "fullName": "System Administrator",
    "avatarUrl": null,
    "email": "admin@example.com",
    "role": "ADMIN"
  },
  "status": "PUBLIC"
}
```

## 15) Thông báo & Cập nhật Realtime

### WebSocket/STOMP Endpoint

- Endpoint: `/ws` (có hỗ trợ SockJS fallback)
- **Xác thực**: Bắt buộc phải có JWT token (xem bên dưới)
- Đích đến cho user: `/user/queue/notifications` (được bảo vệ bởi Principal)
- Application destination prefix: `/app`

#### Xác thực WebSocket

Client phải gửi JWT token khi STOMP CONNECT theo một trong hai cách:

**Cách 1: Authorization header (khuyến nghị)**

```js
stompClient.connectHeaders = {
  Authorization: `Bearer ${jwtToken}`,
};
```

**Cách 2: Custom header "token" (dự phòng)**

```js
stompClient.connectHeaders = {
  token: jwtToken,
};
```

#### Ví dụ kết nối Client (JavaScript)

````js
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// Lấy JWT token từ localStorage/sessionStorage sau khi đăng nhập
const jwtToken = localStorage.getItem("accessToken");

const socket = new SockJS("http://localhost:8080/ws");
const stompClient = new Client({
  webSocketFactory: () => socket,
  reconnectDelay: 5000,
  connectHeaders: {
    Authorization: `Bearer ${jwtToken}`, // ← Gửi JWT để xác thực
  },

---

## Messaging: Unread counts and real-time updates

This section describes new fields, endpoints and WebSocket events to support per-conversation unread counts and total unread count for the current user.

### DB migration (Postgres)

Run these SQL statements to add columns and backfill existing unread counts. Adjust table names if your schema uses a different name (the project uses `conversation` and `message` tables):

```sql
ALTER TABLE conversation
  ADD COLUMN unread_count_job_seeker INT NOT NULL DEFAULT 0,
  ADD COLUMN unread_count_employer INT NOT NULL DEFAULT 0;

-- Backfill unread counts (messages with seen = false)
UPDATE conversation c
SET unread_count_job_seeker = sub.cnt
FROM (
  SELECT m.conversation_id, COUNT(*) AS cnt
  FROM message m
  WHERE m.seen = false AND m.sender_type = 'EMPLOYER'
  GROUP BY m.conversation_id
) sub
WHERE c.id = sub.conversation_id;

UPDATE conversation c
SET unread_count_employer = sub.cnt
FROM (
  SELECT m.conversation_id, COUNT(*) AS cnt
  FROM message m
  WHERE m.seen = false AND m.sender_type = 'USER'
  GROUP BY m.conversation_id
) sub
WHERE c.id = sub.conversation_id;

-- Index for fast counts and seen updates
CREATE INDEX IF NOT EXISTS idx_message_conv_seen_sender ON message (conversation_id, seen, sender_type);
````

Run the migration in a maintenance window or via your migration tool (Flyway/Liquibase) to avoid concurrent writes during backfill.

### API changes

- GET `/api/v1/conversations` (existing)
  - Behavior: each `ConversationResponse` item now contains a new field `unreadCount` which is the number of unread messages for the caller in that conversation.
  - Example item:

```json
{
  "id": 1,
  "jobId": 10,
  "applicationId": 5,
  "jobSeekerId": 2,
  "employerId": 3,
  "lastMessage": "Cảm ơn bạn!",
  "hasEmployerMessage": true,
  "unreadCount": 2,
  "createdAt": "2025-01-15T10:30:00",
  "updatedAt": "2025-01-15T14:20:00"
}
```

- GET `/api/v1/messages/unread-count`
  - Description: returns total unread messages count for the currently authenticated user (job seeker or employer).
  - Response example:

```json
{
  "status": 200,
  "message": "Unread count retrieved",
  "data": { "totalUnread": 12 }
}
```

- PUT `/api/v1/messages/{conversationId}/seen`
  - Description: mark messages in a conversation as seen for the caller. Only messages where `sender_type != caller.role` and `seen = false` will be updated.
  - Behavior: the backend updates `message.seen = true` and atomically decrements the appropriate `conversation.unread_count_job_seeker` or `conversation.unread_count_employer`. The update is performed inside a DB transaction and the `conversation` row is SELECTed FOR UPDATE to prevent races.
  - Response: 200 with no data (existing response structure) and server publishes a WebSocket `SEEN_UPDATE` event (see below).

### WebSocket (STOMP) events

Publish paths: server sends to `/user/{principal}/queue/messages` and `/user/{principal}/queue/unread`.

1. On send message -> publish to recipient a `MESSAGE` payload with message and unread info:

```json
{
  "type": "MESSAGE",
  "message": {
    "id": 123,
    "conversationId": 1,
    "senderId": 3,
    "senderType": "EMPLOYER",
    "content": "Xin chào",
    "seen": false,
    "createdAt": "2025-11-23T10:00:00"
  },
  "unread": {
    "conversationId": 1,
    "unreadForRecipient": 5,
    "totalUnread": 17
  }
}
```

2. On mark-seen -> publish `SEEN_UPDATE` to both users in conversation:

```json
{
  "type": "SEEN_UPDATE",
  "conversationId": 1,
  "updatedByUserId": 2,
  "unread": {
    "conversationId": 1,
    "unreadForJobSeeker": 0,
    "unreadForEmployer": 3
  },
  "totalUnread": {
    "jobSeeker": 4,
    "employer": 10
  }
}
```

Clients should update UI badges and conversation lists on these events.

### Concurrency & correctness notes

- All changes to `message.seen` and `conversation.unread_count_*` are performed inside a DB transaction. The conversation row is locked with `SELECT ... FOR UPDATE` (PESSIMISTIC_WRITE) to avoid race conditions when multiple clients mark seen or send messages concurrently.
- The `mark-as-seen` queries are written to update only messages that match the opposite sender type and `seen = false`, and return the number of rows affected; the conversation counters are decremented by that number (bounded to >= 0).
- Ensure index on `message(conversation_id, seen, sender_type)` for efficient updates and counts.

### Acceptance criteria / tests (summary)

- `GET /api/v1/conversations`: each item contains correct `unreadCount` for caller.
- `GET /api/v1/messages/unread-count`: returns correct `totalUnread`.
- When employer sends a message, recipient receives `MESSAGE` event with updated unread counts and conversation list badge updates.
- When caller calls `PUT /api/v1/messages/{conversationId}/seen`, messages are updated (`seen=true`), conversation unread counter becomes correct, `SEEN_UPDATE` is published and `GET /api/v1/messages/unread-count` decreases accordingly.

If you want, I can add a Flyway migration file with the SQL above and unit tests for the new behavior.
});

stompClient.onConnect = () => {
console.log("Đã kết nối WebSocket");

// Subscribe vào hàng đợi thông báo cá nhân
// Không cần biết user ID - server tự động route dựa vào Principal
stompClient.subscribe("/user/queue/notifications", (message) => {
const notification = JSON.parse(message.body);
console.log("Nhận được thông báo:", notification);

    // Cập nhật UI: hiện toast, tăng số badge, thêm vào danh sách, v.v.
    showNotificationToast(notification);
    updateUnreadCount();

});
};

stompClient.onStompError = (frame) => {
console.error("Lỗi STOMP:", frame);
};

stompClient.activate();

````

#### Cấu trúc dữ liệu Notification

```json
{
  "id": 15,
  "title": "Ứng viên mới ứng tuyển",
  "content": "Ứng viên Nguyen Van A đã ứng tuyển vào vị trí Backend Java Developer",
  "type": "NEW_APPLICATION",
  "link": "/jobs/123/applications",
  "jobId": 123,
  "applicationId": 456,
  "readFlag": false,
  "createdAt": "2025-11-08T10:15:30"
}
````

**Các loại thông báo (type):**

- `NEW_APPLICATION`: Có đơn ứng tuyển mới (gửi cho Employer)
- `APPLICATION_STATUS_UPDATE`: Trạng thái đơn ứng tuyển thay đổi (gửi cho User)

### REST API Endpoints

| Method | Đường dẫn                            | Mô tả                                | Roles                       |
| ------ | ------------------------------------ | ------------------------------------ | --------------------------- |
| GET    | `/api/v1/notifications`              | Lấy danh sách thông báo (phân trang) | JOB_SEEKER, EMPLOYER, ADMIN |
| POST   | `/api/v1/notifications/{id}/read`    | Đánh dấu một thông báo là đã đọc     | JOB_SEEKER, EMPLOYER, ADMIN |
| POST   | `/api/v1/notifications/read-all`     | Đánh dấu tất cả thông báo là đã đọc  | JOB_SEEKER, EMPLOYER, ADMIN |
| GET    | `/api/v1/notifications/unread-count` | Lấy số lượng thông báo chưa đọc      | JOB_SEEKER, EMPLOYER, ADMIN |

#### Tham số truy vấn

`GET /api/v1/notifications` hỗ trợ:

- `pageNumber` (mặc định 1)
- `pageSize` (mặc định 10)

#### Thông báo thay đổi trạng thái đơn ứng tuyển

Khi Employer thay đổi trạng thái đơn ứng tuyển sang một trong các trạng thái: `VIEWED`, `EMAILED`, `SCREENING`, `OFFERED`, `REJECTED`, ứng viên sẽ nhận được thông báo realtime với type = `APPLICATION_STATUS_UPDATE`.

**Lưu ý:** Trạng thái `UNREAD` không kích hoạt thông báo.

#### Thông báo đơn ứng tuyển mới

Khi User nộp đơn ứng tuyển vào một công việc, Employer của công việc đó sẽ nhận được thông báo realtime với type = `NEW_APPLICATION`.

### Chiến lược đếm số thông báo chưa đọc

- Sử dụng endpoint nhẹ `/api/v1/notifications/unread-count` để hiển thị badge counter.
- WebSocket cũng đẩy thông báo mới theo thời gian thực → client có thể tăng counter cục bộ mà không cần gọi API lại.

### Bảo mật

#### Xác thực WebSocket

- JWT bắt buộc phải gửi qua header `Authorization` hoặc `token` khi STOMP CONNECT
- Server sử dụng `WebSocketAuthInterceptor` để validate JWT và gắn Authentication vào session

#### Bảo mật User Destination

- Server sử dụng `convertAndSendToUser("USER:" + email, ...)` hoặc `convertAndSendToUser("EMPLOYER:" + email, ...)` để gửi thông báo riêng cho từng user
- **Principal với prefix:** Sử dụng `USER:{email}` và `EMPLOYER:{email}` để phân biệt User và Employer cùng email
- **Lợi ích:**
  - Client không thể subscribe vào thông báo của người khác
  - User và Employer dùng chung email sẽ nhận thông báo riêng biệt
  - Spring broker tự động route message dựa trên Principal đã được xác thực
- **Không thể subscription hijacking** như phương pháp dùng topic-based `/topic/users/{id}/notifications`

#### REST API

- Tất cả REST endpoints yêu cầu JWT trong Authorization header: `Bearer <token>`
- Mỗi user/employer chỉ có thể truy cập thông báo của chính mình

### Cách hoạt động (Server-side)

1. **Kết nối:** Client kết nối đến `/ws` với JWT trong STOMP headers
2. **Xác thực:** `WebSocketAuthInterceptor` validate JWT và extract email + accountType
3. **Gắn Principal với prefix:**
   - Principal.name = `USER:{email}` cho JOB_SEEKER
   - Principal.name = `EMPLOYER:{email}` cho EMPLOYER
   - **Lý do:** Phân biệt User và Employer cùng email (VD: `abc@gmail.com` có thể vừa là User vừa là Employer)
4. **Gửi thông báo:**

   ```java
   // Server code cho User
   messagingTemplate.convertAndSendToUser("USER:" + user.getEmail(), "/queue/notifications", dto);

   // Server code cho Employer
   messagingTemplate.convertAndSendToUser("EMPLOYER:" + employer.getEmail(), "/queue/notifications", dto);
   ```

   - Spring tự động tìm session(s) có Principal.name khớp với prefix + email
   - Route message chỉ đến session(s) đó

5. **Nhận thông báo:**
   - User chỉ nhận thông báo gửi đến `USER:{email}`
   - Employer chỉ nhận thông báo gửi đến `EMPLOYER:{email}`
   - **Client không cần biết prefix** - việc subscribe vẫn là `/user/queue/notifications`

### Cấu hình WebSocket

```java
// WebSocketConfig.java
config.enableSimpleBroker("/queue");  // Broker xử lý /queue/*
config.setUserDestinationPrefix("/user");  // Client subscribe /user/...
```

**Giải thích:**

- `/queue` là destination pattern mà broker xử lý
- `/user` là prefix để Spring nhận biết đây là user-specific destination
- Client subscribe: `/user/queue/notifications`
- Server internally route: `/queue/notifications` (sau khi resolve Principal)

---

## 15) Ghi chú tích hợp Front-end

- Context path: mọi URL đều bắt đầu với `/workify`.
- CORS: cho phép http://localhost:3000, 5173, 4000 (có thể đổi qua cấu hình).
- Multipart endpoints: dùng field name chính xác (user, employer, post, avatar, background, thumbnail).
- Sorts: dạng danh sách chuỗi, khuyến nghị `property,asc|desc`.

### 10.1 Header/Tokens dùng chung

- Authorization: Bearer <accessToken> – cho các endpoint cần xác thực.
- X-Token: Access token (đăng xuất), Y-Token: Refresh token (refresh/sign-out)
- C-Token: Verify email token (verify email)
- R-Token: Reset password token (reset password)
- CR-Token: Create password token (tạo mật khẩu sau OAuth)
- G-Code/L-Code: Authorization code từ nhà cung cấp OAuth (Google/LinkedIn)

### 10.2 Phân trang & sắp xếp (chuẩn)

- pageNumber (>=1), pageSize (>=1)
- sorts: danh sách chuỗi dạng `field:asc|desc`; nhiều trường → nhiều phần tử (có thể lặp tham số `sorts=...` hoặc truyền bằng dấu phẩy).
- keyword: chuỗi tìm kiếm toàn văn (nếu hỗ trợ).
- Industries hỗ trợ sorts: name, engName, createdAt, updatedAt.

### 10.3 Multipart field names (chuẩn hóa)

- Users: user (JSON), avatar (file)
- Employers: employer (JSON), avatar (file), background (file)
- Posts: post (JSON), thumbnail (file)

### 10.4 OAuth flows (chuẩn)

1. FE lấy authorization code từ Google/LinkedIn → gửi qua header G-Code/L-Code
2. Nếu user đã có mật khẩu: BE trả accessToken/refreshToken + UserResponse
3. Nếu user chưa có mật khẩu: BE chỉ trả data.createPasswordToken → FE gọi API 1.14 để tạo mật khẩu

---

## 16) Ví dụ chi tiết theo endpoint

Các ví dụ này minh hoạ đúng schema thực tế (DTO/Response) trong dự án. Bạn có thể copy để thử nghiệm.

### Auth

- Đăng nhập USER: POST /workify/api/v1/auth/users/sign-in
  - Request
    ```json
    { "email": "jobseeker@example.com", "password": "Workify@123" }
    ```
  - Response 200
    ```json
    {
      "status": 200,
      "message": "Đăng nhập thành công",
      "data": {
        "accessToken": "eyJhbGciOi...",
        "refreshToken": "eyJhbGciOi...",
        "data": {
          "id": 12,
          "createdAt": "2025-10-08T09:35:39.376171",
          "updatedAt": "2025-10-08T09:35:39.376171",
          "fullName": "Nguyen Van A",
          "email": "jobseeker@example.com",
          "phoneNumber": null,
          "birthDate": null,
          "gender": null,
          "province": null,
          "district": null,
          "detailAddress": null,
          "avatarUrl": null,
          "noPassword": false,
          "role": "JOB_SEEKER",
          "status": "ACTIVE"
        }
      }
    }
    ```
  - Response 400 (validate)
    ```json
    {
      "timestamp": "2025-10-08T11:03:00.7349508",
      "status": 400,
      "path": "/workify/api/v1/auth/users/sign-in",
      "error": "Bad Request",
      "message": "Dữ liệu trong request body không hợp lệ",
      "errors": [
        { "fieldName": "email", "message": "Định dạng email không hợp lệ" },
        {
          "fieldName": "password",
          "message": "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt, độ dài từ 8 đến 160 ký tự"
        }
      ]
    }
    ```
  - Response 401 (sai thông tin)
    ```json
    {
      "timestamp": "2025-10-08T11:05:32.878249",
      "status": 401,
      "path": "/workify/api/v1/auth/users/sign-in",
      "error": "Unauthorized",
      "message": "Email hoặc mật khẩu không hợp lệ"
    }
    ```

- Refresh token USER: POST /workify/api/v1/auth/users/refresh-token
  - Headers: { "Y-Token": "<refreshToken>" }
  - Response 200
    ```json
    {
      "status": 200,
      "message": "Làm mới token thành công",
      "data": {
        "accessToken": "eyJhbGciOi...",
        "refreshToken": "eyJhbGciOi..."
      }
    }
    ```

- Sign-out: POST /workify/api/v1/auth/sign-out
  - Headers: { "X-Token": "<accessToken>", "Y-Token": "<refreshToken>" }
  - Response 200
    ```json
    { "status": 200, "message": "Đăng xuất thành công" }
    ```

- Forgot password USER: POST /workify/api/v1/auth/users/forgot-password
  - Headers: { "User-Agent": "Mozilla/5.0 ..." }
  - Body
    ```json
    { "email": "jobseeker@example.com" }
    ```
  - Response 200
    ```json
    { "status": 200, "message": "Gửi email đặt lại mật khẩu thành công" }
    ```

- Reset password USER: POST /workify/api/v1/auth/users/reset-password
  - Headers: { "R-Token": "<resetToken>" }
  - Body
    ```json
    { "newPassword": "Workify@123" }
    ```
  - Response 200
    ```json
    { "status": 200, "message": "Đặt lại mật khẩu thành công" }
    ```

### Users

- GET (ADMIN) /workify/api/v1/users?pageNumber=1&pageSize=10&keyword=
  - Response 200
    ```json
    {
      "status": 200,
      "message": "Lấy danh sách người dùng thành công",
      "data": {
        "pageNumber": 1,
        "pageSize": 10,
        "totalPages": 3,
        "numberOfElements": 10,
        "items": [
          {
            "id": 1,
            "createdAt": "2025-10-08T09:35:39.376171",
            "updatedAt": "2025-10-08T09:35:39.376171",
            "fullName": "System Administrator",
            "email": "admin@example.com",
            "phoneNumber": null,
            "birthDate": null,
            "gender": null,
            "province": null,
            "district": null,
            "detailAddress": null,
            "avatarUrl": null,
            "noPassword": false,
            "role": "ADMIN",
            "status": "ACTIVE"
          }
        ]
      }
    }
    ```

- POST (ADMIN, multipart) /workify/api/v1/users
  - Content-Type: multipart/form-data
  - Parts
    - avatar: (file)
    - user: (application/json)
      ```json
      {
        "fullName": "Nguyen Van B",
        "email": "user2@example.com",
        "password": "Workify@123",
        "phoneNumber": "+84912345678",
        "birthDate": "01/01/2000",
        "gender": "MALE",
        "provinceId": 1,
        "districtId": 2,
        "detailAddress": "123 Đường ABC",
        "status": "ACTIVE",
        "role": "JOB_SEEKER"
      }
      ```
  - Response 200
    ```json
    {
      "status": 200,
      "message": "Tạo người dùng thành công",
      "data": {
        "id": 13,
        "fullName": "Nguyen Van B",
        "email": "user2@example.com",
        "role": "JOB_SEEKER",
        "status": "ACTIVE"
      }
    }
    ```

- PATCH (me/avatar) /workify/api/v1/users/me/avatar
  - Parts: avatar (image/\*)
  - Response 200: trả UserResponse cập nhật avatarUrl

### Employers

- GET (public) /workify/api/v1/employers?pageNumber=1&pageSize=10&companySize=SMALL&provinceId=1
  - Response 200 (PageResponse<EmployerResponse>)
    ```json
    {
      "status": 200,
      "message": "Lấy danh sách nhà tuyển dụng thành công",
      "data": {
        "pageNumber": 1,
        "pageSize": 10,
        "totalPages": 3,
        "numberOfElements": 10,
        "items": [
          {
            "id": 10,
            "email": "hr@example.com",
            "companyName": "ABC Corp",
            "companySize": "SMALL",
            "status": "ACTIVE"
          }
        ]
      }
    }
    ```

- POST (public) /workify/api/v1/employers/sign-up
  - Body
    ```json
    {
      "email": "hr@example.com",
      "password": "Workify@123",
      "companyName": "ABC Corp",
      "companySize": "SMALL",
      "contactPerson": "Tran Thi C",
      "phoneNumber": "0912345678",
      "provinceId": 1,
      "districtId": 2,
      "detailAddress": "Số 1 XYZ",
      "websiteUrls": ["https://abc.example.com"],
      "facebookUrl": "https://facebook.com/abc"
    }
    ```
  - Response 200
    ```json
    {
      "status": 200,
      "message": "Đăng ký nhà tuyển dụng thành công, vui lòng kiểm tra email để xác nhận",
      "data": {
        "id": 50,
        "email": "hr@example.com",
        "companyName": "ABC Corp",
        "status": "ACTIVE"
      }
    }
    ```

- PATCH (EMPLOYER) /workify/api/v1/employers/me/website-urls
  - Body
    ```json
    {
      "websiteUrls": [
        "https://abc.example.com",
        "https://career.abc.example.com"
      ],
      "linkedinUrl": "https://linkedin.com/company/abc"
    }
    ```
  - Response 200: trả EmployerResponse với websiteUrls/linkedinUrl cập nhật

### Category Posts

- GET (public) /workify/api/v1/categories-post?pageNumber=1&pageSize=10
  - Response 200 (PageResponse<CategoryPostResponse>)

- POST (ADMIN) /workify/api/v1/categories-post
  - Body
    ```json
    { "title": "Tin tức", "description": "Danh mục tin tức" }
    ```
  - Response 201
    ```json
    {
      "status": 201,
      "message": "Tạo danh mục bài viết thành công",
      "data": { "id": 3, "title": "Tin tức", "description": "Danh mục tin tức" }
    }
    ```

### Posts

- GET (public) /workify/api/v1/posts/public?keyword=
  - Response 200

- POST (ADMIN, multipart) /workify/api/v1/posts
  - Parts
    - post (application/json)
      ```json
      {
        "title": "Giới thiệu Workify",
        "excerpt": "Nền tảng việc làm...",
        "content": "<p>...</p>",
        "categoryId": 1,
        "status": "PUBLIC"
      }
      ```
    - thumbnail (image/\*)
  - Response 201
    ```json
    {
      "status": 201,
      "message": "Tạo bài viết thành công",
      "data": {
        "id": 100,
        "createdAt": "2025-10-08T12:30:11.000",
        "updatedAt": "2025-10-08T12:30:11.000",
        "title": "Giới thiệu Workify",
        "excerpt": "Nền tảng việc làm...",
        "content": "<p>Nội dung HTML đã được xử lý...</p>",
        "contentText": "Noi dung HTML da duoc xu ly...",
        "thumbnailUrl": "https://cdn.example.com/posts/100/thumbnail.jpg",
        "tags": "workify|viec-lam",
        "slug": "gioi-thieu-workify",
        "readingTimeMinutes": 3,
        "category": {
          "id": 1,
          "title": "Tin tức",
          "description": "Danh mục tin tức"
        },
        "author": {
          "id": 1,
          "fullName": "System Administrator",
          "avatarUrl": null,
          "email": "admin@example.com",
          "role": "ADMIN"
        },
        "status": "PUBLIC"
      }
    }
    ```

- GET (public) /workify/api/v1/posts/public/{id}/related?limit=6
  - Response 200: danh sách PostResponse liên quan (tối đa 20)

### Provinces

- GET (public) /workify/api/v1/provinces
  - Response 200
    ```json
    {
      "status": 200,
      "message": "Lấy danh sách tỉnh thành thành công",
      "data": [{ "id": 1, "code": "HNI", "name": "Hà Nội" }]
    }
    ```

- POST (ADMIN) /workify/api/v1/provinces
  - Body
    ```json
    { "code": "HCM", "name": "Hồ Chí Minh", "engName": "Ho Chi Minh" }
    ```
  - Response 201: trả ProvinceResponse

### Districts

- GET (public) /workify/api/v1/districts/province/{provinceId}
  - Response 200
    ```json
    {
      "status": 200,
      "message": "Lấy danh sách quận/huyện thành công",
      "data": [{ "id": 10, "code": "Q1", "name": "Quận 1" }]
    }
    ```

### Industries

- GET (public) /workify/api/v1/industries/all
  - Response 200
    ```json
    {
      "status": 200,
      "message": "Lấy danh sách ngành nghề thành công",
      "data": [
        {
          "id": 1,
          "name": "Công nghệ thông tin",
          "engName": "Information Technology",
          "description": "Phát triển phần mềm, lập trình"
        }
      ]
    }
    ```

- GET (public) /workify/api/v1/industries?pageNumber=1&pageSize=10&keyword=công nghệ&sorts=name,asc
  - Response 200
    ```json
    {
      "status": 200,
      "message": "Lấy danh sách ngành nghề thành công",
      "data": {
        "pageNumber": 1,
        "pageSize": 10,
        "totalPages": 1,
        "numberOfElements": 2,
        "items": [
          {
            "id": 1,
            "name": "Công nghệ thông tin",
            "engName": "Information Technology",
            "description": "Phát triển phần mềm, lập trình"
          },
          {
            "id": 15,
            "name": "Công nghệ sinh học",
            "engName": "Biotechnology",
            "description": "Ứng dụng công nghệ trong sinh học"
          }
        ]
      }
    }
    ```

- POST (ADMIN) /workify/api/v1/industries
  - Body
    ```json
    {
      "name": "Trí tuệ nhân tạo",
      "engName": "Artificial Intelligence",
      "description": "Machine learning, AI, deep learning"
    }
    ```
  - Response 201: trả IndustryResponse

- PUT (ADMIN) /workify/api/v1/industries/{id}
  - Body tương tự POST
  - Response 200: trả IndustryResponse đã cập nhật

### Roles (ADMIN)

- GET /workify/api/v1/roles
  - Response 200
    ```json
    {
      "status": 200,
      "message": "Lấy danh sách vai trò thành công",
      "data": [
        { "id": 1, "name": "ADMIN" },
        { "id": 2, "name": "JOB_SEEKER" }
      ]
    }
    ```

### Ví dụ lỗi chung

- 403 (không đủ quyền)
  ```json
  {
    "timestamp": "2025-10-08T11:30:00.000",
    "status": 403,
    "path": "/workify/api/v1/roles",
    "error": "Forbidden",
    "message": "Không có quyền truy cập"
  }
  ```
- 404 (không tìm thấy tài nguyên)
  ```json
  {
    "timestamp": "2025-10-08T11:31:00.000",
    "status": 404,
    "path": "/workify/api/v1/users/9999",
    "error": "Not Found",
    "message": "Không tìm thấy tài nguyên"
  }
  ```

Trên đây là các ví dụ phổ biến. Nếu cần thêm ví dụ cho endpoint cụ thể (kèm request multipart, sort, filter nâng cao), mình sẽ bổ sung ngay.

---

## 17) Ví dụ nâng cao: multipart, sort, filter

### 12.1 Multipart: Tạo User (ADMIN)

- Endpoint: POST /workify/api/v1/users
- Content-Type: multipart/form-data
- Các phần (parts):
  - avatar: file ảnh (image/\*), optional
  - user: JSON (application/json), bắt buộc

Form-data mẫu (phần JSON của field `user`):

```json
{
  "fullName": "Le Thi D",
  "email": "user3@example.com",
  "password": "Workify@123",
  "phoneNumber": "+84987654321",
  "birthDate": "31/12/2001",
  "gender": "FEMALE",
  "provinceId": 1,
  "districtId": 2,
  "detailAddress": "456 Đường DEF",
  "status": "ACTIVE",
  "role": "JOB_SEEKER"
}
```

Response (rút gọn): 200 OK kèm `UserResponse` trong `data`.

Lỗi thường gặp:

- 400 Missing part `user` (MissingServletRequestPartException)
- 400 Avatar không hợp lệ: `validation.image.file.invalid`

### 12.2 Multipart: Tạo Employer (ADMIN)

- Endpoint: POST /workify/api/v1/employers
- Parts:
  - employer: JSON (application/json)
  - avatar: file (optional)
  - background: file (optional)

JSON cho `employer`:

```json
{
  "email": "hq@company.io",
  "password": "Workify@123",
  "companyName": "Company IO",
  "companySize": "MEDIUM",
  "contactPerson": "Pham H",
  "phoneNumber": "0911222333",
  "provinceId": 1,
  "districtId": 2,
  "detailAddress": "88 Street",
  "status": "ACTIVE"
}
```

Response 200: `EmployerResponse` với avatar/background nếu có.

### 12.3 Multipart: Tạo Post (ADMIN)

- Endpoint: POST /workify/api/v1/posts
- Parts:
  - post: JSON (application/json)
  - thumbnail: file ảnh (bắt buộc)

JSON cho `post`:

```json
{
  "title": "Workify ra mắt tính năng mới",
  "excerpt": "Tối ưu trải nghiệm...",
  "content": "<p>Nội dung HTML...</p>",
  "categoryId": 1,
  "status": "PUBLIC"
}
```

Response 201: `PostResponse`.

Lỗi thường gặp:

- 400 Missing part `thumbnail`
- 400 `validation.image.file.invalid` nếu ảnh không hợp lệ

### 12.4 Sort nâng cao (nhiều trường)

Các endpoint hỗ trợ `sorts` dưới dạng danh sách tham số lặp lại. Ví dụ:

- Users (ADMIN):
  - GET /workify/api/v1/users?pageNumber=1&pageSize=10&sorts=createdAt,desc&sorts=email,asc&keyword=

- Employers (public):
  - GET /workify/api/v1/employers?pageNumber=1&pageSize=12&sorts=companyName,asc&sorts=createdAt,desc

- Posts (ADMIN):
  - GET /workify/api/v1/posts?pageNumber=1&pageSize=10&sorts=createdAt,desc&sorts=updatedAt,asc

- Industries (public):
  - GET /workify/api/v1/industries?pageNumber=1&pageSize=15&sorts=name,asc&sorts=createdAt,desc&keyword=công nghệ

Ghi chú (Posts): chỉ hỗ trợ sắp xếp theo createdAt, updatedAt.
Ghi chú (Industries): hỗ trợ sắp xếp theo name, engName, createdAt, updatedAt.

Quy ước: mỗi giá trị `sorts` có dạng `field,asc|desc`. Nếu không truyền hướng sắp xếp, backend có thể mặc định `asc` (tùy implement).

### 12.5 Filter nâng cao

- Employers (public): lọc theo nhãn `companySize` (enum `LevelCompanySize`) và `provinceId`.
  - Ví dụ: GET /workify/api/v1/employers?pageNumber=1&pageSize=10&keyword=tech&companySize=SMALL&provinceId=1

- Posts (public/admin): lọc theo danh mục và từ khoá.
  - Ví dụ (public): GET /workify/api/v1/posts/public?categoryId=2&keyword=workify&sorts=createdAt,desc
  - Ví dụ (admin): GET /workify/api/v1/posts?categoryId=2&keyword=tin%20tuc

- Industries (public): lọc theo từ khoá trong tên tiếng Việt và tiếng Anh.
  - Ví dụ: GET /workify/api/v1/industries?pageNumber=1&pageSize=10&keyword=tech&sorts=name,asc
  - Ví dụ: GET /workify/api/v1/industries?keyword=công%20nghệ&sorts=engName,asc

Gợi ý: kết hợp `keyword` + nhiều `sorts` giúp trang danh sách ổn định khi phân trang.

### 12.6 Ví dụ lỗi validate tham số (params)

- provinceId không hợp lệ (không phải số)

```json
{
  "timestamp": "2025-10-08T12:00:00.000",
  "status": 400,
  "path": "/workify/api/v1/districts/province/abc",
  "error": "Bad Request",
  "message": "Tham số provinceId phải có kiểu Long"
}
```

- Thiếu tham số bắt buộc

```json
{
  "timestamp": "2025-10-08T12:01:00.000",
  "status": 400,
  "path": "/workify/api/v1/posts/public",
  "error": "Bad Request",
  "message": "Missing required parameter: categoryId"
}
```

Ghi chú: thông điệp có thể thay đổi theo môi trường triển khai.

---

## 18) Full JSON samples per endpoint (Success & Error)

Ghi chú chung:

- Tất cả ví dụ đều theo Base URL: http://localhost:8080/workify
- Mọi response đều bọc theo ResponseData trừ khi ghi chú khác.
- Timestamp trong lỗi chỉ mang tính minh hoạ.

### Auth

- POST /workify/api/v1/auth/users/sign-in
  - Success 200
    ```json
    {
      "status": 200,
      "message": "Đăng nhập thành công",
      "data": {
        "accessToken": "eyJhbGciOi...",
        "refreshToken": "eyJhbGciOi...",
        "data": {
          "id": 12,
          "createdAt": "2025-10-08T09:35:39.376171",
          "updatedAt": "2025-10-08T09:35:39.376171",
          "fullName": "Nguyen Van A",
          "email": "jobseeker@example.com",
          "phoneNumber": null,
          "birthDate": null,
          "gender": null,
          "province": null,
          "district": null,
          "detailAddress": null,
          "avatarUrl": null,
          "noPassword": false,
          "role": "JOB_SEEKER",
          "status": "ACTIVE"
        }
      }
    }
    ```
  - Error 400 (validate)
    ```json
    {
      "timestamp": "2025-10-08T11:03:00.7349508",
      "status": 400,
      "path": "/workify/api/v1/auth/users/sign-in",
      "error": "Bad Request",
      "message": "Dữ liệu trong request body không hợp lệ",
      "errors": [
        { "fieldName": "email", "message": "Định dạng email không hợp lệ" },
        {
          "fieldName": "password",
          "message": "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt, độ dài từ 8 đến 160 ký tự"
        }
      ]
    }
    ```
  - Error 401 (sai thông tin)
    ```json
    {
      "timestamp": "2025-10-08T11:05:32.878249",
      "status": 401,
      "path": "/workify/api/v1/auth/users/sign-in",
      "error": "Unauthorized",
      "message": "Email hoặc mật khẩu không hợp lệ"
    }
    ```

- POST /workify/api/v1/auth/employers/sign-in
  - Success 200: TokenResponse<EmployerResponse> (tương tự User nhưng data là EmployerResponse)
    ```json
    {
      "status": 200,
      "message": "Đăng nhập thành công",
      "data": {
        "accessToken": "...",
        "refreshToken": "...",
        "data": {
          "id": 10,
          "createdAt": "...",
          "updatedAt": "...",
          "email": "hr@example.com",
          "phoneNumber": null,
          "companyName": "ABC Corp",
          "companySize": "SMALL",
          "contactPerson": "Tran Thi C",
          "avatarUrl": null,
          "backgroundUrl": null,
          "employerSlug": "abc-corp",
          "aboutCompany": null,
          "websiteUrls": [],
          "facebookUrl": null,
          "twitterUrl": null,
          "linkedinUrl": null,
          "googleUrl": null,
          "youtubeUrl": null,
          "status": "ACTIVE",
          "province": null,
          "district": null,
          "detailAddress": null
        }
      }
    }
    ```
  - Error 400/401: cùng cấu trúc như trên, path đổi thành "/workify/api/v1/auth/employers/sign-in"

- POST /workify/api/v1/auth/users/refresh-token
  - Success 200
    ```json
    {
      "status": 200,
      "message": "Refresh token thành công",
      "data": { "accessToken": "...", "refreshToken": "..." }
    }
    ```
  - Error 400 thiếu header, 401 token không hợp lệ
    ```json
    {
      "timestamp": "2025-10-08T11:10:00.000",
      "status": 400,
      "path": "/workify/api/v1/auth/users/refresh-token",
      "error": "Bad Request",
      "message": "Thiếu header: Y-Token"
    }
    ```

- POST /workify/api/v1/auth/employers/refresh-token
  - Success 200: giống users/refresh-token (path đổi)
  - Error 400/401: như trên (path đổi)

- POST /workify/api/v1/auth/sign-out
  - Success 200
    ```json
    { "status": 200, "message": "Đăng xuất thành công" }
    ```
  - Error 400/401

    ```json
    {
      "timestamp": "2025-10-08T11:13:00.000",
      "status": 401,
      "path": "/workify/api/v1/auth/sign-out",
      "error": "Unauthorized",
      "message": "Token không hợp lệ"
    }
    ```

    ***

    ## Messaging (Realtime)

    Nội dung này mô tả các API và payload realtime dành cho chức năng chat/messenger.

    Base URL (ví dụ local): `http://localhost:8080/workify`
    API prefix: `/api/v1`

    Các header chung:
    - `Authorization: Bearer <accessToken>` (required for secured endpoints)

    ### REST Endpoints (Chat)
    1. Send message
    - Path: `POST /api/v1/messages`
    - Body (JSON) - `SendMessageRequest`:

    ```json
    {
      "conversationId": 123,
      "content": "Hello, I'm interested in this job"
    }
    ```

    - Response 200 (`ResponseData<MessageResponse>`):

    ```json
    {
      "status": 200,
      "message": "Message sent successfully",
      "data": {
        "id": 1001,
        "conversationId": 123,
        "senderId": 45,
        "senderType": "USER",
        "senderName": "Nguyen Van A",
        "senderAvatar": "https://.../avatar.jpg",
        "content": "Hello, I'm interested in this job",
        "seen": false,
        "createdAt": "2025-11-24T10:00:00"
      }
    }
    ```

    2. Get conversations for current user
    - Path: `GET /api/v1/conversations`
    - Response 200 (`ResponseData<List<ConversationResponse>>`): each `ConversationResponse` includes `hasUnread` (boolean)

    Sample conversation item:

    ```json
    {
      "id": 123,
      "jobId": 55,
      "jobTitle": "Backend Developer",
      "applicationId": 777,
      "jobSeekerId": 45,
      "jobSeekerName": "Nguyen Van A",
      "jobSeekerAvatar": "https://.../avatar.jpg",
      "employerId": 11,
      "employerName": "ABC Corp",
      "employerAvatar": null,
      "lastMessage": "Thanks for your interest",
      "lastMessageSenderId": 11,
      "lastMessageSenderType": "EMPLOYER",
      "hasEmployerMessage": true,
      "hasUnread": true,
      "createdAt": "2025-10-01T08:00:00",
      "updatedAt": "2025-11-24T09:59:00"
    }
    ```

    3. Get messages by conversation
    - Path: `GET /api/v1/messages/{conversationId}`
    - Response 200 (`ResponseData<List<MessageResponse>>`)

    Sample message item (same as `MessageResponse` above):

    ```json
    {
      "id": 1001,
      "conversationId": 123,
      "senderId": 45,
      "senderType": "USER",
      "senderName": "Nguyen Van A",
      "senderAvatar": "https://.../avatar.jpg",
      "content": "Hello, I'm interested in this job",
      "seen": false,
      "createdAt": "2025-11-24T10:00:00"
    }
    ```

    4. Mark messages in a conversation as seen
    - Path: `PUT /api/v1/messages/{conversationId}/seen`
    - Description: Marks all unseen messages in the conversation as seen for the current authenticated user. Server updates the conversation unread counters accordingly and emits realtime updates.
    - Response 200: No data (`ResponseData<Void>`)
    5. Get number of conversations that have unread messages
    - Path: `GET /api/v1/messages/unread-conversations`
    - Response 200 (`ResponseData<{"unreadConversations": number}>`)

    Sample:

    ```json
    {
      "status": 200,
      "message": "Unread conversations count retrieved",
      "data": { "unreadConversations": 5 }
    }
    ```

    ### WebSocket (STOMP over SockJS) — Realtime messages & unread updates
    - STOMP endpoint (SockJS): `ws://<host>/workify/ws`
    - Subscriptions (per-user destinations)
      - `/user/queue/messages` — receives `MESSAGE` events when a new message is sent involving the user
      - `/user/queue/unread` — receives `SEEN_UPDATE` events when unread/seen status changes

    MESSAGE event (new message)

    ```json
    {
      "type": "MESSAGE",
      "message": {
        /* MessageResponse */
      },
      "unread": {
        "conversationId": 123,
        "unreadForRecipient": 2,
        "totalUnreadConversations": 5
      }
    }
    ```

    SEEN_UPDATE event (after mark-as-seen)

    ```json
    {
      "type": "SEEN_UPDATE",
      "conversationId": 123,
      "updatedByUserId": 45,
      "unread": {
        "conversationId": 123,
        "unreadForJobSeeker": 0,
        "unreadForEmployer": 0
      },
      "totalUnreadConversations": {
        "jobSeeker": 3,
        "employer": 2
      }
    }
    ```

    Notes:
    - `totalUnreadConversations` indicates how many conversations currently have unread messages (per role). Use this to render the global/badge count in the UI.
    - `unreadForRecipient` and the per-role unread counts are derived from `Conversation.unreadCountJobSeeker` / `Conversation.unreadCountEmployer` maintained by the server.

    ### Front-end integration (quick guide)
    1. Connect & subscribe (example with StompJS + SockJS)

    ```javascript
    import SockJS from "sockjs-client";
    import { Client } from "@stomp/stompjs";

    const socketUrl = "http://localhost:8080/workify/ws";
    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders: { Authorization: "Bearer " + accessToken },
    });

    client.onConnect = () => {
      client.subscribe("/user/queue/messages", (msg) => {
        const payload = JSON.parse(msg.body);
        // handle MESSAGE event
      });

      client.subscribe("/user/queue/unread", (msg) => {
        const payload = JSON.parse(msg.body);
        // handle SEEN_UPDATE event
      });
    };

    client.activate();
    ```

    2. Mark conversation as seen when user opens it

    ```javascript
    await fetch("/workify/api/v1/messages/" + conversationId + "/seen", {
      method: "PUT",
      headers: { Authorization: "Bearer " + accessToken },
    });
    // rely on SEEN_UPDATE websocket event to update UI consistently
    ```

    3. Fetch global badge on app load

    ```javascript
    const res = await fetch("/workify/api/v1/messages/unread-conversations", {
      headers: { Authorization: "Bearer " + accessToken },
    });
    const body = await res.json();
    const unreadConversations = body.data.unreadConversations;
    ```

    ### Recommended UI behaviour
    - Conversation list: use `hasUnread` boolean to show a small dot/badge per conversation.
    - Global badge (navbar): show `unreadConversations` value. Update it from REST on load and from realtime events.

    ***

- PATCH /workify/api/v1/auth/users/verify-email
  - Success 200
    ```json
    { "status": 200, "message": "Xác nhận email thành công" }
    ```
  - Error 400/401: thiếu C-Token hoặc token không hợp lệ

- PATCH /workify/api/v1/auth/employers/verify-email
  - Success 200: như users/verify-email
  - Error 400/401: như trên (path đổi)

- POST /workify/api/v1/auth/users/forgot-password
  - Success 200
    ```json
    { "status": 200, "message": "Gửi email đặt lại mật khẩu thành công" }
    ```
  - Error 400/500: validate email hoặc lỗi gửi mail

- POST /workify/api/v1/auth/employers/forgot-password
  - Success 200: như users (path đổi)
  - Error 400/500: như trên (path đổi)

- POST /workify/api/v1/auth/users/reset-password
  - Success 200
    ```json
    { "status": 200, "message": "Đặt lại mật khẩu thành công" }
    ```
  - Error 400/401/500

- POST /workify/api/v1/auth/employers/reset-password
  - Success 200: như users (path đổi)
  - Error 400/401/500

- POST /workify/api/v1/auth/authenticate/google
  - Success 200: TokenResponse<UserResponse>
    - Trường hợp A – đã có mật khẩu (noPassword = false)
      ```json
      {
        "status": 200,
        "message": "Đăng nhập thành công",
        "data": {
          "accessToken": "...",
          "refreshToken": "...",
          "data": {
            "id": 2,
            "fullName": "Nguyen Van A",
            "email": "user.google@example.com",
            "noPassword": false,
            "role": "JOB_SEEKER",
            "status": "ACTIVE"
          }
        }
      }
      ```
    - Trường hợp B – chưa có mật khẩu (noPassword = true)
      ```json
      {
        "status": 200,
        "message": "Xác thực thành công, vui lòng tạo mật khẩu",
        "data": {
          "createPasswordToken": "eyJhbGciOi...CRToken..."
        }
      }
      ```
  - Error 400/500

- POST /workify/api/v1/auth/authenticate/linkedin
  - Success 200: TokenResponse<UserResponse>
    - Trường hợp A – đã có mật khẩu (noPassword = false)
      ```json
      {
        "status": 200,
        "message": "Đăng nhập thành công",
        "data": {
          "accessToken": "...",
          "refreshToken": "...",
          "data": {
            "id": 3,
            "fullName": "Tran Thi B",
            "email": "user.linkedin@example.com",
            "noPassword": false,
            "role": "JOB_SEEKER",
            "status": "ACTIVE"
          }
        }
      }
      ```
    - Trường hợp B – chưa có mật khẩu (noPassword = true)
      ```json
      {
        "status": 200,
        "message": "Xác thực thành công, vui lòng tạo mật khẩu",
        "data": {
          "createPasswordToken": "eyJhbGciOi...CRToken..."
        }
      }
      ```
  - Error 400/500

- POST /workify/api/v1/auth/create-password
  - Success 200: TokenResponse<UserResponse>
  - Error 400/401/409/500

### Users

- GET /workify/api/v1/users?pageNumber=1&pageSize=10
  - Success 200
    ```json
    {
      "status": 200,
      "message": "Lấy danh sách người dùng thành công",
      "data": {
        "pageNumber": 1,
        "pageSize": 10,
        "totalPages": 3,
        "numberOfElements": 10,
        "items": [
          {
            "id": 1,
            "createdAt": "2025-10-08T09:35:39.376171",
            "updatedAt": "2025-10-08T09:35:39.376171",
            "fullName": "System Administrator",
            "email": "admin@example.com",
            "phoneNumber": null,
            "birthDate": null,
            "gender": null,
            "province": null,
            "district": null,
            "detailAddress": null,
            "avatarUrl": null,
            "noPassword": false,
            "role": "ADMIN",
            "status": "ACTIVE"
          }
        ]
      }
    }
    ```
  - Error 400/401/403

- GET /workify/api/v1/users/13
  - Success 200
    ```json
    {
      "status": 200,
      "message": "Lấy người dùng thành công",
      "data": {
        "id": 13,
        "createdAt": "2025-10-08T09:35:39.376171",
        "updatedAt": "2025-10-08T09:35:39.376171",
        "fullName": "Nguyen Van B",
        "email": "user2@example.com",
        "phoneNumber": "+84912345678",
        "birthDate": "2000-01-01",
        "gender": "MALE",
        "province": { "id": 1, "name": "Hà Nội" },
        "district": { "id": 2, "name": "Quận Ba Đình" },
        "detailAddress": "123 Đường ABC",
        "avatarUrl": null,
        "noPassword": false,
        "role": "JOB_SEEKER",
        "status": "ACTIVE"
      }
    }
    ```
  - Error 400/401/403/404

- POST /workify/api/v1/users (multipart)
  - Success 200
    ```json
    {
      "status": 200,
      "message": "Tạo người dùng thành công",
      "data": {
        "id": 13,
        "fullName": "Nguyen Van B",
        "email": "user2@example.com",
        "role": "JOB_SEEKER",
        "status": "ACTIVE"
      }
    }
    ```
  - Error 400/401/403/409/500

- PUT /workify/api/v1/users/13 (multipart)
  - Success 200
    ```json
    {
      "status": 200,
      "message": "Cập nhật người dùng thành công",
      "data": {
        "id": 13,
        "fullName": "Nguyen Van B (updated)",
        "email": "user2@example.com",
        "role": "JOB_SEEKER",
        "status": "ACTIVE"
      }
    }
    ```
  - Error 400/401/403/404

- DELETE /workify/api/v1/users/13
  - Success 200
    ```json
    { "status": 200, "message": "Xóa người dùng thành công" }
    ```
  - Error 400/401/403/404

- POST /workify/api/v1/users/sign-up
  - Success 200
    ```json
    {
      "status": 200,
      "message": "Đăng ký người dùng thành công, vui lòng kiểm tra email để xác nhận",
      "data": { "id": 100, "email": "user@example.com", "status": "ACTIVE" }
    }
    ```
  - Error 400/409/500

- GET /workify/api/v1/users/me
  - Success 200: UserResponse
  - Error 401

- PUT /workify/api/v1/users/me
  - Success 200: UserResponse
  - Error 400/401

- PATCH /workify/api/v1/users/me/avatar (multipart)
  - Success 200: UserResponse (avatarUrl cập nhật)
  - Error 400/401

- PATCH /workify/api/v1/users/me/password
  - Success 200
    ```json
    { "status": 200, "message": "Cập nhật mật khẩu thành công" }
    ```
  - Error 400/401

### Employers

- GET /workify/api/v1/employers?pageNumber=1&pageSize=10
  - Success 200
    ```json
    {
      "status": 200,
      "message": "Lấy danh sách nhà tuyển dụng thành công",
      "data": {
        "pageNumber": 1,
        "pageSize": 10,
        "totalPages": 5,
        "numberOfElements": 10,
        "items": [
          {
            "id": 10,
            "email": "hr@example.com",
            "companyName": "ABC Corp",
            "companySize": "SMALL",
            "status": "ACTIVE"
          }
        ]
      }
    }
    ```
  - Error 400/403

- GET /workify/api/v1/employers/10
  - Success 200: EmployerResponse
  - Error 400/403/404

- GET /workify/api/v1/employers/me
  - Success 200: EmployerResponse
  - Error 401

- POST /workify/api/v1/employers/sign-up
  - Success 200 (đã có ví dụ ở trên)
  - Error 400/409/500

- POST /workify/api/v1/employers (multipart, ADMIN)
  - Success 200: EmployerResponse
  - Error 400/401/403/409

- PUT /workify/api/v1/employers/10 (multipart, ADMIN)
  - Success 200: EmployerResponse
  - Error 400/401/403/404/409

- PUT /workify/api/v1/employers/me
  - Success 200: EmployerResponse
  - Error 400/401

- DELETE /workify/api/v1/employers/10
  - Success 200
    ```json
    { "status": 200, "message": "Xóa nhà tuyển dụng thành công" }
    ```
  - Error 400/401/403/404

- PATCH /workify/api/v1/employers/me/avatar (multipart)
  - Success 200: EmployerResponse
  - Error 400/401

- PATCH /workify/api/v1/employers/me/background (multipart)
  - Success 200: EmployerResponse
  - Error 400/401

- PATCH /workify/api/v1/employers/me/website-urls
  - Success 200: EmployerResponse
  - Error 400/401

- PATCH /workify/api/v1/employers/me/password
  - Success 200
    ```json
    { "status": 200, "message": "Cập nhật mật khẩu thành công" }
    ```
  - Error 400/401

### Category Posts

- GET /workify/api/v1/categories-post?pageNumber=1&pageSize=10
  - Success 200
    ```json
    {
      "status": 200,
      "message": "Lấy danh sách danh mục bài viết thành công",
      "data": {
        "pageNumber": 1,
        "pageSize": 10,
        "totalPages": 1,
        "numberOfElements": 1,
        "items": [
          { "id": 3, "title": "Tin tức", "description": "Danh mục tin tức" }
        ]
      }
    }
    ```
  - Error 400

- GET /workify/api/v1/categories-post/3
  - Success 200: CategoryPostResponse
  - Error 400/404

- POST /workify/api/v1/categories-post (ADMIN)
  - Success 201
    ```json
    {
      "status": 201,
      "message": "Tạo danh mục bài viết thành công",
      "data": { "id": 3, "title": "Tin tức", "description": "Danh mục tin tức" }
    }
    ```
  - Error 400/401/403/409

- PUT /workify/api/v1/categories-post/3 (ADMIN)
  - Success 200: CategoryPostResponse
  - Error 400/401/403/404/409

- DELETE /workify/api/v1/categories-post/3 (ADMIN)
  - Success 200
    ```json
    { "status": 200, "message": "Xóa danh mục bài viết thành công" }
    ```
  - Error 400/401/403/404

### Posts

- GET /workify/api/v1/posts?pageNumber=1&pageSize=10 (ADMIN)
  - Success 200
    ```json
    {
      "status": 200,
      "message": "Lấy danh sách bài viết thành công",
      "data": {
        "pageNumber": 1,
        "pageSize": 10,
        "totalPages": 1,
        "numberOfElements": 1,
        "items": [
          {
            "id": 100,
            "createdAt": "2025-10-08T12:30:11.000",
            "updatedAt": "2025-10-08T12:35:05.000",
            "title": "Giới thiệu Workify",
            "excerpt": "Nền tảng việc làm...",
            "content": "<p>Nội dung HTML đã được xử lý...</p>",
            "contentText": "Noi dung HTML da duoc xu ly...",
            "thumbnailUrl": "https://cdn.example.com/posts/100/thumbnail.jpg",
            "tags": "workify|viec-lam",
            "slug": "gioi-thieu-workify",
            "readingTimeMinutes": 3,
            "category": {
              "id": 1,
              "title": "Tin tức",
              "description": "Danh mục tin tức"
            },
            "author": {
              "id": 1,
              "fullName": "System Administrator",
              "avatarUrl": null,
              "email": "admin@example.com",
              "role": "ADMIN"
            },
            "status": "PUBLIC"
          }
        ]
      }
    }
    ```
  - Error 400/401/403

- GET /workify/api/v1/posts/public?pageNumber=1&pageSize=10
  - Success 200: tương tự cấu trúc trên (không cần quyền)
  - Error 400

- GET /workify/api/v1/posts/100
  - Success 200: PostResponse
  - Error 400/404

- POST /workify/api/v1/posts (multipart, ADMIN)
  - Success 201
    ```json
    {
      "status": 201,
      "message": "Tạo bài viết thành công",
      "data": {
        "id": 100,
        "createdAt": "2025-10-08T12:30:11.000",
        "updatedAt": "2025-10-08T12:30:11.000",
        "title": "Giới thiệu Workify",
        "excerpt": "Nền tảng việc làm...",
        "content": "<p>Nội dung HTML đã được xử lý...</p>",
        "contentText": "Noi dung HTML da duoc xu ly...",
        "thumbnailUrl": "https://cdn.example.com/posts/100/thumbnail.jpg",
        "tags": "workify|viec-lam",
        "slug": "gioi-thieu-workify",
        "readingTimeMinutes": 3,
        "category": {
          "id": 1,
          "title": "Tin tức",
          "description": "Danh mục tin tức"
        },
        "author": {
          "id": 1,
          "fullName": "System Administrator",
          "avatarUrl": null,
          "email": "admin@example.com",
          "role": "ADMIN"
        },
        "status": "PUBLIC"
      }
    }
    ```
  - Error 400/401/403/409

- PUT /workify/api/v1/posts/100 (multipart, ADMIN)
  - Success 200: PostResponse
  - Error 400/401/403/404/409

- DELETE /workify/api/v1/posts/100 (ADMIN)
  - Success 200
    ```json
    { "status": 200, "message": "Xóa bài viết thành công" }
    ```
  - Error 400/401/403/404

- GET /workify/api/v1/posts/public/100/related?limit=6
  - Success 200
    ```json
    {
      "status": 200,
      "message": "Lấy danh sách bài viết thành công",
      "data": [
        {
          "id": 101,
          "title": "Tin liên quan 1",
          "excerpt": "...",
          "thumbnailUrl": "https://cdn.example.com/posts/101/thumbnail.jpg",
          "slug": "tin-lien-quan-1",
          "readingTimeMinutes": 2,
          "category": {
            "id": 1,
            "title": "Tin tức",
            "description": "Danh mục tin tức"
          },
          "author": {
            "id": 2,
            "fullName": "Nguyen Van A",
            "avatarUrl": null,
            "email": "user@example.com",
            "role": "JOB_SEEKER"
          },
          "status": "PUBLIC"
        }
      ]
    }
    ```
  - Error 400/404

- GET /workify/api/v1/posts/public/latest?limit=10
  - Success 200
    ```json
    {
      "status": 200,
      "message": "Lấy danh sách bài viết thành công",
      "data": [
        {
          "id": 110,
          "title": "Bài viết mới 1",
          "excerpt": "...",
          "thumbnailUrl": "https://cdn.example.com/posts/110/thumbnail.jpg",
          "slug": "bai-viet-moi-1",
          "readingTimeMinutes": 1,
          "category": {
            "id": 1,
            "title": "Tin tức",
            "description": "Danh mục tin tức"
          },
          "userAuthor": {
            "id": 1,
            "fullName": "System Administrator",
            "avatarUrl": null,
            "email": "admin@example.com",
            "role": "ADMIN"
          },
          "employerAuthor": null,
          "status": "PUBLIC"
        }
      ]
    }
    ```
  - Error 400

### Industries

- GET /workify/api/v1/industries/all
  - Success 200
    ```json
    {
      "status": 200,
      "message": "Lấy danh sách ngành nghề thành công",
      "data": [
        {
          "id": 1,
          "createdAt": "2025-10-08T09:00:00.000",
          "updatedAt": "2025-10-08T09:00:00.000",
          "name": "Công nghệ thông tin",
          "engName": "Information Technology",
          "description": "Phát triển phần mềm, lập trình, hệ thống IT"
        },
        {
          "id": 2,
          "createdAt": "2025-10-08T09:01:00.000",
          "updatedAt": "2025-10-08T09:01:00.000",
          "name": "Kế toán - Kiểm toán",
          "engName": "Accounting - Auditing",
          "description": "Kế toán doanh nghiệp, kiểm toán tài chính"
        }
      ]
    }
    ```
  - Error 500 (hiếm)

- GET /workify/api/v1/industries?pageNumber=1&pageSize=10&keyword=công nghệ&sorts=name,asc
  - Success 200
    ```json
    {
      "status": 200,
      "message": "Lấy danh sách ngành nghề thành công",
      "data": {
        "pageNumber": 1,
        "pageSize": 10,
        "totalPages": 1,
        "numberOfElements": 2,
        "items": [
          {
            "id": 1,
            "createdAt": "2025-10-08T09:00:00.000",
            "updatedAt": "2025-10-08T09:00:00.000",
            "name": "Công nghệ thông tin",
            "engName": "Information Technology",
            "description": "Phát triển phần mềm, lập trình, hệ thống IT"
          },
          {
            "id": 15,
            "createdAt": "2025-10-08T09:15:00.000",
            "updatedAt": "2025-10-08T09:15:00.000",
            "name": "Công nghệ sinh học",
            "engName": "Biotechnology",
            "description": "Ứng dụng công nghệ trong sinh học và y học"
          }
        ]
      }
    }
    ```
  - Error 400

- GET /workify/api/v1/industries/1
  - Success 200: IndustryResponse
    ```json
    {
      "status": 200,
      "message": "Lấy thông tin ngành nghề thành công",
      "data": {
        "id": 1,
        "createdAt": "2025-10-08T09:00:00.000",
        "updatedAt": "2025-10-08T09:00:00.000",
        "name": "Công nghệ thông tin",
        "engName": "Information Technology",
        "description": "Phát triển phần mềm, lập trình, hệ thống IT"
      }
    }
    ```
  - Error 400/404

- POST /workify/api/v1/industries (ADMIN)
  - Success 201
    ```json
    {
      "status": 201,
      "message": "Tạo ngành nghề thành công",
      "data": {
        "id": 61,
        "createdAt": "2025-10-08T12:30:00.000",
        "updatedAt": "2025-10-08T12:30:00.000",
        "name": "Trí tuệ nhân tạo",
        "engName": "Artificial Intelligence",
        "description": "Machine learning, AI, deep learning và automation"
      }
    }
    ```
  - Error 400/401/403/409
    ```json
    {
      "timestamp": "2025-10-08T12:31:00.000",
      "status": 409,
      "path": "/workify/api/v1/industries",
      "error": "Conflict",
      "message": "Tên ngành nghề đã tồn tại"
    }
    ```

- PUT /workify/api/v1/industries/1 (ADMIN)
  - Success 200: IndustryResponse
    ```json
    {
      "status": 200,
      "message": "Cập nhật ngành nghề thành công",
      "data": {
        "id": 1,
        "createdAt": "2025-10-08T09:00:00.000",
        "updatedAt": "2025-10-08T12:35:00.000",
        "name": "Công nghệ thông tin",
        "engName": "Information Technology",
        "description": "Phát triển phần mềm, lập trình, hệ thống IT và cloud computing"
      }
    }
    ```
  - Error 400/401/403/404/409

- DELETE /workify/api/v1/industries/1 (ADMIN)
  - Success 200
    ```json
    { "status": 200, "message": "Xóa ngành nghề thành công" }
    ```
  - Error 400/401/403/404
    ```json
    {
      "timestamp": "2025-10-08T12:40:00.000",
      "status": 404,
      "path": "/workify/api/v1/industries/999",
      "error": "Not Found",
      "message": "Ngành nghề không tồn tại"
    }
    ```

### Provinces

- GET /workify/api/v1/provinces
  - Success 200
    ```json
    {
      "status": 200,
      "message": "Lấy danh sách tỉnh thành thành công",
      "data": [
        { "id": 1, "code": "HNI", "name": "Hà Nội", "engName": "Ha Noi" }
      ]
    }
    ```
  - Error 500 (hiếm)

- GET /workify/api/v1/provinces/1
  - Success 200: ProvinceResponse
  - Error 400/404

- POST /workify/api/v1/provinces (ADMIN)
  - Success 201: ProvinceResponse
  - Error 400/401/403/409

- PUT /workify/api/v1/provinces/1 (ADMIN)
  - Success 200: ProvinceResponse
  - Error 400/401/403/404/409

- DELETE /workify/api/v1/provinces/1 (ADMIN)
  - Success 200
    ```json
    { "status": 200, "message": "Xóa tỉnh thành công" }
    ```
  - Error 400/401/403/404

### Districts

- GET /workify/api/v1/districts
  - Success 200
    ```json
    {
      "status": 200,
      "message": "Lấy danh sách quận/huyện thành công",
      "data": [{ "id": 10, "code": "Q1", "name": "Quận 1" }]
    }
    ```
  - Error 500 (hiếm)

- GET /workify/api/v1/districts/province/1
  - Success 200: List<DistrictResponse>
  - Error 400/404

- GET /workify/api/v1/districts/10
  - Success 200: DistrictResponse
  - Error 400/404

- POST /workify/api/v1/districts (ADMIN)
  - Success 201: DistrictResponse
  - Error 400/401/403/409

- PUT /workify/api/v1/districts/10 (ADMIN)
  - Success 200: DistrictResponse
  - Error 400/401/403/404/409

- DELETE /workify/api/v1/districts/10 (ADMIN)
  - Success 200
    ```json
    { "status": 200, "message": "Xóa quận/huyện thành công" }
    ```
  - Error 400/401/403/404

### Roles

- GET /workify/api/v1/roles
  - Success 200
    ```json
    {
      "status": 200,
      "message": "Lấy danh sách vai trò thành công",
      "data": [
        { "id": 1, "name": "ADMIN" },
        { "id": 2, "name": "JOB_SEEKER" }
      ]
    }
    ```
  - Error 401/403

- GET /workify/api/v1/roles/ADMIN
  - Success 200
    ```json
    {
      "status": 200,
      "message": "Lấy vai trò thành công",
      "data": { "id": 1, "name": "ADMIN" }
    }
    ```
  - Error 401/403/404

- POST /workify/api/v1/roles
  - Success 201
    ```json
    {
      "status": 201,
      "message": "Tạo vai trò thành công",
      "data": { "id": 3, "name": "EMPLOYER" }
    }
    ```
  - Error 400/401/403/409

- PUT /workify/api/v1/roles?id=3
  - Success 200
    ```json
    {
      "status": 200,
      "message": "Cập nhật vai trò thành công",
      "data": { "id": 3, "name": "EMPLOYER" }
    }
    ```
  - Error 400/401/403/404/409

- DELETE /workify/api/v1/roles/3
  - Success 200
    ```json
    { "status": 200, "message": "Xóa vai trò thành công" }
    ```
  - Error 400/401/403/404

## Chat & Messaging

### Tổng quan

Hệ thống chat cho phép nhà tuyển dụng (EMPLOYER) và người tìm việc (JOB_SEEKER) trao đổi tin nhắn liên quan đến đơn ứng tuyển. Mỗi application sẽ tự động tạo một conversation khi user apply job.

**Quy tắc:**

- 1 application = 1 conversation (unique constraint)
- Conversation được tạo tự động khi user apply job
- Chỉ EMPLOYER có thể gửi tin nhắn đầu tiên
- USER chỉ có thể gửi tin nhắn sau khi EMPLOYER đã gửi ít nhất 1 tin nhắn
- Hỗ trợ WebSocket cho real-time messaging

### WebSocket Configuration

**Endpoint:** `/ws` (SockJS)

**Connection:**

```javascript
const socket = new SockJS("http://localhost:8080/workify/ws");
const stompClient = Stomp.over(socket);

stompClient.connect(
  {
    Authorization: "Bearer <accessToken>",
  },
  onConnected,
  onError
);
```

**Subscribe để nhận tin nhắn:**

```javascript
// Subscribe theo user ID (tự động route đến đúng user)
stompClient.subscribe("/user/queue/messages", onMessageReceived);
```

**Gửi tin nhắn qua WebSocket:**

```javascript
stompClient.send(
  "/app/chat.sendMessage",
  {},
  JSON.stringify({
    conversationId: 1,
    content: "Xin chào!",
  })
);
```

### REST APIs

#### 1. Lấy danh sách conversations

**GET** `/api/v1/conversations`

**Authentication:** Required (JWT)

**Roles:** JOB_SEEKER, EMPLOYER

**Response:**

```json
{
  "status": 200,
  "message": "Conversations retrieved successfully",
  "data": [
    {
      "id": 1,
      "jobId": 10,
      "jobTitle": "Senior Java Developer",
      "applicationId": 5,
      "jobSeekerId": 2,
      "jobSeekerName": "Nguyễn Văn A",
      "jobSeekerAvatar": "https://example.com/avatar.jpg",
      "employerId": 3,
      "employerName": "Công ty ABC",
      "employerAvatar": "https://example.com/company.jpg",
      "lastMessage": "Cảm ơn bạn đã ứng tuyển!",
      "lastMessageSenderId": 3,
      "lastMessageSenderType": "EMPLOYER",
      "hasEmployerMessage": true,
      "createdAt": "2025-01-15T10:30:00",
      "updatedAt": "2025-01-15T14:20:00"
    }
  ]
}
```

**Error Responses:**

- 401: Token không hợp lệ
- 403: Không có quyền truy cập

#### 2. Lấy conversation theo application ID

**GET** `/api/v1/conversations/application/{applicationId}`

**Authentication:** Required (JWT)

**Roles:** JOB_SEEKER, EMPLOYER

**Path Parameters:**

- `applicationId` (Long, required): ID của application

**Response:**

```json
{
  "status": 200,
  "message": "Conversation retrieved successfully",
  "data": {
    "id": 1,
    "jobId": 10,
    "jobTitle": "Senior Java Developer",
    "applicationId": 5,
    "jobSeekerId": 2,
    "jobSeekerName": "Nguyễn Văn A",
    "jobSeekerAvatar": "https://example.com/avatar.jpg",
    "employerId": 3,
    "employerName": "Công ty ABC",
    "employerAvatar": "https://example.com/company.jpg",
    "lastMessage": "Cảm ơn bạn đã ứng tuyển!",
    "lastMessageSenderId": 3,
    "lastMessageSenderType": "EMPLOYER",
    "hasEmployerMessage": true,
    "createdAt": "2025-01-15T10:30:00",
    "updatedAt": "2025-01-15T14:20:00"
  }
}
```

**Error Responses:**

- 400: Application ID không hợp lệ
- 401: Token không hợp lệ
- 403: Không có quyền truy cập conversation này
- 404: Không tìm thấy application hoặc conversation

#### 3. Lấy lịch sử tin nhắn

**GET** `/api/v1/messages/{conversationId}`

**Authentication:** Required (JWT)

**Roles:** JOB_SEEKER, EMPLOYER

**Path Parameters:**

- `conversationId` (Long, required): ID của conversation

**Response:**

```json
{
  "status": 200,
  "message": "Messages retrieved successfully",
  "data": [
    {
      "id": 1,
      "conversationId": 1,
      "senderId": 3,
      "senderType": "EMPLOYER",
      "senderName": "Công ty ABC",
      "senderAvatar": "https://example.com/company.jpg",
      "content": "Cảm ơn bạn đã ứng tuyển!",
      "seen": true,
      "createdAt": "2025-01-15T10:30:00"
    },
    {
      "id": 2,
      "conversationId": 1,
      "senderId": 2,
      "senderType": "USER",
      "senderName": "Nguyễn Văn A",
      "senderAvatar": "https://example.com/avatar.jpg",
      "content": "Cảm ơn bạn! Tôi rất quan tâm đến vị trí này.",
      "seen": true,
      "createdAt": "2025-01-15T10:35:00"
    }
  ]
}
```

**Error Responses:**

- 400: Conversation ID không hợp lệ
- 401: Token không hợp lệ
- 403: Không phải thành viên của conversation này
- 404: Không tìm thấy conversation

#### 4. Gửi tin nhắn (REST API)

**POST** `/api/v1/messages`

**Authentication:** Required (JWT)

**Roles:** JOB_SEEKER, EMPLOYER

**Request Body:**

```json
{
  "conversationId": 1,
  "content": "Xin chào! Tôi muốn hỏi về vị trí này."
}
```

**Validation:**

- `conversationId`: Required, Long
- `content`: Required, NotBlank

**Response:**

```json
{
  "status": 200,
  "message": "Message sent successfully",
  "data": {
    "id": 3,
    "conversationId": 1,
    "senderId": 2,
    "senderType": "USER",
    "senderName": "Nguyễn Văn A",
    "senderAvatar": "https://example.com/avatar.jpg",
    "content": "Xin chào! Tôi muốn hỏi về vị trí này.",
    "seen": false,
    "createdAt": "2025-01-15T15:00:00"
  }
}
```

**Error Responses:**

- 400:
  - Dữ liệu request không hợp lệ
  - Conversation ID hoặc content thiếu
- 401: Token không hợp lệ
- 403:
  - Không phải thành viên của conversation
  - USER chưa được phép gửi tin nhắn (chưa có tin nhắn từ EMPLOYER)
- 404: Không tìm thấy conversation

#### 5. Đánh dấu tin nhắn đã đọc

**PUT** `/api/v1/messages/{conversationId}/seen`

**Authentication:** Required (JWT)

**Roles:** JOB_SEEKER, EMPLOYER

**Path Parameters:**

- `conversationId` (Long, required): ID của conversation

**Response:**

```json
{
  "status": 200,
  "message": "Messages marked as seen"
}
```

**Error Responses:**

- 400: Conversation ID không hợp lệ
- 401: Token không hợp lệ
- 403: Không phải thành viên của conversation
- 404: Không tìm thấy conversation

### Unread counts (Đếm tin chưa đọc) và cập nhật realtime

Phần này mô tả các thay đổi để hỗ trợ số lượng tin chưa đọc trên mỗi conversation và tổng số tin chưa đọc cho user hiện tại.

1. Cơ sở dữ liệu (Postgres) - migration & backfill

Chạy SQL sau để thêm cột vào bảng `conversation` và backfill từ bảng `message` (chỉ các message có `seen = false`):

```sql
ALTER TABLE conversation
  ADD COLUMN unread_count_job_seeker INT NOT NULL DEFAULT 0,
  ADD COLUMN unread_count_employer INT NOT NULL DEFAULT 0;

-- Backfill unread counts
UPDATE conversation c
SET unread_count_job_seeker = sub.cnt
FROM (
  SELECT m.conversation_id, COUNT(*) AS cnt
  FROM message m
  WHERE m.seen = false AND m.sender_type = 'EMPLOYER'
  GROUP BY m.conversation_id
) sub
WHERE c.id = sub.conversation_id;

UPDATE conversation c
SET unread_count_employer = sub.cnt
FROM (
  SELECT m.conversation_id, COUNT(*) AS cnt
  FROM message m
  WHERE m.seen = false AND m.sender_type = 'USER'
  GROUP BY m.conversation_id
) sub
WHERE c.id = sub.conversation_id;

-- Index để tăng tốc các phép đếm và cập nhật
CREATE INDEX IF NOT EXISTS idx_message_conv_seen_sender ON message (conversation_id, seen, sender_type);
```

Lưu ý: chạy backfill trong maintenance window hoặc qua tool migration (Flyway/Liquibase) để tránh race với việc ghi mới.

2. Thay đổi API

- GET `/api/v1/conversations` (không đổi path) — mỗi item `ConversationResponse` giờ có thêm trường `unreadCount` là số tin chưa đọc dành cho user đang gọi API (job seeker hoặc employer).

- GET `/api/v1/messages/unread-count` — trả về tổng số tin chưa đọc cho user hiện tại.

  Response ví dụ:

  ```json
  {
    "status": 200,
    "message": "Unread count retrieved",
    "data": { "totalUnread": 12 }
  }
  ```

- PUT `/api/v1/messages/{conversationId}/seen` — hành vi:
  - Đánh dấu `message.seen = true` cho các message trong conversation nếu `sender_type != caller.role` và `seen = false` (tức là những message chưa đọc của caller).
  - Trong cùng một transaction, SELECT FOR UPDATE conversation row và giảm `conversation.unread_count_job_seeker` hoặc `conversation.unread_count_employer` tương ứng theo số bản ghi đã cập nhật (bounded >= 0).
  - Sau commit, backend publish sự kiện WebSocket `SEEN_UPDATE` tới cả hai user của conversation.

3. Sự kiện WebSocket (STOMP)

Server publish tới `/user/{principal}/queue/messages` và `/user/{principal}/queue/unread`.

A) Khi gửi tin nhắn -> gửi `MESSAGE` tới người nhận (và sender):

```json
{
  "type": "MESSAGE",
  "message": {
    "id": 123,
    "conversationId": 1,
    "senderId": 3,
    "senderType": "EMPLOYER",
    "content": "Xin chào",
    "seen": false,
    "createdAt": "2025-11-23T10:00:00"
  },
  "unread": {
    "conversationId": 1,
    "unreadForRecipient": 5,
    "totalUnread": 17
  }
}
```

B) Khi mark-seen -> publish `SEEN_UPDATE` tới cả hai users:

```json
{
  "type": "SEEN_UPDATE",
  "conversationId": 1,
  "updatedByUserId": 2,
  "unread": {
    "conversationId": 1,
    "unreadForJobSeeker": 0,
    "unreadForEmployer": 3
  },
  "totalUnread": {
    "jobSeeker": 4,
    "employer": 10
  }
}
```

Client frontend nên update badge conversation và tổng unread dựa trên các payload này.

4. Ghi chú về transaction / concurrency

- Luôn thực hiện cập nhật `message.seen` và `conversation.unread_count_*` trong cùng 1 DB transaction.
- Khóa row conversation bằng `SELECT ... FOR UPDATE` (PESSIMISTIC WRITE) trước khi thay đổi counter để tránh race khi nhiều client cùng thao tác.
- Các câu lệnh UPDATE trả về số dòng đã ảnh hưởng; sử dụng con số này để trừ tương ứng vào counter (và đảm bảo counter >= 0).

5. Acceptance criteria (kiểm thử ngắn)

- Khi gọi `GET /api/v1/conversations`, mỗi item trả về `unreadCount` đúng cho caller.
- `GET /api/v1/messages/unread-count` trả về tổng số chưa đọc đúng.
- Khi employer gửi message, recipient nhận event `MESSAGE` có trường `unread` cập nhật và badge conversation được cập nhật.
- Khi caller gọi `PUT /api/v1/messages/{conversationId}/seen`, messages được đánh `seen=true`, conversation counter được cập nhật chính xác và `SEEN_UPDATE` được publish; tổng unread giảm tương ứng.

Nếu muốn tôi có thể tạo file migration Flyway (ví dụ `V2__add_unread_counts.sql`) trong thư mục migrations.

### Data Models

#### ConversationResponse

```typescript
interface ConversationResponse {
  id: number;
  jobId: number;
  jobTitle: string;
  applicationId: number;
  jobSeekerId: number;
  jobSeekerName: string;
  jobSeekerAvatar: string | null;
  employerId: number;
  employerName: string;
  employerAvatar: string | null;
  lastMessage: string | null;
  lastMessageSenderId: number | null;
  lastMessageSenderType: "USER" | "EMPLOYER" | null;
  hasEmployerMessage: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

#### MessageResponse

```typescript
interface MessageResponse {
  id: number;
  conversationId: number;
  senderId: number;
  senderType: "USER" | "EMPLOYER";
  senderName: string;
  senderAvatar: string | null;
  content: string;
  seen: boolean;
  createdAt: string; // ISO 8601
}
```

#### SendMessageRequest

```typescript
interface SendMessageRequest {
  conversationId: number;
  content: string;
}
```

### Flow tích hợp Front-end

#### 1. Khi user apply job

Sau khi gọi API apply job thành công, conversation đã được tạo tự động. Front-end có thể:

**Option A: Lấy conversation ngay sau khi apply**

```javascript
// Sau khi apply job thành công
const applicationResponse = await applyJob(jobId, applicationData);

// Lấy conversation theo applicationId
const conversation = await fetch(
  `/api/v1/conversations/application/${applicationResponse.data.id}`,
  {
    headers: { Authorization: `Bearer ${token}` },
  }
).then((res) => res.json());
```

**Option B: Lấy từ danh sách conversations**

```javascript
// Lấy danh sách conversations (sẽ có conversation mới)
const conversations = await fetch("/api/v1/conversations", {
  headers: { Authorization: `Bearer ${token}` },
}).then((res) => res.json());
```

#### 2. Setup WebSocket connection

```javascript
// Khởi tạo WebSocket
const socket = new SockJS("http://localhost:8080/workify/ws");
const stompClient = Stomp.over(socket);

// Connect với JWT token
stompClient.connect(
  {
    Authorization: `Bearer ${accessToken}`,
  },
  () => {
    console.log("WebSocket connected");

    // Subscribe để nhận tin nhắn
    // Backend sẽ tự động route đến đúng user dựa trên JWT
    stompClient.subscribe("/user/queue/messages", (message) => {
      const messageData = JSON.parse(message.body);
      // Xử lý tin nhắn mới
      handleNewMessage(messageData);
    });
  },
  (error) => {
    console.error("WebSocket error:", error);
  }
);
```

#### 3. Gửi tin nhắn

**Qua WebSocket (realtime):**

```javascript
function sendMessage(conversationId, content) {
  stompClient.send(
    "/app/chat.sendMessage",
    {},
    JSON.stringify({
      conversationId: conversationId,
      content: content,
    })
  );
}
```

**Qua REST API (fallback):**

```javascript
async function sendMessage(conversationId, content) {
  const response = await fetch("/api/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      conversationId: conversationId,
      content: content,
    }),
  });
  return response.json();
}
```

#### 4. Load lịch sử tin nhắn

```javascript
async function loadMessages(conversationId) {
  const response = await fetch(`/api/v1/messages/${conversationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data.data; // Array of MessageResponse
}
```

#### 5. Đánh dấu đã đọc

```javascript
async function markAsSeen(conversationId) {
  await fetch(`/api/v1/messages/${conversationId}/seen`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
}
```

#### 6. Xử lý lỗi

```javascript
// Lỗi khi USER chưa được phép gửi tin nhắn
if (error.status === 403 && error.message.includes("wait")) {
  // Hiển thị thông báo: "Bạn chỉ có thể gửi tin nhắn sau khi nhà tuyển dụng đã gửi tin nhắn đầu tiên"
}

// Lỗi không phải thành viên
if (error.status === 403 && error.message.includes("participant")) {
  // Hiển thị: "Bạn không có quyền truy cập conversation này"
}
```

### Best Practices

1. **Reconnect WebSocket:** Implement auto-reconnect khi mất kết nối
2. **Fallback to REST:** Nếu WebSocket fail, dùng REST API
3. **Polling backup:** Có thể polling `/api/v1/messages/{conversationId}` định kỳ nếu WebSocket không available
4. **Mark as seen:** Gọi API mark as seen khi user mở conversation
5. **Error handling:** Xử lý các lỗi 403, 404 một cách user-friendly
6. **Loading states:** Hiển thị loading khi gửi tin nhắn
7. **Real-time sync:** Backend tự động broadcast tin nhắn qua WebSocket đến cả người gửi và người nhận sau khi lưu vào database. Front-end không cần optimistic update, chỉ cần subscribe `/user/queue/messages` và xử lý tin nhắn mới từ WebSocket

### Notes

- Conversation được tạo tự động khi user apply job, không cần gọi API tạo conversation riêng
- 1 application = 1 conversation (unique constraint)
- Chỉ EMPLOYER có thể gửi tin nhắn đầu tiên
- USER phải đợi EMPLOYER gửi tin nhắn đầu tiên mới được phép gửi
- WebSocket endpoint: `/ws` với SockJS
- WebSocket destination prefix: `/app` cho gửi, `/user/queue` cho nhận
- **WebSocket Broadcast:** Khi gửi tin nhắn (qua REST API hoặc WebSocket), backend tự động broadcast tin nhắn đến:
  - Người nhận: Để hiển thị tin nhắn mới real-time
  - Người gửi: Để đồng bộ multi-device (nếu user đăng nhập trên nhiều thiết bị)
- Front-end chỉ cần subscribe `/user/queue/messages` và xử lý tất cả tin nhắn nhận được từ WebSocket
