-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: discosheavendb
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `canciones`
--

DROP TABLE IF EXISTS `canciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `canciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `disco_id` int NOT NULL,
  `titulo` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `disco_id` (`disco_id`),
  CONSTRAINT `canciones_ibfk_1` FOREIGN KEY (`disco_id`) REFERENCES `discos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `canciones`
--

LOCK TABLES `canciones` WRITE;
/*!40000 ALTER TABLE `canciones` DISABLE KEYS */;
INSERT INTO `canciones` VALUES (1,0,'Are You Satisfied?'),(2,0,'Shampain'),(3,0,'I Am Not a Robot'),(4,0,'Girls'),(5,0,'Mowgli\'s Road'),(6,0,'Obsessions'),(7,0,'Hollywood'),(8,0,'The Outsider'),(9,0,'Guilty'),(10,0,'Hermit The Frog'),(11,0,'Oh No!'),(12,0,'Seventeen'),(13,0,'Numb'),(14,1,'Bubblegum Bitch'),(15,1,'Primadonna'),(16,1,'Lies'),(17,1,'Homewrecker'),(18,1,'Starring Role'),(19,1,'The State of Dreaming'),(20,1,'Power & Control'),(21,1,'Living Dead'),(22,1,'Teen Idle'),(23,1,'Valley of the Dolls'),(24,1,'Hypocrates'),(25,1,'Fear and Loathing'),(26,1,'How to Be a Heartbreaker'),(27,2,'Happy'),(28,2,'Froot'),(29,2,'I\'m a Ruin'),(30,2,'Blue'),(31,2,'Forget'),(32,2,'Gold'),(33,2,'Can\'t Pin Me Down'),(34,2,'Solitaire'),(35,2,'Better Than That'),(36,2,'Weeds'),(37,2,'Savages'),(38,2,'Immortal'),(39,3,'Handmade Heaven'),(40,3,'Superstar'),(41,3,'Orange Trees'),(42,3,'Baby (feat Clean Bandit & Luis Fonsi)'),(43,3,'Enjoy Your Life'),(44,3,'True'),(45,3,'To Be Human'),(46,3,'End of the Earth'),(47,3,'Believe in Love'),(48,3,'Life Is Strange'),(49,3,'You'),(50,3,'Karma'),(51,3,'Emotional Machine'),(52,3,'Too Afraid'),(53,3,'No More Suckers'),(54,3,'Soft to Be Strong'),(55,4,'Ancient Dreams in a Modern Land'),(56,4,'Venus Fly Trap'),(57,4,'Man\'s World'),(58,4,'Purge The Poison'),(59,4,'Highly Emotional People'),(60,4,'New America'),(61,4,'Pandora\'s Box'),(62,4,'I Love You But I Love Me More'),(63,4,'Flowers'),(64,4,'Goodbye');
/*!40000 ALTER TABLE `canciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discos`
--

DROP TABLE IF EXISTS `discos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discos` (
  `id` int NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `artista` varchar(100) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `img` varchar(255) NOT NULL,
  `spotifyId` varchar(50) DEFAULT NULL,
  `spotifyUrl` varchar(255) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `canciones` int NOT NULL,
  `año` year NOT NULL,
  `duracion_total` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discos`
--

