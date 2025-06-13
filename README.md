# Project Setup

This project uses Docker to simplify the development environment setup. Follow the steps below to get started.

## Starting the Development Server

1. Clone the repository to your local machine:

   ```bash
   git clone <repository_url>
   cd <project_directory>
   ```

2. Use Docker Compose to create MongoDB container:

   ```bash
   docker-compose -f docker-compose.dev.yml up -d --build
   ```

   This command will build the image and start the container in the background
