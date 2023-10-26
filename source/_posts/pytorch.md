---
title: pytorch 安装
date: 2023-10-26 14:48:06
tags:
  - python
  - pytorch
categories:
  - python
---
## 查看 cuda 版本
```shell
nvidia-smi
```

![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/image-host/blog_image/202310261451362.png)

或者右键选择 nvidia控制面板，点击 `帮助` -> `系统信息` -> `组件` 

![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/image-host/blog_image/202310261453810.png)

## 创建 conda 虚拟环境
```shell
# 创建虚拟环境
conda create --name 虚拟环境名称 python=3.9
# 激活虚拟环境
conda activate 虚拟环境名称
```
## 安装 pytorch
```shell
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```




