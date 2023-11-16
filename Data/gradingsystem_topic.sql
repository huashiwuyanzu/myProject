-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: gradingsystem
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `topic`
--

DROP TABLE IF EXISTS `topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topic` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `topicId` char(20) NOT NULL,
  `testId` char(20) NOT NULL,
  `topicType` enum('1','2','3','4','5') NOT NULL,
  `score` int NOT NULL,
  `topicText` varchar(255) NOT NULL,
  `answer` varchar(45) NOT NULL,
  `options` varchar(255) NOT NULL,
  `submitNumber` int NOT NULL DEFAULT '0',
  `correctNumber` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `topicId_UNIQUE` (`topicId`),
  KEY `fk_testId_idx` (`testId`),
  CONSTRAINT `fk_testId` FOREIGN KEY (`testId`) REFERENCES `test` (`testId`),
  CONSTRAINT `fk_testId_test` FOREIGN KEY (`testId`) REFERENCES `test` (`testId`)
) ENGINE=InnoDB AUTO_INCREMENT=146 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topic`
--

LOCK TABLES `topic` WRITE;
/*!40000 ALTER TABLE `topic` DISABLE KEYS */;
INSERT INTO `topic` VALUES (97,'UywP0WvB','OWgSgout','1',10,'我是不是帅哥？','正确','_',0,0),(98,'iPo2wsFa','OWgSgout','3',10,'谁是帅哥？','余庆标,loopy','余庆标,啵咿嗷,loopy,华师最后的深情',0,0),(99,'vk7Md2VE','OWgSgout','2',10,'谁是美女？','透明小伞','范冰冰,迪丽热巴,古力娜扎,透明小伞',0,0),(100,'9hcqpR9O','OWgSgout','4',10,'世界上最帅的人是谁?，最美的人是谁?？','梅西,透明小伞','_',0,0),(101,'nmwohuwf','OWgSgout','5',60,'你认为华师是一个怎么样的学校？','_','_',0,0),(102,'dWqZhNrj','GMHgP8HZ','1',10,'我帅不帅','正确','_',0,0),(103,'pz7bsH9r','GMHgP8HZ','3',10,'帅哥是谁？','余庆标,loopy','余庆标,啵咿嗷,loopy,华师最后的深情',0,0),(104,'9HKF6pxU','GMHgP8HZ','2',10,'美女是谁？','透明小伞','范冰冰,迪丽热巴,古力娜扎,透明小伞',0,0),(105,'U9LlhVJD','GMHgP8HZ','4',10,'帅哥是谁?？','梅西','_',0,0),(106,'5U2ticMe','GMHgP8HZ','5',50,'你认为华师是个怎么样的学校？','_','_',0,0),(107,'ymwFvETw','uXr2s6LV','1',11,'123','错误','_',0,0),(108,'Q6mcN6MA','uXr2s6LV','3',2,'asd','余庆标,loopy','余庆标,啵咿嗷,loopy,华师最后的深情',0,0),(109,'jRKtj3Vn','uXr2s6LV','2',10,'asd','透明小伞','范冰冰,迪丽热巴,古力娜扎,透明小伞',0,0),(110,'Nxxwo63R','uXr2s6LV','4',10,'asd?','A','_',0,0),(111,'FgGA4EXT','uXr2s6LV','5',1,'asd','_','_',0,0),(112,'sA4kGAvj','8VthDKxz','1',10,'透明小伞老师是不是英国最好看的女孩子？','正确','_',0,0),(113,'Xec0ey0Y','8VthDKxz','2',10,'谁是美女？','透明小伞','范冰冰,迪丽热巴,古力娜扎,透明小伞',0,0),(114,'DVcgLEST','8VthDKxz','3',10,'谁是帅哥？','余庆标,loopy','余庆标,啵咿嗷,loopy,华师最后的深情',0,0),(115,'oxg86qUk','8VthDKxz','4',10,'世界上最帅的人是谁?，最美的人是谁?？','梅西,透明小伞','_',0,0),(116,'m1KyqRLX','8VthDKxz','5',10,'透明小伞老师是不是英国最好看的女孩子？','_','_',0,0),(117,'ep1tyUVa','8VthDKxz','1',10,'透明小伞老师是不是英国最好看的女孩子？','正确','_',0,0),(118,'XrDkvtUI','8VthDKxz','2',10,'谁是美女？','透明小伞','范冰冰,迪丽热巴,古力娜扎,透明小伞',0,0),(119,'2m39OyfH','8VthDKxz','3',10,'谁是帅哥？','余庆标,loopy','余庆标,啵咿嗷,loopy,华师最后的深情',0,0),(120,'YbkM5xBl','8VthDKxz','4',10,'世界上最帅的人是谁?，最美的人是谁?？','梅西,透明小伞','_',0,0),(121,'SD0f2WTS','8VthDKxz','5',10,'透明小伞老师是不是英国最好看的女孩子？','_','_',0,0),(122,'btMFOadd','yBXnuD71','1',10,'数据库这本书是不是很厚重','正确','_',0,0),(123,'hMR519RR','yBXnuD71','2',10,'比较好用的数据库是说明','Mysql','Mysql,mysql,不知名数据库,只认识mysql',0,0),(124,'W79wMNop','yBXnuD71','3',10,'外键的定义条件是什么','条件1,条件2','条件1,条件2,条件3,条件4',0,0),(125,'KsNlI0mI','yBXnuD71','4',10,'你?数据库实验这门课','喜欢','_',0,0),(126,'zhauhavv','yBXnuD71','5',10,'范式的重要性体现在哪里','_','_',0,0),(127,'xl5FFBns','yBXnuD71','1',10,'数据库这本书是不是很厚重','正确','_',0,0),(128,'mSIF1wYl','yBXnuD71','2',10,'比较好用的数据库是说明','Mysql','Mysql,mysql,不知名数据库,只认识mysql',0,0),(129,'8X7ymG6g','yBXnuD71','3',10,'外键的定义条件是什么','条件1,条件2','条件1,条件2,条件3,条件4',0,0),(130,'cHXvHz5r','yBXnuD71','4',10,'你?数据库实验这门课','喜欢','_',0,0),(131,'QjfdEx2V','yBXnuD71','5',10,'范式的重要性体现在哪里','_','_',0,0),(132,'Q4p9PfJH','XT0JHy31','1',5,'最大的实数是不是100','错误','_',2,1),(133,'8k0KIG02','XT0JHy31','2',10,'1和2哪个更大','2','1,2',2,1),(134,'0licGfkO','XT0JHy31','4',20,'最小的正整数是?','1','_',2,2),(135,'NbqcapxV','XT0JHy31','5',10,'说一下你对数学的看法','_','_',2,0),(136,'M7Scvkqx','qoVbTvQp','1',10,'这门课是不是很容易','正确','_',1,1),(137,'j0mSLKsJ','qoVbTvQp','2',10,'我帅不帅','帅','帅,不帅,一般',1,0),(138,'qe1m5bb0','qoVbTvQp','3',10,'外键的定义条件是什么','条件1,条件2','条件1,条件2,条件3,条件4',1,1),(139,'OUEaIwqH','qoVbTvQp','4',10,'你?数据库实验可视化这门课','喜欢','_',1,0),(140,'FDQj0tz4','qoVbTvQp','5',10,'做完实验你的心得体会是什么','_','_',0,0),(141,'OcAVcnYY','qoVbTvQp','1',10,'这门课是不是很容易','正确','_',1,1),(142,'KdUnBSPs','qoVbTvQp','2',10,'我帅不帅','帅','帅,不帅,一般',1,0),(143,'7cNcpGx7','qoVbTvQp','3',10,'外键的定义条件是什么','条件1,条件2','条件1,条件2,条件3,条件4',1,1),(144,'xdVFakAS','qoVbTvQp','4',10,'你?数据库实验可视化这门课','喜欢','_',1,0),(145,'yj2reHIO','qoVbTvQp','5',10,'做完实验你的心得体会是什么','_','_',0,0);
/*!40000 ALTER TABLE `topic` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-16 17:50:28
