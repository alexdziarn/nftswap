//import axios from 'axios';
import https from 'https';
const http2 = require('http2');
const url = 'opensea.io' 
const tesUrl = 'www.google.com'
//const AxiosInstance = axios.create();  

const session = http2.connect('https://opensea.io')

// If there is any error in connecting, log it to the console
session.on('error', (err: any) => console.error(err))

const req = session.request({ ':path': '/' })
// since we don't have any more data to send as
// part of the request, we can end it
req.end()

// This callback is fired once we receive a response
// from the server
req.on('response', (headers: any) => {
  // we can log each response header here
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`)
  }
})


const options = {
   hostname: url,
    path: '/',
    headers: {
        'X-Forwarded-For': 'xxx',
     	'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:97.0) Gecko/20100101 Firefox/97.0',
        //'Connection': 'keep-alive',
	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8', //text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8' 
    	'Sec-Fetch-Dest': 'document',
	'Sec-Fetch-Mode': 'navigate',
	'Sec-Fetch-Site': 'none',
	'Sec-Fetch-User': '?1',
    	//Host: opensea.io
//User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:97.0) Gecko/20100101 Firefox/97.0
//Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
	'Accept-Language': 'en-US,en;q=0.5',
'Accept-Encoding': 'gzip, deflate, br',
//Connection: keep-alive
'Cookie': '_ga=GA1.2.1578885966.1646605726; _gid=GA1.2.116214819.1646605726; __cf_bm=EVFQngg_5fQMlqG4nCaYeEhPzIuMXDnKL4WA.fwaFuM-1646612659-0-ARw1uhyQ9fzBgSTbf+R7+/pq7uC/v7bKlIzZ0j0H2pTKnVUAtAsqVuqSFH4r2mAyT0botdJfyqYS/c11a+Jv0pA=; amp_ddd6ec=Jav3jhfYSedpM2pyYySNyu...1ftgs835u.1ftgs8id9.g.e.u; _gcl_au=1.1.580336215.1646608905; _ga_9VSBF2K4BX=GS1.1.1646608904.1.1.1646612712.0; _fbp=fb.1.1646608906116.675099535; _dd_s=rum=0&expire=1646613687538',
'Upgrade-Insecure-Requests': '1'
    }
}

function priceFetch( nfts: any[]): string[] {
	
	const prices: string[] = [];	

	for( let nft of nfts ) {

		https.get(options,
	(res) => {
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
