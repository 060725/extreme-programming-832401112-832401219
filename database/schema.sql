-- Address Book / 通讯录 database schema
-- MySQL 8.x (also works on 5.7)
-- Usage: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS `phonebook`
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_general_ci;

USE `phonebook`;

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
    `id`          INT          NOT NULL AUTO_INCREMENT COMMENT '主键',
    `username`    VARCHAR(64)  NOT NULL                COMMENT '姓名',
    `phone`       VARCHAR(32)  NOT NULL                COMMENT '手机号码',
    `phone1`      VARCHAR(32)  DEFAULT NULL            COMMENT '家庭电话',
    `email`       VARCHAR(128) DEFAULT NULL            COMMENT '电子邮箱',
    `socialmedia` VARCHAR(128) DEFAULT NULL            COMMENT '社交媒体',
    `address`     VARCHAR(255) DEFAULT NULL            COMMENT '真实地址',
    `image`       VARCHAR(512) DEFAULT NULL            COMMENT '头像地址',
    `collect`     INT          NOT NULL DEFAULT 1      COMMENT '书签状态: 1=未收藏, 2=已收藏',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci
  COMMENT = '通讯录联系人';

-- Optional sample data
INSERT INTO `user` (`username`, `phone`, `phone1`, `email`, `socialmedia`, `address`, `collect`)
VALUES ('张三', '13800000000', '0591-88888888', 'zhangsan@example.com', 'wechat: zhangsan', '福建省福州市', 1);
