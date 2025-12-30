# 维护手册

本文档面向项目维护者，描述项目维护的相关流程和规范。

## 发布流程

本项目使用 GitHub Actions 自动化发布流程，配合 release-drafter 自动生成 Release Notes。

### 发布步骤

1. **提交并推送代码**
   ```bash
   git add .
   git commit -m "描述你的变更"
   git push origin master
   ```

### 自动处理

代码推送到 `master` 分支后，GitHub Actions 会自动完成：
- 构建项目
- 运行测试
- 生成所有格式的输出文件 (CSV, Markdown, HTML, DOCX, PDF)
- 创建 Release Draft（包含自动生成的 Release Notes 和所有构建产物）

### 发布 Release

1. 访问 https://github.com/EarsEyesMouth/computerese-cross-references/releases
2. 找到自动生成的 Draft Release
3. 检查 Release Notes（如需要可补充说明）
4. 点击 **"Publish release"** 按钮

完成！构建产物将自动变为可下载状态。

## Issue 管理

### Issue 分类标签

使用以下标签对 Issue 进行分类：

- `bug`: 缺陷报告
- `enhancement`: 功能增强
- `documentation`: 文档问题
- `data`: 数据相关
- `ci/cd`: CI/CD 相关

### Issue 处理流程

1. **新建 Issue**
   - 确认 Issue 描述清晰
   - 添加合适的标签
   - 分配优先级 (priority/high/medium/low)

2. **评估和处理**
   - 维护者评估 Issue 有效性
   - 指派负责人
   - 关联相关的 Pull Request

3. **关闭 Issue**
   - 确认问题已解决
   - 添加解决方案说明
   - 询问报告者确认（如适用）

## 版本管理

### 版本号规范

遵循语义化版本 (Semantic Versioning): `MAJOR.MINOR.PATCH`

- **MAJOR**: 不兼容的 API 变更
- **MINOR**: 向后兼容的新功能
- **PATCH**: 向后兼容的问题修复

### 分支策略

- `master`: 主分支，保持稳定
- `feature/*`: 功能开发分支
- `fix/*`: 问题修复分支
- `release/*`: 发布准备分支

## 变更日志

### 格式规范

```markdown
## [1.x.x] - YYYY-MM-DD

### Added
- 新增的功能

### Changed
- 变更的功能

### Fixed
- 修复的问题

### Removed
- 移除的功能
```

## 数据维护

### 添加术语

1. 编辑 `data.yaml`
2. 在对应字母分组添加术语
3. 验证：`npm run validate:data-yaml`
4. 重新生成所有格式：`npm run convert:all`

### 验证数据完整性

```bash
# 完整验证
npm run validate

# 仅验证数据
npm run validate:data-yaml

# 验证转换输出
npm run validate:conversions
```

## 安全相关

### 安全漏洞报告

- 通过 GitHub Private Advisory 报告
- 不在公开 Issue 中讨论安全漏洞
- 及时响应和修复

## 依赖管理

### 更新依赖

```bash
# 检查过时的依赖
npm outdated

# 更新依赖
npm update

# 审查重大变更后升级
npm install package@latest
```

### 安全审计

```bash
npm audit
npm audit fix
```

## 维护者列表

当前项目维护者：
- @EarsEyesMouth

添加新维护者需要：
1. 现有维护者提议
2. 讨论并通过
3. 更新本文件
