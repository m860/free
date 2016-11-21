import mysql from "mysql";
import {
	exec,
	generateInsertSqlText,
	generateUpdateSqlText
} from "../utility/dbHelper";
import {error} from "../utility/logHelper";

let connection=mysql.createConnection({
	host:"10.211.55.9",
	user:"stock",
	password:"abcd@123",
	database:"stock"
});

export async function existsStockByCode(code){
	let count=await exec(connection, `select count(1) as Total from tbl_StockList where CompanyCode=${code}`).then((rows,fields)=>{
		return rows[0].Total;
	});
	return count>0;
}

export function insertStock(stock){
	let sql=generateInsertSqlText("tbl_StockList",stock);
	return exec(connection,sql);
}

export function updateStock(stock){
	let sql=generateUpdateSqlText("tbl_StockList",stock,data=>{
		return `CompanyCode='${data.CompanyCode}'`;
	});
	return exec(connection,sql);
}

export function getStocks() {
	return exec(connection,`select * from tbl_StockList`);
}

export function getLastPriceByCode(companyCode){
	let sql=`select * from tbl_StockPrices where CompanyCode='${companyCode}' order by \`Date\` desc limit 1`;
	return exec(connection, sql).then(rows=>{
		if(rows.length>0){
			return rows[0];
		}
		return null;
	});
}

export function insertStockPrices(prices){
	let sql=generateInsertSqlText("tbl_StockPrices",prices);
	return exec(connection,sql).catch(ex=>{
		error(ex);
		error(JSON.stringify(prices));
	});
}

