# 🐟 闲鱼聊天客户端，多账号支持，可接入AI大模型，支持自动回复等

**⚠️ 非官方！！！仅作为学习交流使用！！**
**⚠️ 注意：如有侵权联系作者删除。**

感谢大佬提供的加解密：[https://github.com/cv-cat/XianYuApis/tree/master](https://github.com/cv-cat/XianYuApis/tree/master)

## 项目介绍

基于 `electron` + `vite` + `vue` + `nodejs` 编写的具有闲鱼账号收发消息的桌面APP（仅在win端开发与测试）。

![/docs/images/des.png](/docs/images/des.png)

## 基本功能

- ✅多账号
- ✅消息提醒
- ✅自动回复
- ✅自定义消息处理逻辑

## 快速开始

### 安装依赖

```bash
yarn install
```

### 运行项目

```bash
yarn dev
```

### 打包 `.exe` 

```bash
yarn build:win
```

## 消息处理（自定义消息处理逻辑）

源代码在 `src/main/service/msg.service.ts` 中，请按需自行扩展。


## 额外说明

**本项目作为electron练习用的，请勿恶意传播或用于非法用途**

最后，感谢您的 start⭐!  有其他需求可以一起探讨~
