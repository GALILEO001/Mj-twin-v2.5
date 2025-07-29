import os
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes, MessageHandler, filters
import requests

BOT_TOKEN = os.getenv("BOT_TOKEN")
BOT_NAME = os.getenv("BOT_NAME", "MJ")
WALLET = os.getenv("WALLET_ADDRESS")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(f"Hustle mode activated! My name is {BOT_NAME} 🤖💸")

async def wallet(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(f"My wallet address: {WALLET}")

app = ApplicationBuilder().token(BOT_TOKEN).build()
app.add_handler(CommandHandler("start", start))
app.add_handler(CommandHandler("wallet", wallet))

app.run_polling()