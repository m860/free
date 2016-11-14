import {
	downloadFileFromUrl,
	unicodeToUTF8,
	rmSpace
} from "./helper";
import path from "path";
import fs from "fs";
import xlsx from "node-xlsx";
import df from "dateformat";

export async function getStockListFromSH() {
	let basePath = path.join(__dirname, `../build/${df(new Date(), "yyyymmdd")}`);
	let url = "https://www.szse.cn/szseWeb/ShowReport.szse?SHOWTYPE=xlsx&CATALOGID=1110&tab2PAGENUM=1&ENCODE=1&TABKEY=tab2";
	if (!fs.existsSync(basePath)) {
		fs.mkdirSync(basePath);
	}
	let fileName = path.join(basePath, "sh.xlsx");
	if (!fs.existsSync(fileName)) {
		await downloadFileFromUrl(fileName, url);
	}
	let text = fs.readFileSync(fileName);
	let buffer = xlsx.parse(text);
	console.log(buffer[0].name);
	// buffer[0].data[0].forEach(value=> {
	// 	console.log(rmSpace(unicodeToUTF8(value)));
	// })
}

export async function getStockHistoryFromYahoo(stockCode, startDate, endDate = new Date()) {
	//http://blog.sina.com.cn/s/blog_7ed3ed3d010146ti.html
	let url = `http://table.finance.yahoo.com/table.csv?s=${stockCode}`;

}