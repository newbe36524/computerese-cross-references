# Change: 将现有的数据转换为data.yaml

**Status**: ExecutionCompleted

## Why

当前项目是一个计算机专业术语对照仓库，主要数据存储在 `README.md` 文件的 Markdown 表格中。这种数据格式存在以下问题：

1. **数据格式固化**：当前数据以 Markdown 表格形式嵌入在 README.md 中，难以程序化处理
2. **转换不便**：无法便捷地转换为其他格式（如 JSON、数据库、API 等）
3. **维护困难**：添加或修改术语需要直接编辑 Markdown 文件，容易破坏格式
4. **脚注处理**：现有的脚注引用系统（如 `<sup>4</sup>`）和脚注定义需要结构化存储

## What Changes

- **创建 data.yaml 文件**：将 README.md 中的术语表格数据提取为结构化 YAML 格式
- **解析工具开发**：开发脚本自动解析 README.md 中的表格内容和脚注引用
- **数据结构设计**：支持按字母分组的术语（`word`, `meaning`）和脚注数据（编号、内容）
- **向后兼容**：README.md 保留作为展示层，data.yaml 作为数据源

## Impact

- **Affected specs**: 新增 `term-data` 能力规范
- **Affected code**:
  - 新增 `data.yaml` - 结构化术语数据文件
  - 新增解析脚本（待定语言/工具）
  - `README.md` - 可能保留或转换为 data.yaml 的生成结果
- **Benefits**:
  - 可维护性提升：术语数据与展示格式分离
  - 扩展性增强：可基于 data.yaml 生成多种输出格式（JSON、CSV、数据库导入等）
  - 工具化支持：便于开发自动化工具进行术语校验、去重、格式化等操作
