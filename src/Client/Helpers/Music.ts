import { Client, Message } from '..';
import ytdl from 'ytdl-core-discord';
import { StreamDispatcher, VoiceConnection } from 'discord.js';

export class Music {
	private client: Client;
	queue: Record<string, any>[] = [];
	streamDispatcher?: StreamDispatcher = undefined;
	voiceConnection?: VoiceConnection = undefined;
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

	async start(msg: Message) {
		if (this.streamDispatcher) return 1;
		if (!msg.member?.voice?.channel) return 2;
		if (!this.queue.length) return 3;

		const currentSong = this.queue[this.currentSong];
		if (!currentSong) return 4;

		if (!this.voiceConnection) this.voiceConnection = await msg.member.voice.channel.join();
		this.streamDispatcher = this.voiceConnection.play(await ytdl(currentSong.id.videoId || currentSong.id), { type: 'opus' }).on('speaking', async s => {
			if (!s) {
				const res = await this.next();
				if (!res) {
					this.streamDispatcher?.destroy();
					this.streamDispatcher = undefined;
				}
			}
		});
		return 0;
	}

	async add(query: string) {
		const url = query.match(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/);
		const res = url
			? await this.client.helpers
					.fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${this.client.config.youtubeToken}&id=${url[1]}`)
					.catch(() => null)
			: await this.client.helpers
					.fetch(
						`https://www.googleapis.com/youtube/v3/search?part=snippet&order=viewCount&type=video&key=${this.client.config.youtubeToken}&q=${query}`
					)
					.catch(() => null);

		if (!res || !res.items || !res.items.length) return null;

		const song = res.items[0];
		this.queue.push(song);

		return song;
	}

	pause() {
		if (!this.streamDispatcher) return false;

		return this.streamDispatcher.pause();
	}

	resume() {
		if (!this.streamDispatcher) return false;

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

	async next() {
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

		this.streamDispatcher = this.voiceConnection.play(await ytdl(nextSong.id.videoId || nextSong.id), { type: 'opus' }).on('speaking', async s => {
			if (!s) {
				const res = await this.next();
				if (!res) {
					this.streamDispatcher?.destroy();
					this.streamDispatcher = undefined;
				}
			}
		});
		return true;
	}

	async previous() {
		if (!this.voiceConnection || !this.streamDispatcher) return;

		this.skips = 0;
		this.prev = 0;

		if (this.currentSong === 0) return false;
		const prevSong = this.queue[--this.currentSong];
		if (!prevSong) return false;

		this.streamDispatcher.destroy();
		this.streamDispatcher = this.voiceConnection.play(await ytdl(prevSong.id.videoId || prevSong.id), { type: 'opus' }).on('speaking', async s => {
			if (!s) {
				const res = await this.next();
				if (!res) {
					this.streamDispatcher?.destroy();
					this.streamDispatcher = undefined;
				}
			}
		});
		return true;
	}
}
