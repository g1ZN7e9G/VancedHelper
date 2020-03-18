const functions = require('../../utils/functions.js');
const fetch = require('node-fetch');
const query = require('../../utils/animeQuery.js');

module.exports = {
  name: 'anime',
  description: 'Get Info about your favorite Anime series!',
  extended: 'Powered by https://graphql.anilist.co!',
  usage: '[Anime Name]',
  aliases: [],
  guildonly: false,
  developersOnly: false,
  args: true,
  category: 'Utility',
  memberPermission: '',
  botPermission: '',
  execute(message, args) {
    const variables = {
      search: args.join(' '),
      page: 1,
      perPage: 1
    };
    const url = 'https://graphql.anilist.co',
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          variables: variables
        })
      };

    function handleData(data) {
      const media = data.data.Page.media[0];
      if (!media)
        return functions.errorMessage(message, "Sorry, I wasn't able to find an anime matching your Search Term.");
      if (media.isAdult)
        return functions.errorMessage(message, "Sorry, this Anime can't be displayed, because it's NSFW!");

      const names = media.synonyms;
      if (media.title.english !== 'null' && media.title.english) names.push(media.title.english);
      if (media.title.native !== 'null' && media.title.native) names.push(media.title.native);

      const output = functions.newEmbed()
        .setTitle(media.title.romaji || media.title.english || media.title.english)
        .setThumbnail(media.coverImage.extraLarge)
        .setImage(media.bannerImage)
        .setDescription(`${media.description.replace(/<[^>]*>/gi, '')}\n[More Info can be found here!](${media.siteUrl})`)
        .addField('Other Names', names.join('\n') || '-')
        .addField('Genres', media.genres.join(', ') || '-')
        .addField('Status', media.status || '-', true)
        .addField('Average Rating', media.averageScore ? media.averageScore + '%' : '-', true)
        .addField('Format', media.format || '-', true)
        .addField('Episodes/Chapters', media.episodes || media.chapters || '-', true)
        .addField('Started on', `${functions.numToMonth(media.startDate.month)} ${media.startDate.day} ${media.startDate.year}`, true)
        .addField('Finished on', media.endDate.month ? `${functions.numToMonth(media.endDate.month)} ${media.endDate.day} ${media.endDate.year}` : '-', true);
      message.channel.send(output);
    }

    fetch(url, options).then(functions.handleResponse)
      .then(handleData)
      .catch(err => functions.logError(err, message.client));
  }
};