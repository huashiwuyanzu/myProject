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
-- Table structure for table `doubt`
--

DROP TABLE IF EXISTS `doubt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doubt` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `doubtId` char(20) NOT NULL,
  `userId` char(20) NOT NULL,
  `topicId` char(20) NOT NULL,
  `testId` char(20) NOT NULL,
  `question` varchar(255) DEFAULT NULL,
  `reply` varchar(255) DEFAULT NULL,
  `taskStatus` enum('0','1','2') NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_userId_doubt_idx` (`userId`),
  KEY `fk_topicId_doubt_idx` (`topicId`),
  KEY `fk_testId_doubt_idx` (`testId`),
  CONSTRAINT `fk_testId_doubt` FOREIGN KEY (`testId`) REFERENCES `test` (`testId`),
  CONSTRAINT `fk_topicId_doubt` FOREIGN KEY (`topicId`) REFERENCES `topic` (`topicId`),
  CONSTRAINT `fk_userId_doubt` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doubt`
--

LOCK TABLES `doubt` WRITE;
/*!40000 ALTER TABLE `doubt` DISABLE KEYS */;
INSERT INTO `doubt` VALUES (2,'aHtoVlnQ','V8s0eUoY','sA4kGAvj','8VthDKxz','这道题的答案为什么是这样的????老子真不懂','我讲了不下雨100此!','1'),(3,'uDiOIHrI','V8s0eUoY','sA4kGAvj','8VthDKxz','我还是不动啊,为什么不回我啊','讲了多少次了,还不会>','1'),(4,'zyOp9cgw','V8s0eUoY','SD0f2WTS','8VthDKxz','为什么你觉得你很好看呢?',NULL,'0'),(5,'sYTJcQDI','V8s0eUoY','sA4kGAvj','8VthDKxz','??','这个上课的时候讲了很多次了','1'),(7,'1aasaaa','V8s0eUoY','sA4kGAvj','8VthDKxz',NULL,'统一回复','2'),(8,'woOK03S1','9gP2Bi5I','Xec0ey0Y','8VthDKxz','老师这题我也不会',NULL,'0'),(12,'j95ZKrZR','d5IVTWRX','sA4kGAvj','8VthDKxz',NULL,'123','2'),(13,'7FKYk13q','d5IVTWRX','sA4kGAvj','8VthDKxz',NULL,'统一回复','2'),(14,'qLJT3mNB','WWOCAO','Q4p9PfJH','XT0JHy31','我不懂','必须懂','1'),(15,'UNWoDYY5','d5IVTWRX','Q4p9PfJH','XT0JHy31',NULL,'这道题很简单的各位爷','2'),(16,'Z5hsMiTQ','d5IVTWRX','8k0KIG02','XT0JHy31',NULL,'这道题跟简单了','2'),(17,'KuhVfWSG','d5IVTWRX','NbqcapxV','XT0JHy31',NULL,'简答题 我无话可说\n','2');
/*!40000 ALTER TABLE `doubt` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-16 17:50:29
