const functions = require('../../utils/functions.js');
const fetch = require('node-fetch');
const config = require('config');
module.exports = {
    name: 'bat',
    description: 'Check how much BAT is worth.',
    usage: 'STONKS',
    aliases: ['brave', 'stonks'],
    guildonly: false,
    developersOnly: false,
    args: false,
    modCommand: false,
    category: 'Misc',
    execute(message, args) {
        function stonkify(percentage) {
            if (parseInt(percentage) >= 25)
                return `<:relaxV:672074572132122624> ${percentage}%`;
            else if (parseInt(percentage) >= 5)
                return `<:Merchant:681301737034088482> ${percentage}%`;
            else if (Math.sign(percentage) === 1)
                return `<:stonks:635003250759958569> ${percentage}%`;
            else if (parseInt(percentage) <= -25)
                return `<:sadboi:661600420678074398> ${percentage}%`;
            else if (parseInt(percentage) <= -5)
                return `<:feels:622146675095371776> ${percentage}%`;
            else
                return `<:stinks:639524149361901576> ${percentage}%`;
        }
        function handleData(data) {
            if (args.length && !isNaN(parseInt(args[0])))
                return message.channel.send((args[0] * data.price).toString().substring(0, 5) + ' EUR');
            const output = functions.newEmbed()
                .setTitle(data.name)
                .addField('EUR', data.price.substring(0, 6) + '€', true)
                .addField('USD', data.markets[2].price.substring(0, 6) + '$', true)
                .addField('Price Change', `\`1h\` - ${stonkify(data.delta_1h)}\n\`24h\` - ${stonkify(data.delta_24h)}\n\`7d\` - ${stonkify(data.delta_7d)}\n\`30d\` - ${stonkify(data.delta_30d)}`)
                .setFooter('Powered by coinlib.io');
            message.channel.send(output);
        }
        const url = `https://coinlib.io/api/v1/coin?key=${config.coinlibToken}&pref=EUR&symbol=BAT`,
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            };

        fetch(url, options).then(functions.handleResponse)
            .then(handleData)
            .catch(err => functions.logError(err, message.client));

    },
};