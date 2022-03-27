var axios = require("axios").default;
import https from 'https';
const url = 'https://opensea.io/rankings'  //could do another API like: 'https://api.opensea.io/api/v1/assets' 

function priceFetch( nfts: any[]): string[] {
	
	const prices: string[] = [];	
        
	console.log(url);

	var options = {
  		method: 'POST',
  		url: 'https://scrapeninja.p.rapidapi.com/scrape',
  		headers: {
    		'content-type': 'application/json',
    		'X-RapidAPI-Host': 'scrapeninja.p.rapidapi.com',
    		'X-RapidAPI-Key': 'f474913de8msh02641f9cd5b4ce2p1ad271jsn9dcc053d6f1c'
  	},
  		data: {url: url}
	};

	axios.request(options).then(function (response: any) {
		console.log(response.data);
	}).catch(function (error: any) {
		console.error(error);
	});
	
	return prices
}


if (require.main === module) {
    priceFetch([0]);
}
