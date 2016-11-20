import fs from "fs";
import http from "http";
import https from "https";
import xlsx from "node-xlsx";
import csv from "csv";
import df from "dateformat";

export function downloadFileFromUrl(fileName, url, retry = 3) {
	let security = /^https/i.test(url);
	let saveFile = (fileName, res)=> {
		return new Promise((resolve, reject)=> {
			let file = fs.createWriteStream(fileName, {
				flags: "w",
				autoClose: true
			});
			file.on("finish", ()=> {
				resolve(file);
			}).on("error", err=> {
				file.close(()=> {
					fs.unlink(fileName);
				});
				reject(err);
			});
			res.pipe(file);
		});
	}
	let getResponse = (url, retry = 3)=> {
		return new Promise((resolve, reject)=> {
			let requesting = ()=> {
				let request;
				let success = res=> {
					if (res.statusCode !== 200) {
						if (res.statusCode === 404) {
							reject(res.statusMessage);
						}
						else {
							if (retry > 1) {
								retry -= 1;
								requesting();
							}
							else {
								reject(res.statusMessage);
							}
						}
					}
					else {
						resolve(res);
					}
				}
				console.log(`[${retry}]begin fetch ${url}`);
				if (security) {
					request = https.get(url, success);
				}
				else {
					request = http.get(url, success);
				}
				request.on("error", err=> {
					if (retry > 1) {
						retry -= 1;
						requesting();
					}
					else {
						reject(err);
					}
				});
			}
			requesting();
		})
	}
	return getResponse(url, retry).then(res=> {
		return saveFile(fileName, res);
	}).catch(ex=> {
		console.error(ex);
	})
}

export function unicodeToUTF8Sync(str) {
	return str.replace(/&#(\d+);/g, (original, group)=> {
		return String.fromCharCode(group);
	})
}

function isShangHaiSync(stockCode) {
	return /^600/.test(stockCode)
		|| /^601/.test(stockCode)
		|| /^900/.test(stockCode)
		|| /^730/.test(stockCode)
		|| /^700/.test(stockCode)
		|| /^603/.test(stockCode);
}

export function getBourseCodeSync(stockCode, sourceApi = "yahoo") {
	switch (sourceApi) {
		case "yahoo":
			if (isShangHaiSync(stockCode)) {
				return "ss";
			}
			return "sz";
			break;
		default:
			return "ss";
	}
}

export function rmSpaceSync(str) {
	return str.replace(/ /g, "");
}

export function readXlsxSync(fileName) {
	return xlsx.parse(fs.readFileSync(fileName));
}

export function readCSV(fileName) {
	return new Promise((resolve, reject)=> {
		csv.parse(fs.readFileSync(fileName), (err, data)=> {
			if (err) {
				reject(err);
			}
			else {
				resolve(data);
			}
		});
	}).catch(ex=> {
		console.error(ex);
	})
}

export function toIntSync(value) {
	let result = parseInt(value);
	if (isNaN(result)) {
		return 0;
	}
	return result;
}

export function toMoneySync(value) {
	value = value.replace(/,/g, "");
	let result = parseFloat(value);
	if (isNaN(result)) {
		return 0.00;
	}
	return result;
}

export function toMysqlDateSync(value) {
	let date;
	if(typeof value === "string"){
		date=new Date(value);
	}
	else {
		date=value;
	}
	try {
		return df(date, "yyyy-mm-dd");
	}
	catch (ex) {
		return null;
	}
}

export function toMysqlDateTimeSync(value) {
	let date;
	if(typeof value === "string"){
		date=new Date(value);
	}
	else {
		date=value;
	}
	try {
		return df(date, "yyyy-mm-dd HH:MM:ss");
	}
	catch (ex) {
		return null;
	}
}

export function addDay(date,day=0){
	let ms;
	if(typeof date === "string"){
		ms=Date.parse(date);
	}
	else{
		ms=date.valueOf();
	}
	ms+=(day*24*60*60*1000);
	return new Date(ms);
}