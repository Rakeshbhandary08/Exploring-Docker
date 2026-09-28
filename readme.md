# 🐳 Docker Revision Guide

A practical Docker command reference for revising everything from the basics to more advanced Docker workflows.

---

# 1. Docker Basics

### Check Docker version

```bash
docker --version
```

### Check Docker system information

```bash
docker info
```

### Docker help

```bash
docker --help
```

Help for a specific command:

```bash
docker run --help
docker build --help
docker compose --help
```

---

# 2. Docker Images

Images are templates used to create containers.

### List images

```bash
docker images
```

or:

```bash
docker image ls
```

### Pull an image

```bash
docker pull ubuntu
```

Specific version:

```bash
docker pull node:18
```

### Remove an image

```bash
docker rmi IMAGE_ID
```

or:

```bash
docker image rm IMAGE_ID
```

### Remove unused images

```bash
docker image prune
```

Remove all unused images:

```bash
docker image prune -a
```

### Inspect an image

```bash
docker image inspect IMAGE_NAME
```

### View image history

```bash
docker history IMAGE_NAME
```

---

# 3. Running Containers

### Run a container

```bash
docker run ubuntu
```

### Run interactively

```bash
docker run -it ubuntu
```

### Run in background

```bash
docker run -d ubuntu
```

`-d` = detached mode.

### Give container a name

```bash
docker run --name my-container ubuntu
```

### Run and automatically remove container after stopping

```bash
docker run --rm ubuntu
```

### Run a specific image version

```bash
docker run node:18
```

---

# 4. Container Management

### List running containers

```bash
docker ps
```

### List all containers

```bash
docker ps -a
```

### Start a stopped container

```bash
docker start CONTAINER_ID
```

### Stop a container

```bash
docker stop CONTAINER_ID
```

### Restart a container

```bash
docker restart CONTAINER_ID
```

### Kill a container

```bash
docker kill CONTAINER_ID
```

### Remove a container

```bash
docker rm CONTAINER_ID
```

### Force remove a running container

```bash
docker rm -f CONTAINER_ID
```

---

# 5. Container Logs

### View logs

```bash
docker logs CONTAINER_ID
```

### Follow logs

```bash
docker logs -f CONTAINER_ID
```

### Show latest logs

```bash
docker logs --tail 100 CONTAINER_ID
```

### Logs with timestamps

```bash
docker logs -t CONTAINER_ID
```

---

# 6. Execute Commands Inside Containers

### Open a shell

```bash
docker exec -it CONTAINER_ID bash
```

If Bash doesn't exist:

```bash
docker exec -it CONTAINER_ID sh
```

### Run a single command

```bash
docker exec CONTAINER_ID ls
```

### Open Node inside a Node container

```bash
docker exec -it CONTAINER_ID node
```

---

# 7. Docker Ports

Basic syntax:

```bash
docker run -p HOST_PORT:CONTAINER_PORT IMAGE
```

Example:

```bash
docker run -p 3000:3000 my-node-app
```

This means:

```text
localhost:3000
      ↓
container:3000
```

### Run in background with port mapping

```bash
docker run -d -p 3000:3000 my-node-app
```

### Multiple ports

```bash
docker run -p 3000:3000 -p 5000:5000 my-app
```

---

# 8. Environment Variables

### Pass environment variable

```bash
docker run -e NODE_ENV=production my-app
```

Multiple variables:

```bash
docker run \
  -e NODE_ENV=production \
  -e PORT=3000 \
  my-app
```

### Check environment variables

```bash
docker inspect CONTAINER_ID
```

---

# 9. Dockerfile

A `Dockerfile` contains instructions for building an image.

Example Node.js Dockerfile:

```dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
```

### Important Dockerfile instructions

```dockerfile
FROM
WORKDIR
COPY
ADD
RUN
CMD
ENTRYPOINT
EXPOSE
ENV
ARG
USER
VOLUME
```

---

# 10. Build Docker Images

### Build image

```bash
docker build -t my-node-app .
```

