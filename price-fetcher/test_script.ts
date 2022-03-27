import {price_fetch} from './app';

function grabNewPrices(name: string): void {
	const arr = price_fetch(name);
}

if (require.main === module) {
    grabNewPrices('world-of-women-galaxy'); // TODO remove first parameter, it is for testing
}
