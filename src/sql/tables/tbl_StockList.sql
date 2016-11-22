SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for tbl_StockList
-- ----------------------------
DROP TABLE IF EXISTS `tbl_StockList`;
CREATE TABLE `tbl_StockList` (
  `SysNo` int(11) NOT NULL AUTO_INCREMENT,
  `CompanyCode` char(6) NOT NULL,
  `CompanyName` varchar(20) NOT NULL,
  `CompanyShortName` varchar(10) NOT NULL,
  `CompanyEnglishName` varchar(100) NOT NULL,
  `RegisterAddress` varchar(100) NOT NULL,
  `ACode` char(6)  NULL,
  `AShortName` varchar(10)  NULL,
  `ALaunchDate` date  null,
  `AGeneralCapital` decimal(16,2)  null,
  `AWorkingCapital` decimal(16,2)  null,
  `BCode` char(6)  NULL,
  `BShortName` varchar(10)  NULL,
  `BLaunchDate` datetime  null,
  `BGeneralCapital` decimal(16,2)  null,
  `BWorkingCapital` decimal(16,2)  null,
  `Area` varchar(10) not null,
  `Province` varchar(10) not null,
  `City` varchar(10) not null,
  `IndustryCodeOfCompany` varchar(20) not null,
  `Website` varchar(100) null,
  `CreateDate` datetime default now(),
  `UpdateDate` datetime null,
  PRIMARY KEY (`SysNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
