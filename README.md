# BolSaathi
# BolSaathi – Frontend

BolSaathi is a multilingual React web application built to provide conversational assistance. It includes login/signup, chatbot interaction, and voice input with multi-language support.

# BolSaathi App – Feature Overview:

1. User-Onboarding & Profile:
   - Secure registration and login
   - Role-based onboarding flows (farmer, entrepreneur, student)
   - Dashboard displaying user profile and chatbot session tracking

2. Government Scheme Discovery:
   - NLP-enabled query interface for scheme recommendations
   - Personalized scheme matching using age, location, income, occupation
   - Summarized eligibility, benefits, application process
   - Live web lookups using gov_scheme_search tool
   - Multi-turn conversational guidance on schemes

3. Destination & Local Insights:
   - Real-time data on weather, internet speed, safety, water quality, ATMs
   - Recommended stay durations
   - Local service suggestions: hospitals, transport, coffee shops
   - Drag-and-drop itinerary planner (for travel-like experiences)

4. Expense & Budget Tracking:
   - Track expenses and split costs among users
   - Dashboard chart of spending vs budget
   - Budget estimation for scheme benefits or project plans

5. Checklist & Document Management:
   - Generate customized checklists for documents or tasks
   - Pre-built templates for scheme applications
   - Shareable digital checklist across users

6. Content, Alerts & Guidance:
   - Detailed guidance on application steps and criteria
   - Notifications about new schemes or deadlines
   - Contextual alerts based on user profile

7. Tool Integration & Search:
   - Calls gov_scheme_search for live data retrieval
   - Summarizes key info and lists relevant support links
   - Packages output in structured format for frontend processing

8. Feedback & Support:
   - Feedback mechanism for user satisfaction
   - Escalation from chatbot to human support
   - Help center with FAQs and educational content

9. Platform & Access:
   - Responsive UI for mobile/desktop
   - Low-bandwidth mode tailored for rural users
   - Clear navigation across chat, scheme info, checklists, and alerts

## 🌐 Supported Languages
- English
- Hindi
- Marathi
- Gujarati
- Bengali

## 🛠️ Tech Stack

- React (v19+)
- React Router
- i18next (localization)
- React Speech Kit (voice input)
- Tailwind CSS (styling)

## 📁 Folder Structure
frontend/
├── public/
│ └── index.html
├── src/
│ ├── assets/
│ ├── components/
│ ├── contexts/
│ ├── i18n/
│ ├── pages/
│ ├── App.jsx
│ ├── main.jsx
├── .env
├── package.json
└── README.md

## ⚙️ Setup Instructions

### 1. Clone the Repository
git clone https://github.com/imakshat47/BolSaathi.git
cd BolSaathi/frontend

### 2.Install Dependencies
npm install
<br/>
--If you get errors (e.g., with react-speech-kit)
npm install react@18 react-dom@18
