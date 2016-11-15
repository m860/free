import {
	downloadStockListFromYahoo,
	getStocks
} from "./stock";

async function run() {
	let list = await getStocks();
	if (list) {
		console.log(`stock total is ${list.length}`);
		let download = async()=> {
			if (list.length > 0) {
				let stock = list.shift();
				console.log(`stock code : ${stock[0]}`)
				await downloadStockListFromYahoo(stock[0]);
				download();
			}
		};
		download();
	}
	else{
		console.log(`stock list is empty`);
	}
}

run();