`-t` = tag/name the image.

`.` = current directory is the build context.

### Build with a specific Dockerfile

```bash
docker build -f Dockerfile.dev -t my-node-app .
```

### Build without cache

```bash
docker build --no-cache -t my-node-app .
```

### Build with a tag

```bash
docker build -t my-node-app:1.0 .
```

Run:

```bash
docker run my-node-app:1.0
```

---

# 11. CMD vs ENTRYPOINT

### CMD

```dockerfile
CMD ["node", "app.js"]
```

CMD provides the default command.

It can easily be overridden:

```bash
docker run my-app node test.js
```

### ENTRYPOINT

```dockerfile
ENTRYPOINT ["node", "app.js"]
```

ENTRYPOINT defines the main executable of the container.

Example:

```bash
docker run my-app
```

---

# 12. .dockerignore

Create:

```text
.dockerignore
```

Example:

```text
node_modules
.git
.env
npm-debug.log
README.md
```

This prevents unnecessary files from being sent to the Docker build context.

---

# 13. Volumes

Volumes allow data to persist outside the container lifecycle.

### Create volume

```bash
docker volume create my-volume
```

### List volumes

```bash
docker volume ls
```

### Inspect volume

```bash
docker volume inspect my-volume
```

### Use volume

```bash
docker run -v my-volume:/app/data my-app
```

### Remove volume

```bash
docker volume rm my-volume
```

### Remove unused volumes

```bash
docker volume prune
```

---

# 14. Bind Mounts

Mount a local directory into a container:

```bash
docker run -v ./src:/app/src my-app
```

On Windows, Docker Desktop handles the path translation.

Bind mounts are especially useful during development.

---

# 15. Docker Networks

### List networks

```bash
docker network ls
```

### Create network

```bash
docker network create my-network
```

### Inspect network

```bash
docker network inspect my-network
```

### Connect container to network

```bash
docker network connect my-network CONTAINER_ID
```

### Disconnect

```bash
docker network disconnect my-network CONTAINER_ID
```

### Remove network

```bash
docker network rm my-network
```

---

# 16. Container-to-Container Communication

Create network:

```bash
docker network create app-network
```

Run MongoDB:

```bash
docker run -d \
  --name mongodb \
  --network app-network \
  mongo
```

Run Node.js:

```bash
docker run -d \
  --name node-app \
  --network app-network \
  my-node-app
```

Inside the Node.js container, MongoDB can be reached using:

```text
mongodb://mongodb:27017
```

Important:

```text
localhost
```

inside a container means **that container itself**.

Container names can be used as hostnames when containers share a Docker network.

---

# 17. Docker Compose

Docker Compose is useful when an application has multiple services.

Example:

```yaml
services:

  node-app:
    build: .
    ports:
      - "3000:3000"

  mongodb:
    image: mongo
    ports:
      - "27017:27017"
```

### Start services

```bash
docker compose up
```

### Build and start

```bash
docker compose up --build
```

### Run in background

```bash
docker compose up -d
```

### Stop services

```bash
docker compose down
```

### Stop and remove volumes

```bash
docker compose down -v
```

### List Compose services

```bash
docker compose ps
```

### View logs

```bash
docker compose logs
```

### Follow logs

```bash
docker compose logs -f
```

### Logs for one service

```bash
docker compose logs -f node-app
```

### Rebuild services

```bash
docker compose build
```

### Restart services

```bash
docker compose restart
```

### Execute command inside service

```bash
docker compose exec node-app sh
```

---

# 18. Docker Compose Environment Variables

Example:

```yaml
services:

  node-app:
    build: .
    environment:
      NODE_ENV: production
      PORT: 3000
```

Or:

```yaml
services:

  node-app:
    build: .
    env_file:
      - .env
```

Example `.env`:

```env
NODE_ENV=development
PORT=3000
MONGO_URL=mongodb://mongodb:27017/app
```

---

# 19. Docker Compose Dependencies

