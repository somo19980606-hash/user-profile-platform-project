# 画像平台 MVP

这是画像平台一期的本地可运行版本，用于验证标签目录、标签地图、人群圈选、导出任务、质量监控、需求看板和权限审计闭环。

## 启动

```bash
npm start
```

默认访问：

```text
http://localhost:8787
```

可通过环境变量修改端口：

```bash
PORT=9000 npm start
```

## 测试

```bash
npm test
```

## 数据来源

- 标签元数据：`../exports/user_tag_metadata_draft_20260514.csv`
- 人群包：`data/audiences.json`
- 导出任务：`data/exports.json`
- 审计日志：`data/audit-log.json`

当前版本不直连生产 MaxCompute，先用元数据 CSV 和本地样例用户生成器验证平台交互。后续接入生产时，将 `src/repository.mjs` 中的数据读取替换为 MaxCompute 查询或服务端数据库。

## 一期页面

- 首页概览
- 标签目录
- 标签地图
- 人群圈选
- 人群包管理
- 导出任务
- 质量监控
- 需求看板
- 审计日志

## 安全边界

- 敏感标签参与圈选时只返回聚合预估，不默认展示用户明细。
- 导出用户级结果必须进入审批或授权状态。
- 所有标签查看、圈选预估、保存人群包、导出申请都会写审计日志。
