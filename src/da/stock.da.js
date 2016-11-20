import mysql from "mysql";
import {
	exec,
	generateInsertSqlText,
	generateUpdateSqlText
} from "../utility/dbHelper";

let connection=mysql.createConnection({
	host:"10.211.55.9",
	user:"stock",
	password:"abcd@123",
	database:"stock"
});

export function connect(){
	connection.connect();
}

export function end(){
	connection.end();
}

export async function existsStockByCode(code){
	let count=await exec(connection, `select count(1) as Total from tbl_StockList where CompanyCode=${code}`).then((rows,fields)=>{
		return rows[0].Total;
	}).catch(ex=>{
		console.error(ex);
	});
	return count>0;
}

export function insertStock(stock){
	let sql=generateInsertSqlText("tbl_StockList",stock);
	return exec(connection,sql).catch(ex=>{
		console.error(ex)
	});
}

export function updateStock(stock){
	let sql=generateUpdateSqlText("tbl_StockList",stock,data=>{
		return `CompanyCode='${data.CompanyCode}'`;
	});
	return exec(connection,sql).catch(ex=>{
		console.error(ex);
	});
}

