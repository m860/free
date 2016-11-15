import {
	downloadFileFromUrl,
	unicodeToUTF8Sync,
	rmSpaceSync,
	readXlsxSync,
	getBourseCodeSync,
	readCSV
} from "./helper";
import path from "path";
import fs from "fs";
import df from "dateformat";

const basePath = path.join(__dirname, `../build/${df(new Date(), "yyyymmdd")}`);

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

export async function downloadStockListFromYahoo(stockCode, startDate, endDate = new Date()) {
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
	let fileName = path.join(basePath, `${code}.csv`);
	if (!fs.existsSync(fileName)) {
		await downloadFileFromUrl(fileName, url);
	}
	// let datas = await readCSV(fileName);
	// if(datas.length>0){
	// 	datas.shift();
	// 	return datas;
	// }
	// return null;
}