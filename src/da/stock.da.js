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

connection.connect();
//
// exec(connection,"select * from tbl_StockList").then((rows,fields)=>{
// 	console.log(rows);
// 	console.log(fields);
// }).catch(err=>{
// 	console.log(err);
// })

export async function existsStockByCode(code){
	let count=await exec(connection, `select count(1) as Total from tbl_StockList where CompanyCode=${code}`).then((rows,fields)=>{
		return rows[0].Total;
	});
	console.log(count);
	return count>0;
}

export function insertStock(stock){
	let sql=generateInsertSqlText("tbl_StockList",stock);
	return exec(connection,sql).then((...args)=>{
		console.log(args);
	}).catch(ex=>{
		console.log(ex)
	});
}

export function updateStock(stock){
	let sql=generateUpdateSqlText("tbl_StockList",stock,data=>{
		return `CompanyCode='${data.CompanyCode}'`;
	});
	console.log(sql);
	return exec(connection,sql);
}