```yaml
services:

  node-app:
    build: .
    depends_on:
      - mongodb

  mongodb:
    image: mongo
```

`depends_on` controls startup ordering, but it does **not necessarily mean the dependency is ready to accept connections**.

For production-like setups, health checks can be used.

---

# 20. Health Checks

Dockerfile:

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s \
  CMD curl -f http://localhost:3000/health || exit 1
```

Compose:

```yaml
services:

  node-app:
    build: .
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 5s
      retries: 3
```

Check health:

```bash
docker ps
```

---

# 21. Inspect Containers

### Inspect container

```bash
docker inspect CONTAINER_ID
```

### Get container IP

```bash
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' CONTAINER_ID
```

### Container resource usage

```bash
docker stats
```

Specific container:

```bash
docker stats CONTAINER_ID
```

---

# 22. Copy Files

### Container → Host

```bash
docker cp CONTAINER_ID:/app/file.txt ./file.txt
```

### Host → Container

```bash
docker cp ./file.txt CONTAINER_ID:/app/file.txt
```

---

# 23. Docker Registry / Docker Hub

### Login

```bash
docker login
```

### Tag image

```bash
docker tag my-node-app username/my-node-app:latest
```

### Push image

```bash
docker push username/my-node-app:latest
```

### Pull image

```bash
docker pull username/my-node-app:latest
```

### Logout

```bash
docker logout
```

---

# 24. Docker Image Tags

Example:

```text
node:18
node:20
node:22
node:22-alpine
mongo:8
```

Avoid relying on `latest` when you need reproducible builds.

Better:

```dockerfile
FROM node:22
```

instead of:

```dockerfile
FROM node:latest
```

---

# 25. Alpine Images

Smaller images are often available with Alpine Linux.

Example:

```dockerfile
FROM node:22-alpine
```

Useful for smaller production images, but some native dependencies may behave differently because Alpine uses `musl` instead of the `glibc` environment commonly found in Debian/Ubuntu images.

---

# 26. Multi-Stage Builds

Useful for reducing production image size.

Example:

```dockerfile
FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/app.js"]
```

Concept:

```text
Builder image
     ↓
Build application
     ↓
Copy only required files
     ↓
Production image
```

---

# 27. Docker Build Cache

Docker builds layers.

Example:

```dockerfile
COPY package*.json ./
RUN npm install

COPY . .
```

This is generally better than:

```dockerfile
COPY . .
RUN npm install
```

because changes to application source files won't necessarily invalidate the dependency-install layer.

---

# 28. BuildKit

Modern Docker uses BuildKit for builds.

Build:

```bash
docker build -t my-app .
```

Inspect build output:

```bash
docker build --progress=plain -t my-app .
```

---

# 29. Docker System Information

### Disk usage

```bash
docker system df
```

### Detailed disk usage

```bash
docker system df -v
```

---

# 30. Docker Cleanup

### Remove stopped containers

```bash
docker container prune
```

### Remove unused images

```bash
docker image prune
```

### Remove unused networks

```bash
docker network prune
```

### Remove unused volumes

```bash
docker volume prune
```

### General cleanup

```bash
docker system prune
```

### More aggressive cleanup

```bash
docker system prune -a
```

With unused volumes:

```bash
docker system prune -a --volumes
```

⚠️ Be careful with cleanup commands. They can remove resources you may still need.

---

# 31. Useful One-Liners

### Show running containers

```bash
docker ps
```

### Stop all running containers

```bash
docker stop $(docker ps -q)
```

### Remove all stopped containers

```bash
docker container prune
```

### Show container names

```bash
docker ps --format "{{.Names}}"
```

### Show container ports

```bash
docker ps --format "table {{.Names}}\t{{.Ports}}"
```

---

# 32. Debugging Checklist

When a container doesn't work:

### 1. Check containers

```bash
docker ps -a
```

### 2. Check logs

```bash
docker logs CONTAINER_ID
```

### 3. Inspect container

```bash
docker inspect CONTAINER_ID
```

### 4. Enter container

```bash
docker exec -it CONTAINER_ID sh
```

### 5. Check resource usage

```bash
docker stats
```

### 6. Check images

```bash
docker images
```

### 7. Check networks

```bash
docker network ls
```

### 8. Check Docker itself

```bash
docker info
```

---

# 33. Common Docker Problems

### "Cannot connect to the Docker daemon"

Check:

```bash
docker info
```

Make sure Docker Desktop / Docker Engine is running.

---

### Port already in use

Example:

```text
bind: address already in use
```

Check:

```bash
docker ps
```

Use another host port:

```bash
docker run -p 3001:3000 my-app
```

Now:

```text
localhost:3001 → container:3000
```

---

### Container immediately exits

Check:

```bash
docker ps -a
```

Then:

```bash
docker logs CONTAINER_ID
```

---

### Check what command the container uses

```bash
docker inspect CONTAINER_ID
```

Look for:

```text
Config.Cmd
Config.Entrypoint
```

---

# 34. Dockerfile vs Image vs Container

Remember:

```text
Dockerfile
    ↓ docker build
