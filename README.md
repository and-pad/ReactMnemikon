# Mnemikon Frontend

> 🚧 **Active Development**

Frontend application for **Mnemikon**, an **Open Source Museum Collection Management System** built with React.

The frontend consumes the Mnemikon REST API and provides an intuitive user interface for managing museum collections, research, restoration processes, collection movements and digital documentation.

The project is designed as a modern, extensible and self-hosted solution for museums, cultural institutions and organizations that need to manage museum collections throughout their entire lifecycle.

👉 **Backend Repository:**  
https://github.com/and-pad/Mnemosine3BackEnd

---

# Overview

Mnemikon is an Open Source Museum Collection Management System designed to support museums and cultural institutions in managing collections throughout their entire lifecycle.

The platform centralizes inventory, research, restoration, loans, digital documentation and document version history within a single application, providing a flexible and extensible solution built on modern web technologies.

The frontend is built as a Single Page Application (SPA) and communicates with the backend through a REST API. It provides authenticated access to museum collections, allowing users to manage inventory records, research, restoration processes, collection movements and associated digital resources from a unified interface.

---

# Key Features

- Modern React-based user interface.
- Secure JWT authentication.
- Museum inventory management.
- Research management.
- Restoration management.
- Collection movement and loan tracking.
- Digital document and image management.
- Advanced search and filtering.
- Role-based access control.
- REST API integration.
- Responsive interface.
- Designed for self-hosted deployments.

---

# Application Preview

![Inventory Module](docs/images/MnemikonInventarioEng.jpg)

*Inventory module displaying museum object metadata, images, documents and collection management tools.*

---

# Technology Stack

## Frontend

- React
- Vite
- React Router
- Bootstrap
- Material UI (MUI)
- Fetch API

## Authentication

- JSON Web Token (JWT)

## Backend Integration

- Django REST Framework API

## Infrastructure

- Docker (optional)
- Linux (recommended)
- Apache HTTP Server (production)

---

# Architecture

Mnemikon Frontend is built as a modular Single Page Application (SPA) using React, where each functional area is organized into reusable components and independent modules.

The application communicates with the Mnemikon Backend through a REST API, handling user authentication, data visualization and interaction with museum collections.

The frontend is designed to provide a responsive and intuitive user experience while keeping presentation logic separated from backend business logic and data persistence.

The project supports self-hosted deployments and can be served as static files by a web server such as Apache HTTP Server or deployed using Docker containers.

---

# Project Structure

```text
src/
├── components/
├── pages/
├── images/
├── Config/
├── App.jsx
└── main.jsx
```

The application is organized into reusable React components grouped by functional modules.

---

# Installation

## Requirements

Before installing Mnemikon Frontend, ensure your system meets the following requirements:

- Node.js 20 or newer
- npm
- Git

---

## Native Installation

### 1. Clone the repository

```bash
git clone https://github.com/and-pad/ReactMnemikon.git
cd ReactMnemikon
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the application

Copy the example configuration file:

```bash
cp src/components/Config/settings_example.js \
   src/components/Config/settings.js
```

Edit `src/components/Config/settings.js` according to your environment.

The configuration file defines:

- Backend API endpoint
- Public server URL
- Image and document paths
- Thumbnail locations
- Temporary upload directory

For local development:

```javascript
server_api_commands: "http://localhost:8000/"
```

For production, configure the API endpoint according to your deployment.

### 4. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173/
```

---

# Docker

The frontend can also be deployed using Docker.

```bash
git clone https://github.com/and-pad/ReactMnemikon.git
cd ReactMnemikon

docker compose up --build
```

Docker automatically installs all required dependencies during the image build.

The frontend will be available after the containers finish starting.

---

# Configuration

Mnemikon Frontend is configured through the `settings.js` file.

Before running the application, copy `settings_example.js` to `settings.js` and review the configuration according to your environment.

## Server

Configure the server URLs:

- `server_url`
- `server_api_commands`

## API Endpoints

Available API endpoints include:

- `generate_word`

## Static Resources

Configure the public resource paths.

### Inventory

- `inventory_thumbnails`
- `inventory_full_size`
- `inventory_documents`

### Research

- `research_thumbnails`
- `research_full_size`
- `research_documents`

### Restoration

- `restoration_thumbnails`
- `restoration_full_size`
- `restoration_documents`

### Temporary Uploads

- `temporary_upload_documents`

> **Note**
>
> During development these URLs usually point to `localhost`. For production deployments they should point to your Mnemikon Backend installation.

---

# Deployment

The frontend supports multiple deployment strategies.

## Development

Run the backend and frontend independently.

Backend:

```bash
python manage.py runserver
```

Frontend:

```bash
npm run dev
```

## Production

A typical production deployment consists of:

- React Frontend
- Django Backend (Gunicorn)
- Apache HTTP Server (Reverse Proxy)
- MongoDB

Apache serves the React application and forwards API requests to the backend.

Future deployment guides will include:

- Docker deployment
- Apache HTTP Server
- Gunicorn
- HTTPS with Certbot
- Reverse Proxy configuration