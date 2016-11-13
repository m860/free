import {
	downloadFileFromUrl,
	unicodeToUTF8,
	rmSpace
} from "./helper";
import path from "path";
import fs from "fs";
import xlsx from "node-xlsx";

export async function getStockListFromSH() {
	let basePath = path.join(__dirname, "../build/data");
	let url = "https://www.szse.cn/szseWeb/ShowReport.szse?SHOWTYPE=xlsx&CATALOGID=1110&tab2PAGENUM=1&ENCODE=1&TABKEY=tab2";
	if (!fs.existsSync(basePath)) {
		fs.mkdirSync(basePath);
	}
	let fileName = path.join(basePath, "sh.xlsx");
	console.log(`path=${fileName}`);
	let file, text;
	if (fs.existsSync(fileName)) {
		let stat = fs.lstatSync(fileName);
		let birthtimeValue = stat.birthtime.valueOf();
		let expiretimeValue = birthtimeValue + 24 * 60 * 60 * 1000;
		if (Date.now() > expiretimeValue) {
			file = await downloadFileFromUrl(fileName, url);
			text = fs.readFileSync(file);
		}
		else {
			text = fs.readFileSync(fileName);
		}
	}
	else {
		file = await downloadFileFromUrl(fileName, url);
		text = fs.readFileSync(file);
	}
	let buffer = xlsx.parse(text);
	console.log(buffer[0].name);
	buffer[0].data[0].forEach(value=> {
		console.log(rmSpace(unicodeToUTF8(value)));
	})
}

export function getStockHistoryFromYahoo(stockCode){
	//http://blog.sina.com.cn/s/blog_7ed3ed3d010146ti.html
	let url=`http://table.finance.yahoo.com/table.csv?s=${stockCode}`;
	let file
}