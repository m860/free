import fs from "fs";
import path from "path";
import readline from "readline";
import walk from "walk";
import {error} from "../utility/logHelper";
import {insertStockPrices} from "../da/stock.da";
import {walkArray,toMysqlDateSync,toMoneySync,toIntSync} from "../utility/helper";

export function getRecordsFromText(fileName, format = (line)=> {
	return line.split(",");
}) {
	return new Promise((resolve, reject)=> {
		let records = [];
		let input = fs.createReadStream(fileName);
		let lineReader = readline.createInterface({input});
		lineReader.on("line", (line)=> {
			records.push(format(line));
		});
		lineReader.on("close", err=> {
			resolve(records);
		})
	})
}

export function getAllDataFiles(folder) {
	return new Promise((resolve, reject)=> {
		let walker = walk.walk(folder, {
			followLinks: false
		});
		let files = [];
		walker.on("file", (root, fileStats, next)=> {
			if(/txt$/i.test(fileStats.name)) {
				files.push(path.join(root, fileStats.name));
			}
			next();
		});
		walker.on("errors", (root, nodeStatsArray, next)=> {
			error(nodeStatsArray);
			next();
		});
		walker.on("end", ()=> {
			resolve(files);
		})
	});
}

function convertRowsToPrices(rows,companyCode){
	return rows.map(item=> {
		return {
			CompanyCode: companyCode,
			Date: toMysqlDateSync(item[0]),
			Open: toMoneySync(item[1]),
			High: toMoneySync(item[2]),
			Low: toMoneySync(item[3]),
			Close: toMoneySync(item[4]),
			Volume: toIntSync(item[5]),
			AdjClose: 0,
			Amount:toMoneySync(item[6])
		};
	});
}

function getCompanyCodeFromFileName(fileName){
	let index=fileName.indexOf("#");
	let str=fileName.substring(index+1);
	return str.replace(/\..*$/,"");
}

const historyPath = path.join(__dirname, "../../../../../Downloads/history");

async function main(){
	console.log(`begin import ......`);
	let files=await getAllDataFiles(historyPath);
	console.log(`find ${files.length} file`);
	console.log(`begin insert ......`);
	// files=files.filter(name=>/603819.txt$/.test(name));
	walkArray(files,fileName=>{
		console.log(`get records from ${fileName}`);
		return getRecordsFromText(fileName,line=>{
			return line.split(/[ \t]+/g);
		}).then(rows=>{
			rows.shift();
			rows.shift();
			rows.pop();
			console.log(`find ${rows.length} records`);
			// rows=rows.slice(3320,3330);
			if(rows.length>0) {
				return insertStockPrices(convertRowsToPrices(rows, getCompanyCodeFromFileName(fileName)));
			}
		})
	})
}

main();
