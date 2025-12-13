# Resume API Documentation

## Overview

The Resume API allows job seekers to create, update, delete, and retrieve their resumes/CVs. Each resume consists of detailed sections including basic info, experience, education, skills, certifications, awards, projects, and more. Resume data is stored in JSONB format for flexibility.

**Base URL**: `/api/v1/resumes`

**Authentication**: Required (JOB_SEEKER or ADMIN role)

---

## Endpoints

### 1. Create Resume

Create a new resume with detailed information. Optionally attach an image for the resume avatar.

**Endpoint**: `POST /api/v1/resumes`

**Authentication**: Required (JOB_SEEKER, ADMIN)

**Content-Type**: `multipart/form-data`

**Request Parts**:

| Part Name | Type | Required | Description                                              |
| --------- | ---- | -------- | -------------------------------------------------------- |
| `request` | JSON | Yes      | Resume data (see structure below)                        |
| `image`   | File | No       | Avatar image for the resume (JPEG, PNG, GIF, WEBP, etc.) |

**Request Headers**:

```
Content-Type: multipart/form-data
Authorization: Bearer {accessToken}
```

**Request Part `request` (JSON)**:

```json
{
  "title": "Senior Developer CV",
  "template": "TEMPLATE_PANDA",
  "data": {
    "basicInfo": {
      "position": "Senior Developer",
      "fullName": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "phone": "0123456789",
      "location": "Hà Nội, Việt Nam",
      "avatarUrl": "https://example.com/photo.jpg",
      "customFields": [
        {
          "type": "LINKEDIN",
          "value": "https://linkedin.com/in/nguyenvana"
        }
      ]
    },
    "objective": {
      "description": "Seeking a challenging role in modern web technologies"
    },
    "experience": [
      {
        "isHidden": false,
        "order": 1,
        "position": "Senior Developer",
        "company": "Tech Company A",
        "startDate": "2021-01",
        "endDate": "2025-12",
        "description": "Led development of microservices architecture"
      }
    ],
    "education": [
      {
        "isHidden": false,
        "order": 1,
        "name": "University of Technology",
        "major": "Computer Science",
        "score": "3.5/4.0",
        "startDate": "2016-09",
        "endDate": "2020-06"
      }
    ],
    "skills": [
      {
        "isHidden": false,
        "order": 1,
        "name": "Java",
        "description": "Advanced"
      }
    ],
    "certifications": [
      {
        "isHidden": false,
        "order": 1,
        "name": "Oracle Certified Associate Java Programmer",
        "date": "2020-06"
      }
    ],
    "awards": [
      {
        "isHidden": false,
        "order": 1,
        "title": "Best Developer Award",
        "date": "2023-12"
      }
    ],
    "projects": [
      {
        "isHidden": false,
        "order": 1,
        "title": "E-commerce Platform",
        "description": "Built scalable e-commerce platform using Spring Boot",
        "startDate": "2022-01",
        "endDate": "2023-06"
      }
    ],
    "references": [
      {
        "isHidden": false,
        "order": 1,
        "information": "John Doe - Manager at Tech Company A",
        "description": "Email: johndoe@example.com, Phone: 0987654321"
      }
    ],
    "interests": {
      "isHidden": false,
      "description": "Reading, Coding, Gaming"
    },
    "additionalInformation": {
      "description": "Volunteered at coding bootcamp"
    },
    "theme": {
      "primaryColor": "#0000FF",
      "bgColor": "#FFFFFF",
      "textColor": "#000000"
    }
  }
}
```

**Response** (201 Created):

```json
{
  "status": 201,
  "message": "Resume created successfully",
  "data": {
    "id": 1,
    "title": "Senior Developer CV",
    "template": "TEMPLATE_PANDA",
    "data": {
        "basicInfo": { ... },
        "objective": { ... },
         ...
    },
    "createdAt": "2025-12-08T10:00:00Z",
    "updatedAt": "2025-12-08T10:00:00Z"
  }
}
```

> **Note**: If an image is provided, the `avatarUrl` in `basicInfo` will be automatically updated with the uploaded image URL.

**Error Responses**:

- 400 Bad Request: Invalid resume data (e.g. invalid template type, missing required fields, invalid image file)
- 401 Unauthorized: Missing or invalid authentication

---

### 2. Update Resume

Update an existing resume by ID. Optionally attach a new image to update the resume avatar.

**Endpoint**: `PUT /api/v1/resumes/{resumeId}`

**Authentication**: Required (JOB_SEEKER, ADMIN)

**Content-Type**: `multipart/form-data`

**Path Parameters**:

- `resumeId` (Long, required, minimum: 1): The ID of the resume to update

**Request Parts**:

