# Discord Bot - Active Developer Badge

A Discord bot with slash commands built to help you earn the Discord Active Developer badge.

## Features

- **2 Slash Commands:**
  - `/ping` - Check bot latency and response time
  - `/userinfo` - Display detailed user information
- Simple code structure with extensive comments
- Error handling and logging
- Environment-based configuration
- Compatible with Node.js v22.21.0

## Prerequisites

- Node.js v22.21.0 or higher
- npm 10.9.4 or higher
- Discord account
- Discord server where you have admin permissions

## Setup Instructions

### Step 1: Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give it a name and click "Create"
4. Go to the "Bot" section in the left sidebar
5. Click "Reset Token" and copy your bot token (save it for later)
6. Scroll down and enable these **Privileged Gateway Intents**:
   - ✅ Server Members Intent (optional but recommended)
7. Go to "General Information" and copy your "Application ID" (this is your CLIENT_ID)

### Step 2: Invite Bot to Your Server

1. In Developer Portal, go to "OAuth2" > "URL Generator"
2. Select these scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Select these bot permissions:
   - ✅ Send Messages
   - ✅ Use Slash Commands
4. Copy the generated URL at the bottom
5. Paste it in your browser and invite the bot to your server

### Step 3: Get Your Server ID

1. Open Discord and enable Developer Mode:
   - Settings > Advanced > Developer Mode (toggle ON)
2. Right-click your server icon
3. Click "Copy Server ID"

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Configure Environment Variables

1. Rename `.env.example` to `.env`
2. Open `.env` and fill in your values:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_server_id_here
```

**Important:**
- Never share your bot token with anyone
- Never commit `.env` to version control

### Step 6: Deploy Slash Commands

```bash
npm run deploy
```

This registers your slash commands with Discord. For testing with `GUILD_ID`, commands are instant. Without `GUILD_ID`, global commands take up to 1 hour.

### Step 7: Start the Bot

```bash
npm start
```

You should see a success message indicating the bot is online.

### Step 8: Test Commands

1. Go to your Discord server
2. Type `/` in any channel
3. You should see your bot's commands appear
4. Try `/ping` and `/userinfo`

## Getting the Active Developer Badge

1. Use any slash command in your server (at least once)
2. Wait **24 hours**
3. Go to [Discord Active Developer page](https://discord.com/developers/active-developer)
4. Click "Claim Badge"
<p align="center">
  <img src="https://raw.githubusercontent.com/nayandas69/discord-active-developer-bot/refs/heads/main/img/Badge_Confirm.png" alt="Soft Theme Preview" width="50%"/>
</p>
5. The badge will appear on your Discord profile
<p align="center">
  <img src="https://raw.githubusercontent.com/nayandas69/discord-active-developer-bot/refs/heads/main/img/Active_Badge.png" alt="Soft Theme Preview" width="50%"/>
</p>


## Commands Explained

### /ping
- Responds with "Pong!" and latency information
- Shows WebSocket ping and API latency
- Useful for checking if bot is responsive

### /userinfo
- Displays information about the command user
- Shows username, ID, account creation date, join date, and more
- Includes avatar URL

## Troubleshooting

### Bot is not responding to commands
- Make sure the bot is online (green status)
- Verify you ran `npm run deploy`
- Check if bot has necessary permissions in the channel

### Commands not appearing
- Wait a few seconds after running `npm run deploy`
- If using global deployment (no GUILD_ID), wait up to 1 hour
- Try kicking and re-inviting the bot

### Bot won't start
- Verify your `.env` file has correct values
- Check that DISCORD_TOKEN is valid (reset it if needed)
- Make sure you ran `npm install`

### "Invalid Token" error
- Your DISCORD_TOKEN is incorrect or expired
- Go to Discord Developer Portal and reset your token
- Update the token in your `.env` file

## Support

- [Discord.js Documentation](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/docs)
- [Discord.js Guide](https://discordjs.guide/)

## License

MIT

---

> [!CAUTION]
> This bot is designed for educational purposes and to help you earn the Discord Active Developer badge. Feel free to customize and expand it with more commands and features!