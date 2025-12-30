## Context

当前项目是一个计算机专业术语对照仓库，包含约 1000+ 条中英文术语对照。数据当前存储在 `README.md` 的 Markdown 表格中，按字母 A-Z 分组。每个术语包含英文单词（`Word` 列）和中文释义（`Meaning` 列）。部分术语包含脚注引用（格式：`<sup>n</sup>`），脚注定义在文档末尾（`[1]`-`[6]`）。

### 约束条件

- 必须保持数据完整性：提取后的数据应与 README.md 完全一致
- 必须保持字母分组：A-Z 的分组结构在 data.yaml 中保留
- 必须正确处理脚注：脚注引用（`<sup>n</sup>`）和脚注定义都需要结构化存储
- YAML 格式应易于人类阅读和机器解析

## Goals / Non-Goals

### Goals

- 创建机器可读的结构化数据文件（data.yaml）
- 支持按字母分组的术语存储
- 支持脚注引用和定义的分离存储
- YAML 格式简洁易读，易于转换为其他格式（JSON、CSV 等）
- 提供解析脚本，便于后续更新数据

### Non-Goals

- 不改变 README.md 的展示格式（README.md 仍作为人类可读的展示层）
- 不实现术语的增删改功能（仅提取现有数据）
- 不实现 Web API 或数据库（data.yaml 作为静态数据源）

## Decisions

### Decision 1: 数据结构设计

选择扁平化的 YAML 结构，按字母分组存储术语：

```yaml
terms:
  A:
    - word: "Abstract Factory"
      meaning: "抽象工厂"
    - word: "Algorithm-of-Thought"
      meaning: "思维算法（AoT）"
      footnotes: [6]
  # ... B-Z
footnotes:
  1: "重构列表，摘自《重构》一书。"
  2: "坏味道列表，摘自《软件设计重构》一书。"
  # ... 3-6
```

**Rationale**:
- 按字母分组与 README.md 的组织方式一致，便于映射和验证
- `footnotes` 作为数组支持一个术语有多个脚注的情况
- 顶层 `footnotes` 对象避免重复定义，便于维护

**Alternatives considered**:
1. **扁平数组结构**（无字母分组）：`terms: [{word, meaning, letter}]`
   - 优点：更简单，便于过滤和排序
   - 缺点：与 README.md 结构不一致，难以验证
2. **嵌套脚注结构**（每个术语内嵌脚注内容）
   - 优点：查询时无需二次查找
   - 缺点：脚注内容重复存储，维护困难

### Decision 2: 脚注引用格式

在 YAML 中使用数字数组存储脚注引用：

```yaml
footnotes: [4, 6]
```

**Rationale**:
- 数组格式简洁，支持多脚注
- 数字与脚注编号一一对应
- YAML 原生支持数组格式

**Alternatives considered**:
1. **对象格式**：`footnotes: {4: true, 6: true}`
   - 缺点：冗余，YAML 解析后需要转换
2. **字符串格式**：`footnotes: "4,6"`
   - 缺点：需要额外解析，不便于程序处理

### Decision 3: 解析工具选择

使用 Python 脚本解析 README.md，依赖 `PyYAML` 库生成 YAML 文件。

**Rationale**:
- Python 标准库支持正则表达式和文件解析
- `PyYAML` 是成熟的 YAML 生成库
- 脚本可复用于后续数据更新

**Alternatives considered**:
1. **手动编辑**：不推荐，容易出错且不便于后续维护
2. **使用其他语言（JavaScript/Go）**：均可，但 Python 在文本处理方面更简洁

## Data Structure Specification

### YAML Schema

```yaml
# 术语数据，按字母分组
terms:
  [A-Z]:
    - word: string          # 英文术语（必需）
      meaning: string       # 中文释义（必需）
      footnotes: [number]   # 脚注引用编号列表（可选）

# 脚注定义
footnotes:
  [1-6]: string            # 脚注内容
```

### 字段说明

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `terms` | object | 是 | 术语数据，键为 A-Z 字母 |
| `terms.[A-Z]` | array | 是 | 该字母下的术语列表 |
| `word` | string | 是 | 英文术语，保留原始大小写 |
| `meaning` | string | 是 | 中文释义，移除脚注标记（`<sup>n</sup>`） |
| `footnotes` | array | 否 | 脚注引用编号列表，仅当术语有脚注时包含 |
| `footnotes` (顶层) | object | 是 | 脚注定义，键为编号，值为内容 |

### 示例

```yaml
terms:
  A:
    - word: "Abstract Factory"
      meaning: "抽象工厂"
    - word: "Algorithm-of-Thought"
      meaning: "思维算法（AoT）"
      footnotes: [6]
    - word: "artifact"
      meaning: "构建物"
      footnotes: [4]

footnotes:
  1: "重构列表，摘自《重构》一书。"
  2: "坏味道列表，摘自《软件设计重构》一书。"
  3: "摘自《Microsoft.NET 企业级应用架构设计》一书。"
  4: "摘自《微服务设计》一书。"
  5: "摘自《领域驱动设计精粹》一书"
  6: "来自大语言模型 LLM 相关术语"
```

## Migration Plan

### Step 1: 开发解析脚本

1. 读取 `README.md` 文件
2. 使用正则表达式提取每个字母段的表格内容
3. 解析表格行，提取 `word` 和 `meaning`
4. 从 `meaning` 中提取 `<sup>n</sup>` 脚注标记
5. 提取文档末尾的脚注定义（`[1]`-`[6]`）
6. 生成 `data.yaml` 文件

### Step 2: 验证数据完整性

1. 统计 README.md 中的术语总数
2. 统计 `data.yaml` 中的术语总数
3. 逐行对比术语内容（或采样对比）
4. 验证脚注引用完整性

### Step 3: 更新文档

1. 在 `data.yaml` 头部添加注释说明
2. 在 README.md 添加 data.yaml 说明

### Rollback

如果解析结果有误：
1. 删除生成的 `data.yaml` 文件
2. 重新运行解析脚本（可能需要修复 bug）
3. 或者手动从 git 恢复

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| 解析脚本可能遗漏或错误解析某些术语 | 验证步骤：对比术语数量，采样对比内容 |
| YAML 格式可能不符合预期 | 使用 `PyYAML` 库确保格式正确，添加格式验证脚本 |
| 特殊字符（如 `|`、`:`）可能破坏 YAML 格式 | 使用 YAML 引号包裹字符串，验证生成的 YAML 可解析 |
| 脚注引用可能不一致（引用了不存在的脚注） | 验证脚本检查脚注引用完整性 |
| README.md 格式变化可能导致解析失败 | 解析脚本应足够健壮，或文档化解析规则 |

## Open Questions

1. **data.yaml 文件位置**：是否放在项目根目录？
   - 建议：是，放在根目录便于访问
2. **是否需要支持反向转换**（data.yaml → README.md）？
   - 建议：暂不需要，README.md 仍作为人工维护的展示层
3. **是否需要添加版本字段**？
   - 建议：暂不需要，git 可以追踪版本
