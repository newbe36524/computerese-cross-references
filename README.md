# 计算机专业术语对照

[![Latest Release](https://img.shields.io/github/v/release/EarsEyesMouth/computerese-cross-references)](https://github.com/EarsEyesMouth/computerese-cross-references/releases/latest)
[![Node.js Version](https://img.shields.io/node/v/EarsEyesMouth/computerese-cross-references)](https://github.com/EarsEyesMouth/computerese-cross-references)
[![License](https://img.shields.io/github/license/EarsEyesMouth/computerese-cross-references)](LICENSE)

多格式计算机术语转换工具。本项目维护包含 1000+ 计算机科学术语的结构化 `data.yaml` 文件，并将数据转换为 CSV、Markdown、HTML、Word (.docx) 和 PDF 等多种格式。

## 下载

### 快速下载

| 格式 | 文件 | 说明 |
|------|------|------|
| CSV | [terms.csv](https://github.com/EarsEyesMouth/computerese-cross-references/releases/latest/download/terms.csv) | 适用于 Excel、数据分析工具 |
| Markdown | [terms.md](https://github.com/EarsEyesMouth/computerese-cross-references/releases/latest/download/terms.md) | 适用于 Markdown 编辑器、文档工具 |
| HTML | [terms.html](https://github.com/EarsEyesMouth/computerese-cross-references/releases/latest/download/terms.html) | 适用于浏览器查看、网页嵌入 |
| Word | [terms.docx](https://github.com/EarsEyesMouth/computerese-cross-references/releases/latest/download/terms.docx) | 适用于 Microsoft Word |
| PDF | [terms.pdf](https://github.com/EarsEyesMouth/computerese-cross-references/releases/latest/download/terms.pdf) | 适用于打印、阅读 |

### 发布页面

- **最新 Release**: [![Latest Release](https://img.shields.io/github/v/release/EarsEyesMouth/computerese-cross-references)](https://github.com/EarsEyesMouth/computerese-cross-references/releases/latest)
- **所有版本**: [Releases](https://github.com/EarsEyesMouth/computerese-cross-references/releases)
- **源代码**: [GitHub](https://github.com/EarsEyesMouth/computerese-cross-references)

## 简介

本项目提供：

- **结构化数据**: `data.yaml` 包含 1000+ 计算机术语的中英文对照
- **多格式转换**: 支持 CSV、Markdown、HTML、Word、PDF 输出
- **数据验证**: 完整的数据验证流程确保数据完整性
- **TypeScript 实现**: 使用 TypeScript 编写，类型安全

## 快速开始

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

### 转换数据

```bash
# 转换所有格式
npm run convert:all

# 转换单个格式
npm run convert:csv
npm run convert:markdown
npm run convert:html
npm run convert:docx
npm run convert:pdf
```

### 验证数据

```bash
# 完整验证
npm run validate

# 仅验证 data.yaml
npm run validate:data-yaml

# 验证转换输出
npm run validate:conversions
```

## 项目结构

```
.
├── data.yaml              # 术语数据源
├── src/
│   ├── cli.ts            # CLI 入口
│   ├── commands/         # 命令实现
│   ├── converters/       # 格式转换器
│   └── templates/        # 模板文件
├── pkg/                  # 输出目录
└── openspec/             # 规范文档
```

## 输出文件

转换后的文件位于 `pkg/` 目录：

- `terms.csv` - CSV 格式
- `terms.md` - Markdown 格式
- `terms.html` - HTML 格式
- `terms.docx` - Word 文档
- `terms.pdf` - PDF 文档

## 术语文档

完整的术语对照表请查看：
- [pkg/terms.md](pkg/terms.md) - Markdown 格式
- [pkg/terms.html](pkg/terms.html) - HTML 格式

## 贡献

欢迎贡献！请查看 [贡献指南](CONTRIBUTING.md) 了解如何参与项目。

## 维护

项目维护者请参考 [维护手册](MAINTAINERS.md)。

## 数据来源

术语数据来源于计算机科学各领域，包括：
- 软件架构
- 编程语言
- 设计模式
- 云计算
- 领域驱动设计
- 大语言模型

## 许可证

[CC0 1.0 Universal License](LICENSE)

## 致谢

感谢所有为本项目做出贡献的开发者。
