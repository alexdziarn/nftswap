var axios = require("axios").default;
import https from 'https';
const url = 'https://opensea.io/collection/'; //'https://opensea.io/rankings'  //could do another API like: 'https://api.opensea.io/api/v1/assets' 

interface Collection {
	address: string,
	price: number
}

export function price_fetch(name: string): string[] {
		 
	const stat_array: string[] = [];
	const usable_url = url + name
	console.log(url);
	
	var options = {
  		method: 'POST',
  		url: 'https://scrapeninja.p.rapidapi.com/scrape',
  		headers: {
    		'content-type': 'application/json',
    		'X-RapidAPI-Host': 'scrapeninja.p.rapidapi.com',
    		'X-RapidAPI-Key': 'INSERT KEY' // TODO set up env variables 
  		},
  		data: {url: usable_url}
	};

	axios.request(options).then(function (res: any) {
				
		const body = res.data.body;
		const search_term = 'Overflowreact__OverflowContainer-sc-7qr9y8-0 jPSCbX'; // class name used divs of the 'main' 4 stats
		let tracker = 0;
		for(let i = 0; i<body.length; i++) {

			if(body.charAt(i) == search_term.charAt(tracker)) {
				tracker++;
				if(tracker == search_term.length) {
					stat_array.push(body.substring(i+17, i+25).replace(/[^\d.-]/g, '')); // TODO: change from hardcoded html grab					
					tracker = 0;
					if(stat_array.length == 4) break;
				}
			} else {
				tracker = 0;
			}
		}
	console.log("items: " +  stat_array[0]);
	console.log("owners: " + stat_array[1]);
	console.log("floor price: " + stat_array[2]);
	console.log("volume traded: " + stat_array[3]);

	const obj = collectionConstructor(name, stat_array[2])	

	}).catch(function (error: any) {
		console.error(error);
	});

	return stat_array;
}

function collectionConstructor(name: string, price: string) {
	return {
		address: name,
		price: Number.parseFloat(price)
	}
}
