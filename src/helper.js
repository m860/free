import fs from "fs";
import http from "http";
import https from "https";

export function downloadFileFromUrl(fileName,url){
	let security=/^https/i.test(url);
	return new Promise((resolve,reject)=>{
		let file=fs.createWriteStream(fileName);
		file.on("finish",()=>{
			file.close(()=>{
				resolve(file);
			});
		}).on("error",err=>{
			console.error(err);
		});
		if(security){
			https.get(url,res=>{
				res.pipe(file);
			});
		}
		else{
			http.get(url,res=>{
				res.pipe(file);
			})
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