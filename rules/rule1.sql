use stock;
set @d60:=date_add(curdate(),INTERVAL -60 day);
SELECT 
    a.*, b.Close, (a.buyPrice - b.Close) AS diffPrice
FROM
    (SELECT 
        sp.CompanyCode,
            COUNT(1) AS Total,
            SUM(sp.Close) / 60 AS avg60Price,
            MIN(sp.Close) AS low60Price,
            MAX(sp.Close) AS high60Price,
            (SUM(sp.Close) / 60) * 0.95 AS buyPrice,
            MAX(sp.Date) AS lastDate
    FROM
        tbl_StockPrices AS sp
    WHERE
        Date > @d60
    GROUP BY CompanyCode) AS a
        INNER JOIN
    tbl_StockPrices AS b ON b.CompanyCode = a.CompanyCode
        AND b.Date = a.lastDate
WHERE
    a.buyPrice >= b.Close
ORDER BY diffPrice DESC;