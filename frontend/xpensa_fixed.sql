
/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS `xpensa` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `xpensa`;

DROP TABLE IF EXISTS `user_auth`;
CREATE TABLE `user_auth` (
  `uid` int(10) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `cid` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  PRIMARY KEY (`cid`),
  KEY `cate_con2` (`user_id`),
  CONSTRAINT `cate_con2` FOREIGN KEY (`user_id`) REFERENCES `user_auth` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `expense_record`;
CREATE TABLE `expense_record` (
  `eid` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `category_id` int(10) NOT NULL,
  `amount` int(10) NOT NULL,
  `date` date NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `receipt_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`eid`),
  KEY `user_con1` (`user_id`),
  KEY `cate_con1` (`category_id`),
  CONSTRAINT `cate_con1` FOREIGN KEY (`category_id`) REFERENCES `category` (`cid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_con1` FOREIGN KEY (`user_id`) REFERENCES `user_auth` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
