import path from "path";
import fs from "fs";
import df from "dateformat";

const basePath = path.join(__dirname, `../../build/logs`);

if (!fs.existsSync(basePath)) {
	fs.mkdirSync(basePath);
}

function getFileName(type="error"){
	return path.join(basePath,`${df(new Date(),"yyyy-mm-dd")}.${type}.log`);
}

function getLogStream(type="error"){
	let fileName=path.join(basePath,`${df(new Date(),"yyyy-mm-dd")}.${type}.log`);
	let stream=fs.createWriteStream(fileName);
	return stream;
}

export function error(message){
	fs.appendFile(getFileName(),`${df(new Date(),"yyyy-mm-dd HH:MM:ss")} ${message} \n`,"utf-8");
}
