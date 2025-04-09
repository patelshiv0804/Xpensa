/*
SQLyog Community v12.5.1 (64 bit)
MySQL - 5.7.44-log : Database - xpensa
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`xpensa` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `xpensa`;


/*Table structure for table `user_auth` */

DROP TABLE IF EXISTS `user_auth`;

CREATE TABLE `user_auth` (
  `uid` int(10) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` time DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


/*Table structure for table `category` */

DROP TABLE IF EXISTS `category`;

CREATE TABLE `category` (
  `cid` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  PRIMARY KEY (`cid`),
  KEY `cate_con2` (`user_id`),
  CONSTRAINT `cate_con2` FOREIGN KEY (`user_id`) REFERENCES `user_auth` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `expense_record` */

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
  CONSTRAINT `cate_con1` FOREIGN KEY (`category_id`) REFERENCES `category` (`cid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `user_con1` FOREIGN KEY (`user_id`) REFERENCES `user_auth` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `notifications` */
DROP TABLE IF EXISTS `notifications`;

CREATE TABLE `notifications` (
  `nid` int(10) NOT NULL AUTO_INCREMENT,  -- Add AUTO_INCREMENT
  `user_id` int(10) NOT NULL,
  `ndate` date NOT NULL,
  `message` varchar(255) NOT NULL,
  PRIMARY KEY (`nid`),
  KEY `notification_con` (`user_id`),
  CONSTRAINT `notification_con` FOREIGN KEY (`user_id`) REFERENCES `user_auth` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


/*Table structure for table `preferences` */
DROP TABLE IF EXISTS `preferences`;

CREATE TABLE `preferences` (
  `pid` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `budget_limit` int(10) DEFAULT NULL,
  `budget_overrun_flag` tinyint(1) DEFAULT NULL,
  `newsletter_flag` tinyint(1) DEFAULT NULL,
  `daily_notification_flag` tinyint(1) DEFAULT NULL,
  `weekly_notification_flag` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`pid`),
  KEY `user_con` (`user_id`),
  CONSTRAINT `preferences_user_fk` FOREIGN KEY (`user_id`) REFERENCES `user_auth` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION  -- Add Foreign Key
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


/*Table structure for table `user_profile` */
DROP TABLE IF EXISTS `user_profile`;

CREATE TABLE `user_profile` (
  `pid` int(10) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `profile_img` varchar(255) DEFAULT NULL,
  `xpensa_coins` int(5) NOT NULL DEFAULT '500',
  `country` varchar(255) NOT NULL,
  `user_id` int(10) NOT NULL,
  PRIMARY KEY (`pid`),
  KEY `user_profile_fk` (`user_id`),
  CONSTRAINT `user_profile_fk` FOREIGN KEY (`user_id`) REFERENCES `user_auth` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION -- Add Foreign Key
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
