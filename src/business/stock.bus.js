import {
	downloadFileFromUrl,
	unicodeToUTF8Sync,
	rmSpaceSync,
	readXlsxSync,
	getBourseCodeSync,
	readCSV
} from "../utility/helper";
import path from "path";
import fs from "fs";
import df from "dateformat";

const basePath = path.join(__dirname, `../../build/${df(new Date(), "yyyymmdd")}`);

if (!fs.existsSync(basePath)) {
	fs.mkdirSync(basePath);
}

export async function downloadAStock(fileName) {
	let url = "https://www.szse.cn/szseWeb/ShowReport.szse?SHOWTYPE=xlsx&CATALOGID=1110&tab2PAGENUM=1&ENCODE=1&TABKEY=tab2";
	if (!fs.existsSync(fileName)) {
		await downloadFileFromUrl(fileName, url);
	}
}

export async function getStocks() {
	let fileName = path.join(basePath, "sh.xlsx");
	await downloadAStock(fileName);
	let datas = readXlsxSync(fileName);
	if (datas.length > 0) {
		datas[0].data.shift();
		return datas[0].data;
	}
	return null;
}

export async function getStockPricesFromYahoo(stockCode, startDate, endDate = new Date()) {
	//http://blog.sina.com.cn/s/blog_7ed3ed3d010146ti.html
	//http://table.finance.yahoo.com/table.csv?s=600000.ss
	//http://table.finance.yahoo.com/table.csv?s=002673.ss
	let url;
	let code = `${stockCode}.${getBourseCodeSync(stockCode)}`;
	if (startDate) {
		url = `http://table.finance.yahoo.com/table.csv?s=${code}&a=${startDate.getMonth()}&b=${startDate.getDate()}&c=${startDate.getFullYear()}&d=${endDate.getMonth()}&e=${endDate.getDate()}&f=${endDate.getFullYear()}`;
	}
	else {
		url = `http://table.finance.yahoo.com/table.csv?s=${code}`;
	}
	let fileName ;
	if(startDate){
		fileName = path.join(basePath, `${code}-${df(startDate,"yyyy-mm-dd")}.csv`);
	}
	else{
		fileName = path.join(basePath, `${code}.csv`);
	}
	if (!fs.existsSync(fileName)) {
		await downloadFileFromUrl(fileName, url);
	}
	let datas = await readCSV(fileName);
	if(datas && datas.shift) {
		datas.shift();
	}
	return datas;
}

// export async function downloadAll() {
// 	let list = await getStocks();
// 	if (list) {
// 		console.log(`stock total is ${list.length}`);
// 		let download = async()=> {
// 			if (list.length > 0) {
// 				let stock = list.shift();
// 				console.log(`stock code : ${stock[0]}`)
// 				await getStockPricesFromYahoo(stock[0]);
// 				download();
// 			}
// 		};
// 		download();
// 	}
// 	else{
// 		console.log(`stock list is empty`);
// 	}
// }
