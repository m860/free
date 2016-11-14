import {
	downloadFileFromUrl,
	unicodeToUTF8,
	rmSpace,
	readXlsx,
readCSV
} from "./helper";
import path from "path";
import fs from "fs";
import df from "dateformat";

const basePath=path.join(__dirname, `../build/${df(new Date(), "yyyymmdd")}`);

if (!fs.existsSync(basePath)) {
	fs.mkdirSync(basePath);
}

export async function getStockListFromSH() {
	let url = "https://www.szse.cn/szseWeb/ShowReport.szse?SHOWTYPE=xlsx&CATALOGID=1110&tab2PAGENUM=1&ENCODE=1&TABKEY=tab2";
	let fileName = path.join(basePath, "sh.xlsx");
	if (!fs.existsSync(fileName)) {
		await downloadFileFromUrl(fileName, url);
	}
	let datas = readXlsx(fileName);
	console.log(datas[0].name);
	// buffer[0].data[0].forEach(value=> {
	// 	console.log(rmSpace(unicodeToUTF8(value)));
	// })
}

export async function getStockHistoryFromYahoo(stockCode, startDate, endDate = new Date()) {
	//http://blog.sina.com.cn/s/blog_7ed3ed3d010146ti.html
	//http://table.finance.yahoo.com/table.csv?s=600000.ss
	//http://table.finance.yahoo.com/table.csv?s=002673.ss
	let url = `http://table.finance.yahoo.com/table.csv?s=${stockCode}`;
	let fileName=path.join(basePath,`${stockCode}.csv`);
	if(!fs.existsSync(fileName)){
		await downloadFileFromUrl(fileName,url);
	}
	/*
	try {
		let datas = await readCSV(fileName);
		console.log(datas[0]);
		console.log(datas[1]);
	}
	catch(ex){
		console.log(ex);
	}
	*/
}