LOCK TABLES `discos` WRITE;
/*!40000 ALTER TABLE `discos` DISABLE KEYS */;
INSERT INTO `discos` VALUES (0,'THE FAMILY JEWELS','MARINA AND THE DIAMONDS','green','/img/TFJ-MATD.jpeg','linktfj','https://open.spotify.com/album/3dWObfa3vKyudzgmh53Xzg',4000.00,13,2010,'44:18'),(1,'ELECTRA HEART','MARINA AND THE DIAMONDS','pink','/img/EH-MATD.jpeg','linkeh','https://open.spotify.com/album/49kf7gWWtReFwPcCNsvyUf',4000.00,13,2012,'46:51'),(2,'FROOT','MARINA AND THE DIAMONDS','purple','/img/FROOT-MATD.jpeg','linkfroot','https://open.spotify.com/album/1u2ACTYzVNK3vSLG0Ah4H3',4000.00,12,2015,'53:09'),(3,'LOVE + FEAR','MARINA AND THE DIAMONDS','grey','/img/L+F-M.jpeg','linklf','https://open.spotify.com/album/0CUxS3KfHNuDpUUjbAewV3',4000.00,16,2019,'56:15'),(4,'ANCIENT DREAMS IN A MODERN LAND','MARINA AND THE DIAMONDS','lightblue','/img/ADIAML-M.jpeg','linkadiaml','https://open.spotify.com/album/5fa6oWFXuvaVkY49mfOsRd',4000.00,10,2021,'36:08'),(5,'DNA','LITTLE MIX','magenta','/img/DNA-LM.jpeg','linkdna','https://open.spotify.com/album/0SHgpefjbVvnR2NnMPj1ve',4000.00,12,2012,'43:56'),(6,'SALUTE','LITTLE MIX','lightgreen','/img/SALUTE-LM.jpeg','linksalute','https://open.spotify.com/album/06haetPrpbIFCY1FUWzVel',4000.00,12,2013,'43:06'),(7,'GET WEIRD','LITTLE MIX','yellow','/img/GW-LM.jpeg','linkgw','https://open.spotify.com/album/4bzVI1FElc13HQagFR7S1W',4000.00,12,2015,'42:17'),(8,'GLORY DAYS','LITTLE MIX','rgb(214, 41, 142)','/img/GD-LM.jpeg','linkgd','https://open.spotify.com/album/5DL2Z5x7UJsWH1HhE9j8nd',4000.00,12,2016,'42:51'),(9,'LM5','LITTLE MIX','black','/img/LM5-LM.jpeg','linklm5','https://open.spotify.com/album/7Ho8gAx4haSxv1eFLQwvTj',4000.00,14,2018,'44:15'),(10,'CONFETTI','LITTLE MIX','grey','/img/CONFETTI-LM.jpeg','linkconfetti','https://open.spotify.com/album/33a8Ha3pE7fo2o4T4xLabF',4000.00,13,2020,'40:31'),(11,'BETWEEN US','LITTLE MIX','brown','/img/BU-LM.jpeg','linkbu','https://open.spotify.com/album/6XNrM2YkzSXyQ9hekFOgLN',4000.00,22,2021,'78:54'),(12,'DUA LIPA','DUA LIPA','rgb(217, 70, 247)','/img/DL-DL.jpeg','linkdl','https://open.spotify.com/album/0obMz8EHnr3dg6NCUK4xWp',4000.00,17,2017,'40:46'),(13,'FUTURE NOSTALGIA','DUA LIPA','rgb(253, 32, 180)','/img/FN-DL.jpeg','linkfn','https://open.spotify.com/album/7fJJK56U9fHixgO0HQkhtI',4000.00,11,2020,'36:47'),(14,'YOURS TRULY','ARIANA GRANDE','rgb(247, 167, 216)','/img/YT-AG.jpeg','linkyt','https://open.spotify.com/album/6WQzwx2a6Wq6rDoEU3TaNE',4000.00,12,2013,'46:23'),(15,'MY EVERYTHING','ARIANA GRANDE','rgb(206, 111, 170)','/img/ME-AG.jpeg','linkme','https://open.spotify.com/album/6EVYTRG1drKdO8OnIQBeEj',4000.00,12,2014,'40:25'),(16,'DANGEROUS WOMAN','ARIANA GRANDE','rgb(41, 41, 41)','/img/DW-AG.jpeg','linkdw','https://open.spotify.com/album/3OZgEywV4krCZ814pTJWr7',4000.00,11,2016,'39:32'),(17,'SWEETENER','ARIANA GRANDE','rgb(184, 161, 58)','/img/SWEETENER-AG.jpeg','linksweetener','https://open.spotify.com/album/3tx8gQqWbGwqIGZHqDNrGe',4000.00,15,2018,'47:50'),(18,'THANK U, NEXT','ARIANA GRANDE','rgb(243, 102, 243)','/img/TUN-AG.jpeg','linktun','https://open.spotify.com/album/2fYhqwDWXjbpjaIJPEfKFw',4000.00,12,2019,'41:11'),(19,'POSITIONS','ARIANA GRANDE','rgb(109, 67, 91)','/img/POSITIONS-AG.jpeg','linkpositions','https://open.spotify.com/album/74vajFwEwXJ61OW1DKSPEa',4000.00,14,2020,'41:04'),(20,'LUNGS','FLORENCE + THE MACHINE','rgb(61, 60, 61)','/img/LUNGS-F+TM.jpeg','linklungs','https://open.spotify.com/album/2FgknX5e7fJlriQtxvpLhZ',4000.00,13,2009,'46:13'),(21,'CEREMONIALS','FLORENCE + THE MACHINE','rgb(122, 105, 37)','/img/CEREMONIALS-F+TM.jpeg','linkceremonials','https://open.spotify.com/album/19J2iqK89BCrNG4El2FRi5',4000.00,12,2011,'55:58'),(22,'HOW BIG, HOW BLUE, HOW BEAUTIFUL','FLORENCE + THE MACHINE','rgb(61, 61, 60)','/img/HBHBHB-F+TM.jpeg','linkhbhbhb','https://open.spotify.com/album/2jn2n5OkuHliOLKCqHnjXV',4000.00,11,2015,'48:46'),(23,'HIGH AS HOPE','FLORENCE + THE MACHINE','rgb(122, 107, 47)','/img/HAH-F+TM.jpeg','linkhah','https://open.spotify.com/album/0pKZJj9GzcKPCS8r4IaksA',4000.00,10,2018,'39:52'),(24,'DANCE FEVER','FLORENCE + THE MACHINE','rgb(241, 147, 218)','/img/DF-F+TM.jpeg','linkdf','https://open.spotify.com/album/4ohh1zQ4yybSK9FS7LLyDE',4000.00,14,2022,'47:12'),(25,'19','ADELE','rgb(177, 175, 92)','/img/19-A.jpeg','link19','https://open.spotify.com/album/59ULskOkBMij4zL8pS7mi0',4000.00,12,2008,'43:41'),(26,'21','ADELE','rgb(128, 207, 74)','/img/21-A.jpeg','link21','https://open.spotify.com/album/1azUkThwd2HfUDdeNeT147',4000.00,11,2011,'48:12'),(27,'25','ADELE','rgb(100, 99, 54)','/img/25-A.jpeg','link25','https://open.spotify.com/album/0K4pIOOsfJ9lK8OjrZfXzd',4000.00,11,2015,'48:25'),(28,'30','ADELE','rgb(197, 195, 42)','/img/30-A.jpeg','link30','https://open.spotify.com/album/21jF5jlMtzo94wbxmJ18aa',4000.00,12,2021,'58:15'),(29,'BORN TO DIE','LANA DEL REY','rgb(80, 154, 163)','/img/BTD-LDR.jpeg','linkbtd','https://open.spotify.com/album/4F5dVhgk569Du5cLfal3t5',4000.00,12,2012,'48:28'),(30,'PRINCESS OF POWER','MARINA','rgba(80, 179, 139, 1)','/img/POP-M.jpg','linkpop','https://open.spotify.com/album/2rjfRdmVDBMFT5mamSsVeU',10000.00,13,2025,'47:39'),(31,'ETERNAL SUNSHINE','ARIANA GRANDE','rgba(180, 33, 13, 1)','/img/ES-AG.jpg','linkes','https://open.spotify.com/album/5EYKrEDnKhhcNxGedaRQeK',10000.00,13,2024,'35:26'),(32,'RADICAL OPTIMISM','DUA LIPA','rgba(126, 248, 250, 1)','/img/RO-DL.jpg','linkro','https://open.spotify.com/album/1Mo92916G2mmG7ajpmSVrc',10000.00,11,2024,'36:35'),(33,'BESOS EN LA ESPALDA','INDIOS','rgba(255, 149, 225, 1)','/img/BELE-I.jpg','linkbele','https://open.spotify.com/album/7KDc628gSoRVXdJxDNGNG3',10000.00,12,2019,'42:52'),(34,'EL BIG BLUE','BANDALOS CHINOS','rgba(88, 202, 255, 1)','/img/EBB-BC.jpg','linkebb','https://open.spotify.com/album/3hPzlhEUvBbKEBeGMhCu3h',10000.00,12,2022,'35:56'),(35,'TAYLOR SWIFT','TAYLOR SWIFT','rgba(116, 203, 95, 1)','/img/TS-TS.jpg','linkts','https://open.spotify.com/album/5eyZZoQEFQWRHkV2xgAeBw',14000.00,15,2006,'40:28'),(36,'FEARLESS','TAYLOR SWIFT','rgba(224, 209, 100, 1)','/img/F-TS.jpg','linkf','https://open.spotify.com/album/08CWGiv27MVQhYpuTtvx83',14000.00,16,2008,'53:41'),(37,'SPEAK NOW','TAYLOR SWIFT','rgba(149, 94, 145, 1)','/img/SN-TS.jpg','linksn','https://open.spotify.com/album/6Ar2o9KCqcyYF9J0aQP3au',14000.00,14,2010,'67:29'),(38,'RED','TAYLOR SWIFT','rgba(193, 49, 49, 1)','/img/R-TS.jpg','linkr','https://open.spotify.com/album/1EoDsNmgTLtmwe1BDAVxV5',14000.00,16,2012,'65:18'),(39,'1989','TAYLOR SWIFT','rgba(255, 254, 196, 1)','/img/1989-TS.jpg','link1989','https://open.spotify.com/album/5fy0X0JmZRZnVa2UEicIOl',14000.00,13,2014,'48:42'),(40,'REPUTATION','TAYLOR SWIFT','rgba(104, 102, 102, 1)','/img/REP-TS.jpg','linkrep','https://open.spotify.com/album/6DEjYFkNZh67HP7R9PSZvv',14000.00,15,2017,'55:38'),(41,'LOVER','TAYLOR SWIFT','rgba(252, 185, 245, 1)','/img/L-TS.jpg','linkl','https://open.spotify.com/album/1NAmidJlEaVgA3MpcPFYGq',14000.00,18,2019,'61:45'),(42,'FOLKLORE','TAYLOR SWIFT','rgba(172, 172, 172, 1)','/img/FOL-TS.jpg','linkfol','https://open.spotify.com/album/2fenSS68JI1h4Fo296JfGr',14000.00,16,2020,'63:27'),(43,'EVERMORE','TAYLOR SWIFT','rgba(154, 82, 82, 1)','/img/E-TS.jpg','linke','https://open.spotify.com/album/2Xoteh7uEpea4TohMxjtaq',14000.00,15,2020,'60:38'),(44,'MIDNIGHTS','TAYLOR SWIFT','rgba(91, 185, 204, 1)','/img/M-TS.jpg','linkm','https://open.spotify.com/album/151w1FgRZfnKZA9FEcg9Z3',14000.00,13,2022,'44:02'),(45,'THE TORTURED POETS DEPARTMENT','TAYLOR SWIFT','rgba(122, 117, 117, 1)','/img/TTPD-TS.jpg','linkttpd','https://open.spotify.com/album/1Mo4aZ8pdj6L1jx8zSwJnt',14000.00,16,2024,'65:00'),(46,'THE LIFE OF A SHOWGIRL','TAYLOR SWIFT','rgba(69, 175, 154, 1)','/img/TLOAS-TS.jpg','linktloas','https://open.spotify.com/album/',14000.00,12,2025,NULL);
/*!40000 ALTER TABLE `discos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-21 20:31:12
