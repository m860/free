import {
	getStocks,
	getLastPriceByCode,
	insertStockPrices
} from "../../da/stock.da";
import {
	getStockPricesFromYahoo
} from "../../business/stock.bus";
import {
	toMysqlDateSync,
	toMoneySync,
	toIntSync,
	addDay
} from "../../utility/helper"
import {error} from "../../utility/logHelper";


export default async function updateStockPrices() {
	let stocks = await getStocks();
	let updatePrice = async()=> {
		if (stocks.length > 0) {
			let stock = stocks.shift();
			let lastPrice = await getLastPriceByCode(stock.CompanyCode);
			let priceArr;
			if (lastPrice) {
				priceArr = await getStockPricesFromYahoo(stock.CompanyCode, addDay(lastPrice.Date, 1));
			}
			else {
				priceArr = await getStockPricesFromYahoo(stock.CompanyCode)
			}
			let prices = priceArr.map(item=> {
				return {
					CompanyCode: stock.CompanyCode,
					Date: toMysqlDateSync(item[0]),
					Open: toMoneySync(item[1]),
					High: toMoneySync(item[2]),
					Low: toMoneySync(item[3]),
					Close: toMoneySync(item[4]),
					Volume: toIntSync(item[5]),
					AdjClose: toMoneySync(item[6]),
				};
			});
			await insertStockPrices(prices);
			console.log(`${stock.CompanyCode} price insert success , total=${prices.length}`);
			updatePrice();
		}
	}
	try {
		updatePrice();
	}
	catch (ex) {
		error(ex);
		updatePrice();
	}
}