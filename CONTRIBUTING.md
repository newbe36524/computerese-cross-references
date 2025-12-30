# 贡献指南

感谢您对 computerese-cross-references 项目的关注！

## 如何贡献

### 报告问题
- 使用 GitHub Issues 报告 bug 或提出功能建议
- 在提交 Issue 前请先搜索是否有类似问题
- 提供清晰的问题描述和重现步骤

### 提交代码
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 开发环境

### 前置要求
- Node.js >= 18.0.0
- npm

### 安装
```bash
# 克隆仓库
git clone https://github.com/EarsEyesMouth/computerese-cross-references.git
cd computerese-cross-references

# 安装依赖
npm install
```

### 构建
```bash
npm run build
```

## 代码规范

- 遵循 TypeScript 严格模式
- 使用 ES Module 语法
- 函数使用 camelCase 命名
- 提交信息使用清晰、描述性的语言

## 数据贡献

### 添加新术语
1. 编辑 `data.yaml`
2. 在相应的字母分组下添加新术语
3. 确保包含 `word` 和 `meaning` 字段
4. 运行验证：`npm run validate:data-yaml`

### 验证数据
```bash
# 验证 data.yaml
npm run validate:data-yaml

# 验证转换输出
npm run validate:conversions
```

## Pull Request 指南

- 每个 PR 应专注于单一问题或功能
- 提供清晰的 PR 描述
- 确保所有验证通过
- 更新相关文档（如需要）

## 行为准则

- 尊重所有贡献者
- 建设性的讨论和反馈
- 专注于项目改进

## 获取帮助

如有疑问，欢迎在 GitHub Issues 中提问。
