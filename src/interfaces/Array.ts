interface Array<T> {
	/**
	 * Get n random elements from an array
	 * @param n Number of random elements to retrieve
	 */
	random(): T;
	random(n: number): T[];
}

Array.prototype.random = function (n?: number) {
	const res = this.sort(() => 0.5 - Math.random()).slice(0, n || 1);
	return n ? res : res[0];
};
