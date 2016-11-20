export function exec(connecttion,sqlText){
	return new Promise((resolve,reject)=>{
		connecttion.query(sqlText,(err, rows, fields)=>{
			if(err){
				reject(err);
			}
			else{
				resolve(rows,fields);
			}
			connecttion.end();
		})
	})
}