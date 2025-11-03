// ===================================
// Discord Bot - Main Entry Point
// ===================================
// This is a Discord bot implementation with slash commands
// Built for Discord Active Developer badge eligibility
// Node.js v22.21.0 | Discord.js v14
// ===================================

// Import required modules
import { Client, GatewayIntentBits, Events, Collection, ChannelFlagsBitField } from 'discord.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// ===================================
// Bot Configuration & Initialization
// ===================================

// Create a new Discord client instance with necessary intents
// GatewayIntentBits define what events the bot can receive
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Required for slash commands and guild events
    ]
});

// Initialize commands collection to store slash commands
client.commands = new Collection();

// ===================================
// Slash Commands Definition
// ===================================

// Command 1: /ping - Simple health check command
const pingCommand = {
    // Command metadata
    name: 'ping',
    description: 'Replies with Pong! and bot latency',

    // Execute function - runs when command is invoked
    async execute(interaction) {
        try {
            // Calculate WebSocket ping (heartbeat latency)
            const wsPing = client.ws.ping;

            // Calculate API roundtrip time
            const sentTimestamp = Date.now();

            // Send initial response (deferred to allow time calculation)
            await interaction.deferReply();

            // Calculate total response time
            const apiLatency = Date.now() - sentTimestamp;

            // Edit reply with detailed latency information
            await interaction.editReply({
                content: `🏓 Pong!\n\n**WebSocket Ping:** ${wsPing}ms\n**API Latency:** ${apiLatency}ms`,
            });

            // Log successful command execution
            console.log(`[PING] Executed by ${interaction.user.tag} | WS: ${wsPing}ms | API: ${apiLatency}ms`);
        } catch (error) {
            // Error handling with proper logging
            console.error('[ERROR] Ping command failed:', error);

            // Attempt to send error message to user
            const errorMessage = ' An error occurred while executing this command.';
            if (interaction.deferred) {
                await interaction.editReply({ content: errorMessage });
            } else {
                await interaction.reply({ content: errorMessage, flags: 64 });
            }
        }
    }
};

// Command 2: /userinfo - Display user information
const userinfoCommand = {
    // Command metadata
    name: 'userinfo',
    description: 'Displays information about you or a specified user',

    // Execute function with comprehensive user data
    async execute(interaction) {
        try {
            // Get the user (defaults to command invoker)
            const user = interaction.user;
            const member = interaction.member;

            // Format account creation date
            const accountCreated = user.createdAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Format server join date (if available)
            const joinedServer = member?.joinedAt ? member.joinedAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : 'N/A';

            // Calculate account age in days
            const accountAge = Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24));

            // Construct detailed response
            const response = [
                `👤 **User Information**`,
                ``,
                `**Username:** ${user.username}`,
                `**Display Name:** ${user.displayName || user.username}`,
                `**User ID:** ${user.id}`,
                `**Account Created:** ${accountCreated}`,
                `**Account Age:** ${accountAge} days`,
                `**Joined Server:** ${joinedServer}`,
                `**Bot Account:** ${user.bot ? 'Yes' : 'No'}`,
                ``,
                `**Avatar URL:** [Click here](${user.displayAvatarURL()})`
            ].join('\n');

            // Send response with user avatar thumbnail
            await interaction.reply({
                content: response
            });

            // Log successful command execution
            console.log(`[USERINFO] Executed by ${user.tag} (${user.id})`);
        } catch (error) {
            // Error handling with proper logging
            console.error('[ERROR] Userinfo command failed:', error);

            // Send error message to user
            await interaction.reply({
                content: ' An error occurred while fetching user information.',
                flags: 64
            });
        }
    }
};

// Register commands in the collection for easy access
client.commands.set(pingCommand.name, pingCommand);
client.commands.set(userinfoCommand.name, userinfoCommand);

// ===================================
// Event Handlers
// ===================================

// Event: Bot is ready and logged in
client.once(Events.ClientReady, (readyClient) => {
    // Log successful connection with timestamp
    console.log('===================================');
    console.log('🤖 Discord Bot Started Successfully');
    console.log('===================================');
    console.log(` Logged in as: ${readyClient.user.tag}`);
    console.log(` Servers: ${readyClient.guilds.cache.size}`);
    console.log(` Users: ${readyClient.users.cache.size}`);
    console.log(` Ready at: ${new Date().toLocaleString()}`);
    console.log('===================================');

    // Set bot presence/status (optional but professional)
    client.user.setPresence({
        activities: [{
            name: 'slash commands',
            type: 0 // Type 0 = Playing
        }],
        status: 'online' // online, idle, dnd, invisible
    });
});

// Event: Slash command interaction received
client.on(Events.InteractionCreate, async (interaction) => {
    // Check if the interaction is a chat input command (slash command)
    if (!interaction.isChatInputCommand()) return;

    // Retrieve the command from the commands collection
    const command = client.commands.get(interaction.commandName);

    // Validate command exists
    if (!command) {
        console.warn(`[WARNING] Unknown command: ${interaction.commandName}`);
        return await interaction.reply({
            content: ' This command is not recognized.',
            flags: 64
        });
    }

    // Log command execution attempt
    console.log(`[COMMAND] ${interaction.user.tag} used /${interaction.commandName}`);

    // Execute the command with error handling
    try {
        await command.execute(interaction);
    } catch (error) {
        // Comprehensive error logging
        console.error(`[ERROR] Command execution failed:`, error);

        // Send user-friendly error message
        const errorResponse = {
            content: ' There was an error executing this command. Please try again later.',
            flags: 64
        };

        // Handle both replied and non-replied interactions
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorResponse);
        } else {
            await interaction.reply(errorResponse);
        }
    }
});

// Event: Error handling for uncaught errors
client.on(Events.Error, (error) => {
    console.error('[CRITICAL ERROR] Discord client error:', error);
});

// Event: Warning handling
client.on(Events.Warn, (warning) => {
    console.warn('[WARNING]', warning);
});

// ===================================
// Process Error Handlers
// ===================================

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('[UNHANDLED REJECTION]', error);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('[UNCAUGHT EXCEPTION]', error);
    // Optionally exit the process after logging
    // process.exit(1);
});

// ===================================
// Bot Login
// ===================================

// Login to Discord using the bot token from environment variables
// The token should NEVER be hardcoded or committed to version control
try {
    await client.login(process.env.DISCORD_TOKEN);
} catch (error) {
    console.error('[FATAL ERROR] Failed to login to Discord:', error);
    console.error('Please check your DISCORD_TOKEN in the .env file');
    process.exit(1);
}
