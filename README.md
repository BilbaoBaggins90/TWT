# ⚔️ Torn War Room

A secure, client-side tool designed to help Torn City factions manage ranked wars, monitor chains, and track targets efficiently.

---

## 🚀 Features

* **🛡️ War Room:** Automatically detects active Ranked Wars and lists enemy targets.
* **⛓️ Chain Monitor:** Live display of the faction chain count and timeout timer.
* **🎯 Smart Filtering:** Filter enemies by Level, Status (Okay, Hospital, Jail), and view estimated Respect/Fair Fight values.
* **💤 Inactive List:** Quick access to the faction's shared target list (hosted externally).
* **👀 Custom Watchlist:** Track specific players regardless of their faction status.
* **🔒 Secure:** Runs entirely in your browser. Your API Key is **never** sent to an external server.

---

## 📖 How to Use

1.  **Get your API Key:**
    * Go to your [Torn Settings Page](https://www.torn.com/preferences.php#tab=api).
    * Copy your **Public** API Key.
2.  **Enter Credentials:**
    * Paste your key into the "YOUR API KEY" box at the top of the tool.
    * The tool will automatically save it to your browser's local storage so you don't have to type it every time.
3.  **Select a Tab:**
    * **War Room:** Enter an Enemy Faction ID (or click "Auto") to scan targets.
    * **Inactive List:** Opens the faction's spreadsheet/document in a new tab.
    * **Watchlist:** Paste a list of User IDs to check their current status and rank.

---

## ⚙️ Configuration (For Admins)

To change the link for the **"Inactive List"** tab, follow these steps:

1.  Open the `index.html` file in your text editor (or directly on GitHub).
2.  Scroll to the very bottom of the code.
3.  Find this line:
    ```javascript
    const TARGET_WEBSITE_URL = "[https://docs.google.com/spreadsheets/u/0/](https://docs.google.com/spreadsheets/u/0/)";
    ```
4.  Replace the URL inside the quotes with the link to your Google Sheet or website.
    * *Tip:* If using Google Sheets, go to **File > Share > Publish to Web** to get the best link.

---

## 🔒 Privacy & Security

This tool is a **Client-Side Application**.
* It runs 100% inside your web browser.
* Your API Key is stored in your browser's `localStorage` for your convenience.
* No data is ever transmitted to a backend database or third-party server.

---

## ⚠️ Disclaimer

This tool is a community-created project and is not affiliated with or endorsed by Torn City. Use at your own risk.
