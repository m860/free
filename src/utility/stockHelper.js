function isShangHaiSync(stockCode) {
	return /^600/.test(stockCode)
		|| /^601/.test(stockCode)
		|| /^900/.test(stockCode)
		|| /^730/.test(stockCode)
		|| /^700/.test(stockCode)
		|| /^603/.test(stockCode);
}

export function getBourseCodeSync(stockCode, sourceApi = "yahoo") {
	switch (sourceApi) {
		case "yahoo":
			if (isShangHaiSync(stockCode)) {
				return "ss";
			}
			return "sz";
			break;
		default:
			return "ss";
	}
}