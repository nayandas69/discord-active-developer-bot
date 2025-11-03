// ===================================
// Slash Commands Deployment Script
// ===================================
// This script registers/updates slash commands with Discord's API
// Run this script whenever you add, modify, or remove commands
// Command: npm run deploy
// ===================================

// Import required modules
import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ===================================
// Command Definitions (JSON format for Discord API)
// ===================================

// Array of all slash commands to register
const commands = [
    // Command 1: /ping
    {
        name: 'ping',
        description: 'Replies with Pong! and bot latency',
        // No options needed for this command
    },

    // Command 2: /userinfo
    {
        name: 'userinfo',
        description: 'Displays information about you or a specified user',
        // No options needed (defaults to command user)
    }
];

// ===================================
// Configuration Validation
// ===================================

// Retrieve environment variables
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

// Validate required environment variables exist
if (!token) {
    console.error(' ERROR: DISCORD_TOKEN is missing in .env file');
    process.exit(1);
}

if (!clientId) {
    console.error(' ERROR: CLIENT_ID is missing in .env file');
    process.exit(1);
}

// Note: GUILD_ID is optional
// If provided: Commands deploy to specific guild (instant, for testing)
// If not provided: Commands deploy globally (takes up to 1 hour, for production)

// ===================================
// REST API Setup
// ===================================

// Create REST client with API version 10
const rest = new REST({ version: '10' }).setToken(token);

// ===================================
// Deployment Function
// ===================================

async function deployCommands() {
    try {
        console.log('===================================');
        console.log(' Starting Slash Commands Deployment');
        console.log('===================================');
        console.log(` Commands to deploy: ${commands.length}`);
        console.log(`   - ${commands.map(cmd => `/${cmd.name}`).join('\n   - ')}`);
        console.log('');

        // Determine deployment type (guild-specific or global)
        if (guildId) {
            // Guild-specific deployment (INSTANT - recommended for testing)
            console.log(' Deployment Type: Guild-Specific (Test Mode)');
            console.log(` Target Guild ID: ${guildId}`);
            console.log(' Commands will be available immediately');
            console.log('');
            console.log('⏳ Deploying commands...');

            // Send PUT request to Discord API to register guild commands
            const data = await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands }
            );

            console.log('');
            console.log(' SUCCESS! Guild commands deployed successfully');
            console.log(` Total commands registered: ${data.length}`);
        } else {
            // Global deployment (TAKES UP TO 1 HOUR - for production)
            console.log(' Deployment Type: Global (Production Mode)');
            console.log('  WARNING: Global commands may take up to 1 hour to update');
            console.log(' TIP: Add GUILD_ID to .env for instant testing');
            console.log('');
            console.log('⏳ Deploying commands...');

            // Send PUT request to Discord API to register global commands
            const data = await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands }
            );

            console.log('');
            console.log(' SUCCESS! Global commands deployed successfully');
            console.log(` Total commands registered: ${data.length}`);
            console.log(' Commands will be available globally within 1 hour');
        }

        console.log('===================================');
        console.log('Deployment Complete!');
        console.log('===================================');
        console.log('');
        console.log(' Next Steps:');
        console.log('   1. Start your bot: npm start');
        console.log('   2. Go to your Discord server');
        console.log('   3. Type / to see available commands');
        console.log('   4. Use /ping or /userinfo');
        console.log('');
        console.log('🏆 Active Developer Badge:');
        console.log('   - Use any command in your server');
        console.log('   - Wait 24 hours');
        console.log('   - Check: https://discord.com/developers/active-developer');
        console.log('');

    } catch (error) {
        // Comprehensive error handling
        console.error('');
        console.error('===================================');
        console.error('DEPLOYMENT FAILED');
        console.error('===================================');
        console.error('Error Details:', error);
        console.error('');

        // Provide specific error guidance
        if (error.code === 50001) {
            console.error(' Missing Access: Bot is not in the specified guild');
            console.error(' Solution: Invite bot to your server first');
        } else if (error.code === 401) {
            console.error(' Invalid Token: Check your DISCORD_TOKEN in .env');
            console.error(' Solution: Get a new token from Discord Developer Portal');
        } else if (error.code === 403) {
            console.error(' Forbidden: Bot lacks necessary permissions');
            console.error(' Solution: Check bot permissions in Discord Developer Portal');
        } else {
            console.error(' Troubleshooting:');
            console.error('   1. Verify DISCORD_TOKEN in .env is correct');
            console.error('   2. Verify CLIENT_ID in .env is correct');
            console.error('   3. Check bot is invited to the guild (if using GUILD_ID)');
            console.error('   4. Ensure bot has necessary permissions');
        }

        console.error('');
        process.exit(1);
    }
}

// ===================================
// Execute Deployment
// ===================================

// Run the deployment function
deployCommands();
