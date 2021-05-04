/* eslint-disable no-extend-native */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unused-vars */

interface String {
	/**
	 * Shorten a string
	 * @param length The maximum length the string may have
	 */
	shorten(length: number): string;
	/**
	 * Turn a string into a codeblock
	 * @param language The language. Defaults to ts
	 */
	toCodeblock(language?: string): string;

	/**
	 * Capitalises the first letter of each word, e.g. lOgAn PAUL => Logan Paul
	 */
	toTitleCase(): string;

	/**
	 * Escape all sorts of markdown
	 */
	escapeMarkdown(): string;

	/**
	 * Replaces all `{KEYS}` with the values provided in the object
	 * @param obj an object containing all key value pairs
	 */
	substitute(obj: Record<string, string>): string;
}

String.prototype.shorten = function (length: number) {
	return (this.length > length ? `${this.substring(0, length - 3)}...` : this).toString();
};

String.prototype.toCodeblock = function (language?: string) {
	return `\`\`\`${language ?? ''}\n${this.toString()}\`\`\``;
};

String.prototype.toTitleCase = function () {
	return this.split(/[\s_]+/)
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
};

String.prototype.escapeMarkdown = function () {
	return this.replace(/\\(\*|_|`|~|\\)/g, '$1').replace(/(\*|_|`|~|\\)/g, '\\$1');
};

String.prototype.substitute = function (obj: Record<string, string>) {
	let str = this.toString();
	for (const prop in obj) {
		if (prop.toUpperCase() === prop) str = str.replace(new RegExp(`{${prop}}`, 'g'), obj[prop]);
	}
	return str;
};
