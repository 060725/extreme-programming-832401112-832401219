# Address Book (通讯录) — Extreme Programming

A front-end / back-end separated address book. It supports **bookmarking contacts**,
**multiple contact methods per contact**, and **Excel import / export**.

- Course: **EE308FZ Software Engineering (FZU–MU)**
- Group: **<!-- TODO: group name -->**
- Members: **<!-- TODO: name / student ID -->**, **<!-- TODO: name / student ID -->**

## Features

| Feature | Details |
| --- | --- |
| Contact CRUD | Add / edit / delete / list contacts |
| Bookmark (收藏) | Toggle `collect` status and view bookmarked contacts on `collect.html` |
| Multiple contact methods | Mobile phone, home phone, e-mail, social media, address, avatar |
| Export to Excel | Export every contact (one row each, one column per field) to `.xlsx` |
| Import from Excel | Read a correctly formatted `.xlsx` and insert contacts |
| Page style | Separated CSS / JS, modal form, colored action buttons |

## Tech Stack

- **Frontend:** HTML + CSS + vanilla JavaScript (Fetch API)
- **Backend:** Spring Boot 2.3.12, MyBatis-Plus, EasyExcel
- **Database:** MySQL 8.x
- **Image storage:** Aliyun OSS (optional, only for avatars)

## Project Structure

```
.
├── backend/                 Spring Boot application
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd      Maven wrapper
│   └── src/main/java/com/example/files/
│       ├── controller/      REST endpoints
│       ├── entity/          User entity
│       ├── mapper/          MyBatis-Plus mapper
│       ├── service/         Service interfaces & implementations
│       └── utils/           Excel / file / config helpers
├── frontend/
│   ├── index.html           Main contact list
│   ├── collect.html         Bookmarked contacts
│   ├── css/index.css
│   └── js/ (config.js, index.js, collect.js)
├── database/schema.sql      Database schema + sample data
└── docs/blog.md             Assignment blog (Markdown)
```

## Getting Started

### Prerequisites

- JDK 8+ (JDK 11 recommended)
- MySQL 8.x
- A browser (no Node.js needed)

### 1. Create the database

```bash
mysql -u root -p < database/schema.sql
```

### 2. Configure the backend

Database settings in `backend/src/main/resources/application.yml` use environment
variables with sensible defaults. Override them if needed, for example:

```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=phonebook
export DB_USERNAME=root
export DB_PASSWORD=your_password
```

Avatar upload needs your own Aliyun OSS bucket (optional):

```bash
export ALI_OSS_ENDPOINT=...
export ALI_OSS_BUCKET=...
export ALI_OSS_ACCESS_KEY_ID=...
export ALI_OSS_ACCESS_KEY_SECRET=...
export ALI_OSS_ADDRESS=...
```

> If OSS is not configured, everything except avatar upload still works.

### 3. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

The server listens on `http://localhost:8888` by default.

### 4. Open the frontend

Open `frontend/index.html` in a browser. If you deploy elsewhere, change
`API_BASE` in `frontend/js/config.js` to the backend URL.

## REST API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/list` | List all contacts |
| GET | `/collectList` | List bookmarked contacts (`collect = 2`) |
| POST | `/add` | Add a contact |
| PUT | `/update` | Update a contact |
| DELETE | `/delete?id=` | Delete a contact |
| PUT | `/toggleBookmark` | Toggle bookmark status |
| GET | `/export` | Export all contacts to Excel |
| POST | `/importExcel` | Import contacts from an Excel file |
| POST | `/uploadImage` | Upload an avatar (requires OSS) |

## Excel Format

Exported file columns (one row per contact):

`用户名 | 手机号码 | 家庭电话 | 邮箱地址 | 社交媒体 | 真实地址`

A file with these headers can be imported directly.
