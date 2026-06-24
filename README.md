<!-- ============================ HEADER BANNER ============================ -->
<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12&height=220&section=header&text=leaaarrn-it&fontSize=70&fontAlignY=35&desc=Master%20every%20keyboard%20shortcut%20across%20every%20OS%2C%20browser%20and%20app&descAlignY=58&descSize=18&animation=fadeIn&fontColor=ffffff" alt="leaaarrn-it banner" />

<!-- Typing animation -->
<a href="https://github.com/Eshwar02/leaaarrn-it">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&pause=1000&color=6C63FF&center=true&vCenter=true&width=700&lines=Press+a+shortcut.+See+what+it+does.+Instantly.;Ctrl%2BShift%2BN+won't+open+incognito+here+%F0%9F%94%92;200%2B+shortcuts+across+14+apps;Built+with+Next.js+%2B+Supabase+%E2%9A%A1" alt="Typing SVG" />
</a>

<br/>

<!-- Badges -->
<img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" />

<br/>

<img src="https://img.shields.io/github/last-commit/Eshwar02/leaaarrn-it?style=flat-square&color=6C63FF" />
<img src="https://img.shields.io/github/languages/top/Eshwar02/leaaarrn-it?style=flat-square&color=F97316" />
<img src="https://img.shields.io/badge/shortcuts-200%2B-22C55E?style=flat-square" />
<img src="https://img.shields.io/badge/apps-14-EF4444?style=flat-square" />

</div>

<!-- ============================ MASCOT ============================ -->
<div align="center">

<img src="https://media.giphy.com/media/13HBDT4QSTpveU/giphy.gif" width="180" alt="typing cat" />

> _"i pressed Ctrl+Shift+N to learn it… and a whole incognito window jumped out at me."_
> — **every developer, once** 😼

</div>

---

## 🎬 What is this?

**leaaarrn-it** is a playground for keyboard shortcuts. Press a combo, and it tells you what that combo does — in Windows, macOS, Linux, Chrome, VS Code, Excel, Figma, and more. No more accidental incognito windows while you're just trying to *learn*.

<div align="center">
<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%" alt="rainbow line" />
</div>

## ✨ Features

| | Feature | What it does |
|:--:|:--|:--|
| ⌨️ | **Key-Capture Box** | A huge, focusable box that **traps your keystrokes** so the browser never reacts. Big, bouncy, animated keycaps show exactly what you pressed. |
| 🔒 | **Full-Capture Mode** | Uses the **Keyboard Lock API** in fullscreen to trap even reserved combos like `Ctrl+Shift+N`, `Ctrl+T`, `Ctrl+W` — *zero* browser interference. |
| 🗂️ | **Browse by App** | A slick left sidebar groups every **OS, browser, and tool**. Click one to see its full shortcut list. |
| 🌍 | **Cross-Platform Notes** | Each shortcut shows how it differs on Windows / macOS / Linux. |
| 🎨 | **Delightful Animations** | Pop-in keycaps, pulsing glow, fire-flash — learning should *feel* good. |

<div align="center">
<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%" alt="rainbow line" />
</div>

## 🧠 The "huge keyboard-proof box"

```
 ┌──────────────────────────────────────────────────────────┐
 │  🟢 Listening… press any shortcut                          │
 │                                                            │
 │        ╔═══════╗   +   ╔═══════╗   +   ╔═══════╗           │
 │        ║ Ctrl  ║       ║ Shift ║       ║   N   ║           │
 │        ╚═══════╝       ╚═══════╝       ╚═══════╝           │
 │                                                            │
 │   🔒 Enable full capture (Ctrl+Shift+N, Ctrl+T…)           │
 └──────────────────────────────────────────────────────────┘
```

> 💡 **Why does this exist?** Browsers refuse to let normal pages suppress
> reserved shortcuts (security). The only true escape hatch is the
> **Keyboard Lock API**, which works in **fullscreen on Chromium browsers**.
> Flip on _Full-Capture Mode_ and `Ctrl+Shift+N` finally behaves. 🎉

## 🗺️ How it works

```mermaid
flowchart LR
    A([⌨️ You press keys]) -->|trapped by| B[KeyCaptureBox]
    B -->|normalized combo| C{Mode?}
    C -->|by combo| D[/api/shortcuts?keys=.../]
    C -->|by app| E[/api/shortcuts?app=.../]
    D --> F[(🟢 Supabase)]
    E --> F
    F --> G[✨ Animated shortcut cards]
    style B fill:#6C63FF,stroke:#fff,color:#fff
    style F fill:#3FCF8E,stroke:#fff,color:#fff
    style G fill:#F97316,stroke:#fff,color:#fff
```

## 🧰 Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=nextjs,react,typescript,tailwind,supabase,postgres,vercel&theme=dark" alt="tech stack" />

</div>

## 🚀 Getting Started

```bash
# 1. Install
npm install

# 2. Configure — copy the example and fill in your Supabase keys
cp .env.local.example .env.local

# 3. Set up the database (Supabase SQL Editor)
#    → run supabase/schema.sql
#    → run supabase/seed.sql
#    → run supabase/seed_more_apps.sql   (PowerPoint, Slack, Photoshop, Notion, Gmail)

# 4. Fire it up 🔥
npm run dev
```

Then open **http://localhost:3000/explore** and start mashing keys. 😎

## 📦 Project Structure

```
leaaarrn-it/
├── app/
│   ├── explore/page.tsx     # 🎯 the explorer (sidebar + capture box)
│   └── api/shortcuts/       # 🔌 query by keys or by app
├── components/
│   ├── KeyCaptureBox.tsx    # ⌨️ the star of the show
│   ├── AppSidebar.tsx       # 🗂️ browse-by-app nav
│   ├── VisualKeyboard.tsx   # 🖱️ click-to-build combos
│   └── ShortcutCard.tsx     # 🃏 result cards
├── lib/
│   ├── apps.ts              # 📚 app catalog (OS / browsers / tools)
│   ├── keys.ts              # 🔧 key normalization magic
│   └── supabase/            # 🟢 db clients
└── supabase/                # 🗃️ schema + seed SQL (200+ shortcuts)
```

## 🎯 Apps Covered

<div align="center">

🪟 Windows &nbsp;•&nbsp; 🍎 macOS &nbsp;•&nbsp; 🐧 Linux &nbsp;•&nbsp; 🌐 Chrome &nbsp;•&nbsp; 🦊 Firefox
<br/>
💻 VS Code &nbsp;•&nbsp; 📊 Excel &nbsp;•&nbsp; 📝 Word &nbsp;•&nbsp; 📽️ PowerPoint &nbsp;•&nbsp; 🎨 Figma
<br/>
🖼️ Photoshop &nbsp;•&nbsp; 🗒️ Notion &nbsp;•&nbsp; 💬 Slack &nbsp;•&nbsp; ✉️ Gmail

</div>

<div align="center">
<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%" alt="rainbow line" />
</div>

<!-- ============================ FOOTER ============================ -->
<div align="center">

<img src="https://media.giphy.com/media/LmNwrBhejkK9EFP504/giphy.gif" width="120" alt="happy cat" />

### Made with 💜, ☕, and far too many keyboard shortcuts

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12&height=120&section=footer" alt="footer" width="100%" />

</div>
