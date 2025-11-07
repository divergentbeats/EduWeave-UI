# EduWeave

EduWeave is an AI-powered student intelligence dashboard that unifies academic data (attendance, grades, skills, projects, achievements) into visual analytics and personalized AI insights. It also includes a RAG-based chatbot (AI Echo) trained on institutional documents to answer academic or project-related queries.

## Tech Stack
- Frontend: React + Chart.js + TailwindCSS + Axios + React Router DOM
- Backend: Python (Flask) + Pandas + LangChain + FAISS (or Chroma) + OpenAI API
- Data format: CSV and JSON for mock datasets

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- OpenAI API key

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Create a virtual environment:
   ```
   python -m venv venv
   ```
3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```

### API Key Setup
1. Obtain an OpenAI API key from [OpenAI](https://platform.openai.com/).
2. Create a `.env` file in the `backend` directory and add your API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

## Running the Application
1. Start the backend server:
   ```
   cd backend
   venv\Scripts\activate  # On Windows
   python app.py
   ```
2. In a new terminal, start the frontend server:
   ```
   cd frontend
   npm start
   ```

The backend will run on `http://localhost:5000` and the frontend on `http://localhost:3000`.
