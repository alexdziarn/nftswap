//import axios from 'axios';
import https from 'https';
const url = 'https://api.opensea.io/api/v1/assets' 
const tesUrl = 'https://www.google.com'
//const AxiosInstance = axios.create();  

function priceFetch( nfts: any[]): string[] {
	
	const prices: string[] = [];	

	for( let nft of nfts ) {

		https.get(url, (res) => {
  			console.log('statusCode:', res.statusCode);
  			//console.log('headers:', res.headers);

  			//res.on('data', (d) => {
    			//process.stdout.write(d);
  		}).on('error', (e) => {
  			console.error(e);
		});
		/* AxiosInstance.get(url)
  		   .then( // for each nft grab html of page with price
    			response => {
      				const html = response.data; 
      				console.log(html);
			}).catch(console.error);
	}	
        */
	}
	return prices
}


if (require.main === module) {
    priceFetch([0]);
}
