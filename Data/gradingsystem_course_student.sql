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
-- Table structure for table `course_student`
--

DROP TABLE IF EXISTS `course_student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_student` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `courseId` char(20) NOT NULL,
  `userId` char(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `no_repeat` (`courseId`,`userId`),
  KEY `fk_courseId_idx` (`courseId`),
  KEY `fk_userId_idx` (`userId`),
  CONSTRAINT `fk_courseId_course_user` FOREIGN KEY (`courseId`) REFERENCES `course` (`courseId`),
  CONSTRAINT `fk_userId_course_user` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=160 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_student`
--

LOCK TABLES `course_student` WRITE;
/*!40000 ALTER TABLE `course_student` DISABLE KEYS */;
INSERT INTO `course_student` VALUES (106,'0jnuFEeN','0p0184t0'),(88,'0jnuFEeN','0V4Lhzx0'),(85,'0jnuFEeN','1gmCRzPX'),(58,'0jnuFEeN','2bJU0gy7'),(62,'0jnuFEeN','2DjpKnPo'),(80,'0jnuFEeN','2GuSwJ4H'),(69,'0jnuFEeN','4hkq5aSi'),(60,'0jnuFEeN','5JeacSb9'),(97,'0jnuFEeN','5Nge1trt'),(71,'0jnuFEeN','6wTfVnki'),(59,'0jnuFEeN','7EN2NhkP'),(87,'0jnuFEeN','8UuxAJSh'),(63,'0jnuFEeN','9sUXJUqg'),(78,'0jnuFEeN','aFeISScf'),(93,'0jnuFEeN','afHPvGrj'),(103,'0jnuFEeN','AHXU2YoL'),(90,'0jnuFEeN','aptnK0BP'),(84,'0jnuFEeN','d4OGdpkS'),(82,'0jnuFEeN','DuYlkqbk'),(74,'0jnuFEeN','EJbhAXSE'),(79,'0jnuFEeN','fizzduvn'),(65,'0jnuFEeN','fKNTpsQo'),(75,'0jnuFEeN','fXPWVmXL'),(95,'0jnuFEeN','G4Ij5XQQ'),(96,'0jnuFEeN','gBsMYK4y'),(86,'0jnuFEeN','gcdjlBXr'),(67,'0jnuFEeN','gtunxIg7'),(76,'0jnuFEeN','hLHdVm78'),(91,'0jnuFEeN','IB4c52mY'),(81,'0jnuFEeN','IiVrO5WD'),(57,'0jnuFEeN','jmFv2gJJ'),(101,'0jnuFEeN','KQkY2yY4'),(72,'0jnuFEeN','lNEiCsPA'),(94,'0jnuFEeN','mHLrggaU'),(98,'0jnuFEeN','MPKEvA4p'),(104,'0jnuFEeN','MuMs2FvX'),(89,'0jnuFEeN','myOSYD8t'),(83,'0jnuFEeN','N0cA8jy5'),(102,'0jnuFEeN','Pe16t4Yk'),(68,'0jnuFEeN','pjTkmFEe'),(61,'0jnuFEeN','pW7WuzAm'),(70,'0jnuFEeN','rTfmr8k5'),(99,'0jnuFEeN','S7VsSabc'),(64,'0jnuFEeN','TDeiwBPV'),(105,'0jnuFEeN','TGWqSp4j'),(77,'0jnuFEeN','VR0q16L9'),(73,'0jnuFEeN','WEmyDfXF'),(66,'0jnuFEeN','xP0swjXD'),(92,'0jnuFEeN','YPCMzA4e'),(100,'0jnuFEeN','Z46YKvbu'),(40,'DOAaTv08','0SntViEr'),(50,'DOAaTv08','1cHgrMsp'),(27,'DOAaTv08','1J88FLWo'),(44,'DOAaTv08','1yGVFRiH'),(51,'DOAaTv08','2DAhIqzs'),(41,'DOAaTv08','4L9Q4q1I'),(38,'DOAaTv08','5nUvcoEl'),(12,'DOAaTv08','5VOBudeC'),(42,'DOAaTv08','6SKHlECi'),(36,'DOAaTv08','7TeI36PK'),(31,'DOAaTv08','9bjm1jDL'),(9,'DOAaTv08','9gP2Bi5I'),(52,'DOAaTv08','aQPVFAfV'),(28,'DOAaTv08','bmtxNzFn'),(23,'DOAaTv08','cHBZK77N'),(46,'DOAaTv08','dPfE4LuI'),(18,'DOAaTv08','EDeQxZVX'),(22,'DOAaTv08','fK4fSnpL'),(24,'DOAaTv08','gX5EbE9Y'),(10,'DOAaTv08','gzywsWlz'),(32,'DOAaTv08','H071tgPQ'),(37,'DOAaTv08','HJGUHzZy'),(14,'DOAaTv08','HNZEnEZ5'),(8,'DOAaTv08','i32Xm6sX'),(49,'DOAaTv08','JnQP0AfB'),(11,'DOAaTv08','kkifXzDH'),(16,'DOAaTv08','lvA1YDO5'),(29,'DOAaTv08','lXP9w7jR'),(54,'DOAaTv08','m4ZlxO1G'),(48,'DOAaTv08','MLhDFXb4'),(56,'DOAaTv08','mZaQ6mLU'),(53,'DOAaTv08','O0rqtwiK'),(21,'DOAaTv08','oABS4rVS'),(15,'DOAaTv08','ObxRjbcx'),(30,'DOAaTv08','OpDdMwKv'),(19,'DOAaTv08','OWFdFFQx'),(34,'DOAaTv08','PLhoO8vw'),(45,'DOAaTv08','pm1kPIwP'),(13,'DOAaTv08','prHATRVQ'),(26,'DOAaTv08','qDrszdBf'),(43,'DOAaTv08','QKIjPk9D'),(47,'DOAaTv08','qmoOTupg'),(33,'DOAaTv08','RH23wBuU'),(25,'DOAaTv08','sDpR21wA'),(17,'DOAaTv08','tYSH36wn'),(7,'DOAaTv08','V8s0eUoY'),(35,'DOAaTv08','XE6N15kb'),(20,'DOAaTv08','YAxOAJPM'),(39,'DOAaTv08','z2VaCpTf'),(55,'DOAaTv08','ZBUChBe4'),(109,'In9F2azS','1234'),(108,'In9F2azS','WWOCAO'),(3,'IOSASD','11110'),(1,'IOSASD','1234'),(5,'IOSASD','U8X92yXZ'),(6,'IOSASD','WWOCAO'),(4,'M8DDnvPV','U8X92yXZ'),(107,'M8DDnvPV','WWOCAO'),(122,'zmJHlcof','1cDdcyCM'),(143,'zmJHlcof','1FXNCLgt'),(139,'zmJHlcof','3oZqklbG'),(126,'zmJHlcof','4OYz0Kxn'),(136,'zmJHlcof','5gNKhBBD'),(113,'zmJHlcof','6RNfR5Uh'),(125,'zmJHlcof','8jF9rj4J'),(153,'zmJHlcof','BroXz08G'),(159,'zmJHlcof','c1JxNYF2'),(119,'zmJHlcof','D2ToUyES'),(134,'zmJHlcof','Dr9mDNPi'),(115,'zmJHlcof','FOIoEl8R'),(127,'zmJHlcof','fQzLedwn'),(156,'zmJHlcof','Fto1mmgN'),(132,'zmJHlcof','FYvkqwUc'),(137,'zmJHlcof','HLDjG3CI'),(151,'zmJHlcof','Iiupf4ut'),(146,'zmJHlcof','kRJYsx8Y'),(155,'zmJHlcof','l6pNUaJd'),(121,'zmJHlcof','LCnEjOpE'),(158,'zmJHlcof','LwdB0Fnv'),(110,'zmJHlcof','LZsUs2lI'),(150,'zmJHlcof','m6FwI3rs'),(138,'zmJHlcof','NE0LfFuk'),(135,'zmJHlcof','opMsqOQd'),(114,'zmJHlcof','QiTXUr9o'),(124,'zmJHlcof','QJNBu8u3'),(112,'zmJHlcof','SkxrYvww'),(144,'zmJHlcof','T81JILWG'),(147,'zmJHlcof','tWufRvSO'),(149,'zmJHlcof','tWXEZZ8I'),(130,'zmJHlcof','UE534fJI'),(128,'zmJHlcof','UnwSMl7X'),(145,'zmJHlcof','Uu3HEvxJ'),(148,'zmJHlcof','uVdSofEF'),(142,'zmJHlcof','v2ChYHLk'),(140,'zmJHlcof','vxHGWKDC'),(154,'zmJHlcof','VZAMUXPE'),(118,'zmJHlcof','WHbrBPPj'),(120,'zmJHlcof','wtFcd3fq'),(141,'zmJHlcof','wvqG0Lze'),(116,'zmJHlcof','XJP8HAuq'),(111,'zmJHlcof','xNGZ9HsV'),(131,'zmJHlcof','XVoVlCez'),(129,'zmJHlcof','XYmbAIKJ'),(152,'zmJHlcof','yciI95Ns'),(133,'zmJHlcof','yputVHnv'),(123,'zmJHlcof','YSpJguTV'),(157,'zmJHlcof','YYbkfNUn'),(117,'zmJHlcof','ztvA446K');
/*!40000 ALTER TABLE `course_student` ENABLE KEYS */;
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
