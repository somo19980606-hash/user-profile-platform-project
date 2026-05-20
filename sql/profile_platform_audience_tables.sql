create table if not exists dwd_user_profile_audience_package (
    audience_id string comment '人群包ID',
    audience_name string comment '人群包名称',
    audience_desc string comment '人群包说明',
    condition_json string comment '圈选条件JSON',
    logic_type string comment '条件组合逻辑：AND/OR',
    estimated_user_cnt bigint comment '预估命中用户数',
    created_by string comment '创建人',
    business_purpose string comment '业务用途',
    status string comment '状态：draft/active/expired/deleted',
    expire_time string comment '过期时间',
    created_time string comment '创建时间',
    updated_time string comment '更新时间'
)
comment '画像平台人群包表'
partitioned by (
    dt string comment '分区日期'
)
lifecycle 36500;

create table if not exists dwd_user_profile_export_task (
    export_task_id string comment '导出任务ID',
    audience_id string comment '人群包ID',
    requested_by string comment '申请人',
    business_purpose string comment '导出用途',
    export_target string comment '导出目标：csv/odps/crm',
    export_fields string comment '导出字段列表，JSON数组',
    approval_status string comment '审批状态：pending/approved/rejected/completed',
    approved_by string comment '审批人',
    output_location string comment '导出结果位置',
    export_user_cnt bigint comment '导出用户数',
    expire_time string comment '结果过期时间',
    created_time string comment '创建时间',
    updated_time string comment '更新时间'
)
comment '画像平台人群导出任务表'
partitioned by (
    dt string comment '分区日期'
)
lifecycle 36500;

create table if not exists dwd_user_profile_audit_log (
    audit_id string comment '审计日志ID',
    actor string comment '操作人',
    action_type string comment '操作类型：view_tag/preview_audience/save_audience/request_export/approve_export/download_export',
    asset_type string comment '资产类型：tag/audience/export',
    asset_id string comment '资产ID',
    condition_json string comment '操作条件JSON',
    result_summary string comment '结果摘要JSON',
    risk_level string comment '风险等级：low/medium/high',
    request_time string comment '请求时间'
)
comment '画像平台权限与审计日志表'
partitioned by (
    dt string comment '分区日期'
)
lifecycle 36500;
