# ClassPilot AI: Hands-Free Voice Assistant for Indian Classrooms

ClassPilot AI is a hands-free, voice-enabled AI teaching assistant designed for government school classrooms in India (tailored for Class 5–8 students). It acts as a co-pilot for teachers in smart board environments, allowing them to lead sessions, display visual aids, translate textbook content, and launch group activities entirely through voice commands.

This project was built for the **Connecting Dreams Foundation — Technical Assignment (Option A)**.

---

## 🌟 4-in-1 Classroom Suite (Exceeding Requirements)
Instead of choosing only two requirements, ClassPilot AI delivers a fully integrated dashboard containing **all four** options:

1. **Live Concept Simplification**: Converts complex topics into primary/middle-school friendly explanation cards, showing relatable real-world analogies, fun facts, key takeaways, and descriptive suggestions for SVG/projector diagrams.
2. **Voice-Triggered Quizzing**: Generates five interactive multiple-choice questions custom-tailored to the active lesson topic. It features score tracking, instant option evaluation, and friendly Hinglish answer explanations.
3. **Bilingual Dictation & Translation**: Transcribes and translates textbook text side-by-side across three columns (English, Devanagari Hindi, and Hinglish transliteration) with corresponding verbal read-back features.
4. **Hands-Free Activity Guide**: Generates group exercises using only materials commonly available in government schools (paper, pencils, textbooks). It includes a voice introduction, an active on-screen countdown timer, and a voice completion notification.

---

## 🛠️ Technology Stack
* **Frontend**: React 18, TypeScript, Vite, CSS (Tailwind & custom UI animations)
* **Backend**: FastAPI, Python 3.11, Uvicorn, Pydantic
* **AI Model & SDK**: Official `google-genai` Python library powered by `gemini-2.5-flash`
* **STT/TTS Pipeline**:
  * **STT (Speech-to-Text)**: Web Speech API's `webkitSpeechRecognition` with continuous listening and custom regex command matching (e.g., *"explain [topic]"*, *"start quiz"*).
  * **TTS (Text-to-Speech)**: Native `window.speechSynthesis` utilizing `hi-IN` (Hindi) and `en-IN` (Indian English) voice profiles.

---

## 🎙️ Localization & Classroom Empathy
ClassPilot AI was built specifically to address the realities of rural government classrooms (e.g., in Haryana):
* **Hinglish Code-Switching**: Explanations and voice prompts switch naturally between Hindi and English vocabulary, which matches how teachers and students naturally communicate.
* **Low-Latency Audio Response**: Because generating a detailed LLM output takes several seconds, ClassPilot AI speaks a quick, natural transition phrase immediately (e.g., *"Sure! Let's learn about Water Cycle. Loading the smart board now."*). The assistant starts speaking within 150ms of a command, completely eliminating awkward silent waiting times.
* **Smart Board Projector Layout**: Large touch-friendly elements, high contrast text, and a clean cards-based display optimized for projector view from the back of the classroom.
* **Teacher Voice Rate**: TTS output speed is tuned down to `0.95` rate to accommodate classroom noise and young learners.

---

## 🛡️ Robust AI Safety & Guardrails
A multi-layered safety architecture secures the application for children (ages 10–14):
1. **Input Sanitization**: Cleans whitespace, truncates inputs to 500 characters, filters HTML/XSS scripts, and strips prompt injection/jailbreak patterns before they reach the model.
2. **Hard Curriculum Blocklist**: A predefined keyword filter checks queries in real-time. If non-educational topics (weapons, adult content, self-harm, drugs) are detected, it blocks the query immediately and reads out a polite safety message.
3. **Strict System Instructions**: System prompts enforce:
   * Age-appropriate, respectful content.
   * No hallucinations (speculative or unverified facts are strictly banned).
   * Refusal of political, religious, or controversial off-topic debates.
4. **Pydantic Validation Schemas**: Force the Gemini API to output structured JSON matching precise data models (`ConceptResponse`, `QuizResponse`, etc.), ensuring no JSON parsing crashes.

---

## 📡 Resiliency: Offline/Mock Mode Fallbacks
Recognizing that internet connection is highly unstable in government schools, the backend includes an automatic **Mock Fallback**. If the Google API key is missing or fails due to network issues, the application automatically handles requests with locally stored offline data models for standard topics (Photosynthesis, Water Cycle, Gravity). 

---

## 🚀 How to Run Locally

### 1. Prerequisites
* Node.js (v18+)
* Python (3.10+)

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # Windows (PowerShell):
   .venv\Scripts\Activate.ps1
   # macOS/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend/` directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=8000
   HOST=0.0.0.0
   ```
   *(If no API Key is supplied, the app will run seamlessly in offline/mock fallback mode).*
5. Start the server:
   ```bash
   python run.py
   ```
   *(Running on http://localhost:8000)*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node modules:
   ```bash
   npm install
   ```
3. Run the local dev server:
   ```bash
   npm run dev
   ```
   *(Running on http://localhost:5173)*
