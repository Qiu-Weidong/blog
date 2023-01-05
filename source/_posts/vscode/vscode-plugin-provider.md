---
title: vsode-plugin-provider
date: 2023-01-04 13:22:45
tags:
  - vscode
categories:
  - vscode
---

{% graphviz maxWidth:300px %}
digraph { 
    rankdir = LR;
    node [shape="circle" color="#654321:#123456"]
    a -> v [color="#123456:#654321:#ff2465"]; 
    u [label="张三"];
    a -> u;
}
{% endgraphviz %}
## 获取设置
`vscode` 工作区目录下有 `.vscode` 目录，目录下有 `settings.json` 文件，可以通过以下代码来获取设置。
```typescript
const settings = vscode.workspace.getConfiguration('要获取的配置项');
```
## 语言配置
在 `package.json` 文件中，添加语言相关的配置。
```json
{
    ...
    "activationEvents": [
		"onLanguage:语言名称"
	],
    ...
    "contributes": {
		"languages": [
			{
				"id": "语言名称",
				"aliases": [
					"语言别名"
				],
				"extensions": [
					".语言扩展名"
				],
				"configuration": "./language.configuration.json"
			}
		],
		"grammars": [
			{
				"language": "语言名称",
				"scopeName": "source.语言扩展名",
				"path": "syntaxes/语言名称.tmLanguage"
			}
		]
	},
}
``` 


