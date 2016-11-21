import {error} from "./utility/logHelper"

async function a(){
	console.log("call a");
	return new Promise((resolve,reject)=>{
		setTimeout(()=>{
			reject("fuck");
		},1000);
	})
}
async function b(){
	console.log("call b");
	try {
		await a();
	}catch(ex){
		console.log(ex);
		throw ex;
	}
}
async function c(){
	try {
		await b();
	}
	catch(ex){
		console.log(ex);
		throw ex;
	}
}

c();