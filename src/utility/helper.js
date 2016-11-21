import fs from "fs";
import http from "http";
import https from "https";
import xlsx from "node-xlsx";
import csv from "csv";
import df from "dateformat";
import {error} from "./logHelper";

export function downloadFileFromUrl(fileName, url, retry = 3) {
	let security = /^https/i.test(url);
	let saveFile = (fileName, res)=> {
		return new Promise((resolve, reject)=> {
			let file = fs.createWriteStream(fileName, {
				flags: "w",
				autoClose: true
			});
			file.on("finish", ()=> {
				console.log(`save file to ${fileName} is success`);
				resolve(file);
			}).on("error", err=> {
				file.close(()=> {
					fs.unlink(fileName);
				});
				console.log(`save file to ${fileName} occur a error`, err);
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
							console.log(`not found file from ${url}`);
							reject(res.statusMessage);
						}
						else {
							if (retry > 1) {
								retry -= 1;
								requesting();
							}
							else {
								console.log(`downloading file occur a error from ${url}`, res.statusMessage);
								reject(res.statusMessage);
							}
						}
					}
					else {
						console.log(`downloading file is success from ${url}`);
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
					console.log(`request error`, err);
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
				console.error(`read CSV occur error from ${fileName}`, err);
				reject(err);
			}
			else {
				resolve(data);
			}
		});
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
	if (typeof value === "string") {
		date = new Date(value);
	}
	else {
		date = value;
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
	if (typeof value === "string") {
		date = new Date(value);
	}
	else {
		date = value;
	}
	try {
		return df(date, "yyyy-mm-dd HH:MM:ss");
	}
	catch (ex) {
		return null;
	}
}

export function addDay(date, day = 0) {
	let ms;
	if (typeof date === "string") {
		ms = Date.parse(date);
	}
	else {
		ms = date.valueOf();
	}
	ms += (day * 24 * 60 * 60 * 1000);
	return new Date(ms);
}

export function dateAdd(date: Date|String, expr:Number, type: "second"|"minute"|"hour"|"day"|"month"|"year") {
	let ms;
	if (typeof date === "string") {
		ms = Date.parse(date);
	}
	else {
		ms = date.valueOf();
	}
	let unit;
	switch (type.toLowerCase()) {
		case "year":
			unit=365*24*60*60*1000;
			break;
		case "month":
			unit=30*24*60*60*1000;
			break;
		case "day":
			unit=24*60*60*1000;
			break;
		case "hour":
			unit=60*60*1000;
			break;
		case "minute":
			unit=60*1000;
			break;
		case "second":
			unit=1000;
			break;
		default:
			unit = 1;
	}
	ms+=(unit*expr);
	return new Date(ms);
}