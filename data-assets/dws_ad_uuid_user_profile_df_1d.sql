--@exclude_input=liblibaidwh.dws_ad_uuid_user_profile_df_1d
--odps sql
--********************************************************************--
--author:风君
--create time:2025-04-25 16:50:39
--********************************************************************--
-- drop table if exists dws_ad_uuid_user_profile_df_1d
-- ;
-- 使用方法说明
-- 1. 如何计算UV导出率和PV导出率
-- 1. UV导出率 = count(uuid) filter (where export_self_gen_media_cnt > 0) / count(uuid) filter (where generate_media_cnt > 0)
-- 1. PV导出率 = export_self_gen_media_cnt / generate_media_cnt
-- ‼️任何对于此表的修改，都要确认uuid的唯一性，千万不要信任业务数据
create table if not exists dws_ad_uuid_user_profile_df_1d
(
    uuid                                 string comment '登录用户UUID'
    ,user_id                             bigint comment '登录用户ID'
    ,nickname                            string comment '昵称'
    ,avatar                              string comment '头像'
    ,status                              string comment '用户状态'
    ,status_id                           bigint comment '用户状态ID'
    ,first_bind_cid                      string comment '首次绑定CID'
    ,first_access_pt                     string comment '首次访问日期'
    ,last_record_cid                     string comment '最后一个访问日期使用的第一个CID'
    ,last_access_pt                      string comment '最后访问日期'
    ,active_pt_list                      array<string> comment '访问日期列表'
    ,canvas_pt_list                      array<string> comment '画布使用日期列表'
    ,agent_pt_list                       array<string> comment 'Agent使用日期列表'
    ,sd_pt_list                          array<string> comment '生图日期列表'
    ,copy_pt_list                        array<string> comment '复制日期列表'
    ,download_pt_list                    array<string> comment '下载日期列表'
    ,collect_pt_list                     array<string> comment '收藏日期列表'
    ,share_pt_list                       array<string> comment '分享日期列表'
    ,like_pt_list                        array<string> comment '点赞日期列表'
    ,hate_pt_list                        array<string> comment '点踩日期列表'
    ,comment_pt_list                     array<string> comment '评论日期列表'
    ,is_vip                              string comment '是否VIP'
    ,vip_type                            string comment 'VIP类型'
    ,pay_pt_list                         array<string> comment '付费日期列表'
    ,member_pay_pt_list                  array<string> comment '会员付费日期列表。不含充值'
    ,recharge_pay_pt_list                array<string> comment '充值付费日期列表。不含购买会员商品'
    ,member_left_days                    bigint comment '会员剩余天数'
    ,event_map                           map<string,bigint> comment '用户事件map'
    ,event_count                         bigint comment '用户事件总数'
    ,behave_pt_list                      array<string> comment '行为日期列表'
    ,init_power_balance                  bigint comment '初始算力余额'
    ,final_power_balance                 bigint comment '最终算力余额'
    ,increase_power                      bigint comment '增加的算力点数'
    ,decrease_power                      bigint comment '消耗的算力点数。包含团队版'
    ,gift_power                          bigint comment '赠送的算力点数'
    ,agent_consume_power                 bigint comment 'Agent消耗的算力点数'
    ,dialog_thread_cnt                   bigint comment '对话数'
    ,pay_order_cnt                       bigint comment '支付订单数'
    ,pay_amount                          decimal(38,18) comment '支付金额'
    ,jwl_apply_pt                        string comment 'JWL申请日期'
    ,jwl_give_pt                         string comment 'JWL发放日期'
    ,invite_code_verified_pt             string comment '邀请码核销日期'
    ,inviter_uuid                        string comment '邀请人UUID'
    ,show_paywall                        string comment '是否显示付费墙'
    ,initiative_show_paywall             string comment '是否主动显示付费墙'
    ,passive_show_paywall                string comment '是否被动显示付费墙'
    ,click2pay                           string comment '是否点击去付费'
    ,is_sign_member                      string comment '是否签约会员。仅对在期会员生效'
    ,member_trade_biz_id                 string comment '会员订单流水ID'
    ,member_contract_sign_biz_id         string comment '会员签约单流水ID。仅对在期签约会员有效'
    ,member_contract_sign_pt             string comment '会员签约日期。最新的会员签约日期。仅对在期签约会员有效'
    ,member_contract_cancel_pt           string comment '会员取消日期。最新的会员取消日期。仅对在期签约会员有效'
    ,member_sign_status                  string comment '会员签约状态。签约中、已取消。仅对在期签约会员有效'
    ,auto_renew_status                   string comment '自动续费状态。当用户前一日的会员剩余天数为1时，才统计此值，否则值被设置为「null」。仅对在期签约会员有效'
    ,manual_renew_status                 string comment '手动续费状态。当用户前一日的会员剩余天数为0时，才统计此值，否则值被设置为「null」'
    ,psv_paywall_pt_list                 array<string> comment '被弹付费墙日期列表'
    ,agent_api_call_times                bigint comment 'Agent API调用次数'
    ,agent_api_cost                      decimal(38,18) comment 'Agent API调用成本'
    ,member_end_time                     datetime comment '会员到期时间'
    ,dialog_input_cnt                    bigint comment '对话输入数'
    ,email                               string comment '邮箱'
    ,total_pay_order_cnt                 bigint comment '历史总支付订单数'
    ,total_pay_amount                    decimal(38,18) comment '历史总支付金额'
    ,total_decrease_power                bigint comment '历史总计消耗算力点数'
    ,generate_media_cnt                  bigint comment '生成媒体数。媒体：图片、视频、音频'
    ,export_media_cnt                    bigint comment '导出媒体数'
    ,export_self_gen_media_cnt           bigint comment '导出自己生成的媒体数'
    ,agent_generate_media_cnt            bigint comment 'Agent生成媒体数'
    ,agent_export_media_cnt              bigint comment 'Agent导出媒体数'
    ,agent_export_self_gen_media_cnt     bigint comment 'Agent导出自己生成的媒体数'
    ,generator_generate_media_cnt        bigint comment '生成器生成媒体数'
    ,generator_export_media_cnt          bigint comment '导出生成器生成媒体数'
    ,generator_export_self_gen_media_cnt bigint comment '导出自己生成器生成的媒体数'
    ,af_level                            string comment '反作弊评级'
    ,af_register_device_id               string comment '反作弊注册设备ID'
    ,af_last_login_device_id             string comment '反作弊最后登录设备ID'
    ,af_reason                           string comment '反作弊原因'
    ,first_visit_country                 string comment '首次访问国家'
    ,first_visit_channel_type            string comment '首次访问渠道类型'
    ,first_visit_channel_code            string comment '首次访问渠道代码'
    ,expired_pay_power                   bigint comment '过期算力点数。应该包括会员算力过期和付费算力过期'
    ,decrease_pay_power                  bigint comment '消耗的付费算力点数'
    ,decrease_free_power                 bigint comment '消耗的免费算力点数'
    ,pays                                array<struct<day:string,count:bigint,amount:decimal(38,18)>> comment '用户支付订单，按天统计'
    ,amortize_pays                       map<string,double> comment '用户支付订单按天分摊。key：日期，value：金额'
    ,to_renew_contract_biz_id            string comment '待续费签约单ID。当前按照业务指31天前（不含统计日期）的签约单'
    ,renew_status                        string comment '续费状态。【已续费｜改签｜已取消｜代扣未成功】'
    ,historical_renew_contract_biz_id    string comment '已经不可变的签约单ID。35天前（不含统计日期）的签约单'
    ,historical_renew_status             string comment '已经不可变的续签状态。【已续费｜改签｜已取消｜代扣失败】'
    ,renew_order_cnt                     bigint comment '续费订单数'
    ,renew_amount                        decimal(38,18) comment '续费金额'
    ,costs                               map<string,double> comment '成本'
    ,renew_pt_list                       array<string> comment '续费日期列表'
    ,renews                              map<string,double> comment '续费'
    ,first_visit_ip                      string comment '首次访问IP'
    ,deleted                             bigint comment '是否删除'
    ,cid_first_access_pt                 string comment '对应CID的首访日期'
    ,is_gift_member                      string comment '是否赠送会员'
    ,signup_time                         datetime comment '注册时间'
    ,decrease_individual_power           bigint comment '消耗的个人算力'
    ,decrease_team_power                 bigint comment '消费的团队算力'
    ,first_visit_time                    datetime comment '首次访问时间'
    ,first_visit_clickid                 string comment '首次访问clickid'
    ,first_visit_utm_source              string comment '首次访问UTM来源'
    ,first_visit_utm_medium              string comment '首次访问UTM媒介'
    ,first_visit_utm_campaign            string comment '首次访问UTM活动'
    ,first_visit_utm_term                string comment '首次访问UTM关键词'
    ,first_visit_utm_content             string comment '首次访问UTM内容'
    ,first_visit_log                     string comment '首次访问日志'
    ,first_pay_time                      datetime comment '首次支付时间'
    ,first_pay_amount                    decimal(38,18) comment '首次支付金额'
    ,is_en_user                          string comment '是否英语用户: 1=是 0=否'                        
)
comment 'Lovart注册用户画像表'
partitioned by 
(
    pt                                   string
)
;

