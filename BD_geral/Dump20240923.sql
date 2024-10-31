CREATE DATABASE  IF NOT EXISTS `mydb` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci */;
USE `mydb`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mydb
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `produtos`
--

DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtos` (
  `idProdutos` int(11) NOT NULL AUTO_INCREMENT,
  `nomeProduto` varchar(45) NOT NULL,
  `quantidadeProduto` int(10) unsigned NOT NULL,
  `valorProduto` decimal(10,2) unsigned NOT NULL,
  `dataValidade` date DEFAULT NULL,
  `fornecedor` varchar(45) NOT NULL,
  `descricaoProduto` varchar(150) NOT NULL,
  `imagemProduto` text DEFAULT NULL,
  PRIMARY KEY (`idProdutos`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
INSERT INTO `produtos` VALUES (1,'Teclado Mecânico RGB',10,350.00,'2024-12-15','TechWorld Solutions','Teclado mecânico com iluminação RGB','https://cdn.awsli.com.br/800x800/2557/2557636/produto/2064463988497a79131.jpg'),(2,'Mouse Gamer Laser',25,200.00,'2024-11-22','ProGamer Supplies','Mouse gamer com sensor laser de alta precisão','https://i.zst.com.br/thumbs/12/32/15/727434563.jpg'),(3,'Monitor Ultrawide 34\"',8,2800.00,'2024-10-31','Visual Tech','Monitor ultrawide com alta resolução','https://images.kabum.com.br/produtos/fotos/472908/monitor-gamer-lg-ultragear-lg-34-curvo-led-wqhd-ultrawide-160hz-1ms-displayport-e-hdmi-amd-freesync-premium-hdr10-99-srgb-34gp63a-b_1717591886_gg.jpg'),(4,'SSD NVMe 1TB',15,850.00,NULL,'Tech Supplies Ltda','SSD ultrarrápido para desempenho otimizado','https://waz.vteximg.com.br/arquivos/ids/203789-1000-1000/118279-2-SSD_M_2_2280_PCIe_NVMe_1TB_Samsung_970_EV_Plus_MZ_V7S1T0BAM_MZ_V7S1T0B_118279.jpg'),(5,'Placa-mãe ATX Gaming',10,1200.00,'2025-02-12','Global Components','Placa-mãe com suporte para overclock','https://images.kabum.com.br/produtos/fotos/173461/placa-mae-gigabyte-b560m-gaming-hd-rev-1-0-intel-lga1200-micro-atx-led-rgb-b560m-gaming-hd_1628079711_gg.jpg'),(6,'Memória RAM 16GB DDR4',30,400.00,NULL,'Memory Solutions','Memória RAM DDR4 com frequência de 3200 MHz','https://images.kabum.com.br/produtos/fotos/172410/memoria-kingston-fury-beast-rgb-16gb-2x8gb-3200mhz-ddr4-cl16-preto-kf432c16bbak2-16_1662150641_g.jpg'),(7,'Headset Bluetooth',20,500.00,'2025-01-05','AudioPro Supplies','Headset com cancelamento de ruído e microfone','https://images.kabum.com.br/produtos/fotos/sync_mirakl/185214/Headphone-Bluetooth-Orelhas-Gatinho-Led-Rosa-Exbom-Hf-c240bt_1694031504_gg.jpg'),(8,'Processador Intel i7 13700K',12,2200.00,'2024-12-18','CPU Experts','Processador de alto desempenho para jogos','https://i.zst.com.br/thumbs/12/1e/38/-1346792134.jpg'),(9,'Placa de Vídeo RTX 4080',5,9500.00,NULL,'GPU Pro Traders','Placa de vídeo para gamers e profissionais','https://img.terabyteshop.com.br/produto/g/placa-de-video-gainward-nvidia-geforce-rtx-4080-phantom-16gb-gddr6x-dlss-ray-tracing-ned4080019t2-1030p_154903.jpg'),(10,'Fonte 750W Modular',18,600.00,NULL,'PowerMax Solutions','Fonte de alimentação modular com certificação 80+','https://images.kabum.com.br/produtos/fotos/39786/39786_1540838778_index_g.jpg'),(11,'Gabinete Mid Tower',12,450.00,NULL,'BuildTech','Gabinete com suporte para watercooling','https://images.kabum.com.br/produtos/fotos/sync_mirakl/519080/Gabinete-Gamer-Redragon-Preto-Mid-Tower-Sem-Fan-Sem-Fonte-Ca-604b-pro_1726573079_gg.jpg'),(12,'Pasta Térmica MX-4',40,15.00,'2024-11-11','CoolTech Supplies','Pasta térmica de alta condutividade','https://m.media-amazon.com/images/I/610tethTHOL._AC_UF1000,1000_QL80_.jpg'),(13,'Watercooler 240mm RGB',10,750.00,'2025-03-29','CoolPro Components','Watercooler para overclocking com LEDs RGB','https://images.kabum.com.br/produtos/fotos/130043/water-cooler-rise-mode-gamer-black-rgb-240mm-preto-rm-wcb-02-rgb_1663776685_gg.jpg'),(14,'Webcam Full HD',25,180.00,NULL,'CamTech Solutions','Webcam com resolução Full HD e microfone','https://backend.intelbras.com/sites/default/files/2020-10/capa-cam-1080p-web-cam-full-hd.png'),(15,'Teclado Sem Fio Compacto',30,150.00,'2025-08-17','KeyPro Supplies','Teclado compacto sem fio para produtividade','https://m.media-amazon.com/images/I/511kFsaNOCL._AC_.jpg');
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-23 10:52:50
