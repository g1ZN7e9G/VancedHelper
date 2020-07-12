import { Message, Client } from '..';
import ytdl from 'ytdl-core-discord';
import { videoInfo } from 'ytdl-core';
import { StreamDispatcher, VoiceConnection, TextChannel } from 'discord.js';

export class Music {
	private client: Client;
	queue: videoInfo[] = [];
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

	get playing() {
		return !!this.streamDispatcher && !!this.voiceConnection;
	}

	get nowPlaying() {
		if (!this.streamDispatcher || !this.voiceConnection) return false;
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

	songEmbed(song: videoInfo) {
		return this.client
			.newEmbed(`INFO`)
			.setImage(song.player_response.videoDetails.thumbnail.thumbnails.last()?.url)
			.setAuthor(song.author.name, song.author.avatar)
			.setTitle(song.title)
			.setURL(song.video_url)
			.setTimestamp(new Date(song.timestamp))
			.setDescription(`Duration: \`${this.secondsToTime(song.length_seconds)}\``);
	}

	async start(msg: Message) {
		if (this.streamDispatcher) return 1;
		if (!msg.member?.voice?.channel) return 2;
		if (!this.queue.length) return 3;

		const currentSong = this.queue[this.currentSong];
		if (!currentSong) return 4;

		this.textChannel = msg.channel as TextChannel;
		if (!this.voiceConnection) this.voiceConnection = await msg.member.voice.channel.join();

		this.streamDispatcher = this.voiceConnection.play(await ytdl(currentSong.video_url), { type: 'opus' }).on('speaking', async s => {
			if (!s && !this.paused) {
				const res = await this.next(true);
				if (!res) {
					this.streamDispatcher?.destroy();
					this.streamDispatcher = undefined;
				}
			}
		});
		return 0;
	}

	async add(query: string) {
		const url =
			query.match(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/)?.[0] ||
			(await this.client.helpers
				.fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&order=viewCount&type=video&key=${this.client.config.youtubeToken}&q=${query}`)
				.then(res => res.items[0].id.videoId)
				.catch(() => null));

		if (!url) return null;
		const res = await ytdl.getInfo(url).catch(() => null);

		if (!res) return null;

		this.queue.push(res);

		return res;
	}

	pause = () => {
		if (!this.streamDispatcher) return false;

		this.paused = true;

		return this.streamDispatcher.pause();
	};

	resume = () => {
		if (!this.streamDispatcher) return false;

		this.paused = false;

		return this.streamDispatcher.resume();
	};

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
		if (!this.streamDispatcher || !this.voiceConnection) return false;

		if (force) return this.next();

		const neededSkips = Math.round(this.voiceConnection.channel.members.size / 2);
		if (neededSkips > ++this.skips) return `${this.skips}/${neededSkips}`;

		return this.next();
	}

	back(force: boolean) {
		if (!this.streamDispatcher || !this.voiceConnection) return false;

		if (force) return this.previous();

		const neededSkips = Math.round(this.voiceConnection.channel.members.size / 2);
		if (neededSkips > ++this.prev) return `${this.prev}/${neededSkips}`;

		return this.previous();
	}

	async next(auto = false) {
		if (!this.voiceConnection || !this.streamDispatcher) return;

		this.skips = 0;
		this.prev = 0;

		if (this.currentSong === this.queue.length + 1) return false;
		const nextSong = this.queue[++this.currentSong];

		this.streamDispatcher.destroy();
		if (!nextSong) {
			this.streamDispatcher = undefined;
			return true;
		}

		this.streamDispatcher = this.voiceConnection.play(await ytdl(nextSong.video_url), { type: 'opus' }).on('speaking', async s => {
			if (!s && !this.paused) {
				const res = await this.next(true);
				if (!res) {
					this.streamDispatcher?.destroy();
					this.streamDispatcher = undefined;
				}
			}
		});

		if (auto) this.textChannel?.send(`Now playing \`${nextSong.title}\``);
		return true;
	}

	async previous(auto = false) {
		if (!this.voiceConnection || !this.streamDispatcher) return;

		this.skips = 0;
		this.prev = 0;

		if (this.currentSong === 0) return false;
		const prevSong = this.queue[--this.currentSong];
		if (!prevSong) return false;

		this.streamDispatcher.destroy();
		this.streamDispatcher = this.voiceConnection.play(await ytdl(prevSong.video_url), { type: 'opus' }).on('speaking', async s => {
			if (!s && !this.paused) {
				const res = await this.next(true);
				if (!res) {
					this.streamDispatcher?.destroy();
					this.streamDispatcher = undefined;
				}
			}
		});
		if (auto) this.textChannel?.send(`Now playing \`${prevSong.title}\``);
		return true;
	}
}
