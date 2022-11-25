---
title: anaconda安装与配置
date: 2022-11-25 16:19:09
tags:
  - python
categories:
  - python
---
## 安装anaconda
在[官网](https://www.anaconda.com/)下载anaconda，并按照指示安装。
## 在Window Terminal中配置anaconda
todo
## anaconda常用命令
### 新建虚拟环境
```bash
conda create --name 虚拟环境名称
```
### 删除虚拟环境
```bash
conda remove --name 虚拟环境名称 --all
```
### 创建指定python版本，指定包的虚拟环境
```bash
# 指定python版本
conda create -n 虚拟环境名 python=3.10
# 指定包
conda create -n 虚拟环境名称 scipy
# 指定包版本
conda create -n 虚拟环境名 scipy=0.15.0
# 同时指定包和python版本
conda create -n 虚拟环境名称 python=3.9 scipy=0.15.0
```
### 给虚拟环境安装包
```bash
conda install -n 虚拟环境民 包名=版本
```
### 克隆一个虚拟环境
```bash
conda create --name 新的虚拟环境名 --clone 被克隆虚拟环境名
```
### 查看conda虚拟环境信息
```bash
conda info --envs
```
### 激活虚拟环境
```bash
conda activate 待激活虚拟环境名称
```
### 退出当前虚拟环境
```bash
deactivate
```

## 安装pytorch
命令`conda install pytorch torchvision torchaudio pytorch-cuda=11.7 -c pytorch -c nvidia`

