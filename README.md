# Goal Tracker

Goal Tracker is a microservice-based application that helps users manage and track their goals. The project includes a frontend application and two backend services for user management and goal tracking, as well as a database for persistent storage.

## Project Structure

The project is organized into the following main directories:
- **frontend**: Contains the React-based web application.
- **backend-UserService**: Provides user authentication and management features.
- **backend-GoalService**: Manages goal creation, updates, and tracking.

## Features

- **User Service**: 
  - REST API for user registration and authentication.
  - Secured with JWT for token-based authentication.

- **Goal Service**:
  - REST API for creating, updating, and managing user goals.

- **Database**:
  - MySQL database for storing user and goal data.
  - Uses persistent storage to ensure data is not lost during infrastructure restarts.

## Deployment

The application is designed to be deployed using Kubernetes. Each microservice can be independently scaled to handle different loads.

### Prerequisites

- Docker
- Kubernetes (Minikube or a cloud-based Kubernetes cluster)
- Node.js and npm/Yarn for running the frontend locally

### Steps to Deploy

1. **Build Docker Images**:
   ```bash
   docker build -t zaidalogaili/user-service:latest ./backend-UserService
   docker build -t zaidalogaili/goal-service:latest ./backend-GoalService
