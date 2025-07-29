import os
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes
from together import Together

# Load environment variables
load_dotenv()
BOT_TOKEN = os.getenv("BOT_TOKEN")
TOGETHER_AI_KEY = os.getenv("TOGETHER_AI_KEY")
WALLET_ADDRESS = os.getenv("WALLET_ADDRESS", "Not set")

# Initialize Together AI
ai = Together(api_key=TOGETHER_AI_KEY)
chat_history = []  # Simple in-memory conversation history

# Commands
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("🔥 MJ2 is online with memory and crypto tracking!")

async def wallet(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(f"Your wallet address is: {WALLET_ADDRESS}")

async def chat(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_message = update.message.text
    chat_history.append({"role": "user", "content": user_message})

    response = ai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=chat_history
    )

    bot_reply = response.choices[0].message.content
    chat_history.append({"role": "assistant", "content": bot_reply})

    await update.message.reply_text(bot_reply)

# Bot Setup
app = ApplicationBuilder().token(BOT_TOKEN).build()
app.add_handler(CommandHandler("start", start))
app.add_handler(CommandHandler("wallet", wallet))
app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, chat))

app.run_polling()