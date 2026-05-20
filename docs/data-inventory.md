# 画像平台一期数据盘点

## 1. 已有资产

| 资产 | 当前文件 / 表 | 可用性 | 一期用途 |
| --- | --- | --- | --- |
| 标签治理方案 | `resonate_governance_doc_after_cost.md` | 可用 | 平台范围、分类、编码、状态流转依据 |
| 标签元数据 DDL | `dim_user_tag_metadata_df_ddl.sql` | 可用 | 元数据主表设计 |
| 标签元数据草稿 | `exports/user_tag_metadata_draft_20260514.csv` | 可用 | 一期本地样例数据源 |
| 画像宽表 DDL | `dws_ad_uuid_user_profile_df_1d.sql` | 可用 | 圈选字段、敏感字段识别 |
| 画像字段清单 | `profile_tables_columns.json` | 可用 | 标签字段和值类型映射 |
| 血缘与任务信息 | `lineage_*.json`、`task_*.json` | 部分可用 | 后续血缘下钻和任务状态 |
| 飞书需求表单 | 飞书多维表格 / 表单 | 待接入 | 一期先用本地模拟需求 |

## 2. 标签元数据主表

主表：`dim_user_tag_metadata_df`

关键字段：

- `tag_id`：标签唯一 ID。
- `tag_name`：标签中文名称。
- `tag_code`：标签编码。
- `tag_category_l1` / `tag_category_l2`：标签分类。
- `tag_subject_key`：第一期统一为 `uuid`。
- `applicable_product` / `applicable_market_region`：适用产品和区域。
- `tag_value_type` / `tag_value_field_type`：标签值类型。
- `tag_status`：状态流转字段。
- `business_definition`：业务口径。
- `source_table` / `output_table` / `output_field`：技术口径和产出字段。
- `has_monitor`：是否配置监控。
- `business_owner` / `data_owner`：责任人。

当前 CSV 草稿可直接支撑标签目录、标签详情、标签地图和基础筛选。

## 3. 画像宽表

一期优先使用 `dws_ad_uuid_user_profile_df_1d`。

主键与分区：

- 用户主体：`uuid`
- 分区字段：`pt`

适合圈选的字段类型：

- 枚举/字符串：`status`、`is_vip`、`vip_type`、`member_sign_status`、`first_visit_country`
- 数值：`event_count`、`dialog_thread_cnt`、`pay_order_cnt`、`pay_amount`、`generate_media_cnt`
- 日期/时间：`signup_time`、`first_pay_time`、`member_end_time`
- 数组：`active_pt_list`、`pay_pt_list`、`download_pt_list`

敏感字段：

- 身份标识：`uuid`、`user_id`
- 联系方式：`email`
- 设备与风控：`af_register_device_id`、`af_last_login_device_id`、`af_reason`
- 订单与支付：`member_trade_biz_id`、`member_contract_sign_biz_id`、`pay_amount`、`first_pay_amount`
- IP 与渠道追踪：`first_visit_ip`、`first_visit_clickid`

## 4. 一期新增数据对象

### 4.1 人群包表

建议表名：`dwd_user_profile_audience_package`

用途：保存圈选条件、预估人数、业务用途和状态。

核心字段：

- `audience_id`
- `audience_name`
- `audience_desc`
- `condition_json`
- `logic_type`
- `estimated_user_cnt`
- `created_by`
- `business_purpose`
- `status`
- `expire_time`

### 4.2 导出任务表

建议表名：`dwd_user_profile_export_task`

用途：记录导出申请、审批、目标、行数和结果。

核心字段：

- `export_task_id`
- `audience_id`
- `requested_by`
- `export_target`
- `export_fields`
- `approval_status`
- `approved_by`
- `output_location`
- `export_user_cnt`
- `expire_time`

### 4.3 审计日志表

建议表名：`dwd_user_profile_audit_log`

用途：记录标签查看、圈选、保存、导出等行为。

核心字段：

- `audit_id`
- `actor`
- `action_type`
- `asset_type`
- `asset_id`
- `condition_json`
- `result_summary`
- `request_time`
- `risk_level`

## 5. 当前缺口

- `ads_user_tag_quality_stat` 尚未看到可直接使用的落地数据，需要先用元数据和样例规则生成质量状态。
- 飞书需求表单需要后续接入真实 Base API，一期本地先模拟需求记录。
- 画像宽表真实数据查询需要 ODPS/MaxCompute 连接，一期本地开发使用样例用户数据生成器验证交互。
- 导出到 ODPS 结果表需要发布前确认 DataWorks/MaxCompute 权限、目标库、生命周期和审批链路。

## 6. 一期处理方式

- 本地平台使用 `exports/user_tag_metadata_draft_20260514.csv` 作为标签元数据源。
- API 启动时根据元数据生成质量摘要、分类分布和样例用户标签值。
- 人群圈选、保存、导出任务和审计日志先保存在本地 JSON 文件。
- 后续接入生产数据时，把本地 JSON 存储替换为 MaxCompute 表或服务端数据库。
