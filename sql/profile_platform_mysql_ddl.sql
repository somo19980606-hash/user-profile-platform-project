create table if not exists profile_tag_metadata (
    id bigint unsigned primary key auto_increment comment '自增主键',
    tag_id varchar(64) not null comment '标签唯一ID',
    tag_name varchar(255) not null comment '标签中文名称',
    tag_code varchar(255) not null comment '标签编码',
    tag_category_l1 varchar(128) not null comment '一级分类',
    tag_category_l2 varchar(128) default null comment '二级分类',
    tag_subject_key varchar(64) not null default 'uuid' comment '标签主体主键',
    applicable_product varchar(255) default null comment '适用产品',
    applicable_market_region varchar(64) default null comment '适用市场/区域',
    tag_value_type varchar(64) default null comment '标签值类型',
    tag_value_field_type varchar(128) default null comment '标签值字段类型',
    tag_value_desc text comment '标签值说明',
    tag_status varchar(64) not null comment '标签状态',
    business_definition text comment '业务口径',
    stat_period varchar(128) default null comment '统计周期',
    update_frequency varchar(64) default null comment '更新频率',
    data_latency varchar(64) default null comment '数据时效',
    source_table text comment '来源表',
    output_table varchar(255) default null comment '产出表',
    output_field varchar(255) default null comment '产出字段',
    schedule_task_name varchar(255) default null comment '调度任务名称',
    has_monitor char(1) not null default 'N' comment '是否配置监控：Y/N',
    business_owner varchar(128) default null comment '业务负责人',
    data_owner varchar(128) default null comment '数据负责人',
    sensitivity_level varchar(32) not null default 'low' comment '敏感等级：low/medium/high',
    requirement_doc_url varchar(1024) default null comment '需求文档链接',
    current_version varchar(64) default null comment '当前版本',
    online_date date default null comment '上线日期',
    latest_update_time datetime default null comment '源数据最近更新时间',
    remark text comment '备注',
    created_time datetime not null default current_timestamp comment '创建时间',
    updated_time datetime not null default current_timestamp on update current_timestamp comment '更新时间',
    unique key uk_tag_id (tag_id),
    unique key uk_tag_code (tag_code),
    key idx_category (tag_category_l1, tag_category_l2),
    key idx_status (tag_status),
    key idx_owner (data_owner),
    key idx_sensitivity (sensitivity_level)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci comment='画像平台标签元数据镜像表';

create table if not exists profile_tag_value_dict (
    id bigint unsigned primary key auto_increment comment '自增主键',
    tag_code varchar(255) not null comment '标签编码',
    value_code varchar(255) not null comment '标签值编码',
    value_name varchar(255) not null comment '标签值名称',
    value_desc text comment '标签值说明',
    sort_no int not null default 0 comment '排序',
    status varchar(32) not null default 'active' comment '状态：active/inactive',
    created_time datetime not null default current_timestamp comment '创建时间',
    updated_time datetime not null default current_timestamp on update current_timestamp comment '更新时间',
    unique key uk_tag_value (tag_code, value_code),
    key idx_tag_code (tag_code)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci comment='画像平台标签值字典表';

create table if not exists profile_audience_package (
    audience_id varchar(64) primary key comment '人群包ID',
    audience_name varchar(255) not null comment '人群包名称',
    audience_desc text comment '人群包说明',
    condition_json json not null comment '圈选条件JSON',
    logic_type varchar(16) not null default 'AND' comment '条件组合逻辑：AND/OR',
    estimated_user_cnt bigint not null default 0 comment '预估用户数',
    created_by varchar(128) not null comment '创建人',
    business_purpose text comment '业务用途',
    status varchar(32) not null default 'active' comment '状态：draft/active/expired/deleted',
    expire_time datetime default null comment '过期时间',
    created_time datetime not null default current_timestamp comment '创建时间',
    updated_time datetime not null default current_timestamp on update current_timestamp comment '更新时间',
    key idx_created_by (created_by),
    key idx_status (status),
    key idx_expire_time (expire_time)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci comment='画像平台人群包表';

create table if not exists profile_audience_version (
    version_id varchar(64) primary key comment '版本ID',
    audience_id varchar(64) not null comment '人群包ID',
    version_no varchar(32) not null comment '版本号',
    condition_json json not null comment '圈选条件JSON',
    estimated_user_cnt bigint not null default 0 comment '预估用户数',
    changed_by varchar(128) not null comment '变更人',
    change_reason text comment '变更原因',
    created_time datetime not null default current_timestamp comment '创建时间',
    unique key uk_audience_version (audience_id, version_no),
    key idx_audience_id (audience_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci comment='画像平台人群包版本表';

create table if not exists profile_export_task (
    export_task_id varchar(64) primary key comment '导出任务ID',
    audience_id varchar(64) not null comment '人群包ID',
    requested_by varchar(128) not null comment '申请人',
    business_purpose text comment '导出用途',
    export_target varchar(32) not null default 'local_csv' comment '导出目标',
    export_fields json not null comment '导出字段JSON数组',
    approval_status varchar(32) not null default 'pending' comment '审批/任务状态',
    approval_instance_id varchar(128) default null comment '飞书审批实例ID',
    approval_url varchar(1024) default null comment '飞书审批链接',
    approved_by varchar(128) default null comment '审批人',
    output_location varchar(1024) default null comment '导出结果位置',
    export_user_cnt bigint not null default 0 comment '导出用户数',
    expire_time datetime default null comment '结果过期时间',
    created_time datetime not null default current_timestamp comment '创建时间',
    updated_time datetime not null default current_timestamp on update current_timestamp comment '更新时间',
    key idx_audience_id (audience_id),
    key idx_requested_by (requested_by),
    key idx_approval_status (approval_status),
    key idx_expire_time (expire_time)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci comment='画像平台导出任务表';

create table if not exists profile_permission_grant (
    grant_id varchar(64) primary key comment '授权ID',
    subject_type varchar(32) not null comment '主体类型：user/department/role',
    subject_id varchar(128) not null comment '主体ID',
    asset_type varchar(32) not null comment '资产类型：tag/audience/export',
    asset_id varchar(255) not null comment '资产ID',
    permission_code varchar(64) not null comment '权限编码',
    expire_time datetime default null comment '授权过期时间',
    granted_by varchar(128) not null comment '授权人',
    grant_reason text comment '授权原因',
    status varchar(32) not null default 'active' comment '状态：active/expired/revoked',
    created_time datetime not null default current_timestamp comment '创建时间',
    updated_time datetime not null default current_timestamp on update current_timestamp comment '更新时间',
    unique key uk_grant (subject_type, subject_id, asset_type, asset_id, permission_code),
    key idx_subject (subject_type, subject_id),
    key idx_asset (asset_type, asset_id),
    key idx_status (status)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci comment='画像平台权限授权表';

create table if not exists profile_audit_log (
    audit_id varchar(64) primary key comment '审计日志ID',
    actor varchar(128) not null comment '操作人',
    action_type varchar(64) not null comment '操作类型',
    asset_type varchar(32) not null comment '资产类型',
    asset_id varchar(255) not null comment '资产ID',
    condition_json json default null comment '操作条件JSON',
    result_summary json default null comment '结果摘要JSON',
    risk_level varchar(32) not null default 'low' comment '风险等级：low/medium/high',
    request_time datetime not null default current_timestamp comment '请求时间',
    key idx_actor_time (actor, request_time),
    key idx_asset (asset_type, asset_id),
    key idx_action_type (action_type),
    key idx_risk_level (risk_level)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci comment='画像平台审计日志表';

create table if not exists profile_tag_requirement (
    requirement_id varchar(64) primary key comment '需求ID',
    requirement_name varchar(255) not null comment '需求名称',
    requester varchar(128) default null comment '需求联系人',
    request_department varchar(255) default null comment '使用部门',
    business_purpose text comment '业务背景和用途',
    expected_definition text comment '期望业务定义',
    expected_value_desc text comment '期望标签值形态',
    expected_value_enum text comment '期望枚举值说明',
    use_scenario json default null comment '使用场景JSON数组',
    related_project varchar(255) default null comment '活动或项目节点',
    expected_online_date date default null comment '期望上线日期',
    status varchar(64) not null default '需求中' comment '需求状态',
    feishu_record_url varchar(1024) default null comment '飞书记录链接',
    created_time datetime not null default current_timestamp comment '创建时间',
    updated_time datetime not null default current_timestamp on update current_timestamp comment '更新时间',
    key idx_status (status),
    key idx_requester (requester),
    key idx_expected_online_date (expected_online_date)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci comment='画像平台标签需求表';

create table if not exists profile_sync_log (
    sync_id varchar(64) primary key comment '同步ID',
    sync_type varchar(64) not null comment '同步类型：tag_metadata/requirement/quality',
    source_name varchar(255) not null comment '来源名称',
    target_name varchar(255) not null comment '目标名称',
    status varchar(32) not null comment '状态：success/failed/running',
    row_count int not null default 0 comment '同步行数',
    error_message text comment '错误信息',
    started_time datetime not null comment '开始时间',
    finished_time datetime default null comment '结束时间',
    key idx_sync_type (sync_type),
    key idx_status (status),
    key idx_started_time (started_time)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_0900_ai_ci comment='画像平台同步日志表';
