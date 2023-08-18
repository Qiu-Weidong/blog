---
title: influxdb
date: 2023-08-02 13:40:17
tags:
  - 数据库
categories:
  - 数据库
---

influxDB 是一个用 GO 语言编写的时序数据库，与传统的关系型数据库相比，它对时序数据场景有专门的优化。

influxDB 通常被用在监控场景。如果将 influxDB 换成 mysql，则性能会很差。
MySQL 等关系型数据库的底层是 B+ 树，而 influxDB 等时序数据库的底层则一般是日志结构化合并 (LSM) 树。

influxDB 具有单点每秒数十万的写入能力。不支持事务、不能删除或更新数据。

2.x 版本的易用性高于 1.x 。

influxDB Proxy 可以有 2.3 的分布式实现。

## 官网地址
[influxdata.com](https://www.influxdata.com/)
influxdb 有不同的产品，其中 oss 表示独立部署的意思，主要关注它就可以了。其文档地址 [https://docs.influxdata.com/influxdb/v2.7/](https://docs.influxdata.com/influxdb/v2.7/)

## 安装
采用手动安装方式 
```bash
# 下载二进制压缩包
wget https://dl.influxdata.com/influxdb/releases/influxdb2-2.7.0-linux-amd64.tar.gz
# 解压之
tar xvzf path/to/influxdb2-2.7.0-linux-amd64.tar.gz
# 将 influxd 可执行程序放到 /usr/local/bin/
sudo cp influxdb2-2.7.0-linux-amd64/influxd /usr/local/bin/

# 启动，直接使用 influxd 命令即可启动之
influxd
```
启动之后，即可在 8086 端口查看




