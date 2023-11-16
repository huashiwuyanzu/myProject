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
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `courseId` char(20) NOT NULL,
  `courseName` char(40) NOT NULL,
  `invitationCode` char(20) NOT NULL,
  `courseIntroduction` varchar(245) NOT NULL DEFAULT '暂无简介',
  `userId` char(20) NOT NULL,
  `startYear` char(40) NOT NULL,
  `endYear` char(40) NOT NULL,
  `coursePicture` char(90) NOT NULL DEFAULT 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `courseId_UNIQUE` (`courseId`),
  KEY `fk_userId_idx` (`userId`),
  CONSTRAINT `fk_userId` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1,'IOSASD','数据结构与算法2023-2024','OIUSAD','数据结构与算法是黄煜廉老师最难的一门课。数据结构与算法是黄煜廉老师最难的一门课。数据结构与算法是黄煜廉老师最难的一门课。数据结构与算法是黄煜廉老师最难的一门课。数据结构与算法是黄煜廉老师最难的一门课。','SQWAAA','1622427218359','1622427218359','https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'),(2,'IOSASA','算法设计与分析2022-2023','QSIOAA','算法设计与逻辑是黄花一老师开设的课程。请同学们认真参与。这门课程的难度中等偏上，不好好学期末很容易挂科。','SQWAAA','1622427218359','1622427218359','https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'),(4,'M8DDnvPV','Python程序设计','3O13Ebtb','暂无简介','SQWAAA','1699525693','1699525693','https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'),(20,'DOAaTv08','编译原理项目课2023-2024','SN1XyyQU','编译原理项目课是透明小伞老师很难的一门课，不认真学的话可能大四无法毕业。不要挂科，请同学们不懂就问。','d5IVTWRX','1622427218359','1622427218359','http://127.0.0.1:7001/public/userPicture/d5IVTWRX.jpg'),(21,'0jnuFEeN','数据库实验2023','FSkODKYE','数据库实验不男  只要你是个人我都不会让你挂科','71FY2TKr','1622427218359','1622427218359','https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'),(24,'In9F2azS','高等数学','Jb6ixb6U','高等数学 容易挂科\n','d5IVTWRX','1640966400000','1735660800000','http://127.0.0.1:7001/public/coursePicture/In9F2azS.jpg'),(25,'zmJHlcof','数据库可视化','3pAVWKCm','需要提交两份实验 第一份在第十周提交  第二份在十六周前  第一份老师打分  第二份小组互评。','83F0yuv6','1622427218359','1622427218359','https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png');
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
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
