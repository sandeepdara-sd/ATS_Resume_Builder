# 💼 ATS Resume Builder

> **A fully functional, AI-powered resume builder built with React, Firebase, Gemini AI, Node.js, and MongoDB.**

This project empowers users to create professional, ATS-friendly resumes tailored to their career goals. Whether you're a fresher or an experienced professional, this platform offers guided resume creation, AI-generated summaries, resume scoring, and clean PDF exports — all wrapped in a modern, responsive UI.

---

🎯 🚀 Live Demo  
🔗 https://sd-resume-builder.vercel.app/


## 🚀 Why This Project?

Many job seekers struggle to craft a resume that is both professional and ATS-compliant. This tool solves that by:

- 🧠 Using **AI** to generate personalized summaries.
- 🧾 Parsing uploaded resumes for quick editing.
- 📊 Scoring resumes against job descriptions for better targeting.
- 📄 Offering a clean PDF output ready for applications.

---

## 🎯 Key Features

- 🔐 **User Authentication**: Sign in using Google or email/password (via Firebase).
- 🧑‍🎓 **Smart Resume Builder**: Dynamic form flows for freshers and experienced users.
- 🧠 **AI Summary Generator**: Uses Google Gemini to craft compelling summaries.
- 📄 **PDF Export**: Download your resume in a beautifully formatted, clean PDF layout.
- 📥 **Resume Parsing**: Upload an existing resume to extract data and reuse it.
- 📊 **Resume Scoring**: Get an AI-backed score based on job descriptions.
- 📬 **Feedback Submission**: Users can send direct feedback (EmailJS + MongoDB).
- 🧩 **Modular Codebase**: Clean separation between frontend and backend logic.
- 🌐 **Fully Responsive UI**: Built using Material UI for a sleek and modern experience.

---

## 🧰 Tech Stack

| Layer         | Technology Used                                           |
|---------------|-----------------------------------------------------------|
| 🎨 Frontend    | React (CRA), Firebase Auth, Material UI                  |
| 🧠 AI Engine   | Gemini Flash API (Google Generative AI)                  |
| 🖥️ Backend     | Node.js, Express.js, MongoDB, JWT                        |
| 📤 PDF Export  | html-pdf-node, PDF Text Parser                           |
| 📬 Feedback    | EmailJS                                                  |

---

## 📁 Project Structure

```
ats-resume-builder/
│
├── backend/
│   ├── controllers/    # API Logic (Resume, Auth, AI)
│   ├── models/         # Mongoose Schemas
│   ├── routes/         # Express Routes
│   ├── middleware/     # Auth, Error Handling
│   └── utils/          # PDF Parser, AI Prompts, Helpers
│
├── frontend/
│   ├── public/         # Static Files
│   └── src/
│       ├── components/ # Reusable UI Components
│       ├── pages/      # Route-based Pages
│       ├── context/    # Global State (Auth/User)
│       ├── firebase/   # Firebase Config & Logic
│       └── helper/     
```

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git https://github.com/sandeepdara-sd/ATS_Resume_Builder.git

```

### 2️⃣ Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

---

## 💻 Run the App

You can run the frontend and backend together or separately:

### 🧪 Option 1: Combined (with Concurrently)

```bash
npm run dev
```

### 🧪 Option 2: Run Separately

**Backend**

```bash
cd backend
npm start
```

**Frontend**

```bash
cd frontend
npm start
```

---

## 📌 Use Cases

- 🧑‍🎓 **Freshers**: Quickly generate a professional resume with AI help.
- 💼 **Working Professionals**: Score resumes against job descriptions to increase chances.
- 📝 **Resume Review Services**: Extract content, improve, and export with ease.
- 📤 **Job Portals**: Integrate AI scoring as an enhancement.

---

## 👨‍💻 Author

Made with ❤️ by **Sandeep Dara**  
📧 sandeepdara44@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/sandeep-dara-1b0a23242/)  
🌐 [Portfolio](https://sd-portfoilo.vercel.app/)

---

## 🌟 Support This Project

If you find this useful, please consider ⭐ starring the repo and sharing it with your friends. It helps a lot!

---

## 📃 License

This project is licensed under the MIT License.
