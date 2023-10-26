---
title: grafana 安装和配置
date: 2023-10-19 15:25:39
tags:
  - grafana
categories:
  - grafana
---

## 使用 docker 安装和运行 grafana
使用一条命令即可通过 docker 启动 grafana
```shell
docker run -d -p 3000:3000 --name=grafana grafana/grafana-enterprise
```
启动后在 3000 端口即可看到 grafana 的服务.
默认的用户名和密码都是 `admin`

## 使用目录映射来持久化数据
```shell
docker run -d -p 3000:3000 --name=grafana \
  --user "$(id -u)" \
  --volume "$PWD/data:/var/lib/grafana" \
  grafana/grafana-enterprise
```
## 使用 docker volume 来持久化数据


## 配置 metricbeat 数据展示
[参考](https://www.jianshu.com/p/c94d3b57f529)
点击 `datasource`
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/image-host/blog_image/202310191540460.png)
然后点击 `add data source`
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/image-host/blog_image/202310191541422.png)
选择 elasticsearch
![](https://cdn.jsdelivr.net/gh/Qiu-Weidong/image-host/blog_image/202310191543782.png)

然后配置 elastic search 的 ip, 索引等,注意版本要选对。

最后导入配置
```json
{
  "annotations": {
    "list": [
      {
        "builtIn": 1,
        "datasource": "-- Grafana --",
        "enable": true,
        "hide": true,
        "iconColor": "rgba(0, 211, 255, 1)",
        "name": "Annotations & Alerts",
        "type": "dashboard"
      }
    ]
  },
  "editable": true,
  "gnetId": null,
  "graphTooltip": 0,
  "hideControls": false,
  "id": 5,
  "links": [],
  "refresh": false,
  "rows": [
    {
      "collapse": false,
      "height": 304,
      "panels": [
        {
          "aliasColors": {},
          "bars": false,
          "dashLength": 10,
          "dashes": false,
          "datasource": "监控运维",
          "fill": 3,
          "id": 1,
          "legend": {
            "avg": false,
            "current": true,
            "max": false,
            "min": false,
            "show": true,
            "total": false,
            "values": true
          },
          "lines": true,
          "linewidth": 2,
          "links": [],
          "nullPointMode": "connected",
          "percentage": true,
          "pointradius": 5,
          "points": false,
          "renderer": "flot",
          "seriesOverrides": [],
          "spaceLength": 10,
          "span": 3,
          "stack": true,
          "steppedLine": false,
          "targets": [
            {
              "bucketAggs": [
                {
                  "field": "@timestamp",
                  "id": "2",
                  "settings": {
                    "interval": "auto",
                    "min_doc_count": 0,
                    "trimEdges": 0
                  },
                  "type": "date_histogram"
                }
              ],
              "dsType": "elasticsearch",
              "metrics": [
                {
                  "field": "system.cpu.system.pct",
                  "id": "1",
                  "meta": {},
                  "settings": {},
                  "type": "max"
                }
              ],
              "query": "beat.hostname:$Node",
              "refId": "A",
              "timeField": "@timestamp"
            },
            {
              "bucketAggs": [
                {
                  "field": "@timestamp",
                  "id": "2",
                  "settings": {
                    "interval": "auto",
                    "min_doc_count": 0,
                    "trimEdges": 0
                  },
                  "type": "date_histogram"
                }
              ],
              "dsType": "elasticsearch",
              "metrics": [
                {
                  "field": "system.cpu.user.pct",
                  "id": "1",
                  "meta": {},
                  "settings": {},
                  "type": "max"
                }
              ],
              "query": "beat.hostname:$Node",
              "refId": "B",
              "timeField": "@timestamp"
            }
          ],
          "thresholds": [],
          "timeFrom": null,
          "timeShift": null,
          "title": "CPU",
          "tooltip": {
            "shared": true,
            "sort": 0,
            "value_type": "cumulative"
          },
          "type": "graph",
          "xaxis": {
            "buckets": null,
            "mode": "time",
            "name": null,
            "show": true,
            "values": []
          },
          "yaxes": [
            {
              "format": "percentunit",
              "label": null,
              "logBase": 1,
              "max": "100",
              "min": "0",
              "show": true
            },
            {
              "format": "short",
              "label": null,
              "logBase": 1,
              "max": null,
              "min": null,
              "show": true
            }
          ]
        },
        {
          "aliasColors": {},
          "bars": false,
          "dashLength": 10,
          "dashes": false,
          "datasource": "监控运维",
          "fill": 3,
          "id": 2,
          "legend": {
            "avg": false,
            "current": true,
            "max": false,
            "min": false,
            "show": true,
            "total": false,
            "values": true
          },
          "lines": true,
          "linewidth": 2,
          "links": [],
          "nullPointMode": "connected",
          "percentage": false,
          "pointradius": 5,
          "points": false,
          "renderer": "flot",
          "seriesOverrides": [],
          "spaceLength": 10,
          "span": 3,
          "stack": false,
          "steppedLine": false,
          "targets": [
            {
              "alias": "总内存",
              "bucketAggs": [
                {
                  "field": "@timestamp",
                  "id": "2",
                  "settings": {
                    "interval": "auto",
                    "min_doc_count": 0,
                    "trimEdges": 0
                  },
                  "type": "date_histogram"
                }
              ],
              "dsType": "elasticsearch",
              "metrics": [
                {
                  "field": "system.memory.total",
                  "id": "1",
                  "meta": {},
                  "settings": {},
                  "type": "max"
                }
              ],
              "query": "beat.hostname:$Node",
              "refId": "A",
              "timeField": "@timestamp"
            },
            {
              "alias": "已经使用",
              "bucketAggs": [
                {
                  "field": "@timestamp",
                  "id": "2",
                  "settings": {
                    "interval": "auto",
                    "min_doc_count": 0,
                    "trimEdges": 0
                  },
                  "type": "date_histogram"
                }
              ],
              "dsType": "elasticsearch",
              "metrics": [
                {
                  "field": "system.memory.used.bytes",
                  "id": "1",
                  "meta": {},
                  "settings": {},
                  "type": "max"
                }
              ],
              "query": "beat.hostname:$Node",
              "refId": "B",
              "timeField": "@timestamp"
            }
          ],
          "thresholds": [],
          "timeFrom": null,
          "timeShift": null,
          "title": "内存",
          "tooltip": {
            "shared": true,
            "sort": 0,
            "value_type": "individual"
          },
          "type": "graph",
          "xaxis": {
            "buckets": null,
            "mode": "time",
            "name": null,
            "show": true,
            "values": []
          },
          "yaxes": [
            {
              "decimals": null,
              "format": "decbytes",
              "label": null,
              "logBase": 1,
              "max": null,
              "min": "0",
              "show": true
            },
            {
              "format": "short",
              "label": null,
              "logBase": 1,
              "max": null,
              "min": null,
              "show": true
            }
          ]
        },
        {
          "cacheTimeout": null,
          "colorBackground": false,
          "colorValue": true,
          "colors": [
            "#299c46",
            "rgba(237, 129, 40, 0.89)",
            "#d44a3a"
          ],
          "datasource": "监控运维",
          "decimals": 2,
          "format": "percentunit",
          "gauge": {
            "maxValue": 1,
            "minValue": 0,
            "show": true,
            "thresholdLabels": false,
            "thresholdMarkers": true
          },
          "id": 3,
          "interval": null,
          "links": [],
          "mappingType": 1,
          "mappingTypes": [
            {
              "name": "value to text",
              "value": 1
            },
            {
              "name": "range to text",
              "value": 2
            }
          ],
          "maxDataPoints": 100,
          "nullPointMode": "connected",
          "nullText": null,
          "postfix": "",
          "postfixFontSize": "50%",
          "prefix": "",
          "prefixFontSize": "50%",
          "rangeMaps": [
            {
              "from": "null",
              "text": "N/A",
              "to": "null"
            }
          ],
          "span": 2,
          "sparkline": {
            "fillColor": "rgba(31, 118, 189, 0.18)",
            "full": false,
            "lineColor": "rgb(31, 120, 193)",
            "show": false
          },
          "tableColumn": "",
          "targets": [
            {
              "bucketAggs": [
                {
                  "field": "@timestamp",
                  "id": "2",
                  "settings": {
                    "interval": "auto",
                    "min_doc_count": 0,
                    "trimEdges": 0
                  },
                  "type": "date_histogram"
                }
              ],
              "dsType": "elasticsearch",
              "metrics": [
                {
                  "field": "system.cpu.user.pct",
                  "id": "1",
                  "meta": {},
                  "settings": {},
                  "type": "max"
                }
              ],
              "query": "beat.hostname:$Node",
              "refId": "A",
              "timeField": "@timestamp"
            }
          ],
          "thresholds": "0.8,0.9,1",
          "title": "CPU",
          "type": "singlestat",
          "valueFontSize": "80%",
          "valueMaps": [
            {
              "op": "=",
              "text": "N/A",
              "value": "null"
            }
          ],
          "valueName": "current"
        },
        {
          "cacheTimeout": null,
          "colorBackground": false,
          "colorValue": true,
          "colors": [
            "#299c46",
            "rgba(237, 129, 40, 0.89)",
            "#d44a3a"
          ],
          "datasource": "监控运维",
          "decimals": 2,
          "format": "percentunit",
          "gauge": {
            "maxValue": 1,
            "minValue": 0,
            "show": true,
            "thresholdLabels": false,
            "thresholdMarkers": true
          },
          "id": 4,
          "interval": null,
          "links": [],
          "mappingType": 1,
          "mappingTypes": [
            {
              "name": "value to text",
              "value": 1
            },
            {
              "name": "range to text",
              "value": 2
            }
          ],
          "maxDataPoints": 100,
          "nullPointMode": "connected",
          "nullText": null,
          "postfix": "",
          "postfixFontSize": "50%",
          "prefix": "",
          "prefixFontSize": "50%",
          "rangeMaps": [
            {
              "from": "null",
              "text": "N/A",
              "to": "null"
            }
          ],
          "span": 2,
          "sparkline": {
            "fillColor": "rgba(31, 118, 189, 0.18)",
            "full": false,
            "lineColor": "rgb(31, 120, 193)",
            "show": false
          },
          "tableColumn": "",
          "targets": [
            {
              "bucketAggs": [
                {
                  "field": "@timestamp",
                  "id": "2",
                  "settings": {
                    "interval": "auto",
                    "min_doc_count": 0,
                    "trimEdges": 0
                  },
                  "type": "date_histogram"
                }
              ],
              "dsType": "elasticsearch",
              "metrics": [
                {
                  "field": "system.memory.used.pct",
                  "id": "1",
                  "meta": {},
                  "settings": {},
                  "type": "max"
                }
              ],
              "query": "beat.hostname:$Node",
              "refId": "A",
              "timeField": "@timestamp"
            }
          ],
          "thresholds": "0.70,0.8,0.9",
          "title": "内存使用量",
          "type": "singlestat",
          "valueFontSize": "80%",
          "valueMaps": [
            {
              "op": "=",
              "text": "N/A",
              "value": "null"
            }
          ],
          "valueName": "current"
        },
        {
          "cacheTimeout": null,
          "colorBackground": false,
          "colorValue": true,
          "colors": [
            "#299c46",
            "rgba(237, 129, 40, 0.89)",
            "#d44a3a"
          ],
          "datasource": "监控运维",
          "decimals": 2,
          "format": "percentunit",
          "gauge": {
            "maxValue": 1,
            "minValue": 0,
            "show": true,
            "thresholdLabels": false,
            "thresholdMarkers": true
          },
          "id": 5,
          "interval": null,
          "links": [],
          "mappingType": 1,
          "mappingTypes": [
            {
              "name": "value to text",
              "value": 1
            },
            {
              "name": "range to text",
              "value": 2
            }
          ],
          "maxDataPoints": 100,
          "nullPointMode": "connected",
          "nullText": null,
          "postfix": "",
          "postfixFontSize": "50%",
          "prefix": "",
          "prefixFontSize": "50%",
          "rangeMaps": [
            {
              "from": "null",
              "text": "N/A",
              "to": "null"
            }
          ],
          "span": 2,
          "sparkline": {
            "fillColor": "rgba(31, 118, 189, 0.18)",
            "full": false,
            "lineColor": "rgb(31, 120, 193)",
            "show": false
          },
          "tableColumn": "",
          "targets": [
            {
              "bucketAggs": [
                {
                  "field": "@timestamp",
                  "id": "2",
                  "settings": {
                    "interval": "auto",
                    "min_doc_count": 0,
                    "trimEdges": 0
                  },
                  "type": "date_histogram"
                }
              ],
              "dsType": "elasticsearch",
              "metrics": [
                {
                  "field": "system.filesystem.used.pct",
                  "id": "1",
                  "meta": {},
                  "settings": {},
                  "type": "max"
                }
              ],
              "query": "beat.hostname:$Node",
              "refId": "A",
              "timeField": "@timestamp"
            }
          ],
          "thresholds": "0.8,0.9,1",
          "title": "硬盘使用量",
          "type": "singlestat",
          "valueFontSize": "80%",
          "valueMaps": [
            {
              "op": "=",
              "text": "N/A",
              "value": "null"
            }
          ],
          "valueName": "current"
        }
      ],
      "repeat": null,
      "repeatIteration": null,
      "repeatRowId": null,
      "showTitle": false,
      "title": "Dashboard Row",
      "titleSize": "h6"
    },
    {
      "collapse": false,
      "height": 250,
      "panels": [
        {
          "aliasColors": {},
          "bars": false,
          "dashLength": 10,
          "dashes": false,
          "datasource": "监控运维",
          "fill": 3,
          "id": 6,
          "legend": {
            "alignAsTable": false,
            "avg": false,
            "current": false,
            "max": false,
            "min": false,
            "show": false,
            "total": false,
            "values": false
          },
          "lines": true,
          "linewidth": 2,
          "links": [],
          "nullPointMode": "connected",
          "percentage": false,
          "pointradius": 5,
          "points": false,
          "renderer": "flot",
          "seriesOverrides": [
            {
              "alias": "Average system.network.out.bytes"
            }
          ],
          "spaceLength": 10,
          "span": 12,
          "stack": false,
          "steppedLine": false,
          "targets": [
            {
              "alias": "network in",
              "bucketAggs": [
                {
                  "field": "@timestamp",
                  "id": "2",
                  "settings": {
                    "interval": "auto",
                    "min_doc_count": 0,
                    "trimEdges": 0
                  },
                  "type": "date_histogram"
                }
              ],
              "dsType": "elasticsearch",
              "metrics": [
                {
                  "field": "system.network.in.bytes",
                  "hide": true,
                  "id": "1",
                  "meta": {},
                  "pipelineAgg": "select metric",
                  "settings": {},
                  "type": "avg"
                },
                {
                  "field": "1",
                  "id": "3",
                  "meta": {},
                  "pipelineAgg": "1",
                  "settings": {},
                  "type": "derivative"
                }
              ],
              "query": "beat.hostname:$Node AND !system.network.name:\"IBM USB Remote NDIS Network Device\"",
              "refId": "A",
              "timeField": "@timestamp"
            },
            {
              "alias": "network out",
              "bucketAggs": [
                {
                  "field": "@timestamp",
                  "id": "2",
                  "settings": {
                    "interval": "auto",
                    "min_doc_count": 0,
                    "trimEdges": 0
                  },
                  "type": "date_histogram"
                }
              ],
              "dsType": "elasticsearch",
              "metrics": [
                {
                  "field": "system.network.out.bytes",
                  "hide": true,
                  "id": "1",
                  "meta": {},
                  "pipelineAgg": "select metric",
                  "settings": {},
                  "type": "avg"
                },
                {
                  "field": "1",
                  "id": "3",
                  "meta": {},
                  "pipelineAgg": "1",
                  "settings": {},
                  "type": "derivative"
                }
              ],
              "query": "beat.hostname:$Node AND !system.network.name:\"IBM USB Remote NDIS Network Device\"",
              "refId": "B",
              "timeField": "@timestamp"
            }
          ],
          "thresholds": [],
          "timeFrom": null,
          "timeShift": null,
          "title": "网络 In / Out",
          "tooltip": {
            "shared": true,
            "sort": 0,
            "value_type": "individual"
          },
          "type": "graph",
          "xaxis": {
            "buckets": null,
            "mode": "time",
            "name": null,
            "show": true,
            "values": []
          },
          "yaxes": [
            {
              "format": "Bps",
              "label": null,
              "logBase": 1,
              "max": null,
              "min": "0",
              "show": true
            },
            {
              "format": "Bps",
              "label": null,
              "logBase": 1,
              "max": null,
              "min": "0",
              "show": true
            }
          ]
        }
      ],
      "repeat": null,
      "repeatIteration": null,
      "repeatRowId": null,
      "showTitle": false,
      "title": "Dashboard Row",
      "titleSize": "h6"
    },
    {
      "collapse": false,
      "height": 250,
      "panels": [
        {
          "columns": [],
          "datasource": "监控运维",
          "fontSize": "100%",
          "id": 7,
          "links": [],
          "pageSize": 20,
          "scroll": true,
          "showHeader": true,
          "sort": {
            "col": null,
            "desc": false
          },
          "span": 12,
          "styles": [
            {
              "alias": "系统进程列表",
              "dateFormat": "YYYY-MM-DD HH:mm:ss",
              "pattern": "system.process.name",
              "preserveFormat": false,
              "sanitize": false,
              "type": "string"
            },
            {
              "alias": "系统CPU资源占用",
              "colorMode": "value",
              "colors": [
                "rgba(50, 172, 45, 0.97)",
                "#1f78c1",
                "rgba(245, 54, 54, 0.9)"
              ],
              "dateFormat": "YYYY-MM-DD HH:mm:ss",
              "decimals": 2,
              "pattern": "Max system.process.cpu.total.pct",
              "thresholds": [
                "82",
                "90",
                "100"
              ],
              "type": "number",
              "unit": "percent"
            },
            {
              "alias": "内存占用",
              "colorMode": null,
              "colors": [
                "rgba(50, 172, 45, 0.97)",
                "rgba(237, 129, 40, 0.89)",
                "rgba(245, 54, 54, 0.9)"
              ],
              "dateFormat": "YYYY-MM-DD HH:mm:ss",
              "decimals": 2,
              "pattern": "Max system.process.memory.size",
              "thresholds": [
                ""
              ],
              "type": "number",
              "unit": "decbytes"
            },
            {
              "alias": "常驻内存",
              "colorMode": null,
              "colors": [
                "rgba(245, 54, 54, 0.9)",
                "rgba(237, 129, 40, 0.89)",
                "rgba(50, 172, 45, 0.97)"
              ],
              "dateFormat": "YYYY-MM-DD HH:mm:ss",
              "decimals": 2,
              "pattern": "Max system.process.memory.rss.bytes",
              "thresholds": [],
              "type": "number",
              "unit": "decbytes"
            },
            {
              "alias": "共享内存",
              "colorMode": null,
              "colors": [
                "rgba(245, 54, 54, 0.9)",
                "rgba(237, 129, 40, 0.89)",
                "rgba(50, 172, 45, 0.97)"
              ],
              "dateFormat": "YYYY-MM-DD HH:mm:ss",
              "decimals": 2,
              "pattern": "Max system.process.memory.share",
              "thresholds": [],
              "type": "number",
              "unit": "decbytes"
            },
            {
              "alias": "",
              "colorMode": null,
              "colors": [
                "rgba(245, 54, 54, 0.9)",
                "rgba(237, 129, 40, 0.89)",
                "rgba(50, 172, 45, 0.97)"
              ],
              "decimals": 2,
              "pattern": "/.*/",
              "thresholds": [],
              "type": "number",
              "unit": "short"
            }
          ],
          "targets": [
            {
              "bucketAggs": [
                {
                  "field": "system.process.name",
                  "id": "2",
                  "settings": {
                    "min_doc_count": 1,
                    "order": "desc",
                    "orderBy": "1",
                    "size": "10"
                  },
                  "type": "terms"
                }
              ],
              "dsType": "elasticsearch",
              "metrics": [
                {
                  "field": "system.process.cpu.total.pct",
                  "id": "1",
                  "meta": {},
                  "settings": {},
                  "type": "max"
                },
                {
                  "field": "system.process.memory.size",
                  "id": "3",
                  "meta": {},
                  "settings": {},
                  "type": "max"
                },
                {
                  "field": "system.process.memory.rss.bytes",
                  "id": "4",
                  "meta": {},
                  "settings": {},
                  "type": "max"
                },
                {
                  "field": "system.process.memory.share",
                  "id": "5",
                  "meta": {},
                  "settings": {},
                  "type": "max"
                }
              ],
              "query": "beat.hostname:$Node",
              "refId": "A",
              "timeField": "@timestamp"
            }
          ],
          "title": "系统进程",
          "transform": "table",
          "type": "table"
        }
      ],
      "repeat": null,
      "repeatIteration": null,
      "repeatRowId": null,
      "showTitle": false,
      "title": "Dashboard Row",
      "titleSize": "h6"
    },
    {
      "collapse": false,
      "height": 250,
      "panels": [
        {
          "columns": [],
          "datasource": "监控运维",
          "fontSize": "100%",
          "id": 8,
          "links": [],
          "pageSize": null,
          "scroll": true,
          "showHeader": true,
          "sort": {
            "col": 1,
            "desc": true
          },
          "span": 12,
          "styles": [
            {
              "alias": "挂载分区",
              "dateFormat": "YYYY-MM-DD HH:mm:ss",
              "pattern": "system.filesystem.mount_point",
              "type": "string"
            },
            {
              "alias": "剩余空间",
              "colorMode": null,
              "colors": [
                "rgba(245, 54, 54, 0.9)",
                "rgba(237, 129, 40, 0.89)",
                "rgba(50, 172, 45, 0.97)"
              ],
              "dateFormat": "YYYY-MM-DD HH:mm:ss",
              "decimals": 2,
              "pattern": "system.filesystem.available",
              "thresholds": [],
              "type": "number",
              "unit": "decbytes"
            },
            {
              "alias": "使用空间",
              "colorMode": null,
              "colors": [
                "rgba(245, 54, 54, 0.9)",
                "rgba(237, 129, 40, 0.89)",
                "rgba(50, 172, 45, 0.97)"
              ],
              "dateFormat": "YYYY-MM-DD HH:mm:ss",
              "decimals": 2,
              "pattern": "system.filesystem.used.bytes",
              "thresholds": [],
              "type": "number",
              "unit": "decbytes"
            },
            {
              "alias": "总共使用空间",
              "colorMode": null,
              "colors": [
                "rgba(245, 54, 54, 0.9)",
                "rgba(237, 129, 40, 0.89)",
                "rgba(50, 172, 45, 0.97)"
              ],
              "dateFormat": "YYYY-MM-DD HH:mm:ss",
              "decimals": 2,
              "pattern": "Max",
              "thresholds": [],
              "type": "number",
              "unit": "decbytes"
            },
            {
              "alias": "",
              "colorMode": null,
              "colors": [
                "rgba(245, 54, 54, 0.9)",
                "rgba(237, 129, 40, 0.89)",
                "rgba(50, 172, 45, 0.97)"
              ],
              "decimals": 2,
              "pattern": "/.*/",
              "thresholds": [],
              "type": "number",
              "unit": "short"
            }
          ],
          "targets": [
            {
              "bucketAggs": [
                {
                  "fake": true,
                  "field": "system.filesystem.mount_point",
                  "id": "3",
                  "settings": {
                    "min_doc_count": 1,
                    "order": "desc",
                    "orderBy": "_term",
                    "size": "5"
                  },
                  "type": "terms"
                },
                {
                  "fake": true,
                  "field": "system.filesystem.available",
                  "id": "4",
                  "settings": {
                    "min_doc_count": 1,
                    "order": "desc",
                    "orderBy": "_term",
                    "size": "1"
                  },
                  "type": "terms"
                },
                {
                  "field": "system.filesystem.used.bytes",
                  "id": "2",
                  "settings": {
                    "min_doc_count": 1,
                    "order": "desc",
                    "orderBy": "_term",
                    "size": "1"
                  },
                  "type": "terms"
                }
              ],
              "dsType": "elasticsearch",
              "metrics": [
                {
                  "field": "system.filesystem.total",
                  "id": "1",
                  "meta": {},
                  "settings": {},
                  "type": "max"
                }
              ],
              "query": "beat.hostname:$Node",
              "refId": "A",
              "timeField": "@timestamp"
            }
          ],
          "title": "硬盘",
          "transform": "table",
          "type": "table"
        }
      ],
      "repeat": null,
      "repeatIteration": null,
      "repeatRowId": null,
      "showTitle": false,
      "title": "Dashboard Row",
      "titleSize": "h6"
    }
  ],
  "schemaVersion": 14,
  "style": "dark",
  "tags": [],
  "templating": {
    "list": [
      {
        "allValue": null,
        "current": {
          "text": "elastic",
          "value": "elastic"
        },
        "datasource": "监控运维",
        "hide": 0,
        "includeAll": false,
        "label": null,
        "multi": false,
        "name": "Node",
        "options": [],
        "query": "{\"find\": \"terms\", \"field\": \"beat.hostname\"}",
        "refresh": 1,
        "regex": "",
        "sort": 0,
        "tagValuesQuery": "",
        "tags": [],
        "tagsQuery": "",
        "type": "query",
        "useTags": false
      }
    ]
  },
  "time": {
    "from": "2018-01-26T05:47:13.321Z",
    "to": "2018-01-26T08:27:13.321Z"
  },
  "timepicker": {
    "refresh_intervals": [
      "5s",
      "10s",
      "30s",
      "1m",
      "5m",
      "15m",
      "30m",
      "1h",
      "2h",
      "1d"
    ],
    "time_options": [
      "5m",
      "15m",
      "1h",
      "6h",
      "12h",
      "24h",
      "2d",
      "7d",
      "30d"
    ]
  },
  "timezone": "",
  "title": "Datababy",
  "version": 4
}
```
