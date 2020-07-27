interface Date {
	/**
	 * Formats to Feb 30th 2020
	 */
	formatDate(): string;
	/**
	 * Formats to 04:20:18
	 */
	formatTime(): string;
	/**
	 * How long ago this timestamp was, human readable, e.g. 31 days or 17 minutes
	 */
	age(): string;
}

Date.prototype.formatDate = function () {
	return `${
		['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][this.getMonth()]
	} ${this.getDate().toOrdinal()} ${this.getFullYear()}`;
};

Date.prototype.formatTime = function () {
	return `${this.getUTCHours().addZero()}:${this.getUTCMinutes().addZero()}:${this.getUTCSeconds().addZero()} UTC`;
};

const msToHuman = (ms: number) => {
	const seconds = Math.round(ms / 1000),
		minutes = Math.round(ms / (1000 * 60)),
		hours = Math.round(ms / (1000 * 60 * 60)),
		days = Math.round(ms / (1000 * 60 * 60 * 24));

	if (seconds < 60) return seconds + ' seconds';
	else if (minutes < 60) return minutes + ' minutes';
	else if (hours < 24) return hours + ' hours';
	else return days + ' days';
};

Date.prototype.age = function () {
	const age = Date.now() - this.getTime();
	return msToHuman(age);
};
