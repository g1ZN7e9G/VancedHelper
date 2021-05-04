/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-extend-native */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unused-vars */

const ordinal = require('ordinal');

interface Number {
	/**
	 * 12 => 12th or 1 => 1st
	 */
	toOrdinal(): string;
	/**
	 * Add a leading 0 to numbers below 10, e.g. 7 => 07
	 */
	addZero(): string;
}

Number.prototype.toOrdinal = function () {
	return ordinal(this);
};

Number.prototype.addZero = function () {
	return this < 10 ? `0${this.toString()}` : this.toString();
};
