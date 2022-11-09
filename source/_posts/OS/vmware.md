---
title: 使用VMWare安装Ubuntu并使用vscode远程连接到虚拟机
date: 2022-04-30 19:44:24
tags:
  - 操作系统
  - 虚拟机
  - VMware
  - Ubuntu
  - vscode
categories:
  - 操作系统
---
## VMware下载
下载地址: [https://www.vmware.com/products/workstation-pro/workstation-pro-evaluation.html](https://www.vmware.com/products/workstation-pro/workstation-pro-evaluation.html)
点击进入上面的地址，然后往下拉，就可以看到windows和linux的下载选项，选择对应的系统进行下载即可。
下载完成后，双击运行下载的安装文件，一路下一步即可完成安装。
如果需要许可证，可以去咸鱼找一个。
## Ubuntu下载
下载地址: [https://ubuntu.com/download/desktop](https://ubuntu.com/download/desktop)
选择需要的版本下载即可。

## 创建新的虚拟机
打开安装好的VMware，点击`文件->新建虚拟机`，如下图所示。
![新建虚拟机](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/VMware/新建虚拟机.JPG)
会弹出如下的对话框：
![新建虚拟机向导](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/VMware/新建虚拟机向导.JPG)
这里选择推荐的设置，直接点击下一步即可。
然后选择稍后安装操作系统，如下图所示。
![选择稍后安装操作系统](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/VMware/新建虚拟机向导2.JPG)
然后客户操作系统选择linux，版本选择Ubuntu 64位，如下图所示。
![选择操作系统和版本](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/VMware/新建虚拟机向导3.JPG)
然后需要指定磁盘容量，这里采用默认就好。
![指定磁盘容量](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/VMware/新建虚拟机向导4.JPG)
然后会进入下图所示的界面，如果需要修改，可以点击自定义硬件。如果不需要修改，点击完成即可。至此虚拟机创建完成，可以在左侧的列表中找到刚才创建的虚拟机。
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/VMware/新建虚拟机向导5.JPG)
选择刚创建的虚拟机，点击编辑虚拟机设置，如下图所示。
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/VMware/编辑虚拟机设置.JPG)

会弹出如下对话框。
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/VMware/配置iso镜像文件.jpg)
选择CD/DVD，并且在右侧选择`使用ISO镜像文件`，添加之前下载的ubuntu镜像文件。

完成设置之后，点击开启此虚拟机。如下图所示：
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/VMware/开启虚拟机.JPG)

选择`中文简体`，然后点击右边的安装ubuntu。
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/VMware/安装ubuntu.JPG)
然后选择键盘布局。这里选择中文的键盘布局。
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/VMware/选择键盘布局.JPG)
接下来选择安装方式。为了节约时间， 这里选择了最小安装。
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/VMware/最小安装.JPG)
点击`现在安装`。
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/VMware/现在安装.JPG)
点击`继续`。
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/VMware/点击继续.JPG)
接下来需要填写地址，国内的话位置填写`Shanghai`即可。
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/VMware/国内的话输入shanghai即可.JPG)
接下来设置用户名和密码。
然后进入漫长的等待。
安装完毕后，会显示如下界面：
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/VMware/安装完毕.JPG)
点击`现在重启`重启虚拟机即可，至此ubuntu安装完成。

## apt换源
首先需要备份原始文件，使用命令:
```bash
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
```
接下来编辑`sources.list`文件，使用如下命令:
```bash
sudo vi /etc/apt/sources.list
```
将内容替换为如下内容:
```
# 清华源
# 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-security main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-security main restricted universe multiverse
```
保存并退出，使用如下命令来更新apt:
```bash
sudo apt update
sudo apt upgrade
```
至此，apt换源完成。
## vscode远程连接虚拟机
首先需要在虚拟机中安装sshd。开启虚拟机，新建一个终端，输入以下命令:
```bash
sudo apt-get install openssh-server  
```
sshd安装完成后，使用以下命令来启动:
```bash
sudo service ssh start
```
查看sshd是否启动成功:
```bash
ps -e | grep sshd
```
如果成功启动，会得到类似如下的输出:
```bash
 11708 ?        00:00:00 sshd
```
接下来查询虚拟机ip地址:
```bash
ifconfig
```
会得到如下输出:
```bash
ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.33.128  netmask 255.255.255.0  broadcast 192.168.33.255
        inet6 fe80::34d2:5778:624f:8a39  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:88:29:ad  txqueuelen 1000  (以太网)
        RX packets 83888  bytes 123829089 (123.8 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 6419  bytes 766032 (766.0 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (本地环回)
        RX packets 960  bytes 552262 (552.2 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 960  bytes 552262 (552.2 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```
在上面的输出中找到类似`192.168.xxx.xxx`的ip地址，笔者这里是`192.168.33.128`。将这个地址记下来。
接下来，在本机上打开vscode。安装`Remote-SSH`插件。安装完成后，会在左侧的图标列表中显示远程连接图标，点击它，得到下图所示界面。
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/VMware/remote-ssh图标.JPG)
点击下图所示的齿轮图标，会弹出一个配置文件选择的对话框，选择第一个即可。
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/VMware/remote-ssh配置1.JPG)
然后，在配置文件中添加如下内容:
```
Host 192.168.xxx.xxx
  HostName 192.168.xxx.xxx
  User xxxxx
```
其中`HostName`需要配置成之前记下来的虚拟机的ip地址，`User`配置为要登录的用户名。
配置成功之后，虚拟机的ip会显示在`ssh targets`列表中，右键点击它，会让你选择在当前窗口连接还是在新窗口连接。
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/VMware/远程连接.JPG)

选择`Connect Host in Current Window`或者`Connect Host in New Window`，会得到下图所示的结果:
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/VMware/输入密码.JPG)
输入密码后，即可连接成功。
![连接成功](https://cdn.jsdelivr.net/gh/Qiu-Weidong/pictures/images/VMware/连接成功.JPG)


