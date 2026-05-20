# 用户画像平台项目包

本目录是用户画像平台当前阶段的独立项目包，已从原工作区中收拢 PRD、技术设计、数据盘点、高保真原型、轻量 MVP、SQL 设计和样例数据资产。

## 目录结构

| 目录 | 内容 |
| --- | --- |
| `docs/` | 一期 PRD、数据盘点、技术设计 |
| `prototype/` | 高保真静态原型，可直接本地预览 |
| `mvp/` | 早期轻量 Node.js MVP 骨架 |
| `sql/` | MySQL 业务库 DDL、MaxCompute 人群与审计表 DDL |
| `data-assets/` | 存量标签治理文档、标签元数据 DDL、画像宽表 DDL、字段清单、血缘和任务样例 |
| `exports/` | 标签元数据样例 CSV |

## 原型预览

在项目包目录下启动静态服务：

```bash
python3 -m http.server 8899 --directory prototype
```

访问：

```text
http://localhost:8899/
```

可直达页面：

```text
http://localhost:8899/?view=tagmap
http://localhost:8899/?view=catalog
```

## 当前阶段

当前项目仍处于一期 PRD 和高保真原型确认阶段，尚未进入正式工程化开发。后续建议先确认页面信息架构和业务流程，再基于 `mvp/` 或新建前后端工程继续开发。
