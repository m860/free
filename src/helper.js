import fs from "fs";
import http from "http";
import https from "https";
import xlsx from "node-xlsx";
import csv from "csv";

export function downloadFileFromUrl(fileName, url, retry = 3) {
	let security = /^https/i.test(url);
	let saveFile=(fileName,res)=>{
		return new Promise((resolve, reject)=> {
			let file = fs.createWriteStream(fileName, {
				flags: "w",
				autoClose:true
			});
			file.on("finish", ()=> {
				resolve(file);
			}).on("error", err=> {
				file.close(()=>{
					fs.unlink(fileName);
				});
				reject(err);
			});
			res.pipe(file);
		});
	}
	let getResponse=(url,retry=3)=>{
		return new Promise((resolve,reject)=>{
			let requesting=()=>{
				let request;
				let success=res=>{
					if(res.statusCode!==200){
						if(res.statusCode===404){
							reject(res.statusMessage);
						}
						else{
							if(retry>1){
								retry-=1;
								requesting();
							}
							else{
								reject(res.statusMessage);
							}
						}
					}
					else{
						resolve(res);
					}
				}
				console.log(`[${retry}]begin fetch ${url}`);
				if(security){
					request=https.get(url,success);
				}
				else{
					request=http.get(url,success);
				}
				request.on("error",err=>{
					if(retry>1){
						retry-=1;
						requesting();
					}
					else{
						reject(err);
					}
				});
			}
			requesting();
		})
	}
	return getResponse(url,retry).then(res=>{
		return saveFile(fileName,res);
	}).catch(ex=>{
		console.error(ex);
	})
}

export function unicodeToUTF8(str) {
	return str.replace(/&#(\d+);/g, (original, group)=> {
		return String.fromCharCode(group);
	})
}

export function rmSpace(str) {
	return str.replace(/ /g, "");
}

export function readXlsx(fileName) {
	return xlsx.parse(fs.readFileSync(fileName));
}

export function readCSV(fileName) {
	return new Promise((resolve, reject)=> {
		csv.parse(fs.readFileSync(fileName), (err, data)=> {
			if (err) {
				console.error(err);
				reject(err);
			}
			else {
				resolve(data);
			}
		});
	})
}