| Part Name | Type | Required | Description                                                               |
| --------- | ---- | -------- | ------------------------------------------------------------------------- |
| `request` | JSON | Yes      | Resume data to update (see Create Resume structure, excluding `template`) |
| `image`   | File | No       | New avatar image for the resume (JPEG, PNG, GIF, WEBP, etc.)              |

**Request Headers**:

```
Content-Type: multipart/form-data
Authorization: Bearer {accessToken}
```

**Request Part `request` (JSON)**: Same structure as Create Resume (all fields to be updated, excluding `template`)

**Response** (200 OK): Returns the updated resume object.

> **Note**: If an image is provided, the `avatarUrl` in `basicInfo` will be automatically updated with the new uploaded image URL. If no image is provided, the existing `avatarUrl` remains unchanged.

---

### 3. Delete Resume

Delete a resume by ID.

**Endpoint**: `DELETE /api/v1/resumes/{resumeId}`

**Authentication**: Required (JOB_SEEKER, ADMIN)

---

### 4. Get Resume Details

Retrieve a specific resume by ID.

**Endpoint**: `GET /api/v1/resumes/{resumeId}`

**Authentication**: Required (JOB_SEEKER, ADMIN)

---

### 5. Get My Resumes (List with Pagination)

Retrieve all resumes for the current user with pagination.

**Endpoint**: `GET /api/v1/resumes?pageNumber=1&pageSize=10`

**Authentication**: Required (JOB_SEEKER, ADMIN)

---

### 6. Get Default Resume

Retrieve the default resume for the current user.

**Endpoint**: `GET /api/v1/resumes/default`

**Authentication**: Required (JOB_SEEKER, ADMIN)

---

## Data Structures

### ResumeTemplate Enum (TemplateType)

Available template types for resumes:

```
TEMPLATE_PANDA
TEMPLATE_RABBIT
TEMPLATE_LION
TEMPLATE_DOLPHIN
TEMPLATE_TIGER
TEMPLATE_EAGLE
TEMPLATE_HAVARD_1
TEMPLATE_HAVARD_2
TEMPLATE_PROFESSIONAL_1
TEMPLATE_PROFESSIONAL_2
TEMPLATE_PROFESSIONAL_3
TEMPLATE_PROFESSIONAL_4
```

### BasicInfo Structure

```json
{
  "position": "string (required)",
  "fullName": "string (required)",
  "email": "string (required)",
  "phone": "string (required)",
  "location": "string (required)",
  "avatarUrl": "string (optional)",
  "customFields": [
    {
      "type": "string (required)",
      "value": "string (required)"
    }
  ]
}
```

### Objective Structure

```json
{
  "description": "string (required)"
}
```

### Experience Structure (List Item)

```json
{
  "isHidden": "boolean (required)",
  "order": "integer (required)",
  "company": "string (required)",
  "position": "string (required)",
  "startDate": "string",
  "endDate": "string",
  "description": "string"
}
```

### Education Structure (List Item)

```json
{
  "isHidden": "boolean (required)",
  "order": "integer (required)",
  "name": "string (required) - e.g. Institution Name",
  "major": "string (required) - e.g. Field of Study",
  "score": "string",
  "startDate": "string",
  "endDate": "string"
}
```

### Skill Structure (List Item)

```json
{
  "isHidden": "boolean (required)",
  "order": "integer (required)",
  "name": "string (required)",
  "description": "string"
}
```

### Certification Structure (List Item)

```json
{
  "isHidden": "boolean (required)",
  "order": "integer (required)",
  "name": "string (required)",
  "date": "string"
}
```

### Award Structure (List Item)

```json
{
  "isHidden": "boolean (required)",
  "order": "integer (required)",
  "title": "string (required)",
  "date": "string"
}
```

### Project Structure (List Item)

```json
{
  "isHidden": "boolean (required)",
  "order": "integer (required)",
  "title": "string (required)",
  "startDate": "string",
  "endDate": "string",
  "description": "string"
}
```

### Reference Structure (List Item)

```json
{
  "isHidden": "boolean (required)",
  "order": "integer (required)",
  "information": "string (required)",
  "description": "string"
}
```

### Interests Structure

```json
{
  "isHidden": "boolean (required)",
  "description": "string"
}
```

### AdditionalInformation Structure

```json
{
  "description": "string (required)"
}
```

### Theme Structure

```json
{
  "primaryColor": "string (required)",
  "bgColor": "string (required)",
  "textColor": "string (required)"
}
```

---

## Validation Rules

- `isHidden` and `order` are required for list items to support UI ordering and visibility toggling.
- `experience`, `education`, `skills` lists must generally not be empty (check `@NotEmpty` annotations in code).
