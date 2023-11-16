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
-- Table structure for table `test_student`
--

DROP TABLE IF EXISTS `test_student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_student` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` char(20) NOT NULL,
  `testId` char(20) NOT NULL,
  `score` int NOT NULL DEFAULT '0',
  `taskStatus` enum('0','1') NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ig_UNIQUE` (`id`),
  UNIQUE KEY `userId_testId` (`userId`,`testId`),
  KEY `fk_userId_usertest_idx` (`userId`),
  KEY `fk_testId_usertest_idx` (`testId`),
  CONSTRAINT `fk_userId_usertest` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=242 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_student`
--

LOCK TABLES `test_student` WRITE;
/*!40000 ALTER TABLE `test_student` DISABLE KEYS */;
INSERT INTO `test_student` VALUES (28,'WWOCAO','OWgSgout',90,'1'),(29,'U8X92yXZ','OWgSgout',80,'1'),(30,'U8X92yXZ','GMHgP8HZ',80,'1'),(31,'WWOCAO','GMHgP8HZ',50,'1'),(32,'0SntViEr','8VthDKxz',78,'1'),(33,'1cHgrMsp','8VthDKxz',61,'1'),(34,'1J88FLWo','8VthDKxz',59,'1'),(35,'1yGVFRiH','8VthDKxz',44,'1'),(36,'2DAhIqzs','8VthDKxz',84,'1'),(37,'4L9Q4q1I','8VthDKxz',58,'1'),(38,'5nUvcoEl','8VthDKxz',43,'1'),(39,'5VOBudeC','8VthDKxz',71,'1'),(40,'6SKHlECi','8VthDKxz',41,'1'),(41,'7TeI36PK','8VthDKxz',60,'1'),(42,'9bjm1jDL','8VthDKxz',49,'1'),(43,'9gP2Bi5I','8VthDKxz',73,'1'),(44,'aQPVFAfV','8VthDKxz',39,'1'),(45,'bmtxNzFn','8VthDKxz',45,'1'),(46,'cHBZK77N','8VthDKxz',64,'1'),(47,'dPfE4LuI','8VthDKxz',42,'1'),(48,'EDeQxZVX','8VthDKxz',30,'1'),(49,'fK4fSnpL','8VthDKxz',49,'1'),(50,'gX5EbE9Y','8VthDKxz',31,'1'),(51,'gzywsWlz','8VthDKxz',41,'1'),(52,'H071tgPQ','8VthDKxz',41,'1'),(53,'HJGUHzZy','8VthDKxz',57,'1'),(54,'HNZEnEZ5','8VthDKxz',58,'1'),(55,'i32Xm6sX','8VthDKxz',48,'1'),(56,'JnQP0AfB','8VthDKxz',54,'1'),(57,'kkifXzDH','8VthDKxz',15,'1'),(58,'lvA1YDO5','8VthDKxz',51,'1'),(59,'lXP9w7jR','8VthDKxz',29,'1'),(60,'m4ZlxO1G','8VthDKxz',68,'1'),(61,'MLhDFXb4','8VthDKxz',69,'1'),(62,'mZaQ6mLU','8VthDKxz',80,'1'),(63,'O0rqtwiK','8VthDKxz',83,'1'),(64,'oABS4rVS','8VthDKxz',52,'1'),(65,'ObxRjbcx','8VthDKxz',62,'1'),(66,'OpDdMwKv','8VthDKxz',73,'1'),(67,'OWFdFFQx','8VthDKxz',37,'1'),(68,'PLhoO8vw','8VthDKxz',75,'1'),(69,'pm1kPIwP','8VthDKxz',82,'1'),(70,'prHATRVQ','8VthDKxz',59,'1'),(71,'qDrszdBf','8VthDKxz',40,'1'),(72,'QKIjPk9D','8VthDKxz',57,'1'),(73,'qmoOTupg','8VthDKxz',75,'1'),(74,'RH23wBuU','8VthDKxz',55,'1'),(75,'sDpR21wA','8VthDKxz',60,'1'),(76,'tYSH36wn','8VthDKxz',25,'1'),(77,'V8s0eUoY','8VthDKxz',49,'1'),(78,'XE6N15kb','8VthDKxz',51,'1'),(79,'YAxOAJPM','8VthDKxz',56,'1'),(80,'z2VaCpTf','8VthDKxz',37,'1'),(81,'ZBUChBe4','8VthDKxz',62,'1'),(82,'0p0184t0','yBXnuD71',47,'1'),(83,'0V4Lhzx0','yBXnuD71',54,'1'),(84,'1gmCRzPX','yBXnuD71',53,'1'),(85,'2bJU0gy7','yBXnuD71',60,'1'),(86,'2DjpKnPo','yBXnuD71',41,'1'),(87,'2GuSwJ4H','yBXnuD71',55,'1'),(88,'4hkq5aSi','yBXnuD71',34,'1'),(89,'5JeacSb9','yBXnuD71',38,'1'),(90,'5Nge1trt','yBXnuD71',42,'1'),(91,'6wTfVnki','yBXnuD71',48,'1'),(92,'7EN2NhkP','yBXnuD71',56,'1'),(93,'8UuxAJSh','yBXnuD71',72,'1'),(94,'9sUXJUqg','yBXnuD71',55,'1'),(95,'aFeISScf','yBXnuD71',27,'1'),(96,'afHPvGrj','yBXnuD71',46,'1'),(97,'AHXU2YoL','yBXnuD71',35,'1'),(98,'aptnK0BP','yBXnuD71',46,'1'),(99,'d4OGdpkS','yBXnuD71',31,'1'),(100,'DuYlkqbk','yBXnuD71',34,'1'),(101,'EJbhAXSE','yBXnuD71',46,'1'),(102,'fizzduvn','yBXnuD71',34,'1'),(103,'fKNTpsQo','yBXnuD71',37,'1'),(104,'fXPWVmXL','yBXnuD71',58,'1'),(105,'G4Ij5XQQ','yBXnuD71',42,'1'),(106,'gBsMYK4y','yBXnuD71',72,'1'),(107,'gcdjlBXr','yBXnuD71',26,'1'),(108,'gtunxIg7','yBXnuD71',36,'1'),(109,'hLHdVm78','yBXnuD71',32,'1'),(110,'IB4c52mY','yBXnuD71',67,'1'),(111,'IiVrO5WD','yBXnuD71',49,'1'),(112,'jmFv2gJJ','yBXnuD71',47,'1'),(113,'KQkY2yY4','yBXnuD71',35,'1'),(114,'lNEiCsPA','yBXnuD71',42,'1'),(115,'mHLrggaU','yBXnuD71',47,'1'),(116,'MPKEvA4p','yBXnuD71',73,'1'),(117,'MuMs2FvX','yBXnuD71',39,'1'),(118,'myOSYD8t','yBXnuD71',53,'1'),(119,'N0cA8jy5','yBXnuD71',56,'1'),(120,'Pe16t4Yk','yBXnuD71',33,'1'),(121,'pjTkmFEe','yBXnuD71',19,'1'),(122,'pW7WuzAm','yBXnuD71',42,'1'),(123,'rTfmr8k5','yBXnuD71',45,'1'),(124,'S7VsSabc','yBXnuD71',66,'1'),(125,'TDeiwBPV','yBXnuD71',37,'1'),(126,'TGWqSp4j','yBXnuD71',62,'1'),(127,'VR0q16L9','yBXnuD71',22,'1'),(128,'WEmyDfXF','yBXnuD71',46,'1'),(129,'xP0swjXD','yBXnuD71',59,'1'),(130,'YPCMzA4e','yBXnuD71',39,'1'),(131,'Z46YKvbu','yBXnuD71',45,'1'),(140,'WWOCAO','XT0JHy31',45,'1'),(141,'1234','XT0JHy31',21,'1'),(142,'1cDdcyCM','qoVbTvQp',44,'1'),(143,'1FXNCLgt','qoVbTvQp',71,'1'),(144,'3oZqklbG','qoVbTvQp',61,'1'),(145,'4OYz0Kxn','qoVbTvQp',50,'1'),(146,'5gNKhBBD','qoVbTvQp',36,'1'),(147,'6RNfR5Uh','qoVbTvQp',47,'1'),(148,'8jF9rj4J','qoVbTvQp',79,'1'),(149,'BroXz08G','qoVbTvQp',37,'1'),(150,'c1JxNYF2','qoVbTvQp',75,'1'),(151,'D2ToUyES','qoVbTvQp',50,'1'),(152,'Dr9mDNPi','qoVbTvQp',58,'1'),(153,'FOIoEl8R','qoVbTvQp',42,'1'),(154,'fQzLedwn','qoVbTvQp',33,'1'),(155,'Fto1mmgN','qoVbTvQp',63,'1'),(156,'FYvkqwUc','qoVbTvQp',35,'1'),(157,'HLDjG3CI','qoVbTvQp',52,'1'),(158,'Iiupf4ut','qoVbTvQp',32,'1'),(159,'kRJYsx8Y','qoVbTvQp',38,'1'),(160,'l6pNUaJd','qoVbTvQp',76,'1'),(161,'LCnEjOpE','qoVbTvQp',50,'1'),(162,'LwdB0Fnv','qoVbTvQp',29,'1'),(163,'LZsUs2lI','qoVbTvQp',36,'1'),(164,'m6FwI3rs','qoVbTvQp',63,'1'),(165,'NE0LfFuk','qoVbTvQp',39,'1'),(166,'opMsqOQd','qoVbTvQp',60,'1'),(167,'QiTXUr9o','qoVbTvQp',41,'1'),(168,'QJNBu8u3','qoVbTvQp',59,'1'),(169,'SkxrYvww','qoVbTvQp',34,'1'),(170,'T81JILWG','qoVbTvQp',48,'1'),(171,'tWufRvSO','qoVbTvQp',39,'1'),(172,'tWXEZZ8I','qoVbTvQp',39,'1'),(173,'UE534fJI','qoVbTvQp',64,'1'),(174,'UnwSMl7X','qoVbTvQp',65,'1'),(175,'Uu3HEvxJ','qoVbTvQp',45,'1'),(176,'uVdSofEF','qoVbTvQp',51,'1'),(177,'v2ChYHLk','qoVbTvQp',47,'1'),(178,'vxHGWKDC','qoVbTvQp',56,'1'),(179,'VZAMUXPE','qoVbTvQp',47,'1'),(180,'WHbrBPPj','qoVbTvQp',64,'1'),(181,'wtFcd3fq','qoVbTvQp',79,'1'),(182,'wvqG0Lze','qoVbTvQp',57,'1'),(183,'XJP8HAuq','qoVbTvQp',34,'1'),(184,'xNGZ9HsV','qoVbTvQp',45,'1'),(185,'XVoVlCez','qoVbTvQp',62,'1'),(186,'XYmbAIKJ','qoVbTvQp',45,'1'),(187,'yciI95Ns','qoVbTvQp',53,'1'),(188,'yputVHnv','qoVbTvQp',47,'1'),(189,'YSpJguTV','qoVbTvQp',67,'1'),(190,'YYbkfNUn','qoVbTvQp',39,'1'),(191,'ztvA446K','qoVbTvQp',50,'1'),(192,'1cDdcyCM','zmJHlcof',0,'1'),(193,'1FXNCLgt','zmJHlcof',0,'1'),(194,'3oZqklbG','zmJHlcof',0,'1'),(195,'4OYz0Kxn','zmJHlcof',0,'1'),(196,'5gNKhBBD','zmJHlcof',0,'1'),(197,'6RNfR5Uh','zmJHlcof',0,'1'),(198,'8jF9rj4J','zmJHlcof',0,'1'),(199,'BroXz08G','zmJHlcof',0,'1'),(200,'c1JxNYF2','zmJHlcof',0,'1'),(201,'D2ToUyES','zmJHlcof',0,'1'),(202,'Dr9mDNPi','zmJHlcof',0,'1'),(203,'FOIoEl8R','zmJHlcof',0,'1'),(204,'fQzLedwn','zmJHlcof',0,'1'),(205,'Fto1mmgN','zmJHlcof',0,'1'),(206,'FYvkqwUc','zmJHlcof',0,'1'),(207,'HLDjG3CI','zmJHlcof',0,'1'),(208,'Iiupf4ut','zmJHlcof',0,'1'),(209,'kRJYsx8Y','zmJHlcof',0,'1'),(210,'l6pNUaJd','zmJHlcof',0,'1'),(211,'LCnEjOpE','zmJHlcof',0,'1'),(212,'LwdB0Fnv','zmJHlcof',0,'1'),(213,'LZsUs2lI','zmJHlcof',0,'1'),(214,'m6FwI3rs','zmJHlcof',0,'1'),(215,'NE0LfFuk','zmJHlcof',0,'1'),(216,'opMsqOQd','zmJHlcof',0,'1'),(217,'QiTXUr9o','zmJHlcof',0,'1'),(218,'QJNBu8u3','zmJHlcof',0,'1'),(219,'SkxrYvww','zmJHlcof',0,'1'),(220,'T81JILWG','zmJHlcof',0,'1'),(221,'tWufRvSO','zmJHlcof',0,'1'),(222,'tWXEZZ8I','zmJHlcof',0,'1'),(223,'UE534fJI','zmJHlcof',0,'1'),(224,'UnwSMl7X','zmJHlcof',0,'1'),(225,'Uu3HEvxJ','zmJHlcof',0,'1'),(226,'uVdSofEF','zmJHlcof',0,'1'),(227,'v2ChYHLk','zmJHlcof',0,'1'),(228,'vxHGWKDC','zmJHlcof',0,'1'),(229,'VZAMUXPE','zmJHlcof',0,'1'),(230,'WHbrBPPj','zmJHlcof',0,'1'),(231,'wtFcd3fq','zmJHlcof',0,'1'),(232,'wvqG0Lze','zmJHlcof',0,'1'),(233,'XJP8HAuq','zmJHlcof',0,'1'),(234,'xNGZ9HsV','zmJHlcof',0,'1'),(235,'XVoVlCez','zmJHlcof',0,'1'),(236,'XYmbAIKJ','zmJHlcof',0,'1'),(237,'yciI95Ns','zmJHlcof',0,'1'),(238,'yputVHnv','zmJHlcof',0,'1'),(239,'YSpJguTV','zmJHlcof',0,'1'),(240,'YYbkfNUn','zmJHlcof',0,'1'),(241,'ztvA446K','zmJHlcof',0,'1');
/*!40000 ALTER TABLE `test_student` ENABLE KEYS */;
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
