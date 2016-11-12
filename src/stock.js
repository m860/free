import {downloadFileFromUrl} from "./helper";

export async function getStockListFromSH(){
	let file=await downloadFileFromUrl("sh.xlsx","https://www.szse.cn/szseWeb/ShowReport.szse?SHOWTYPE=xlsx&CATALOGID=1110&tab2PAGENUM=1&ENCODE=1&TABKEY=tab2");
	console.log("done");
}