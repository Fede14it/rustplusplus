const RustPlus = require('../structures/RustPlus');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup a RustPlus instance for the guild')
        .addStringOption(option => option
            .setName('server_ip')
            .setDescription('The IP address of the Rust Server')
            .setRequired(true))
        .addStringOption(option => option
            .setName('app_port')
            .setDescription('The Rust+ port for the Rust Server')
            .setRequired(true))
        .addStringOption(option => option
            .setName('steam_id')
            .setDescription('The Steam ID of the user that is setting up the bot')
            .setRequired(true))
        .addStringOption(option => option
            .setName('player_token')
            .setDescription('The Player Token for the Rust Server')
            .setRequired(true)),
    async execute(client, interaction) {
        /* Get the options from the command */
        let server_ip = interaction.options.getString('server_ip');
        let app_port = interaction.options.getString('app_port');
        let steam_id = interaction.options.getString('steam_id');
        let player_token = interaction.options.getString('player_token');

        /* Validate server_ip and app_port */
        if (!isValidIpAddress(server_ip)) {
            await interaction.reply({
                content: `:x: Invalid Server IP Address: ${server_ip}`,
                ephemeral: true
            });
            return;
        }
        else if (!(app_port >= 1 && app_port <= 65535)) {
            await interaction.reply({
                content: `:x: Invalid Server App Port: ${app_port}`,
                ephemeral: true
            });
            return;
        }

        /* Reply with a temporary 'thinking ...' */
        await interaction.deferReply({ ephemeral: true });

        /* Disconnect previous instance is any */
        if (client.rustplusInstances[interaction.guildId]) {
            client.rustplusInstances[interaction.guildId].disconnect();
        }

        /* Create the rustplus instance */
        let rustplus = new RustPlus(
            server_ip,
            app_port,
            steam_id,
            player_token
        );

        /* Add guild ID to the rustplus instance */
        rustplus.guildId = interaction.guildId;

        /* Store the interaction in the RustPlus instance temporarily */
        rustplus.interaction = interaction;

        /* Connect */
        rustplus.build();
    },
};

function isValidIpAddress(ip) {
    let regex = new RegExp('^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$');
    if (regex.test(ip)) {
        return true;
    }
    return false;
}