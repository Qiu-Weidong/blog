---
title: k8s
date: 2023-04-01 17:42:24
tags:
  - k8s
categories:
  - k8s
---

## 修改主机名称
```bash
hostnamectl set-hostname master
hostnamectl set-hostname slave
```
## 修改 hosts
```bash
vim /etc/hosts
xxx.xxx.xxx.xxx master
xxx.xxx.xxx.xxx slave
```

## ubuntu创建 root 账户
使用如下命令，输入密码即可
```bash
sudo passwd root
```


## 关闭 swap 分区
```bash
sudo swapoff -a && sudo sed -i '/ swap / s/^/#/' /etc/fstab
```
## 关闭防火墙
```bash
sudo ufw disable
```

## 安装 docker
```bash
sudo apt install docker.io
```

## 配置 docker
```bash
sudo vi /etc/docker/daemon.json
```
内容如下
```json
{
  "registry-mirrors": [
    "https://dockerhub.azk8s.cn",
    "https://reg-mirror.qiniu.com",
    "https://quay-mirror.qiniu.com"
  ],
  "exec-opts": [ "native.cgroupdriver=systemd" ]
}
```
重启 docker
```
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 安装 k8s
```bash
# 使得 apt 支持 ssl 传输
apt-get update && apt-get install -y apt-transport-https
# 下载 gpg 密钥   这个需要root用户否则会报错
curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add - 
# 添加 k8s 镜像源 这个需要root用户否则会报错
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
EOF
# 更新源列表
apt-get update
# 下载 kubectl，kubeadm以及 kubelet
apt-get install -y kubelet kubeadm kubectl

# 锁定版本
apt-mark hold kubelet kubeadm kubectl
```


## 启动容器
```bash
kubeadm init --pod-network-cidr=10.244.0.0/16  --image-repository=registry.aliyuncs.com/google_containers
```

