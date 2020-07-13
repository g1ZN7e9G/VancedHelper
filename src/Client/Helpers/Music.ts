import { Message, Client } from '..';
import ytdl from 'ytdl-core-discord';
import { StreamDispatcher, VoiceConnection, TextChannel } from 'discord.js';
import { Song } from '../Interfaces';
import { stripIndents } from 'common-tags';

export class Music {
	private client: Client;
	queue: Song[] = [];
	streamDispatcher?: StreamDispatcher = undefined;
	voiceConnection?: VoiceConnection = undefined;
	textChannel?: TextChannel = undefined;
	leaveTimeout?: ReturnType<typeof setTimeout> = undefined;
	paused = false;
	currentSong = 0;
	skips = 0;
	prev = 0;

	constructor(client: Client) {
		this.client = client;
	}

	private async play(song: Song, auto = false) {
		try {
			this.streamDispatcher = this.voiceConnection!.play(await ytdl(song.url), { type: 'opus' })
				.on(`finish`, async () => {
					if (!this.paused) {
						const res = await this.next(true);
						if (!res) {
							this.streamDispatcher?.destroy();
							this.streamDispatcher = undefined;
						}
					}
				})
				.on('error', this.client.handleError);
		} catch {
			this.textChannel?.send(`Something went wrong while playing ${song.title}.`);
			this.queue.splice(this.queue.indexOf(song), 1);
			this.next(true);
			return false;
		}

		if (auto) this.textChannel?.send(`Now playing \`${song.title}\``);

		return true;
	}

	get playing() {
		return !!this.streamDispatcher && !!this.voiceConnection;
	}

	get nowPlaying() {
		if (!this.playing) return false;
		return this.queue[this.currentSong];
	}

	secondsToTime(seconds: number | string) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		const date = new Date(null);
		seconds = typeof seconds === 'number' ? seconds : parseInt(seconds);
		date.setSeconds(seconds);
		return seconds > 3600 ? date.toISOString().substr(11, 8) : date.toISOString().substr(14, 5);
	}

	songEmbed(song: Song) {
		return this.client
			.newEmbed(`INFO`)
			.setImage(song.thumbnail)
			.setAuthor(song.author.name, song.author.avatar)
			.setTitle(song.title)
			.setURL(song.url)
			.setDescription(
				stripIndents`
					Duration: \`${this.secondsToTime(song.length)}\`
					Playing in: \`${this.secondsToTime(
						this.queue.slice(this.currentSong, this.queue.indexOf(song)).reduce((x, y) => x + parseInt(y.length), 0) -
							this.streamDispatcher!.streamTime / 1000
					)}\`
					Spot in queue: ${this.queue.indexOf(song) + 1}
					Added by: ${song.addedBy.name}`
			);
	}

	async start(msg: Message) {
		if (this.streamDispatcher) return 1;
		if (!msg.member?.voice?.channel) return 2;
		if (!this.queue.length) return 3;

		const currentSong = this.queue[this.currentSong];
		if (!currentSong) return 4;

		this.textChannel = msg.channel as TextChannel;
		if (!this.voiceConnection) this.voiceConnection = await msg.member.voice.channel.join();

		return this.play(currentSong);
	}

	async add(query: string, msg: Message) {
		const url =
			query.match(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/)?.[0] ||
			(await this.client.helpers
				.fetch(
					`https://www.googleapis.com/youtube/v3/search?part=snippet&safeSearch=none&type=video&key=${
						this.client.config.youtubeToken
					}&q=${encodeURIComponent(query)}`
				)
				.then(res => res.items[0].id.videoId)
				.catch(() => null));

		if (!url) return null;
		const res = await ytdl.getInfo(url).catch(() => null);

		if (!res) return null;

		const song: Song = {
			title: res.title,
			author: {
				name: res.author.name,
				avatar: res.author.avatar
			},
			url: res.video_url,
			length: res.length_seconds,
			thumbnail: res.player_response.videoDetails.thumbnail.thumbnails.last()?.url,
			addedBy: {
				name: msg.member?.displayName || msg.author.username,
				id: msg.author.id
			}
		};

		this.queue.push(song);

		return song;
	}

	pause() {
		if (!this.streamDispatcher) return false;

		this.paused = true;

		return this.streamDispatcher.pause();
	}

	resume() {
		if (!this.streamDispatcher) return false;

		this.paused = false;

		return this.streamDispatcher.resume();
	}

	clear() {
		this.queue = [];
		this.currentSong = 0;
		this.streamDispatcher?.destroy();
		this.streamDispatcher = undefined;
	}

	stop() {
		this.clear();
		this.voiceConnection?.disconnect();
		this.voiceConnection = undefined;
	}

	skip(force: boolean) {
		if (!this.voiceConnection) return false;

		if (force) return this.next();

		const neededSkips = Math.round(this.voiceConnection.channel.members.size / 2);
		if (neededSkips > ++this.skips) return `${this.skips}/${neededSkips}`;

		return this.next();
	}

	back(force: boolean) {
		if (!this.voiceConnection) return false;

		if (force) return this.previous();

		const neededSkips = Math.round(this.voiceConnection.channel.members.size / 2);
		if (neededSkips > ++this.prev) return `${this.prev}/${neededSkips}`;

		return this.previous();
	}

	async next(auto = false) {
		if (!this.voiceConnection) return;

		this.skips = 0;
		this.prev = 0;

		if (this.currentSong === this.queue.length + 1) return false;
		const nextSong = this.queue[++this.currentSong];

		this.streamDispatcher?.destroy();
		if (!nextSong) {
			this.streamDispatcher = undefined;
			return true;
		}

		return this.play(nextSong, auto);
	}

	async previous(auto = false) {
		if (!this.voiceConnection) return;

		this.skips = 0;
		this.prev = 0;

		if (this.currentSong === 0) return false;
		const prevSong = this.queue[--this.currentSong];
		if (!prevSong) return false;

		this.streamDispatcher?.destroy();

		return this.play(prevSong, auto);
	}
}
