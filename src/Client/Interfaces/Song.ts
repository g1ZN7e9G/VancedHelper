export interface Song {
	title: string;
	url: string;
	length: string;
	thumbnail: string;
	author: {
		name: string;
		avatar: string;
	};
	addedBy: {
		name: string;
		id: string;
	};
}
