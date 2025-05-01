require('dotenv').config();
const { Client, GatewayIntentBits, Partials, ChannelType, REST, Routes, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// Files where server-specific channelId and roleMessageId are stored
const channelFile = path.join(__dirname, 'channelId.json');
const roleMessageFile = path.join(__dirname, 'roleMessageId.json');

// Read server-specific data if it exists
let serverData = {};
if (fs.existsSync(channelFile)) {
    serverData = JSON.parse(fs.readFileSync(channelFile, 'utf8'));
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    await registerCommands();
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'setup') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You must be an admin to use this command.', ephemeral: true });
        }

        const targetChannel = interaction.options.getChannel('channel');

        if (targetChannel.type !== ChannelType.GuildText) {
            return interaction.reply({ content: 'Please select a valid text channel.', ephemeral: true });
        }

        const guildName = interaction.guild.name;

        try {
            const message = await targetChannel.send("**React with your country flag on this message please**");

            // Store the channelId and roleMessageId for the specific server
            serverData[`${guildName}ChannelId`] = targetChannel.id;
            serverData[`${guildName}RoleMessageId`] = message.id;

            // Save updated server data to the JSON files
            fs.writeFileSync(channelFile, JSON.stringify(serverData, null, 2));
            fs.writeFileSync(roleMessageFile, JSON.stringify(serverData, null, 2));

            return interaction.reply({ content: `Setup complete! Message sent to <#${targetChannel.id}> in server "${guildName}".`, ephemeral: true });
        } catch (err) {
            console.error(err);
            return interaction.reply({ content: 'Failed to send message to the selected channel.', ephemeral: true });
        }
    }
});

async function registerCommands() {
    const commands = [
        new SlashCommandBuilder()
            .setName('setup')
            .setDescription('Set up the role selection message.')
            .addChannelOption(option =>
                option.setName('channel')
                    .setDescription('Select the text channel to send the message.')
                    .setRequired(true))
            .toJSON()
    ];

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        const appId = process.env.APPLICATION_ID;
        await rest.put(Routes.applicationCommands(appId), { body: commands });
        console.log('Slash command registered.');
    } catch (error) {
        console.error('Failed to register commands:', error);
    }
}

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.partial) {
        try { await reaction.fetch(); } catch (error) { console.error('Fetching error:', error); return; }
    }
    const guildName = reaction.message.guild.name;
    if (user.bot || !serverData[`${guildName}RoleMessageId`] || reaction.message.id !== serverData[`${guildName}RoleMessageId`]) return;

    const emoji = reaction.emoji.name;
    const countryName = emojiToCountryName(emoji);
    if (!countryName) return;

    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id);
    let role = guild.roles.cache.find(r => r.name === countryName);

    if (!role) {
        role = await guild.roles.create({
            name: countryName,
            color: null,
            permissions: [],
            reason: 'Country role for reaction'
        }).catch(console.error);
    }

    if (role) {
        await member.roles.add(role).catch(console.error);
    }
});

