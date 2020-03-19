const functions = require('../../utils/functions.js');
module.exports = {
    name: 'download',
    description: 'Sends all the official download mirrors.',
    usage: ' ',
    aliases: ['mirrors', 'links', 'sources', 'dl'],
    guildonly: false,
    developersOnly: false,
    args: false,
    modCommand: false,
    category: 'Vanced',
    execute(message) {
        const output = functions.newEmbed()
            .addFields([
                { name: 'Discord', value: 'Just download from <#517803059821281280>' },
                { name: 'Official Website', value: '[Vanced.app](https://vanced.app/nonroot)' },
                { name: 'AndroidFileHost', value: '[Youtube Vanced](https://androidfilehost.com/?w=files&flid=294874) - [Vanced MicroG](https://androidfilehost.com/?w=files&flid=294875)' },
                { name: 'Mediafire', value: '[Youtube Vanced](https://www.mediafire.com/folder/773e97cz2ezx1/AddFree_Youtube_BackgroundPlay_Enabled#tipud73tn4lo1) - [Vanced MicroG](https://www.mediafire.com/folder/773e97cz2ezx1/AddFree_Youtube_BackgroundPlay_Enabled#qdy8ps6d9sho7)' }
            ])
            .setThumbnail('https://i.imgur.com/mFkZnUB.png')
            .setTitle('Official Mirrors');

        return message.channel.send(output);
    },
};