create table if not exists dim_user_tag_metadata_df (
    tag_id string comment '标签唯一ID，规则：TAG + 创建日期 + 当日流水号',
    tag_name string comment '标签中文名称',
    tag_code string comment '标签英文编码，用户主体标签统一使用user_前缀',
    tag_category_l1 string comment '一级分类',
    tag_category_l2 string comment '二级分类',
    tag_subject_key string comment '标签主体主键粒度，用户标签第一阶段统一为 uuid',
    applicable_product string comment '适用产品：全产品/Lovart/LibTV/Liblib.ART/星流/造次；多产品用逗号分隔',
    applicable_market_region string comment '适用市场/区域：全区域/国内/海外',
    tag_value_type string comment '标签值类型：boolean/enum/number/string/array',
    tag_value_field_type string comment '标签值字段类型',
    tag_value_desc string comment '标签值说明，枚举型标签需说明每个值含义',
    tag_status string comment '标签状态：需求中/口径确认中/待开发/开发中/待验收/已上线/暂停使用/已下线',
    business_definition string comment '业务口径定义',
    stat_period string comment '统计周期，如近7天、近30天、自然月、截至统计分区',
    update_frequency string comment '更新频率：实时/小时/日/周/月',
    data_latency string comment '数据时效：实时/T+1/T+2',
    source_table string comment '来源表，记录标签字段真实上游来源表；多个表用逗号分隔',
    output_table string comment '标签最终产出的画像宽表',
    output_field string comment '标签在产出表中的字段名',
    schedule_task_name string comment 'DataWorks调度任务名称',
    has_monitor string comment '是否配置监控：Y/N',
    business_owner string comment '业务负责人',
    data_owner string comment '数据负责人',
    replacement_tag_code string comment '替代标签编码，标签合并或下线时必填',
    offline_reason string comment '下线或暂停原因',
    offline_date string comment '下线日期',
    requirement_doc_url string comment '需求文档链接',
    current_version string comment '当前版本号',
    online_date string comment '上线日期',
    latest_update_time string comment '最近更新时间',
    remark string comment '备注'
)
comment '用户画像标签元数据主表'
partitioned by (
    dt string comment '分区日期'
)
lifecycle 36500;