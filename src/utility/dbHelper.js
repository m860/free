export function exec(connecttion,sqlText){
	return new Promise((resolve,reject)=>{
		//connecttion.connect();
		connecttion.query(sqlText,(err, rows, fields)=>{
			//connecttion.end();
			if(err){
				console.error(`exec sql occur a error`,err);
				reject(err);
			}
			else{
				resolve(rows,fields);
			}
		})
	})
}

function buildMysqlValue(value){
	if(typeof value==="string"){
		return `'${value}'`;
	}
	else if(typeof value === "number"){
		return value;
	}
	else{
		return `${value}`;
	}
}

export function generateInsertSqlText(tableName,data){
	let fields=[];
	let values=[];
	let generateFields=(data)=>{
		for(let field in data){
			fields.push(field);
		}
	}
	let generateValues=(value)=>{
		let arr=[];
		for(let field in value){
			arr.push(buildMysqlValue(value[field]));
		}
		values.push(`(${arr.join(',')})`);
	}
	if(data instanceof Array){
		generateFields(data[0]);
		data.forEach(item=>{
			generateValues(item);
		})
	}
	else{
		generateFields(data);
		generateValues(data);
	}
	let text=`insert into ${tableName}(${fields.join(",")}) values${values.join(",")};`;
	return text;
}

export function generateUpdateSqlText(tableName:String,data:Object,condition:Function){
	let buildUpdateFields=()=>{
		let fields=[];
		for(let field in data){
			fields.push(`${field}=${buildMysqlValue(data[field])}`);
		}
		return fields.join(",");
	}
	let text=`update ${tableName} set ${buildUpdateFields()}`;
	if(condition){
		text+=` where ${condition(data)};`;
	}
	else{
		text+=";";
	}
	return text;
}

