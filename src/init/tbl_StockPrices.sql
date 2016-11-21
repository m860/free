SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for tbl_StockList
-- ----------------------------
DROP TABLE IF EXISTS `tbl_StockPrices`;
CREATE TABLE `tbl_StockPrices` (
  `SysNo` int(11) NOT NULL AUTO_INCREMENT,
  `CompanyCode` char(6) NOT NULL,
  `Open` decimal(10,6) not null,
  `High` decimal(10,6) not null,
  `Low` decimal(10,6) not null,
  `Close` decimal(10,6) not null,
  `Volume` int not null,
  `AdjClose` decimal(10,6) not null,
  `Date` date null,
  `CreateDate` datetime default now(),
  PRIMARY KEY (`SysNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