Docker Image
    ↓ docker run
Container
```

Example:

```text
Dockerfile
    ↓
my-node-app:1.0
    ↓
node-container
```

---

# 35. Docker Architecture

Basic mental model:

```text
                    Docker CLI
                       │
                       ▼
                Docker Engine
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      Container    Container    Container
          │            │            │
          ▼            ▼            ▼
       Image        Image        Image
```

Docker Desktop on Windows provides the environment in which the Docker Engine runs.

---

# 36. Important Docker Commands — Quick Revision

```bash
# Docker
docker --version
docker info

# Images
docker images
docker pull IMAGE
docker build -t IMAGE .
docker rmi IMAGE

# Containers
docker ps
docker ps -a
docker run IMAGE
docker start CONTAINER
docker stop CONTAINER
docker restart CONTAINER
docker rm CONTAINER
docker logs CONTAINER
docker exec -it CONTAINER sh

# Ports
docker run -p 3000:3000 IMAGE

# Volumes
docker volume ls
docker volume create VOLUME
docker volume inspect VOLUME

# Networks
docker network ls
docker network create NETWORK
docker network inspect NETWORK

# Docker Hub
docker login
docker tag IMAGE USERNAME/IMAGE:TAG
docker push USERNAME/IMAGE:TAG
docker pull USERNAME/IMAGE:TAG

# Cleanup
docker container prune
docker image prune
docker volume prune
docker network prune
docker system prune

# Compose
docker compose up
docker compose up -d
docker compose up --build
docker compose down
docker compose ps
docker compose logs
docker compose logs -f
docker compose exec SERVICE sh
docker compose build
docker compose restart
```

---

# 🧠 Docker Mental Model

The most important flow to remember:

```text
             Dockerfile
                 │
                 │ docker build
                 ▼
             Docker Image
                 │
                 │ docker run
                 ▼
             Container
                 │
        ┌────────┼────────┐
        ▼        ▼        ▼
      Ports    Volumes   Network
```

For multiple services:

```text
              docker-compose.yml
                       │
                       ▼
             ┌─────────┴─────────┐
             ▼                   ▼
         Node.js API          MongoDB
             │                   │
             └────── Network ────┘
```

### The commands I use most often

```bash
docker build -t my-app .
docker run -d -p 3000:3000 my-app
docker ps
docker logs -f my-app
docker exec -it my-app sh
docker stop my-app
docker rm my-app

docker compose up --build
docker compose down
docker compose logs -f
```

---

## 🚀 Learning Path

```text
Docker Basics
     ↓
Images
     ↓
Containers
     ↓
Dockerfile
     ↓
Ports
     ↓
Volumes
     ↓
Networks
     ↓
Docker Compose
     ↓
Multi-container Applications
     ↓
Docker Hub
     ↓
Multi-stage Builds
     ↓
Production Optimization
```

> **Goal:** Don't just memorize commands. Understand what Docker is doing behind each command.
