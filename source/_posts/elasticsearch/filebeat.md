---
title: filebeat 部署和使用
date: 2023-10-02 20:04:38
tags:
  - elasticsearch
  - filebeat

categories:
  - elasticsearch
---

## 查看 elasticsearch 版本
`filebeat` 需要和 `elasticsearch` 使用相同的版本, 因此, 需要首先查看 `elasticsearch` 的版本, 直接在浏览器输入 `elasticsearch` 的地址即可

```
http://localhost:9200
```
可以得到如下输出
```json
{
  "name" : "es",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "fbY3H5rSRnSlWlSTW-7lKg",
  "version" : {
    "number" : "7.17.6",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "f65e9d338dc1d07b642e14a27f338990148ee5b6",
    "build_date" : "2022-08-23T11:08:48.893373482Z",
    "build_snapshot" : false,
    "lucene_version" : "8.11.1",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```
## 安装
首先需要下载 `filebeat` 的二进制程序, 可以从[下载页面](https://www.elastic.co/cn/downloads/beats/filebeat?)查找对应操作系统版本的二进制程序.
如果需要下载特定版本,则可以从[past releases](https://www.elastic.co/cn/downloads/past-releases#filebeat)页面下载.

然后复制链接地址并下载即可
```shell
# 下载
wget https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-7.17.6-linux-x86_64.tar.gz
# 解压
tar -xvf filebeat-7.17.6-linux-x86_64.tar.gz
# 进入
cd filebeat-7.17.6-linux-x86_64
```

## 配置
修改 `filebeat.yml` 文件, 配置输入输出.

```yml
filebeat.inputs:
- type: filestream
  id: my-filestream-id
  enabled: true
  paths:
    - /tmp/log/*.log

output.elasticsearch:
  hosts: ["<elastic search server ip>:9200"]    
```
## 启动
```shell
# 启动
./filebeat
```

## 测试
在 `/tmp` 下新建一个 `log` 目录,并创建一个 `1.log` 文件
```shell
mkdir -p /tmp/log
echo "hello world" >> 1.log
```
然后查看索引
```shell
curl http://<elastic search server >:9200/_cat/indices
```
可以查看到一个以 `filebeat` 开头的索引

## 设置 kibana 索引模式
首先点击 `stack management`,如下图所示
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/image-host/blog_image/202310022042652.png)
然后点击 `kibana` 下的 `index patterns`,如下图所示
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/image-host/blog_image/202310022044383.png)
然后点击右上角的 `create index pattern`,将弹出如下对话框
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/image-host/blog_image/202310022046610.png)
在 `name` 中填写前缀 `filebeat-7.17.6-*`, 即可匹配到所有的 `filebeat` 索引, `Timestamp field` 选择 `@timestamp`,然后点击 `create index pattern` 按钮即可创建索引模板,然后进入 discover 页面即可查看该索引
