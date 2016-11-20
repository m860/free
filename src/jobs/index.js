import {getStocks} from "../business/stock.bus";
import {
	existsStockByCode,
	insertStock,
	updateStock,
	connect,
end
} from "../da/stock.da";
import {
	unicodeToUTF8Sync,
	toMoneySync,
	toMysqlDateSync,
	toMysqlDateTimeSync
} from "../utility/helper";

async function updateStockList() {
	let data = await getStocks();
	if (data) {
		let saveStock = async()=> {
			if (data.length > 0) {
				try {
					let rowData = data.shift();
					let stock = {
						CompanyCode: rowData[0],
						CompanyShortName: unicodeToUTF8Sync(rowData[1]),
						CompanyName: unicodeToUTF8Sync(rowData[2]),
						CompanyEnglishName: rowData[3],
						RegisterAddress: unicodeToUTF8Sync(rowData[4]),
						ACode: rowData[5],
						AShortName: unicodeToUTF8Sync(rowData[6]),
						ALaunchDate: toMysqlDateSync(rowData[7]),
						AGeneralCapital: toMoneySync(rowData[8]),
						AWorkingCapital: toMoneySync(rowData[9]),
						BCode: rowData[10],
						BShortName: rowData[11],
						BLaunchDate: toMysqlDateSync(rowData[12]),
						BGeneralCapital: toMoneySync(rowData[13]),
						BWorkingCapital: toMoneySync(rowData[14]),
						Area: unicodeToUTF8Sync(rowData[15]),
						Province: unicodeToUTF8Sync(rowData[16]),
						City: unicodeToUTF8Sync(rowData[17]),
						IndustryCodeOfCompany: unicodeToUTF8Sync(rowData[18]),
						Website: rowData[19],
					};
					let exists = await existsStockByCode(stock.CompanyCode);

					if (exists) {
						//update
						stock.UpdateDate = toMysqlDateTimeSync(new Date());
						await updateStock(stock);
					}
					else {
						//insert
						await insertStock(stock);
					}
					console.log(`${stock.CompanyCode} save success`);
				}
				catch(ex){
					console.log(ex);
				}
				saveStock();
			}
		}
		try {
			saveStock();
		}
		catch(ex){
			console.log(ex);
		}
	}
}

connect();

updateStockList();

end();