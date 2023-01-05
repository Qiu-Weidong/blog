---
title: vscode插件开发
date: 2023-01-03 11:03:23
tags:
  - vscode
categories:
  - vscode
---

## script
 - `npm run watch` 启用监视模式，当修改 `TypeScript` 文件后，会自动重新编译成 `JavaScript` 文件。
 - `npm run lint` 使用 `eslint` 对代码进行静态分析。
 - `npm run compile` 将 `TypeScript` 编译为 `JavaScript` 。 
 - `npm run test` 运行测试。

## Launch
一个 `Launch.json` 的示例如下:
```json
{
	"version": "0.2.0",
	"configurations": [{
			"name": "Run Extension",
			"type": "extensionHost",
			"request": "launch",
			"runtimeExecutable": "${execPath}",
			"args": [
				"--extensionDevelopmentPath=${workspaceFolder}"
			],
			"outFiles": [
				"${workspaceFolder}/out/**/*.js"
			],
			"preLaunchTask": "npm: watch"
		}
	]
}
```
当运行插件的时候，会先执行 `npm: watch` 任务，从而监视 `TypeScript` 文件的改动并重新编译。`${execPath}` 是 `vscode` 程序的路径，因为需要用 `vscode` 来运行插件。`extensionDevelopmentPath` 是开发目录，一般指定为 `${workspaceFolder}` 。

## 项目结构
一般来说，一个 `vscode` 插件的项目结构如下所示:
```
├─.vscode
│  ├─launch.json
│  └─task.json
├─node_modules
│  └─略
├─src
│  ├─extension.ts
│  └─其他ts文件
├─.eslintrc.js
├─.gitignore
├─package-lock.json
├─package.json
├─README.md
└─tsconfig.json
```
插件的源代码位于 `src` 目录下，一般来说，`src` 目录下有一个 `extension.ts` 文件，该文件的一个示例内容如下:
```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	...
}
export function deactivate() {
	...
}

```

如果使用 `JavaScript` 而不是 `TypeScript`，那么 `extension.js` 文件的结构可能是这样的:
```javascript
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	...
}

function deactivate() { ... }

module.exports = {
	activate,
	deactivate
}

```

## 注册命令
```typescript
// 模块 `vscode` 包含 VScode 扩展的相关 API
// 导入模块并在下面的代码中使用别名 vscode 引用它
import * as vscode from 'vscode';

// 当你的扩展被激活时调用这个方法
// 你的扩展在第一次执行命令时被激活
export function activate(context: vscode.ExtensionContext) {
	// 使用控制台输出诊断信息（console.log）和错误信息（console.error）
	// 这行代码只会在你的扩展被激活时执行一次
	console.log('Congratulations, your extension "helloworld-sample" is now active!');

	// 命令在 `package.json` 文件中定义 
	// 使用 registerCommand 
	// commandId参数必须与 package.json 文件中相应字段的定义一致
	const disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// 每次运行 helloworld命令的时候都会执行以下代码

		// 向用户展示一条消息
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}

// 当扩展失活时调用
export function deactivate() {}
```

在 `package.json` 中需要对命令进行声明
```json
{
	...
	"contributes": {
		"commands": [
			{
				"command": "extension.helloWorld",
				"title": "Hello World"
			}
		]
	},
	...
}
```



## 运行测试
在 `src` 目录下添加 `test` 文件夹和相关文件，添加后的文件树如下所示:
```
├─.vscode
│  ├─launch.json
│  └─task.json
├─node_modules
│  └─略
├─src
│  ├─test
│  │  ├─suite
│  │  │  ├─extension.test.ts
│  │  │  └─index.ts
│  │  └─runTest.ts
│  ├─extension.ts
│  └─其他ts文件
├─.eslintrc.js
├─.gitignore
├─package-lock.json
├─package.json
├─README.md
└─tsconfig.json
```
在 `launch.json` 中添加配置 `Run Extension Tests`
```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"name": "Run Extension Tests",
			"type": "extensionHost",
			"request": "launch",
			"runtimeExecutable": "${execPath}",
			"args": [
				"--extensionDevelopmentPath=${workspaceFolder}",
				"--extensionTestsPath=${workspaceFolder}/out/test/suite/index"
			],
			"outFiles": ["${workspaceFolder}/out/test/**/*.js"],
			"preLaunchTask": "npm: watch"
		}
	]
}

```
在运行时选择 `Run Extension Tests` 即可进行测试。




