---
title: u-boot简明教程
date: 2022-06-08 14:49:25
tags:
  - 操作系统
  - u-boot
categories:
  - 操作系统
---

## u-boot的编译
首先要下载u-boot的源代码，从这里[ftp://ftp.denx.de/pub/u-boot/](ftp://ftp.denx.de/pub/u-boot/)下载需要的纯净版u-boot源码。下载后解压源码，进入u-boot源码的根目录，执行`make distclean`命令清除所有配置，然后再执行`make xxxx_config`命令生成配置，其中`xxxx`是开发板的名称。配置成功后执行`make -j4 ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf-`进行编译。
## u-boot启动流程
### 找入口
从Makefile文件中找链接文件，然后从链接文件当中找到入口函数。
### tftp配置
服务器端建立在Ubuntu，客户端建立在开发板上。
首先运行命令
```bash
dpkg -s tftpd-hda
```
确保存在tftp服务器，大部分情况是有的，如果没有，则运行
```bash
sudo apt-get install tftpd-hda
```
安装tftp服务器。
然后配置tftp服务器，运行命令
```bash
sudo vim /etc/default/tftpd-hda
```
将文件修改为如下
```file
TFTP_USERNAME="tftp"
TFTP_DIRECTORY="你要共享的目录，通常在家目录下新建"
# 监听任何ip
TFTP_ADDRESS="0.0.0.0:69"
# 支持可读写
TFTP_OPTIONS="-l -c -s"
```
启动tftp，使用命令：
```bash
sudo service tftpd-hda restart
```
本地测试，运行命令
```bash
tftp 127.0.0.1
get 你要下载的文件
```
连上板子，在串口命令中输入print，打印参数。
在打印的信息中找到板子的网络信息。在服务器端输入命令ifconfig，打印服务器ip，确保服务器ip和板子ip在同一个网段。
在串口中运行`ping 服务器ip`，查看网络是否连通。

如果ip地址和服务器不在同一个网段，则可以通过`set ipaddr 新ip`修改板子ip。

文件的下载：
在确保网络连通之后，在串口终端中输入`tftp 41000000 你要下载的文件`，请确保要下载的文件在共享目录中。
下载成功后，可以使用命令`go 41000000`，执行下载的文件。
如果ping得通但出问题，可以重启服务器端。

拷贝内核：
在板子上执行：
```bash
tftp 41000000 uImage 
tftp 42000000 设备树
tftp 43000000 根文件系统
bootm 41000000 43000000 42000000
```
内核编译
```bash
make ARCH=arm CROSS_COMPILE=arm-linux-
```
首先执行命令
```bash
make  ARCH=目标架构 xxx_defconfig
```
然后配置内核，使用命令
```bash
make ARCH=arm menuconfig
```
最后执行命令
```bash
make uImage
```
编译设备树
```bash
make dtbs
```
## u-boot源码解读
头文件的存放目录在u-boot的根目录下和`arch/你的开发板架构名称/include`目录下。