# **SGB - Song Grader** 🎵🤖

SGB is a full-stack web application that allows users to:
1. Search for songs using the **Spotify API**  
2. Fetch and display song lyrics via the **Genius API**  
3. Analyze and "grade" lyrics using a custom **BERT-based NLP model**  

The project is containerized using **Docker** for seamless deployment.

---

## **Table of Contents**
1. [Features](#features)  
2. [Architecture](#architecture)  
3. [Tech Stack](#tech-stack)  
4. [Installation & Setup](#installation--setup)  
5. [Environment Variables](#environment-variables)  
6. [Docker Deployment](#docker-deployment)  
7. [API Endpoints](#api-endpoints)  
8. [Future Improvements](#future-improvements)  

---

## **Features**
✅ Search for songs (Spotify API)  
✅ Fetch lyrics from Genius API  
✅ Listen to song preview audio (Spotify)  
✅ Analyze lyrics with a fine-tuned **BERT model**  
✅ Interactive UI built with **React + Tailwind**  

---

## **Architecture**
frontend/ # React application
backend/
├── server.js # Node.js Express server (Spotify & Genius APIs)
├── main.py # Flask API for BERT model
├── models/ # BERT, preprocessing, helper scripts
docker-compose.yml # Multi-service orchestration


- **Frontend:** React + Tailwind UI (users search songs and view lyrics/grades)  
- **Backend:** Node.js Express API to communicate with Spotify & Genius  
- **BERT Service:** Flask + Transformers model hosted as a microservice  

---

## **Tech Stack**
- **Frontend:** React, Tailwind CSS, Axios  
- **Backend:** Node.js (Express)  
- **NLP Service:** Python, Flask, PyTorch, Transformers (BERT)  
- **APIs:** Spotify Web API, Genius Lyrics API  
- **Deployment:** Docker & Docker Compose  

---

## **Installation & Setup**

### 1️⃣ Clone the repository:
```bash
git clone https://github.com/DerrickWawerumuturi/sgd.git
cd sgd
```

### 2️⃣ Install dependencies:
# Frontend:

``` bash

cd frontend
npm install

```

# Backend (Node.js):



cd backend
```

npm install

```

# BERT Service (Python):

``` bash
pip install -r requirements.txt

```

# Environment Variables
Create a .env file in the backend/ directory:

``` bash
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
GENIUS_TOKEN=your_genius_access_token
PORT=4000

```

# Docker Deployment
Build and run containers:

``` bash

docker compose up --build -d

```

## Access the app at:
```
Frontend: http://localhost:3000
Backend API: http://localhost:4000
BERT API: http://localhost:7455
```

# API Endpoints
Backend (Express)

``` GET /search?q=<song> → Search Spotify for songs ```

``` GET /lyrics?artist=<artist>&title=<title> → Fetch lyrics from Genius ```

``` POST /grade → Send lyrics text to BERT service ```

# BERT Service (Flask)
``` POST /predict → Analyze lyrics & return top matching responses ```

# Future Improvements
Add user accounts & save graded lyrics

Use WebSockets for real-time grading updates

Deploy to AWS/GCP/Vercel

Extend NLP model for sentiment/emotion analysis


💡 Note: The BERT model is downloaded automatically when you first run the Python service. Ensure you have sufficient disk space.

⚡ **Author:** Derrick Muturi  
📧 [Email](mailto:wawerumuturi57@gmail.com) | 🌐 [LinkedIn](https://www.linkedin.com/in/derrickmuturi)