with user_init as 
(
    select  t1.uuid
            ,t1.id as user_id
            ,t1.nickname
            ,t1.avatar
            ,case    t1.status
                    when 1 then '有效'
                    else cast(t1.status as string)
            end as status
            ,t1.status as status_id
            ,t1.email
            ,t1.delete_flag as deleted
            ,dateadd(t1.create_time,wt(t1.pt,-4),'hh') as signup_time
    from    liblibaidwh.ods_w_user_df t1
    where   t1.pt = max_pt('liblibaidwh.ods_w_user_df')
    and     to_char(dateadd(t1.create_time,wt(t1.pt,-4),'hh'),'yyyyMMdd') <= '${bizdate}'
)
,order_base as 
(
    select  t1.user_id
            ,t1.trade_id
            ,t1.pay_pt
            ,t1.sku_name
            ,if(t1.sku_name like '%连续包月%',1,0) as monthly_renew_package
            ,t1.pay_amount / 100 as pay_amount
            ,if(t1.pay_pt = dsub('${bizdate}',31)
            and     t1.sku_name like '%连续包月%',1,0) as to_renew
            ,if(t1.pay_pt = dsub('${bizdate}',35)
            and     t1.sku_name like '%连续包月%',1,0) as historical_renew
            ,t1.biz_id
            ,t1.contract_biz_id
            ,t1.pay_time
            ,t2.is_renew
    from    liblibaidwh.dwd_c_order_detail_df t1
    inner join liblibaidwh.dwd_ad_c_trade_order_detail_df_1d t2
    on      t2.pt = max_pt('liblibaidwh.dwd_ad_c_trade_order_detail_df_1d')
    and     t1.trade_id = t2.id
    where   t1.pt = max_pt('liblibaidwh.dwd_c_order_detail_df')
    and     t1.is_trial = '否'
    and     t1.lib_id = 3
    and     t1.pay_pt <= '${bizdate}'
)
,contract_trade as 
(
    select  t1.user_id
            ,t1.biz_id
            ,t2.contract_biz_id
            ,t2.to_renew
            ,t2.historical_renew
            ,t1.status_id
            ,t1.status
            ,t2.pay_pt
            ,t1.is_renew
    from    liblibaidwh.dwd_ad_c_trade_order_detail_df_1d t1
    inner join order_base t2
    on      t2.contract_biz_id = t1.biz_id
    where   t1.pt = max_pt('liblibaidwh.dwd_ad_c_trade_order_detail_df_1d') -- and     t1.father_biz_id is null -- and     t1.package_shop_type = '套餐'
    and     t2.monthly_renew_package = 1
    and     t2.biz_id <> t2.contract_biz_id
    and     (
                t2.to_renew = 1
                or      t2.historical_renew = 1
    )
    qualify row_number() over (partition by t1.user_id,t2.pay_pt order by t2.pay_time desc ) = 1 --如果用户在同一天有两个签约单，按照最后一个支付的签约单统计
)
,contract_renew_base as 
(
    select  t1.*
            ,t2.pay_time as renew_time
    from    contract_trade t1
    inner join  (
                    select  *
                    from    order_base t21
                    where   t21.pay_pt > dsub('${bizdate}',35)
                ) t2
    on      t1.contract_biz_id = t2.contract_biz_id
    where   t1.biz_id <> t2.biz_id
    and     t2.pay_pt > t1.pay_pt
    qualify row_number() over (partition by t1.user_id,t1.pay_pt order by t2.pay_time asc ) = 1 --解决35天会出现2笔支付单的问题
)
,contract_renew_enh as 
(
    select  t1.*
            ,if(t1.status_id = 3,1,0) as canceled
            ,if(t2.contract_biz_id is not null,1,0) as renewed
            ,t2.renew_time
    from    contract_trade t1
    left join contract_renew_base t2
    on      t1.contract_biz_id = t2.contract_biz_id
)
,pays_stat as 
(
    select  t11.user_id
            ,collect_list(daily_pay) as pays
    from    (
                select  t1.user_id
                        ,t1.pay_pt
                        ,count(1) as count
                        ,sum(t1.pay_amount) as amount
                        ,named_struct('day',t1.pay_pt,
                                      'count',count(1),
                                      'amount',sum(t1.pay_amount)) as daily_pay
                from    order_base t1
                group by t1.user_id
                         ,t1.pay_pt
            ) t11
    group by t11.user_id
)
,renew_stat as 
(
    select  t1.user_id
            ,sort_array(collect_set(t1.pay_pt)) as renew_pt_list
            ,map_agg(t1.pay_pt,t1.pay_amount) as renews
    from    (
                select  user_id
                        ,pay_pt
                        ,cast(sum(pay_amount) as double) as pay_amount
                from    order_base
                where   is_renew = '是'
                group by user_id
                         ,pay_pt
            ) t1
    group by t1.user_id
)
,amortize_pays_stat as 
(
    select  t11.user_id
            ,map_from_arrays(collect_list(t11.amortize_date),collect_list(t11.amortize_amount)) as amortize_pays
    from    (
                select  t1.user_id
                        ,t1.amortize_date
                        ,sum(t1.amortize_amount) / 100.0 as amortize_amount
                from    liblibaidwh.dwd_c_order_amortization_df_1d t1
                where   pt = max_pt('liblibaidwh.dwd_c_order_amortization_df_1d')
                and     t1.lib_id = 3
                and     to_char(t1.create_time,'yyyyMMdd') <= '${bizdate}'
                group by t1.user_id
                         ,t1.amortize_date
            ) t11
    group by t11.user_id
)
,order_stat as 
(
    select  t1.user_id
            ,count(t1.trade_id) filter (where t1.pay_pt = '${bizdate}') as pay_order_cnt
            ,sum(t1.pay_amount) filter (where t1.pay_pt = '${bizdate}') as pay_amount
            ,count(t1.trade_id) filter (where (t1.sku_name like '%包月' or t1.sku_name like '%包年') and t1.pay_pt = '${bizdate}') as member_order_cnt
            ,count(t1.trade_id) filter (where t1.sku_name like '算力充值%' and t1.pay_pt = '${bizdate}') as recharge_order_cnt
            ,count(t1.trade_id) as total_pay_order_cnt
            ,sum(t1.pay_amount) as total_pay_amount
            ,count(t1.trade_id) filter (where t1.sku_name like '%包月' or t1.sku_name like '%包年') as total_member_order_cnt
            ,count(t1.trade_id) filter (where t1.sku_name like '算力充值%') as total_recharge_order_cnt
            ,count(t1.trade_id) filter (where t1.is_renew = '是' and t1.pay_pt = '${bizdate}') as renew_order_cnt
            ,sum(t1.pay_amount) filter (where t1.is_renew = '是' and t1.pay_pt = '${bizdate}') as renew_amount
    from    order_base t1
    group by user_id
)
,team_trans_base as 
(
    select  t3.user_id
            ,t2.amount as trans_amount
            ,to_char(dateadd(t2.create_time,wt(t2.pt,-4),'hh'),'yyyyMMdd') = '${bizdate}' as is_today
    from    liblibaidwh.ods_cc_e_team_power_trans_log_df t2
    inner join user_init t3
    on      t3.uuid = t2.user_uuid
    where   t2.pt = max_pt('liblibaidwh.ods_cc_e_team_power_trans_log_df')
    and     to_char(dateadd(t2.create_time,wt(t2.pt,-4),'hh'),'yyyyMMdd') <= '${bizdate}'
    and     t2.operation_type in ('DEDUCT','FREEZE_CONSUME')
)
,trans_users_cum as 
(
    select  t1.user_id
            ,sum(t1.trans_amount) as total_decrease_power
    from    (
                select  t1.user_id
                        ,t1.trans_amount
                from    liblibaidwh.ods_c_power_trans_log_df t1
                where   t1.pt = max_pt('liblibaidwh.ods_c_power_trans_log_df')
                and     t1.lib_id = 3
                and     t1.op_type = 2
                and     to_char(dateadd(t1.create_time,wt(t1.pt,-4),'hh'),'yyyyMMdd') <= '${bizdate}'
                and     source not in (5,11,15,16) -- 5 会员算力清零，11 每日赠送算力清零
                union all
                select  user_id
                        ,trans_amount
                from    team_trans_base
            ) t1
    group by t1.user_id
)
,be_user as 
(
    select  t2.uuid
    from    (
                select  user_id
                from    order_stat
                union
                select  user_id
                from    trans_users_cum
            ) t1
    inner join user_init t2
    on      t1.user_id = t2.user_id
)
,activity_user as 
(
     select  t11.uuid
            ,min(t11.cid) as cid
    from    liblibaidwh.dws_ad_user_activity_index_di_1d t11
    where   t11.pt = '${bizdate}'
    and     length(t11.uuid) = 32
    group by t11.uuid
)
,prev_uuid_profile as
(
    select  *
    from    (
                select  t2.*
                        ,row_number() over (
                            partition by uuid
                            order by last_access_pt desc, user_id desc
                        ) as rn
                from    dws_ad_uuid_user_profile_df_1d t2
                where   pt = dsub('${bizdate}',1)
            ) t
    where   rn = 1
)
,uuid_source as 
(
    select  coalesce(t1.uuid,t2.uuid) as uuid
            ,t1.cid
    from    activity_user t1
    full outer join be_user t2
    on      t1.uuid = t2.uuid
)
,uuid_bound as 
(
    select  t1.uuid
            ,t1.cid as first_bind_cid
            ,'${bizdate}' as first_access_pt
    from    (
                select  t11.uuid
                        ,coalesce(t11.cid,t12.cid) as cid
                from    uuid_source t11
                left join   (
                                select  uuid
                                        ,first_bind_cid as cid
                                from    prev_uuid_profile
                            ) t12
                on      t11.uuid = t12.uuid
            ) t1
    inner join liblibaidwh.dws_ad_cid_user_profile_df_1d t2
    on      t2.pt = '${bizdate}'
    and     t2.is_human = '是'
    and     t2.cid = t1.cid
    where   t1.cid is not null --如果一个用户没有CID，则订单数据会被过滤掉
    qualify row_number() over (partition by t1.uuid order by t1.cid asc ) = 1
)
,user_base as 
(
    select  t1.uuid
            ,t1.user_id
            ,t1.nickname
            ,t1.avatar
            ,t1.status
            ,t1.status_id
            ,t1.email
            ,t1.deleted
    from    user_init t1
    inner join uuid_bound t2
    on      t1.uuid = t2.uuid
)
,trans_log_base as 
(
    select  t1.user_id
            ,t1.biz_no
            ,t1.before_balance
            ,t1.after_balance
            ,t1.trans_amount
            ,t1.op_type
            ,t1.source
            ,t2.type as account_type
            ,t2.status as account_status
            ,dateadd(t1.create_time,wt(t1.pt,-4),'hh') as create_time
            ,to_char(dateadd(t1.create_time,wt(t1.pt,-4),'hh'),'yyyyMMdd') as create_pt
            ,row_number() over (partition by t1.user_id,t1.power_account_id order by t1.create_time asc ) as asc_rn
            ,row_number() over (partition by t1.user_id,t1.power_account_id order by t1.create_time desc ) as desc_rn
    from    liblibaidwh.ods_c_power_trans_log_di t1
    inner join liblibaidwh.ods_c_power_account_df t2
    on      t2.pt = max_pt('liblibaidwh.ods_c_power_account_df')
    and     t1.power_account_id = t2.id
    where   t1.pt = '${bizdate}'
    and     t1.lib_id = 3
)
,trans_users as 
(
    select  t1.user_id
            ,sum(t1.before_balance) filter (where asc_rn = 1) as init_power_balance
            ,sum(t1.after_balance) filter (where desc_rn = 1) as final_power_balance
            ,sum(t1.after_balance - t1.before_balance) filter (where op_type = 1) as increase_power
            ,sum(t1.before_balance - t1.after_balance) filter (where op_type = 2 and source not in (5,11,15,16)) as decrease_individual_power -- 5 会员算力清零，11 每日赠送算力清零
            ,sum(t1.before_balance - t1.after_balance) filter (where op_type = 2 and source in (5)) as expired_pay_power
            ,sum(t1.before_balance - t1.after_balance) filter (where op_type = 2 and source not in (5,11,15,16) and account_type in (3)) as decrease_pay_power
            ,sum(t1.before_balance - t1.after_balance) filter (where op_type = 2 and source not in (5,11,15,16) and account_type in (0,1)) as decrease_free_power
            ,sum(t1.before_balance - t1.after_balance) filter (where t1.source in (21,22)) as agent_consume_power
            ,sum(t1.after_balance - t1.before_balance) filter (where op_type = 1 and (biz_no like 'LOVART-FREE-%' or biz_no like 'GIFT_REGISTER%' or biz_no like 'GIFT_REFERRAL_USER%')) as gift_power
    from    trans_log_base t1
    group by t1.user_id
)
,team_trans_users as 
(
    select  user_id
            ,sum(trans_amount) as decrease_team_power
    from    team_trans_base
    where   is_today
    group by user_id
)
,trans_users_all as 
(
    select  coalesce(t1.user_id,t2.user_id) as user_id
            ,coalesce(init_power_balance,0) as init_power_balance
            ,coalesce(final_power_balance,0) as final_power_balance
            ,coalesce(increase_power,0) as increase_power
            ,coalesce(decrease_individual_power,0) as decrease_individual_power
            ,coalesce(expired_pay_power,0) as expired_pay_power
            ,coalesce(decrease_pay_power,0) as decrease_pay_power
            ,coalesce(decrease_free_power,0) as decrease_free_power
            ,coalesce(agent_consume_power,0) as agent_consume_power
            ,coalesce(gift_power,0) as gift_power
            ,coalesce(decrease_team_power,0) as decrease_team_power
            ,coalesce(decrease_individual_power,0) + coalesce(decrease_team_power,0) as decrease_power
    from    trans_users t1
    full outer join team_trans_users t2
    on      t1.user_id = t2.user_id
)
,agent_use_base as 
(
    select  t1.user_id
            ,t1.project_id
            ,t1.agent_thread_id
            ,length(t1.text) as prompt_len
            ,row_number() over (partition by t1.user_id order by t1.create_time asc ) as rn
    from    liblibaidwh.ods_w_project_agent_thread_df t1
    where   t1.pt = max_pt('liblibaidwh.ods_w_project_agent_thread_df')
    and     to_char(dateadd(t1.create_time,wt(t1.pt,-4),'hh'),'yyyyMMdd') = '${bizdate}'
)
,agent_use_stat as 
(
    select  t1.user_id
            ,count(t1.agent_thread_id) as dialog_input_cnt
            ,count(distinct t1.agent_thread_id) as dialog_thread_cnt
    from    agent_use_base t1
    group by t1.user_id
)
,agent_model_cost_day_stat as 
(
    select  t11.user_uuid
            ,map_agg(pt,cost) as costs
    from    (
                select  t1.user_uuid
                        ,t1.pt
                        ,cast(sum(t1.cost) as double) as cost
                from    (
                            select  t11.user_uuid
                                    ,to_char(dateadd(t11.create_time,wt(t11.pt,-4),'hh'),'yyyyMMdd') as pt
                                    ,t11.cost
                            from    liblibaidwh.ods_t_agent_payment_df_1d t11
                            where   t11.pt = max_pt('liblibaidwh.ods_t_agent_payment_df_1d')
                            and     to_char(dateadd(t11.create_time,wt(t11.pt,-4),'hh'),'yyyyMMdd') <= '${bizdate}'
                            union all
                            select  t12.user_uuid
                                    ,to_char(dateadd(t12.create_time,wt(t12.pt,-4),'hh'),'yyyyMMdd') as pt
                                    ,t12.cost
                            from    liblibaidwh.ods_t_generator_payment_df t12
                            where   t12.pt = max_pt('liblibaidwh.ods_t_generator_payment_df')
                            and     to_char(dateadd(t12.create_time,wt(t12.pt,-4),'hh'),'yyyyMMdd') <= '${bizdate}'
                        ) t1
                group by t1.user_uuid
                         ,t1.pt
            ) t11
    group by t11.user_uuid
)
,agent_model_cost_stat as 
(
    select  user_uuid
            ,count(distinct t1.model_id) as agent_model_cnt
            ,sum(t1.call_times) as agent_api_call_times
            ,sum(t1.total_amount) as agent_api_cost
    from    liblibaidwh.dws_ad_user_model_index_di_1d t1
    where   t1.pt = '${bizdate}'
    group by user_uuid
)
,uuid_be_stat as 
(
    select  t1.uuid
            ,t2.init_power_balance
            ,t2.final_power_balance
            ,t2.increase_power
            ,t2.decrease_power
            ,t2.expired_pay_power
            ,t2.decrease_pay_power
            ,t2.decrease_free_power
            ,t2.agent_consume_power
            ,t2.gift_power
            ,t3.dialog_thread_cnt
            ,t3.dialog_input_cnt
            ,t4.pay_order_cnt
            ,t4.pay_amount
            ,t4.member_order_cnt
            ,t4.recharge_order_cnt
            ,t4.total_pay_order_cnt
            ,t4.total_pay_amount
            ,t5.total_decrease_power
            ,t4.renew_order_cnt
            ,t4.renew_amount
            ,t2.decrease_individual_power
            ,t2.decrease_team_power
    from    user_base t1
    left join trans_users_all t2
    on      t1.user_id = t2.user_id
    left join agent_use_stat t3
    on      t1.user_id = t3.user_id
    left join order_stat t4
    on      t1.user_id = t4.user_id
    left join trans_users_cum t5
    on      t1.user_id = t5.user_id
)
,uuid_activity as 
(
    select  t11.*
            ,array(t11.pt) as active_pt_list
            ,if(t11.canvas_cnt > 0,array(t11.pt),array()) as canvas_pt_list
            ,if(t11.agent_cnt > 0,array(t11.pt),array()) as agent_pt_list
            ,if(t11.sd_cnt > 0,array(t11.pt),array()) as sd_pt_list
            ,array() as copy_pt_list
            ,array() as download_pt_list
            ,array() as collect_pt_list
            ,array() as share_pt_list
            ,array() as like_pt_list
            ,array() as hate_pt_list
            ,array() as comment_pt_list
            ,if(t11.pay_cnt > 0,array(t11.pt),array()) as pay_pt_list
            ,if(t11.sd_cnt + t11.agent_cnt > 0,array(t11.pt),array()) as behave_pt_list
    from    (
                select  t1.uuid
                        ,'${bizdate}' as pt
                        ,count(t1.event_name) filter (where t1.event_name like 'tool.canvas.%') as canvas_cnt
                        ,count(t1.event_name) filter (where t1.event_name = 'be.agent.dialog.thread') as agent_cnt
                        ,count(t1.event_name) filter (where t1.event_name = 'tool.canvas.gen.pic.start') as sd_cnt
                        ,count(t1.event_name) filter (where t1.event_name = 'be.trade.pay') as pay_cnt
                        ,count(t1.event_name) filter (where t1.event_name = 'training.billing.show') as wall_cnt
                        ,count(t1.event_name) filter (where t1.event_name = 'special.training.billing.show.initiative') as initiative_wall_cnt
                        ,count(t1.event_name) filter (where t1.event_name = 'special.training.billing.show.passive') as passive_wall_cnt
                        ,count(t1.event_name) filter (where t1.event_name = 'training.vip.pay.button.click') as click2pay_cnt
                        ,map_from_arrays(collect_list(t1.event_name),collect_list(t1.event_cnt)) as event_map
                        ,sum(t1.event_cnt) filter (where t1.event_name not like 'special.%') as event_cnt
                from    (
                            select  uuid
                                    ,event_name
                                    ,sum(event_cnt) as event_cnt
                            from    liblibaidwh.dws_ad_user_activity_index_di_1d
                            where   pt = '${bizdate}'
                            and     length(uuid) = 32
                            group by uuid
                                     ,event_name
                        ) t1
                group by t1.uuid
            ) t11
)
,uuid_base as 
(
    select  t1.uuid
            ,t1.user_id
            ,t1.nickname
            ,t1.avatar
            ,t1.status
            ,t1.status_id
            ,t1.email
            ,t1.deleted
            ,t3.first_bind_cid
            ,t3.first_access_pt
            ,t2.active_pt_list
            ,t2.canvas_pt_list
            ,t2.agent_pt_list
            ,t2.sd_pt_list
            ,t2.copy_pt_list
            ,t2.download_pt_list
            ,t2.collect_pt_list
            ,t2.share_pt_list
            ,t2.like_pt_list
            ,t2.hate_pt_list
            ,t2.comment_pt_list
            ,t2.pay_pt_list
            ,if(t4.member_order_cnt > 0,array('${bizdate}'),array()) as member_pay_pt_list
            ,if(t4.recharge_order_cnt > 0,array('${bizdate}'),array()) as recharge_pay_pt_list
            ,-1 as member_left_days
            ,t2.event_map
            ,t2.event_cnt
            ,t2.behave_pt_list
            ,t4.init_power_balance
            ,t4.final_power_balance
            ,coalesce(t4.increase_power,0) as increase_power
            ,coalesce(t4.decrease_power,0) as decrease_power
            ,coalesce(t4.decrease_individual_power,0) as decrease_individual_power
            ,coalesce(t4.decrease_team_power,0) as decrease_team_power
            ,coalesce(t4.expired_pay_power,0) as expired_pay_power
            ,coalesce(t4.decrease_pay_power,0) as decrease_pay_power
            ,coalesce(t4.decrease_free_power,0) as decrease_free_power
            ,coalesce(t4.total_decrease_power,0) as total_decrease_power
            ,coalesce(t4.gift_power,0) as gift_power
            ,coalesce(t4.agent_consume_power,0) as agent_consume_power
            ,coalesce(t4.dialog_thread_cnt,0) as dialog_thread_cnt
            ,coalesce(t4.dialog_input_cnt,0) as dialog_input_cnt
            ,coalesce(t4.pay_order_cnt,0) as pay_order_cnt
            ,coalesce(t4.pay_amount,0) as pay_amount
            ,coalesce(t4.total_pay_order_cnt,0) as total_pay_order_cnt
            ,coalesce(t4.total_pay_amount,0) as total_pay_amount
            ,coalesce(t4.renew_order_cnt,0) as renew_order_cnt
            ,coalesce(t4.renew_amount,0) as renew_amount
            ,if(t2.wall_cnt > 0,'是','否') as show_paywall
            ,if(t2.initiative_wall_cnt > 0,'是','否') as initiative_show_paywall
            ,if(t2.passive_wall_cnt > 0,'是','否') as passive_show_paywall
            ,if(t2.click2pay_cnt > 0,'是','否') as click2pay
            ,if(t2.passive_wall_cnt > 0,array('${bizdate}'),array()) as psv_paywall_pt_list
    from    user_base t1
    inner join uuid_activity t2
    on      t1.uuid = t2.uuid
    inner join uuid_bound t3
    on      t1.uuid = t3.uuid
    inner join uuid_be_stat t4
    on      t1.uuid = t4.uuid
)
,uuid_profile as 
(
    select  coalesce(t1.uuid,t2.uuid) as uuid
            ,coalesce(t1.user_id,t2.user_id) as user_id
            ,coalesce(t1.nickname,t2.nickname) as nickname
            ,coalesce(t1.avatar,t2.avatar) as avatar
            ,coalesce(t1.status,t2.status) as status
            ,coalesce(t1.status_id,t2.status_id) as status_id
            ,coalesce(t1.deleted,t2.deleted) as deleted
            ,coalesce(t2.first_bind_cid,t1.first_bind_cid) as first_bind_cid
            ,least(coalesce(t2.first_access_pt,'${bizdate}'),coalesce(t1.first_access_pt,'${bizdate}')) as first_access_pt
            ,coalesce(t1.first_bind_cid,t2.last_record_cid) as last_record_cid
            ,coalesce(t1.first_access_pt,t2.last_access_pt) as last_access_pt
            ,concat(coalesce(t2.active_pt_list,array()),coalesce(t1.active_pt_list,array())) as active_pt_list
            ,concat(coalesce(t2.canvas_pt_list,array()),coalesce(t1.canvas_pt_list,array())) as canvas_pt_list
            ,concat(coalesce(t2.agent_pt_list,array()),coalesce(t1.agent_pt_list,array())) as agent_pt_list
            ,concat(coalesce(t2.sd_pt_list,array()),coalesce(t1.sd_pt_list,array())) as sd_pt_list
            ,concat(coalesce(t2.copy_pt_list,array()),coalesce(t1.copy_pt_list,array())) as copy_pt_list
            ,concat(coalesce(t2.download_pt_list,array()),coalesce(t1.download_pt_list,array())) as download_pt_list
            ,concat(coalesce(t2.collect_pt_list,array()),coalesce(t1.collect_pt_list,array())) as collect_pt_list
            ,concat(coalesce(t2.share_pt_list,array()),coalesce(t1.share_pt_list,array())) as share_pt_list
            ,concat(coalesce(t2.like_pt_list,array()),coalesce(t1.like_pt_list,array())) as like_pt_list
            ,concat(coalesce(t2.hate_pt_list,array()),coalesce(t1.hate_pt_list,array())) as hate_pt_list
            ,concat(coalesce(t2.comment_pt_list,array()),coalesce(t1.comment_pt_list,array())) as comment_pt_list
            ,concat(coalesce(t2.pay_pt_list,array()),coalesce(t1.pay_pt_list,array())) as pay_pt_list
            ,concat(coalesce(t2.member_pay_pt_list,array()),coalesce(t1.member_pay_pt_list,array())) as member_pay_pt_list
            ,concat(coalesce(t2.recharge_pay_pt_list,array()),coalesce(t1.recharge_pay_pt_list,array())) as recharge_pay_pt_list
            ,concat(coalesce(t2.psv_paywall_pt_list,array()),coalesce(t1.psv_paywall_pt_list,array())) as psv_paywall_pt_list
            ,t1.event_map
            ,t1.event_cnt
            ,concat(coalesce(t2.behave_pt_list,array()),coalesce(t1.behave_pt_list,array())) as behave_pt_list
            ,coalesce(t1.init_power_balance,t2.final_power_balance,0) as init_power_balance
            ,coalesce(t1.final_power_balance,t2.final_power_balance,0) as final_power_balance
            ,coalesce(t1.increase_power,0) as increase_power
            ,coalesce(t1.decrease_power,0) as decrease_power
            ,coalesce(t1.decrease_individual_power,0) as decrease_individual_power
            ,coalesce(t1.decrease_team_power,0) as decrease_team_power
            ,coalesce(t1.expired_pay_power,0) as expired_pay_power
            ,coalesce(t1.decrease_pay_power,0) as decrease_pay_power
            ,coalesce(t1.decrease_free_power,0) as decrease_free_power
            ,coalesce(t1.total_decrease_power,0) as total_decrease_power
            ,coalesce(t1.gift_power,0) as gift_power
            ,coalesce(t1.agent_consume_power,0) as agent_consume_power
            ,coalesce(t1.dialog_thread_cnt,0) as dialog_thread_cnt
            ,coalesce(t1.dialog_input_cnt,0) as dialog_input_cnt
            ,coalesce(t1.pay_order_cnt,0) as pay_order_cnt
            ,coalesce(t1.pay_amount,0) as pay_amount
            ,coalesce(t1.renew_order_cnt,0) as renew_order_cnt
            ,coalesce(t1.renew_amount,0) as renew_amount
            ,coalesce(t1.total_pay_order_cnt,t2.total_pay_order_cnt,0) as total_pay_order_cnt
            ,coalesce(t1.total_pay_amount,t2.total_pay_amount,0) as total_pay_amount
            ,coalesce(t1.show_paywall,'否') as show_paywall
            ,coalesce(t1.initiative_show_paywall,'否') as initiative_show_paywall
            ,coalesce(t1.passive_show_paywall,'否') as passive_show_paywall
            ,coalesce(t1.click2pay,'否') as click2pay
            ,t2.member_left_days as prev_member_left_days
            ,coalesce(t1.email,t2.email) as email
            ,from_unixtime(bigint(bigint(substr(t1.first_bind_cid,1,17)) / 1000)) cid_signup_time
    from    uuid_base t1
    full outer join prev_uuid_profile t2
    on      t1.uuid = t2.uuid
)
,jwl_base as 
(
    select  t1.user_id
            ,to_char(dateadd(t1.apply_time,wt(t1.pt,-4),'hh'),'yyyyMMdd') as apply_pt
            ,to_char(
                    if(t1.status = 1,
                       if(t1.give_time is not null,dateadd(t1.give_time,wt(t1.pt,-4),'hh'),dateadd(t1.apply_time,32,'hh'))
                    ,null)
            ,'yyyyMMdd') as give_pt
    from    liblibaidwh.ods_w_lovart_waitlist_df_1d t1
    left join liblibaidwh.ods_ai_op_experience_code_df t2
    on      t2.pt = '${bizdate}'
    and     t1.invite_code = t2.code
    where   t1.pt = '${bizdate}'
    and     t2.id is null
    qualify row_number() over (partition by t1.user_id order by t1.apply_time asc ) = 1
)
,invite_code_usage as 
(
    -- select  t1.user_uuid as uuid
    --         ,to_char(dateadd(t1.create_time,-4,'hh'),'yyyyMMdd') as invite_code_verified_pt
    --         ,t2.owner as inviter_uuid
    -- from    liblibaidwh.ods_op_experience_code_usage_df t1
    -- inner join liblibaidwh.ods_ai_op_experience_code_df t2
    -- on      t2.pt = max_pt('liblibaidwh.ods_ai_op_experience_code_df')
    -- and     t2.code = t1.code
    -- where   t1.pt = max_pt('liblibaidwh.ods_op_experience_code_usage_df')
    -- qualify row_number() over (partition by t1.user_uuid order by t1.create_time asc ) = 1
    select  t1.invitee_uuid as uuid
            ,to_char(dateadd(t1.create_time,wt(t1.pt,-4),'hh'),'yyyyMMdd') as invite_code_verified_pt
            ,t1.inviter_uuid
    from    liblibaidwh.ods_op_experience_referral_relationship_df t1
    where   t1.pt = max_pt('liblibaidwh.ods_op_experience_referral_relationship_df')
    qualify row_number() over (partition by t1.invitee_uuid order by create_time ) = 1
)
,trade_order_dedup as
(
    select  *
    from    liblibaidwh.dwd_ad_c_trade_order_detail_df_1d
    where   pt = max_pt('liblibaidwh.dwd_ad_c_trade_order_detail_df_1d')
    qualify row_number() over (
        partition by biz_id
        order by updated_at desc, id desc
    ) = 1
)
,member_base as 
(                                                                                                                            
      select  mp.user_id
              ,cast(                                                                                                           
                  greatest(               
                      coalesce(mp.personal_end_time, '1970-01-01 00:00:00'),
                      coalesce(mp.team_end_time,     '1970-01-01 00:00:00')                                                    
                  ) as datetime               
              ) as member_end_time                                                                                             
              ,greatest(                                                                                                       
                  coalesce(mp.personal_left_days, 0),                                                                          
                  coalesce(mp.team_left_days,     0)                                                                           
              ) as member_left_days                                                                                            
              ,case                       
                  when mp.team_account_level = '团队版VIP'        then '团队版VIP'                                             
                  when mp.personal_account_level = '过期会员'      then '非会员'                                               
                  else coalesce(mp.personal_account_level, '非会员')
               end as vip_type                                                                                                 
              ,case                                                                                                            
                  when mp.is_member in ('是','赠送会员') then '是'                                                             
                  else '否'                                                                                                    
               end as is_vip                                                                                                   
              ,if(t4.id is not null,'是','否') as is_sign_member                                                               
              ,t1.trade_id as member_trade_biz_id                                                                              
              ,t4.biz_id as member_contract_sign_biz_id
              ,t4.created_pt as member_contract_sign_pt                                                                        
              ,if(t4.status_id = 3,to_char(t4.updated_at,'yyyyMMdd'),null) as member_contract_cancel_pt                        
              ,if(t4.id is not null,t4.status,null) as member_sign_status                                                      
              ,coalesce(mp.personal_is_gift, '否') as is_gift_member                                                           
      from    liblibaidwh.dws_ad_uuid_member_profile_df mp                                                                     
      left join (                                                                                                              
          select  user_id, trade_id                                                                                            
          from    liblibaidwh.ods_c_member_account_df                                                                          
          where   pt = '${bizdate}'                                                                                            
          and     status = 2                                                                                                   
          and     lib_id = 3                                                                                                   
          qualify row_number() over (partition by user_id order by update_time desc) = 1                                       
      ) t1                                                                                                                     
      on      t1.user_id = mp.user_id                                                                                          
      left join liblibaidwh.dwd_c_order_detail_df t2                                                                           
      on      t2.pt = max_pt('liblibaidwh.dwd_c_order_detail_df')
      and     t2.user_id = mp.user_id                                                                                          
      and     t2.biz_id = t1.trade_id                                                                                          
      and     t2.lib_id = 3                                                                                                    
      left join trade_order_dedup t3                                                               
      on      t3.biz_id = t1.trade_id                                                                                          
      left join trade_order_dedup t4
      on      t4.biz_id = t3.father_biz_id                                                                                     
      where   mp.pt = '${bizdate}'
)
,antifraud_base as 
(
    select  t1.uuid
            ,t1.ext_key
            ,t1.ext_value
            ,t1.data_type
            ,t1.create_time
            ,t1.update_time
    from    liblibaidwh.ods_ai_w_user_ext_df t1
    where   pt = '${bizdate}'
)
,af_level as 
(
    select  uuid
            ,ext_value as af_level
    from    antifraud_base
    where   ext_key = 'black_list_level'
)
,af_register_device as 
(
    select  uuid
            ,ext_value as af_register_device_id
    from    antifraud_base
    where   ext_key = 'register_device_id'
)
,af_last_login_device as 
(
    select  uuid
            ,ext_value as af_last_login_device_id
    from    antifraud_base
    where   ext_key = 'last_login_device_id'
)
,af_reason as 
(
    select  uuid
            ,ext_value as af_reason
    from    antifraud_base
    where   ext_key = 'black_list_reason'
)
,af_info as 
(
    select  t1.uuid
            ,t1.af_level
            ,t2.af_register_device_id
            ,t3.af_last_login_device_id
            ,t4.af_reason
    from    af_level t1
    left join af_register_device t2
    on      t1.uuid = t2.uuid
    left join af_last_login_device t3
    on      t1.uuid = t3.uuid
    left join af_reason t4
    on      t1.uuid = t4.uuid
)
,generator_generate_media_base as 
(
    select  t1.user_id
            ,t3.image_url as media_url
            ,parse_url(t3.image_url,'path') as media_path
            ,'generator' as source
            ,t1.create_time
    from    liblibaidwh.dwd_sd_generate_output_di_1d t1
    left join liblibaidwh.dwd_sd_generate_detail_di t2
    on      t1.generate_id = t2.id
    and     t2.biz_type = 17 -- 参考 https://codeup.aliyun.com/663dc7b313a39cc55c4cb5b8/backend/task-center/blob/release%2Fonline/task-center-api/src/main/java/com/liblibai/task/api/enums/MainTaskBizTypeEnum.java
    and     t2.pt = '${bizdate}'
    inner join liblibaidwh.ods_w_user_image_detail_df_1d t3
    on      t1.id = t3.output_id
    and     t3.pt = '${bizdate}'
    where   t1.pt = '${bizdate}'
    and     t1.deleted = 0
)
,agent_generate_media_base as 
(
    select  t1.user_id
            ,t1.media_url
            ,t1.media_path
            ,'agent' as source
            ,t1.create_time
            ,t1.start_time
            ,t1.end_time
            ,t1.step_id
    from    liblibaidwh.dwd_ad_agent_media_output_df t1
    where   t1.pt = max_pt('liblibaidwh.dwd_ad_agent_media_output_df')
    and     to_char(t1.create_time,'yyyymmdd') = '${bizdate}'
)
,generate_media_base as 
(
    select  t1.user_id
            ,t2.uuid
            ,t1.media_path
            ,t1.source
            ,t1.create_time
    from    (
                select  user_id
                        ,media_path
                        ,source
                        ,create_time
                from    generator_generate_media_base
                union all
                select  user_id
                        ,media_path
                        ,source
                        ,create_time
                from    agent_generate_media_base
            ) t1
    inner join liblibaidwh.ods_w_user_df t2
    on      t1.user_id = t2.id
    and     t2.pt = '${bizdate}'
)
,generate_media_info as 
(
    select  t1.uuid
            ,count(t1.media_path) as generate_media_cnt
            ,count(t1.media_path) filter (where t1.source = 'agent') as agent_generate_media_cnt
            ,count(t1.media_path) filter (where t1.source = 'generator') as generator_generate_media_cnt
    from    generate_media_base t1
    group by t1.uuid
)
,export_media_info as 
(
    select  t1.uuid
            ,count(distinct t1.media_url) as export_media_cnt
            ,count(distinct t1.media_url) filter (where (t1.uuid = t1.creator_uuid) or (t1.creator_uuid is null)) as export_self_gen_media_cnt
            ,count(distinct t1.media_url) filter (where t1.source = 'agent') as agent_export_media_cnt
            ,count(distinct t1.media_url) filter (where t1.source = 'agent' and (t1.uuid = t1.creator_uuid) or (t1.creator_uuid is null)) as agent_export_self_gen_media_cnt
            ,count(distinct t1.media_url) filter (where t1.source = 'generator' or t1.source is null) as generator_export_media_cnt
            ,count(distinct t1.media_url) filter (where (t1.source = 'generator' or t1.source is null) and (t1.uuid = t1.creator_uuid) or (t1.creator_uuid is null)) as generator_export_self_gen_media_cnt
    from    liblibaidwh.dwd_ad_media_export_di_1d t1
    where   t1.pt = '${bizdate}'
    group by t1.uuid
)
,uuid_profile_enh as 
(
    select  t1.uuid
            ,t1.user_id
            ,t1.nickname
            ,t1.avatar
            ,t1.status
            ,t1.status_id
            ,t1.first_bind_cid
            ,t1.first_access_pt
            ,t1.last_record_cid
            ,t1.last_access_pt
            ,t1.active_pt_list
            ,t1.canvas_pt_list
            ,t1.agent_pt_list
            ,t1.sd_pt_list
            ,t1.copy_pt_list
            ,t1.download_pt_list
            ,t1.collect_pt_list
            ,t1.share_pt_list
            ,t1.like_pt_list
            ,t1.hate_pt_list
            ,t1.comment_pt_list
            ,coalesce(t4.is_vip,'否') as is_vip
            ,coalesce(t4.vip_type,'非会员') as vip_type
            ,t1.pay_pt_list
            ,t1.member_pay_pt_list
            ,t1.recharge_pay_pt_list
            ,t4.member_left_days
            ,t1.event_map
            ,t1.event_cnt
            ,t1.behave_pt_list
            ,t1.init_power_balance
            ,t1.final_power_balance
            ,t1.increase_power
            ,t1.decrease_power
            ,t1.gift_power
            ,t1.agent_consume_power
            ,t1.dialog_thread_cnt
            ,t1.pay_order_cnt
            ,t1.pay_amount
            ,t2.apply_pt
            ,t2.give_pt
            ,t3.invite_code_verified_pt
            ,t3.inviter_uuid
            ,t1.show_paywall
            ,t1.initiative_show_paywall
            ,t1.passive_show_paywall
            ,t1.click2pay
            ,t4.is_sign_member
            ,t4.member_trade_biz_id
            ,t4.member_contract_sign_biz_id
            ,t4.member_contract_sign_pt
            ,t4.member_contract_cancel_pt
            ,t4.member_sign_status
            ,if(t4.is_sign_member = '是' and t1.prev_member_left_days = 2,if(t4.member_left_days > 2,'已续约','未续约'),null) as auto_renew_status
            ,if(t1.prev_member_left_days = 1,if(t4.member_left_days > 1,'已续约','未续约'),null) as manual_renew_status
            ,t1.psv_paywall_pt_list
            ,coalesce(t5.agent_api_call_times,0) as agent_api_call_times
            ,coalesce(t5.agent_api_cost,0) as agent_api_cost
            ,t4.member_end_time
            ,t1.dialog_input_cnt
            ,t1.email
            ,t1.total_pay_order_cnt
            ,t1.total_pay_amount
            ,t1.total_decrease_power
            ,coalesce(t8.generate_media_cnt,0) as generate_media_cnt
            ,coalesce(t9.export_media_cnt,0) as export_media_cnt
            ,coalesce(t9.export_self_gen_media_cnt,0) as export_self_gen_media_cnt
            ,coalesce(t8.agent_generate_media_cnt,0) as agent_generate_media_cnt
            ,coalesce(t9.agent_export_media_cnt,0) as agent_export_media_cnt
            ,coalesce(t9.agent_export_self_gen_media_cnt,0) as agent_export_self_gen_media_cnt
            ,coalesce(t8.generator_generate_media_cnt,0) as generator_generate_media_cnt
            ,coalesce(t9.generator_export_media_cnt,0) as generator_export_media_cnt
            ,coalesce(t9.generator_export_self_gen_media_cnt,0) as generator_export_self_gen_media_cnt
            ,t6.af_level
            ,t6.af_register_device_id
            ,t6.af_last_login_device_id
            ,t6.af_reason
            ,coalesce(t7.fixed_first_visit_country,'未知') as fixed_first_visit_country --事实上应该不能发生
            ,coalesce(t7.first_visit_channel_type,'未知') as first_visit_channel_type --事实上应该不能发生
            ,coalesce(t7.first_visit_channel_code,'000000') as first_visit_channel_code --事实上应该不能发生
            ,t1.expired_pay_power
            ,t1.decrease_pay_power
            ,t1.decrease_free_power
            ,g1.pays
            ,g2.amortize_pays
            ,g3.contract_biz_id as to_renew_contract_biz_id
            ,case   when g3.renewed = 1 then '已续费'
                    when g3.status_id = 3 and coalesce(t4.member_left_days,0) > 2 then '改签'
                    when g3.status_id = 3 then '已取消'
                    when g3.status_id = 6 and coalesce(t4.member_left_days,0) <= 2 then '代扣未成功'
            end as renew_status
            ,g4.contract_biz_id as historical_renew_contract_biz_id
            ,case   when g4.renewed = 1 then '已续费'
                    when g4.status_id = 3 and coalesce(t4.member_left_days,0) > 2 then '改签'
                    when g4.status_id = 3 then '已取消'
                    when g4.status_id = 6 and coalesce(t4.member_left_days,0) <= 2 then '代扣失败'
            end as historical_renew_status
            ,t1.renew_order_cnt
            ,t1.renew_amount
            ,coalesce(g5.costs,cast(map() as map<string,double>)) as costs
            ,g6.renew_pt_list
            ,coalesce(g6.renews,cast(map() as map<string,double>)) as renews
            ,t7.first_visit_ip
            ,t1_0.deleted
            ,t7.first_visit_date as cid_first_access_pt
            ,t4.is_gift_member
            ,greatest(t1_0.signup_time,least(cid_signup_time,t7.first_visit_time)) as signup_time
            ,t1.decrease_individual_power
            ,t1.decrease_team_power
            ,t7.first_visit_time
            ,t7.first_visit_clickid
            ,coalesce(t7.first_visit_utm_source,'无') as first_visit_utm_source
            ,coalesce(t7.first_visit_utm_medium,'无') as first_visit_utm_medium
            ,coalesce(t7.first_visit_utm_campaign,'无') as first_visit_utm_campaign
            ,coalesce(t7.first_visit_utm_term,'无') as first_visit_utm_term
            ,coalesce(t7.first_visit_utm_content,'无') as first_visit_utm_content
            ,t7.first_visit_log_str as first_visit_log
            ,g7.first_pay_time
            ,g7.first_pay_amount
            ,CASE WHEN lj.native_lang = 'en'
                      AND timezone2region(t7.last_visit_timezone) IN ('US','GB','AU','CA','NZ','IE')
                      AND t7.fixed_first_visit_country <> '中国'
                      THEN '1' ELSE '0'
                 END AS is_en_user
    from    uuid_profile t1
    inner join user_init t1_0
    on      t1.uuid = t1_0.uuid
    left join jwl_base t2
    on      (
                t1.user_id = t2.user_id
    )
    left join invite_code_usage t3
    on      (
                t3.uuid = t1.uuid
    )
    left join member_base t4
    on      (
                t4.user_id = t1.user_id
    )
    left join agent_model_cost_stat t5
    on      (
                t5.user_uuid = t1.uuid
    )
    left join af_info t6
    on      (
                t6.uuid = t1.uuid
    )
    inner join liblibaidwh.dws_ad_cid_user_profile_df_1d t7
    on      t7.pt = '${bizdate}'
    and     t1.first_bind_cid = t7.cid
    left join generate_media_info t8
    on      t8.uuid = t1.uuid
    left join export_media_info t9
    on      t9.uuid = t1.uuid
    left join pays_stat g1
    on      g1.user_id = t1.user_id
    left join amortize_pays_stat g2
    on      g2.user_id = t1.user_id
    left join contract_renew_enh g3
    on      g3.user_id = t1.user_id
    and     g3.to_renew = 1
    left join contract_renew_enh g4
    on      g4.user_id = t1.user_id
    and     g4.historical_renew = 1
    left join agent_model_cost_day_stat g5
    on      g5.user_uuid = t1.uuid
    left join renew_stat g6
    on      g6.user_id = t1.user_id
    left join liblibaidwh.dws_ad_uuid_cp_user_profile_df g7
    on g7.pt = '${bizdate}'
    and g7.user_uuid = t1.uuid
    left join liblibaidwh.dim_user_lang_judge_df_1d lj
    on      lj.pt = '${bizdate}'
    and     lj.user_id = t1.user_id
)
insert overwrite table dws_ad_uuid_user_profile_df_1d partition (pt = '${bizdate}')
select  *
from    uuid_profile_enh;

-- ‼️任何对于此表的修改，都要确认uuid的唯一性，千万不要信任业务数据
-- ‼️任何对于此表的修改，都要确认uuid的唯一性，千万不要信任业务数据
-- ‼️任何对于此表的修改，都要确认uuid的唯一性，千万不要信任业务数据