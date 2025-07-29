# 🤖 Telegram Role Bot

A Telegram bot that allows users to assign themselves roles (tags) and mention groups of users by tag.  
Built with TypeScript using the [Telegraf](https://github.com/telegraf/telegraf) framework.

---

## 📦 Features

- `/addtag <tag>` — assign a tag to yourself
- `/removetag <tag>` — remove a tag from yourself
- `/mytags` — view your current tags
- `/ping <tag>` — mention all users with that tag

---

## 🚀 Quick Start (Local)

### 1. Install dependencies

```bash
npm install
```

### 2. Create a .env file

```bash
touch .env
```

Add your bot token from @BotFather:
BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11

### 3. Run the bot

```bash
npx ts-node src/index.ts
```
