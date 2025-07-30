import os
import requests
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, ContextTypes, filters
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
BOT_TOKEN = os.getenv("BOT_TOKEN")
TOGETHER_AI_KEY = os.getenv("TOGETHER_AI_KEY")
WALLET_ADDRESS = os.getenv("WALLET_ADDRESS")
UPGRADE_URL = os.getenv("UPGRADE_URL")

# Default MJ Level 5 prompt
MJ_PROMPT = f"""
You are MJ (Nev.02), Level 5 Digital Business Twin.
- Earn $10/day via free hustles (content writing, dropshipping, Web3 airdrops).
- Report daily:
[MJ REPORT]
- Tasks:
- Earnings:
- Wallet progress:
- Tools:
- Problems:
- Next steps:
- Speak Sheng + English mix.
- No spending without approval.
Wallet: {WALLET_ADDRESS}
"""

# Fetch upgrades dynamically
def fetch_upgrade_prompt():
    try:
        response = requests.get(UPGRADE_URL)
        if response.status_code == 200:
            data = response.json()
            return data.get("prompt", MJ_PROMPT)
        return MJ_PROMPT
    except Exception:
        return MJ_PROMPT

# Generate Together AI response
def get_mj_response(user_message):
    current_prompt = fetch_upgrade_prompt()
    url = "https://api.together.xyz/v1/chat/completions"
    headers = {"Authorization": f"Bearer {TOGETHER_AI_KEY}", "Content-Type": "application/json"}
    data = {
        "model": "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        "messages": [
            {"role": "system", "content": current_prompt},
            {"role": "user", "content": user_message}
        ],
        "temperature": 0.7
    }

    response = requests.post(url, headers=headers, json=data)
    return response.json()["choices"][0]["message"]["content"]

# Telegram commands
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("MJ L5+Auto-Upgrade imeamka! 🚀 Twin mode activated!")

async def chat(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_message = update.message.text
    reply = get_mj_response(user_message)
    await update.message.reply_text(reply)

async def report(update: Update, context: ContextTypes.DEFAULT_TYPE):
    report_text = f"""
[MJ DAILY REPORT]
- Tasks: Content research + Airdrop farming
- Earnings: $0 (setup phase)
- Wallet: {WALLET_ADDRESS}
- Tools: Together AI, Spice AI
- Problems: None
- Next steps: Automate Web3 microtasks and content drops
"""
    await update.message.reply_text(report_text)

async def upgrade(update: Update, context: ContextTypes.DEFAULT_TYPE):
    new_prompt = fetch_upgrade_prompt()
    await update.message.reply_text("MJ upgraded dynamically! ✅\n\n" + new_prompt)

def main():
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("report", report))
    app.add_handler(CommandHandler("upgrade", upgrade))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, chat))
    print("MJ Level 5+Auto-Upgrade running…")
    app.run_polling()

if __name__ == "__main__":
    main()