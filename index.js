require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');

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

let roleMessageId = null; 
const channelId = '869410860215468035';

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const channel = await client.channels.fetch(channelId);
    if (!channel) {
        console.error('Channel not found!');
        return;
    }

    const message = await channel.send("**React with your country flag on this message please**");
    roleMessageId = message.id;

    console.log('Role selection message sent!');
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.partial) {
        try { await reaction.fetch(); } catch (error) { console.error('Fetching error:', error); return; }
    }
    if (user.bot) return;
    if (reaction.message.id !== roleMessageId) return;

    const emoji = reaction.emoji.name;
    const countryName = emojiToCountryName(emoji);
    if (!countryName) {
        console.log(`Unknown country emoji: ${emoji}`);
        return;
    }

    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id);

    let role = guild.roles.cache.find(r => r.name === countryName);

    if (!role) {
        try {
            role = await guild.roles.create({
                name: countryName,
                color: 'Random',
                reason: `Created automatically for country role selection.`,
            });
            console.log(`Created new role: ${countryName}`);
        } catch (err) {
            console.error(`Failed to create role ${countryName}:`, err);
            return;
        }
    }

    try {
        await member.roles.add(role);
        console.log(`Assigned role ${countryName} to ${user.tag}`);
    } catch (err) {
        console.error(`Failed to assign role: ${err}`);
    }
});

client.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.partial) {
        try { await reaction.fetch(); } catch (error) { console.error('Fetching error:', error); return; }
    }
    if (user.bot) return;
    if (reaction.message.id !== roleMessageId) return;

    const emoji = reaction.emoji.name;
    const countryName = emojiToCountryName(emoji);
    if (!countryName) {
        console.log(`Unknown country emoji: ${emoji}`);
        return;
    }

    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id);
    const role = guild.roles.cache.find(r => r.name === countryName);
    if (!role) return;

    try {
        await member.roles.remove(role);
        console.log(`Removed role ${countryName} from ${user.tag}`);
    } catch (err) {
        console.error(`Failed to remove role: ${err}`);
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
