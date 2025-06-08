# 🚀 Epic Tech AI - Interactive Lyric Visualizer (v2.0)

## **Project Overview: The Rebuild**

Welcome to version 2.0 of the **Epic Tech AI Interactive HTML Lyric Visualizer**. This version represents a complete architectural rebuild, designed from the ground up to address user feedback and deliver a true Web-as-a-Service (WaaS) experience.

The core mission of this rebuild was to empower you, the user, to **use your own media files directly in the browser** without touching a single line of code.

## **✨ New Features in v2.0**

-   **🖥️ Interactive Setup Screen:** A user-friendly interface to configure your entire visual experience.
-   **⬆️ Direct File Uploads:** Select your MP3 and lyric images directly from your computer.
-   **⏱️ Dynamic Timestamp Configuration:** After uploading images, you can set the exact time (in seconds) each lyric should appear.
-   **🚀 One-Click Launch:** Start the immersive visualizer once your configuration is complete.
-   **🔄 Session Reset:** An "Exit" button in the visualizer allows you to return to the setup screen to start a new session.
-   **🧠 In-Memory File Handling:** Uses `URL.createObjectURL()` to handle your files securely and efficiently within the browser session. No server-side upload or storage is required.
-   **✅ Real-time Validation:** The "Launch" button only becomes active when all required files are selected.

## **🛠️ Technology Stack**

-   **HTML5**: A two-screen layout (`setup-screen`, `visualizer-screen`).
-   **CSS3**: Advanced styling for the setup UI, including flexbox, grid, and custom properties.
-   **JavaScript (ES6+ Classes)**: A robust, class-based architecture managing the application's state (setup vs. visualizer) and handling all user interactions and DOM manipulation.
-   **File API & Object URLs**: The core technologies that enable client-side file handling.

## **📁 New Project Structure**

```
epic-visualizer-v2/
│
├── index.html      # Contains both Setup and Visualizer screen layouts
├── style.css       # Styles for both screens
├── script.js       # The new engine driving the entire application
└── README.md       # This documentation
```

## **🚀 How to Use Your New Visualizer**

1.  **Open the Application:** Navigate to the provided live URL.
2.  **Step 1: Select Audio:** Click the "Select MP3 File" button and choose your desired audio track.
3.  **Step 2: Select Images:** Click the "Select All Image Files" button. You can select multiple images at once. They will be automatically sorted alphabetically.
4.  **Step 3: Set Timestamps:** For each image that appears, enter the time in seconds (e.g., `15.5`) when you want it to display.
5.  **Step 4: Launch:** Once you've selected an audio file and at least one image, the "Launch Visualizer" button will become active. Click it to begin.
6.  **Enjoy:** Experience the full-screen visualizer, powered by your own media.
7.  **Exit:** Click the "✕" button on the audio controls to end the session and return to the setup screen.

## **📄 License**

This project is licensed under the **MIT License**.

## **🤝 Support & Credits**

Created with precision and adaptability by **Epic Tech AIGent Tools**. This rebuild demonstrates a commitment to understanding user needs and engineering superior solutions.

---

**Epic Tech AI** - *Where Innovation Meets Excellence* 🚀