---
title: vscode 配置 java 开发环境
date: 2023-09-24 19:00:11
tags:
  - vscode
  - java
categories:
  - vscode
---

## 安装插件
首先安装插件 `Extension Pack for Java`

## 安装 maven
首先下载 maven。
[下载地址](https://dlcdn.apache.org/maven/maven-3/3.9.4/binaries/apache-maven-3.9.4-bin.zip)

下载后解压到 `C:\Program Files\Apache\apache-maven-3.9.4`, 该目录下的文件如下所示:

```
├─bin
├─boot
├─conf
│  └─logging
└─lib
    ├─ext
    │  ├─hazelcast
    │  └─redisson
    └─jansi-native
        └─Windows
            ├─x86
            └─x86_64
```

设置 `MAVEN_HOME` 环境变量为 `C:\Program Files\Apache\apache-maven-3.9.4`, 并将 `%MAVEN_HOME%\bin\` 添加到 path 。

然后使用 `mvn --version` 命令查看是否添加成功
```
> mvn --version
Apache Maven 3.9.4 (dfbb324ad4a7c8fb0bf182e6d91b0ae20e3d2dd9)
Maven home: C:\Program Files\Apache\apache-maven-3.9.4
Java version: 19.0.1, vendor: Oracle Corporation, runtime: C:\Program Files\Java\jdk-19
Default locale: zh_CN, platform encoding: UTF-8
OS name: "windows 11", version: "10.0", arch: "amd64", family: "windows"
```


## 配置 settings.json



在 `settings.json` 中添加如下配置
```json
{
  ...
  "java.jdt.ls.java.home": "C:\\Program Files\\Java\\jdk-19",
  "maven.settingsFile": "C:\\Program Files\\Apache\\apache-maven-3.9.4\\conf\\settings.xml",
  "java.configuration.maven.userSettings": "C:\\Program Files\\Apache\\apache-maven-3.9.4\\conf\\settings.xml",
  "maven.executable.path": "C:\\Program Files\\Apache\\apache-maven-3.9.4\\bin\\mvn.cmd",
  ...
}
```
