import fs from "fs";
import http from "http";
import https from "https";
import xlsx from "node-xlsx";
import csv from "csv";

export function downloadFileFromUrl(fileName,url){
	let security=/^https/i.test(url);
	return new Promise((resolve,reject)=>{
		let file=fs.createWriteStream(fileName);
		file.on("finish",()=>{
			file.close(()=>{
				resolve(file);
			});
		}).on("error",err=>{
			file.close(()=>{
				fs.unlinkSync(fileName);
			});
			console.error(err);
			reject(err);
		});
		console.log(`begin download ${url}`);
		let done=res=>{
			console.log(`end download ${url}`);
			res.pipe(file);
		}
		if(security){
			https.get(url,done);
		}
		else{
			http.get(url,done)
		}
	});
}

export function unicodeToUTF8(str){
	return str.replace(/&#(\d+);/g,(original,group)=>{
		return String.fromCharCode(group);
	})
}

export function rmSpace(str){
	return str.replace(/ /g,"");
}

export function readXlsx(fileName){
	return xlsx.parse(fs.readFileSync(fileName));
}

export function readCSV(fileName){
	return new Promise((resolve,reject)=>{
		csv.parse(fs.readFileSync(fileName),(err,data)=>{
			if(err){
				console.error(err);
				reject(err);
			}
			else{
				resolve(data);
			}
		});
	})
}