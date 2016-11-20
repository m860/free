import mysql from "mysql";
import {exec} from "../utility/dbHelper";

let connection=mysql.createConnection({
	host:"10.211.55.9",
	user:"stock",
	password:"abcd@123",
	database:"stock"
});

connection.connect();

exec(connection,"select * from tbl_StockList").then((rows,fields)=>{
	console.log(rows);
	console.log(fields);
}).catch(err=>{
	console.log(err);
})

