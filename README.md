import os
import requests
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("MJ v2.5 Activated! 🧠💥")

async def chat(update: Update, context: ContextTypes.DEFAULT_TYPE):
    message = update.message.text

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://chat.openai.com/",
    }

    payload = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [{"role": "user", "content": message}]
    }

    res = requests.post("https://openrouter.ai/api/v1/chat/completions", json=payload, headers=headers)

    if res.status_code == 200:
        reply = res.json()["choices"][0]["message"]["content"]
        await update.message.reply_text(reply)
    else:
        await update.message.reply_text("Error talking to OpenRouter.")
        
if __name__ == "__main__":
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), chat))
    app.run_polling()