client.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.partial) {
        try { await reaction.fetch(); } catch (error) { console.error('Fetching error:', error); return; }
    }
    const guildName = reaction.message.guild.name;
    if (user.bot || !serverData[`${guildName}RoleMessageId`] || reaction.message.id !== serverData[`${guildName}RoleMessageId`]) return;

    const emoji = reaction.emoji.name;
    const countryName = emojiToCountryName(emoji);
    if (!countryName) return;

    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id);
    const role = guild.roles.cache.find(r => r.name === countryName);
    if (role) {
        await member.roles.remove(role).catch(console.error);
    }
});
function emojiToCountryName(emoji) {
    const map = {
    "🇦🇫": "Afghanistan",
    "🇦🇱": "Albania",
    "🇩🇿": "Algeria",
    "🇦🇩": "Andorra",
    "🇦🇴": "Angola",
    "🇦🇮": "Anguilla",
    "🇦🇶": "Antarctica",
    "🇦🇬": "Antigua and Barbuda",
    "🇦🇷": "Argentina",
    "🇦🇲": "Armenia",
    "🇦🇼": "Aruba",
    "🇦🇺": "Australia",
    "🇦🇹": "Austria",
    "🇦🇿": "Azerbaijan",
    "🇧🇸": "Bahamas",
    "🇧🇭": "Bahrain",
    "🇧🇩": "Bangladesh",
    "🇧🇧": "Barbados",
    "🇧🇾": "Belarus",
    "🇧🇪": "Belgium",
    "🇧🇿": "Belize",
    "🇧🇯": "Benin",
    "🇧🇲": "Bermuda",
    "🇧🇹": "Bhutan",
    "🇧🇴": "Bolivia",
    "🇧🇦": "Bosnia and Herzegovina",
    "🇧🇼": "Botswana",
    "🇧🇷": "Brazil",
    "🇧🇳": "Brunei",
    "🇧🇬": "Bulgaria",
    "🇧🇫": "Burkina Faso",
    "🇧🇮": "Burundi",
    "🇨🇻": "Cabo Verde",
    "🇰🇭": "Cambodia",
    "🇨🇲": "Cameroon",
    "🇨🇦": "Canada",
    "🇨🇫": "Central African Republic",
    "🇹🇩": "Chad",
    "🇨🇱": "Chile",
    "🇨🇳": "China",
    "🇨🇴": "Colombia",
    "🇰🇲": "Comoros",
    "🇨🇬": "Congo",
    "🇨🇷": "Costa Rica",
    "🇭🇷": "Croatia",
    "🇨🇺": "Cuba",
    "🇨🇾": "Cyprus",
    "🇨🇿": "Czechia",
    "🇩🇰": "Denmark",
    "🇩🇯": "Djibouti",
    "🇩🇲": "Dominica",
    "🇩🇴": "Dominican Republic",
    "🇪🇨": "Ecuador",
    "🇪🇬": "Egypt",
    "🇸🇻": "El Salvador",
    "🇬🇶": "Equatorial Guinea",
    "🇪🇷": "Eritrea",
    "🇪🇪": "Estonia",
    "🇸🇿": "Eswatini",
    "🇪🇹": "Ethiopia",
    "🇫🇯": "Fiji",
    "🇫🇮": "Finland",
    "🇫🇷": "France",
    "🇬🇦": "Gabon",
    "🇬🇲": "Gambia",
    "🇬🇪": "Georgia",
    "🇩🇪": "Germany",
    "🇬🇭": "Ghana",
    "🇬🇷": "Greece",
    "🇬🇩": "Grenada",
    "🇬🇹": "Guatemala",
    "🇬🇳": "Guinea",
    "🇬🇼": "Guinea-Bissau",
    "🇬🇾": "Guyana",
    "🇭🇹": "Haiti",
    "🇭🇳": "Honduras",
    "🇭🇰": "Hong Kong",
    "🇭🇺": "Hungary",
    "🇮🇸": "Iceland",
    "🇮🇳": "India",
    "🇮🇩": "Indonesia",
    "🇮🇷": "Iran",
    "🇮🇶": "Iraq",
    "🇮🇪": "Ireland",
    "🇮🇱": "Israel",
    "🇮🇹": "Italy",
    "🇯🇲": "Jamaica",
    "🇯🇵": "Japan",
    "🇯🇴": "Jordan",
    "🇰🇿": "Kazakhstan",
    "🇰🇪": "Kenya",
    "🇰🇮": "Kiribati",
    "🇰🇵": "North Korea",
    "🇰🇷": "South Korea",
    "🇰🇼": "Kuwait",
    "🇰🇬": "Kyrgyzstan",
    "🇱🇦": "Laos",
    "🇱🇻": "Latvia",
    "🇱🇧": "Lebanon",
    "🇱🇸": "Lesotho",
    "🇱🇷": "Liberia",
    "🇱🇾": "Libya",
    "🇱🇮": "Liechtenstein",
    "🇱🇹": "Lithuania",
    "🇱🇺": "Luxembourg",
    "🇲🇴": "Macau",
    "🇲🇰": "North Macedonia",
    "🇲🇬": "Madagascar",
    "🇲🇼": "Malawi",
    "🇲🇾": "Malaysia",
    "🇲🇻": "Maldives",
    "🇲🇱": "Mali",
    "🇲🇹": "Malta",
    "🇲🇭": "Marshall Islands",
    "🇲🇶": "Martinique",
    "🇲🇷": "Mauritania",
    "🇲🇺": "Mauritius",
    "🇲🇽": "Mexico",
    "🇫🇲": "Micronesia",
    "🇲🇩": "Moldova",
    "🇲🇨": "Monaco",
    "🇲🇳": "Mongolia",
    "🇲🇪": "Montenegro",
    "🇲🇦": "Morocco",
    "🇲🇿": "Mozambique",
    "🇲🇲": "Myanmar",
    "🇳🇦": "Namibia",
    "🇳🇷": "Nauru",
    "🇳🇵": "Nepal",
    "🇳🇱": "Netherlands",
    "🇳🇿": "New Zealand",
    "🇳🇮": "Nicaragua",
    "🇳🇪": "Niger",
    "🇳🇬": "Nigeria",
    "🇳🇺": "Niue",
    "🇳🇴": "Norway",
    "🇴🇲": "Oman",
    "🇵🇰": "Pakistan",
    "🇵🇼": "Palau",
    "🇵🇸": "Palestine",
    "🇵🇦": "Panama",
    "🇵🇬": "Papua New Guinea",
    "🇵🇾": "Paraguay",
    "🇵🇪": "Peru",
    "🇵🇭": "Philippines",
    "🇵🇱": "Poland",
    "🇵🇹": "Portugal",
    "🇶🇦": "Qatar",
    "🇷🇴": "Romania",
    "🇷🇺": "Russia",
    "🇷🇼": "Rwanda",
    "🇰🇳": "Saint Kitts and Nevis",
    "🇱🇨": "Saint Lucia",
    "🇻🇨": "Saint Vincent and the Grenadines",
    "🇼🇸": "Samoa",
    "🇸🇲": "San Marino",
    "🇸🇹": "Sao Tome and Principe",
    "🇸🇦": "Saudi Arabia",
    "🇸🇳": "Senegal",
    "🇷🇸": "Serbia",
    "🇸🇨": "Seychelles",
    "🇸🇱": "Sierra Leone",
    "🇸🇬": "Singapore",
    "🇸🇰": "Slovakia",
    "🇸🇮": "Slovenia",
    "🇸🇧": "Solomon Islands",
    "🇸🇴": "Somalia",
    "🇿🇦": "South Africa",
    "🇸🇸": "South Sudan",
    "🇪🇸": "Spain",
    "🇱🇰": "Sri Lanka",
    "🇸🇩": "Sudan",
    "🇸🇷": "Suriname",
    "🇸🇪": "Sweden",
    "🇨🇭": "Switzerland",
    "🇸🇾": "Syria",
    "🇹🇼": "Taiwan",
    "🇹🇯": "Tajikistan",
    "🇹🇿": "Tanzania",
    "🇹🇭": "Thailand",
    "🇹🇱": "Timor-Leste",
    "🇹🇬": "Togo",
    "🇹🇴": "Tonga",
    "🇹🇹": "Trinidad and Tobago",
    "🇹🇳": "Tunisia",
    "🇹🇷": "Turkey",
    "🇹🇲": "Turkmenistan",
    "🇹🇻": "Tuvalu",
    "🇺🇬": "Uganda",
    "🇺🇦": "Ukraine",
    "🇦🇪": "United Arab Emirates",
    "🇬🇧": "United Kingdom",
    "🇺🇸": "United States",
    "🇺🇾": "Uruguay",
    "🇺🇿": "Uzbekistan",
    "🇻🇺": "Vanuatu",
    "🇻🇦": "Vatican City",
    "🇻🇪": "Venezuela",
    "🇻🇳": "Vietnam",
    "🇾🇪": "Yemen",
    "🇿🇲": "Zambia",
    "🇿🇼": "Zimbabwe"
    };

    return map[emoji];
}

client.login(process.env.DISCORD_TOKEN);
