# Plan-scrapper-ubb

Plan-scrapper-ubb is a simple project that displays teachers for selected subjects across various majors. This project was created for college classes.

## Features

- Select a major and subject to view corresponding teachers
- API endpoints for retrieving majors, subjects, and syllabus information

## Getting Started

### Prerequisites

- Docker (for containerized deployment)
- Node.js and npm (for local development)

### Installation

#### Using Docker

1. Build and run the project:
   ```bash
   docker-compose up --build
   ```

2. To stop Docker containers:
   ```bash
   docker-compose down
   ```

3. To start a specific service:
   ```bash
   docker-compose up --build <service-name>
   ```
   Where `<service-name>` can be either `webservices` (Website service) or `scrapper` (Data retrieval tool)

> [!NOTE] You can view the data in `/data/dane.csv` under the "Volumes" tab in Docker Desktop.

#### Local Development

1. Navigate to the webservices directory:
   ```bash
   cd webservices
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the scraper (from the scraper directory):
   ```bash
   ./scrapper.sh
   ```

> [!WARNING] Ensure you're in the correct directory when running these commands.

## API Endpoints

### GET /api/major

Returns a list of unique majors.

**Example Response:**
```yaml
["CS", "Math", "Art"]
```

### GET /api/subject-from-major

Returns a list of unique subjects for a specified major.

**Query Parameter:** `major` (required)

**Example:** `/api/subject-from-major?major=CS`

**Response:**
```yaml
["Programming", "Data Structure", "AI"]
```

> **Note:** This method will return an error if no major is specified.

### GET /api/sylabus

Returns syllabus information. Can be filtered by major and/or subject.

**Query Parameters:** `major`, `subject` (optional)

**Example:** `/api/sylabus?major=CS&subject=Programming`

**Response:**
```yaml
[
  {
    "Major": "CS",
    "Subject": "Programming",
    "Type": "Lecture",
    "Teacher": "Smith"
  }
]
```

## License

This project is licensed under the [MIT License](LICENSE).
