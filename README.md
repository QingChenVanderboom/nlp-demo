# AI Chat Demo

基于 Next.js 和 Together AI 的智能对话演示项目，采用优雅极简的 Apple 风格设计。

## ✨ 特性

- 🤖 集成 Together AI 免费大模型 (Llama-2-7b-chat)
- 🎨 Apple 风格优雅极简界面设计
- 🔒 服务端 API 代理，保护 API Key 安全
- 📱 响应式设计，支持移动端
- ⚡ 基于 Next.js 14，性能优异
- 🚀 一键部署到 Vercel

## 🚀 快速开始

### 1. 获取 Together AI API Key

1. 访问 [Together AI](https://api.together.xyz/)
2. 注册账号并获取免费 API Key
3. 复制 API Key 备用

### 2. 本地开发

```bash
# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 文件，填入你的 Together AI API Key

# 启动开发服务器
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 3. 环境变量配置

在项目根目录创建 `.env.local` 文件：

```env
TOGETHER_API_KEY=your-together-ai-api-key-here
```

## 📁 项目结构

```
ai-chat-demo/
├── pages/
│   ├── api/
│   │   └── llm.ts          # Together AI API 代理
│   ├── _app.tsx            # 全局应用配置
│   └── index.tsx           # 主页面
├── .env.example            # 环境变量示例
├── .gitignore              # Git 忽略文件
├── next.config.js          # Next.js 配置
├── package.json            # 项目依赖
├── tsconfig.json           # TypeScript 配置
└── README.md               # 项目说明
```

## 🎨 设计理念

本项目遵循 Apple 的优雅极简美学：

- **字体排版**：使用 San Francisco 和 Inter 字体
- **色彩搭配**：低饱和度配色，渐变背景
- **布局设计**：合适留白，卡片式布局
- **交互反馈**：自然动画，清晰反馈
- **响应式**：适配各种屏幕尺寸

## 🚀 部署到 Vercel

### 方法一：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel

# 设置环境变量
vercel env add TOGETHER_API_KEY
```

### 方法二：通过 GitHub 集成

1. 将代码推送到 GitHub 仓库
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 在项目设置中添加环境变量 `TOGETHER_API_KEY`
4. 部署完成

### 方法三：一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/ai-chat-demo)

## 🛠️ 技术栈

- **前端框架**：Next.js 14
- **开发语言**：TypeScript
- **AI 服务**：Together AI (Llama-2-7b-chat)
- **样式方案**：CSS-in-JS (styled-jsx)
- **包管理器**：pnpm
- **部署平台**：Vercel

## 📝 API 说明

### POST /api/llm

发送消息给 AI 模型

**请求体：**
```json
{
  "message": "你好，请介绍一下自己"
}
```

**响应：**
```json
{
  "response": "你好！我是一个AI助手..."
}
```

## 🔧 自定义配置

### 更换 AI 模型

在 `pages/api/llm.ts` 中修改 `model` 参数：

```typescript
model: 'meta-llama/Llama-2-13b-chat-hf', // 更大的模型
// 或
model: 'mistralai/Mistral-7B-Instruct-v0.1', // 其他模型
```

### 调整模型参数

```typescript
{
  max_tokens: 512,        // 最大输出长度
  temperature: 0.7,       // 创造性 (0-1)
  top_p: 0.7,            // 核采样
  repetition_penalty: 1   // 重复惩罚
}
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License