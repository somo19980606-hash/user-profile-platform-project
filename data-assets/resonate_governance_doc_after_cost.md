> 适用场景：公司当前没有统一画像平台、历史标签分散、口径不统一、标签查找和复用困难。当前阶段目标：先用「飞书文档 + 数仓元数据表 + Quick BI 看板 + DataWorks 流程规范」建立轻量治理体系。

## 1. 建设目标

### 1.1 核心目标

建立一套轻量、可执行、可追溯的用户画像标签管理机制，先解决以下问题：

<callout emoji="💡" background-color="light-blue" border-color="light-blue">

第一期治理范围限定为用户主体标签，默认标签对象为 uuid。图片、视频、模型等非用户主体标签先不纳入本期分类体系，后续可复用本方案的方法论单独扩展。
</callout>

<lark-table rows="6" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      问题
    </lark-td>
    <lark-td>
      治理目标
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      标签散落在不同表中，没人知道有哪些
    </lark-td>
    <lark-td>
      建立统一标签元数据表和查询看板
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      同名不同义、同义不同名
    </lark-td>
    <lark-td>
      统一标签命名、编码、分类和口径
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      新需求直接开发，缺少前置评审
    </lark-td>
    <lark-td>
      建立增量标签需求流程和门禁
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      业务口径和技术口径不一致
    </lark-td>
    <lark-td>
      用元数据表沉淀业务口径、技术口径和责任人
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      存量标签无法复用
    </lark-td>
    <lark-td>
      对存量标签进行盘点、补录、分类和状态管理
    </lark-td>
  </lark-tr>
</lark-table>

### 1.2 当前阶段不做的事情

本阶段先不建设完整画像平台，也暂不引入复杂的标签效果评估、权限审批和标签市场能力；图片、视频、模型等非用户主体标签不进入本期分类和治理范围。

本阶段重点是把标签资产先「看得见、查得到、说得清、有人管」。

## 2. 整体建设思路

<whiteboard token="AHTuwzWHuhhWmobgLgtcfJ1nnre" align="left"/>

### 2.1 工具分工

<lark-table rows="5" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      工具
    </lark-td>
    <lark-td>
      承载内容
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      飞书文档
    </lark-td>
    <lark-td>
      需求模板、口径评审、验收记录、流程规范
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      数仓表
    </lark-td>
    <lark-td>
      标签元数据、标签变更记录、标签质量指标
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Quick BI / 阿里云 BI
    </lark-td>
    <lark-td>
      标签目录查询、筛选、统计和治理看板
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      DataWorks
    </lark-td>
    <lark-td>
      标签开发、调度、发布、任务监控
    </lark-td>
  </lark-tr>
</lark-table>

推荐原则：
> 飞书管流程和协同，数仓管元数据，Quick BI 管查询展示，DataWorks 管开发调度。

## 3. 治理范围

### 3.1 存量治理

针对已有用户画像标签表、标签宽表、标签字段、临时标签 SQL、下游使用标签，进行统一盘点和补录。

存量治理产出：

<lark-table rows="5" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      产出物
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      存量标签清单
    </lark-td>
    <lark-td>
      现有所有标签字段和标签表的盘点结果
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      标签元数据表
    </lark-td>
    <lark-td>
      统一沉淀标签名称、编码、口径、来源、负责人等
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      标签查询看板
    </lark-td>
    <lark-td>
      支持按名称、分类、状态、负责人、来源表等筛选
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      口径问题清单
    </lark-td>
    <lark-td>
      记录口径不清、重复、冲突、无人负责的标签
    </lark-td>
  </lark-tr>
</lark-table>

### 3.2 增量开发流程规范

针对后续所有新增画像标签需求，建立强制流程：

<whiteboard token="LicBwVw9thHRsKbAQE5cmbyinKg" align="left"/>

## 4. 关键规范补全

### 4.1 标签分类规范

结合公司当前产品矩阵（Lovart、LibTV、Liblib.ART、星流、造次），第一期仅对「用户主体标签」进行分类管理，采用「7 个一级分类 + 若干二级分类」的方式管理。

一级分类要保持稳定，二级分类用于承接具体业务标签。新增标签时必须同时填写一级分类、二级分类、适用产品和适用市场/区域。

#### 4.1.1 一级分类

<lark-table rows="8" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      一级分类
    </lark-td>
    <lark-td>
      分类定义
    </lark-td>
    <lark-td>
      典型标签示例
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户基础标签
    </lark-td>
    <lark-td>
      描述用户是谁、来自哪里、属于什么账号或人群
    </lark-td>
    <lark-td>
      国家/地区、语言、注册渠道、注册产品、用户身份、主活跃产品
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户行为标签
    </lark-td>
    <lark-td>
      描述用户在产品内做了什么，以及使用频次、深度和路径
    </lark-td>
    <lark-td>
      近 7 日访问次数、生成次数、导出次数、发布次数、工作流使用次数
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户偏好标签
    </lark-td>
    <lark-td>
      描述用户偏好的内容、风格、模型、功能、场景和产品形态
    </lark-td>
    <lark-td>
      偏好图片/视频、偏好设计类型、偏好风格、偏好模型、偏好行业场景
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户风险标签
    </lark-td>
    <lark-td>
      描述用户在账号、内容、支付、合规、体验等方面的风险
    </lark-td>
    <lark-td>
      异常登录、违规内容、版权风险、支付失败、异常算力消耗
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户价值标签
    </lark-td>
    <lark-td>
      描述用户对平台的综合贡献和潜在价值，不只看付费
    </lark-td>
    <lark-td>
      高频创作用户、高影响力创作者、优质内容贡献者、高传播价值用户、SMB 潜在线索
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户会员标签
    </lark-td>
    <lark-td>
      描述用户实际付费、会员状态、算力购买、算力消耗和收入贡献
    </lark-td>
    <lark-td>
      是否会员、会员等级、累计付费金额、购买算力、算力消耗场景、LTV
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户生命周期标签
    </lark-td>
    <lark-td>
      描述用户当前所处阶段，以及从注册到流失/回流的状态
    </lark-td>
    <lark-td>
      新用户、激活用户、活跃用户、沉默用户、流失用户、回流用户
    </lark-td>
  </lark-tr>
</lark-table>

#### 4.1.2 二级分类

<lark-table rows="46" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      一级分类
    </lark-td>
    <lark-td>
      二级分类
    </lark-td>
    <lark-td>
      说明与示例
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户基础标签
    </lark-td>
    <lark-td>
      账号属性
    </lark-td>
    <lark-td>
      用户 ID、账号类型、注册时间、注册产品、是否内部用户
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户基础标签
    </lark-td>
    <lark-td>
      地域语言
    </lark-td>
    <lark-td>
      国家、地区、城市、语言、时区
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户基础标签
    </lark-td>
    <lark-td>
      渠道来源
    </lark-td>
    <lark-td>
      注册渠道、投放渠道、邀请来源、自然流量/付费流量
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户基础标签
    </lark-td>
    <lark-td>
      用户身份
    </lark-td>
    <lark-td>
      设计师、视频创作者、SMB、企业用户、学生、运营、普通用户
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户基础标签
    </lark-td>
    <lark-td>
      产品归属
    </lark-td>
    <lark-td>
      首次使用产品、主活跃产品、最近活跃产品、使用产品数、跨产品用户
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户行为标签
    </lark-td>
    <lark-td>
      登录访问行为
    </lark-td>
    <lark-td>
      近 7 日登录天数、近 30 日访问次数、最近访问时间
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户行为标签
    </lark-td>
    <lark-td>
      创作行为
    </lark-td>
    <lark-td>
      生成次数、项目创建数、设计稿数量、视频生成次数
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户行为标签
    </lark-td>
    <lark-td>
      编辑加工行为
    </lark-td>
    <lark-td>
      编辑次数、二次修改次数、素材替换、局部重绘
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户行为标签
    </lark-td>
    <lark-td>
      导出发布行为
    </lark-td>
    <lark-td>
      导出次数、下载次数、发布作品数、公开视频数
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户行为标签
    </lark-td>
    <lark-td>
      社区互动行为
    </lark-td>
    <lark-td>
      点赞、收藏、评论、关注、浏览作品、浏览模型
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户行为标签
    </lark-td>
    <lark-td>
      工具使用行为
    </lark-td>
    <lark-td>
      工作流使用、模型训练、LoRA 使用、Agent 多轮设计
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户行为标签
    </lark-td>
    <lark-td>
      行为汇总
    </lark-td>
    <lark-td>
      事件 map、事件总数、行为日期列表等聚合型行为字段
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户行为标签
    </lark-td>
    <lark-td>
      跨产品行为
    </lark-td>
    <lark-td>
      Lovart 到 LibTV 转化、Liblib.ART 到星流转化、多产品活跃
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户偏好标签
    </lark-td>
    <lark-td>
      内容类型偏好
    </lark-td>
    <lark-td>
      图片、视频、海报、Logo、广告图、商品图、角色、场景
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户偏好标签
    </lark-td>
    <lark-td>
      风格偏好
    </lark-td>
    <lark-td>
      写实、二次元、3D、插画、极简、科技感、国潮
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户偏好标签
    </lark-td>
    <lark-td>
      模型偏好
    </lark-td>
    <lark-td>
      常用模型、偏好 LoRA、偏好视频模型、偏好工作流
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户偏好标签
    </lark-td>
    <lark-td>
      功能偏好
    </lark-td>
    <lark-td>
      文生图、图生图、视频特效、智能扩图、局部重绘
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户偏好标签
    </lark-td>
    <lark-td>
      行业场景偏好
    </lark-td>
    <lark-td>
      电商、游戏、教育、美妆、服饰、餐饮、地产、文旅
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户偏好标签
    </lark-td>
    <lark-td>
      规格偏好
    </lark-td>
    <lark-td>
      常用画幅、分辨率、视频比例、时长、导出格式
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户风险标签
    </lark-td>
    <lark-td>
      账号风险
    </lark-td>
    <lark-td>
      多账号、异常登录、疑似机器注册、封禁状态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户风险标签
    </lark-td>
    <lark-td>
      内容安全风险
    </lark-td>
    <lark-td>
      涉敏内容、违规生成、版权风险、审核不通过
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户风险标签
    </lark-td>
    <lark-td>
      支付风险
    </lark-td>
    <lark-td>
      支付失败、退款异常、拒付风险、异常购买
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户风险标签
    </lark-td>
    <lark-td>
      资源滥用风险
    </lark-td>
    <lark-td>
      异常算力消耗、批量刷图、接口滥用
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户风险标签
    </lark-td>
    <lark-td>
      体验风险
    </lark-td>
    <lark-td>
      生成失败高频、导出失败、投诉、客服工单
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户风险标签
    </lark-td>
    <lark-td>
      流失风险
    </lark-td>
    <lark-td>
      活跃下降、会员临期未续费、长期未创作
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户价值标签
    </lark-td>
    <lark-td>
      使用价值
    </lark-td>
    <lark-td>
      高频使用、高消耗、高导出、高创作深度
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户价值标签
    </lark-td>
    <lark-td>
      内容价值
    </lark-td>
    <lark-td>
      高质量作品、爆款作品、优质视频、高通过率内容
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户价值标签
    </lark-td>
    <lark-td>
      社区价值
    </lark-td>
    <lark-td>
      优质创作者、模型贡献者、工作流贡献者、社区影响力
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户价值标签
    </lark-td>
    <lark-td>
      传播价值
    </lark-td>
    <lark-td>
      高频分享、分享带来注册、作品带来访问、邀请用户
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户价值标签
    </lark-td>
    <lark-td>
      增长价值
    </lark-td>
    <lark-td>
      跨产品转化、带来 SMB 线索、自然传播用户
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户价值标签
    </lark-td>
    <lark-td>
      潜在价值
    </lark-td>
    <lark-td>
      高活跃未付费、高导出未付费、疑似商业使用、高付费潜力
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户会员标签
    </lark-td>
    <lark-td>
      会员身份
    </lark-td>
    <lark-td>
      是否会员、会员等级、会员类型、会员状态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户会员标签
    </lark-td>
    <lark-td>
      会员周期
    </lark-td>
    <lark-td>
      开通时间、到期时间、剩余天数、连续订阅月数
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户会员标签
    </lark-td>
    <lark-td>
      付费行为
    </lark-td>
    <lark-td>
      首次付费时间、最近付费时间、付费次数、累计付费金额
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户会员标签
    </lark-td>
    <lark-td>
      算力购买
    </lark-td>
    <lark-td>
      购买算力金额、购买算力次数、购买套餐类型
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户会员标签
    </lark-td>
    <lark-td>
      算力消耗
    </lark-td>
    <lark-td>
      消耗算力、消耗产品、消耗功能、消耗场景
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户会员标签
    </lark-td>
    <lark-td>
      续费退款
    </lark-td>
    <lark-td>
      是否续费、续费次数、退款次数、退款金额、退款原因
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户会员标签
    </lark-td>
    <lark-td>
      成本消耗
    </lark-td>
    <lark-td>
      Agent API 成本、模型调用成本、每日成本、摊销成本
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户生命周期标签
    </lark-td>
    <lark-td>
      新客阶段
    </lark-td>
    <lark-td>
      新注册、新访问、新激活、首创作
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户生命周期标签
    </lark-td>
    <lark-td>
      激活阶段
    </lark-td>
    <lark-td>
      首次生成、首次导出、首次发布、首次付费
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户生命周期标签
    </lark-td>
    <lark-td>
      成长阶段
    </lark-td>
    <lark-td>
      连续创作、功能探索、跨产品使用、使用深度提升
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户生命周期标签
    </lark-td>
    <lark-td>
      成熟阶段
    </lark-td>
    <lark-td>
      稳定活跃、高频创作、稳定付费、社区贡献
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户生命周期标签
    </lark-td>
    <lark-td>
      沉默阶段
    </lark-td>
    <lark-td>
      近 7/30 天未访问、未创作、未导出
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户生命周期标签
    </lark-td>
    <lark-td>
      流失阶段
    </lark-td>
    <lark-td>
      长期未访问、长期未创作、会员过期未回流
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户生命周期标签
    </lark-td>
    <lark-td>
      回流阶段
    </lark-td>
    <lark-td>
      召回后访问、重新创作、重新付费
    </lark-td>
  </lark-tr>
</lark-table>

#### 4.1.3 分类边界说明

<lark-table rows="5" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      容易混淆的分类
    </lark-td>
    <lark-td>
      判定原则
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户行为标签 vs 用户生命周期标签
    </lark-td>
    <lark-td>
      行为标签记录用户做了什么，生命周期标签判断用户处于什么阶段。活跃、沉默、流失优先归入生命周期。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户价值标签 vs 用户会员标签
    </lark-td>
    <lark-td>
      价值标签衡量综合贡献和潜在价值，会员标签只看实际付费、会员、算力购买和算力消耗。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户行为标签 vs 用户偏好标签
    </lark-td>
    <lark-td>
      行为标签记录动作和频次，偏好标签基于行为归纳用户更喜欢什么内容、风格、模型或功能。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户风险标签 vs 用户生命周期标签
    </lark-td>
    <lark-td>
      风险标签描述异常、合规、体验或流失风险；生命周期标签描述正常用户阶段。流失风险归风险，已流失状态归生命周期。
    </lark-td>
  </lark-tr>
</lark-table>

#### 4.1.4 适用产品字段

由于公司存在多产品矩阵，标签元数据中需要同时维护「适用产品」和「适用市场/区域」两个字段：前者区分标签适用于全产品还是某个具体产品，后者区分标签适用于国内、海外还是全区域。

适用产品支持多值，第一期元数据表用逗号分隔；建议枚举：

- 全产品
- Lovart
- LibTV
- Liblib.ART
- 星流
- 造次

适用市场/区域只维护 `全区域`、`国内`、`海外` 三类，不下钻到国家或空间粒度；建议枚举：

- 全区域
- 国内
- 海外

同一一级/二级分类下，不同产品和市场可以有各自的业务标签。例如「用户行为标签-创作行为」下，Lovart 海外可以有 Agent 设计次数，LibTV 海外可以有视频生成次数，星流国内可以有视频生成次数；如果口径完全一致，则优先复用同一个标签并通过适用产品、适用市场/区域字段标记覆盖范围。

### 4.2 标签编码规范

建议采用英文小写 + 下划线，编码在用户主体标签范围内全局唯一。跨产品/市场但业务口径一致的标签优先复用同一个 `tag_code`，只有口径、对象、统计窗口或适用范围存在实质差异时才允许新建编码。

命名结构：
```plaintext
对象_主题_指标_窗口
```

示例：

<lark-table rows="5" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      中文名称
    </lark-td>
    <lark-td>
      标签编码
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      近 30 天活跃等级
    </lark-td>
    <lark-td>
      user_active_level_30d
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      近 90 天消费层级
    </lark-td>
    <lark-td>
      user_consume_level_90d
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户生命周期阶段
    </lark-td>
    <lark-td>
      user_lifecycle_stage
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户偏好品类
    </lark-td>
    <lark-td>
      user_prefer_category
    </lark-td>
  </lark-tr>
</lark-table>

主题取值建议从一级/二级分类中提炼，但不直接使用一级分类作为主题。一级分类用于目录管理，`tag_code` 中的主题应表达更具体的业务域。

<lark-table rows="14" cols="3" header-row="true" column-widths="180,260,260">

  <lark-tr>
    <lark-td>
      主题
    </lark-td>
    <lark-td>
      适用范围
    </lark-td>
    <lark-td>
      示例编码
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      account
    </lark-td>
    <lark-td>
      账号属性、用户状态、用户 ID 类标签
    </lark-td>
    <lark-td>
      `user_account_user_id`
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      active
    </lark-td>
    <lark-td>
      访问、活跃、行为日期
    </lark-td>
    <lark-td>
      `user_active_level_30d`
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      create
    </lark-td>
    <lark-td>
      画布、生图、媒体生成、导出
    </lark-td>
    <lark-td>
      `user_create_generate_cnt_30d`
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      interact
    </lark-td>
    <lark-td>
      复制、下载、收藏、分享、点赞、评论
    </lark-td>
    <lark-td>
      `user_interact_share_cnt_30d`
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      agent
    </lark-td>
    <lark-td>
      Agent 使用、对话、API 调用
    </lark-td>
    <lark-td>
      `user_agent_call_cnt_30d`
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      member
    </lark-td>
    <lark-td>
      会员身份、会员周期、会员状态
    </lark-td>
    <lark-td>
      `user_member_status`
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      consume
    </lark-td>
    <lark-td>
      支付订单、金额、消费层级
    </lark-td>
    <lark-td>
      `user_consume_level_90d`
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      power
    </lark-td>
    <lark-td>
      算力余额、算力消耗、算力赠送
    </lark-td>
    <lark-td>
      `user_power_decrease_cnt_30d`
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      channel
    </lark-td>
    <lark-td>
      首访国家、渠道、UTM、投放归因
    </lark-td>
    <lark-td>
      `user_channel_source`
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      invite
    </lark-td>
    <lark-td>
      邀请人、邀请码、邀请核销
    </lark-td>
    <lark-td>
      `user_invite_verified_date`
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      renew
    </lark-td>
    <lark-td>
      续费状态、续费订单、续费金额
    </lark-td>
    <lark-td>
      `user_renew_status`
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      risk
    </lark-td>
    <lark-td>
      反作弊、账号风险、异常原因
    </lark-td>
    <lark-td>
      `user_risk_level`
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      value
    </lark-td>
    <lark-td>
      成本、价值贡献、潜在价值
    </lark-td>
    <lark-td>
      `user_value_cost_30d`
    </lark-td>
  </lark-tr>
</lark-table>

编码要求：

- 不使用中文、空格、特殊符号。
- 不直接使用业务黑话。
- 时间窗口必须显式体现在编码中，如 `7d`、`30d`、`90d`。
- 同一含义只能有一个主编码。

补充说明：

标签唯一 ID 和标签编码分开维护。

<lark-table rows="3" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      定义
    </lark-td>
    <lark-td>
      规则示例
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      tag_id
    </lark-td>
    <lark-td>
      标签系统唯一标识，创建后不随名称、分类、口径变化而变化
    </lark-td>
    <lark-td>
      `TAG202605060001`，即 `TAG + 创建日期 + 当日流水号`
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      tag_code
    </lark-td>
    <lark-td>
      标签业务编码，用于开发、查询和看板展示
    </lark-td>
    <lark-td>
      `user_create_video_generate_cnt_30d`
    </lark-td>
  </lark-tr>
</lark-table>

原则上 `tag_id` 永久不变；`tag_code` 也应保持稳定，如确需调整，必须记录变更原因和影响范围。

### 4.3 标签状态规范

<lark-table rows="9" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      状态
    </lark-td>
    <lark-td>
      含义
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      需求中
    </lark-td>
    <lark-td>
      业务提出需求，但口径尚未确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      口径确认中
    </lark-td>
    <lark-td>
      正在确认业务定义、标签值和使用场景
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      待开发
    </lark-td>
    <lark-td>
      口径已确认，等待开发排期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      开发中
    </lark-td>
    <lark-td>
      正在进行 SQL、调度、表结构开发
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      待验收
    </lark-td>
    <lark-td>
      已产出数据，等待业务确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      已上线
    </lark-td>
    <lark-td>
      已正式产出并可被下游使用
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      暂停使用
    </lark-td>
    <lark-td>
      暂时不推荐使用，但未下线
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      已下线
    </lark-td>
    <lark-td>
      不再产出或不再允许使用
    </lark-td>
  </lark-tr>
</lark-table>

#### 4.3.1 状态流转约束

<lark-table rows="4" cols="3" header-row="true" column-widths="180,260,300">

  <lark-tr>
    <lark-td>
      流转动作
    </lark-td>
    <lark-td>
      允许条件
    </lark-td>
    <lark-td>
      强约束
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      需求进入开发
    </lark-td>
    <lark-td>
      业务口径、标签值、适用产品、适用市场/区域已确认
    </lark-td>
    <lark-td>
      未完成元数据预登记、复用检查和责任人确认，不得进入开发
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      开发进入上线
    </lark-td>
    <lark-td>
      数据已产出并完成业务验收
    </lark-td>
    <lark-td>
      未配置监控、未记录验收链接，不得标记为已上线
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      上线标签退出
    </lark-td>
    <lark-td>
      无下游使用，或已有替代标签，或口径废弃
    </lark-td>
    <lark-td>
      必须记录替代标签、影响范围、下线原因和下线日期
    </lark-td>
  </lark-tr>
</lark-table>

### 4.4 标签复用检查

新增标签进入开发前，必须完成存量检索：

<lark-table rows="6" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      检查项
    </lark-td>
    <lark-td>
      说明
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      是否已有同名标签
    </lark-td>
    <lark-td>
      避免重复创建
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      是否已有同义标签
    </lark-td>
    <lark-td>
      避免换名字重复建设
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      是否存在口径相近标签
    </lark-td>
    <lark-td>
      判断是否可复用或扩展
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      是否和现有标签冲突
    </lark-td>
    <lark-td>
      避免同一用户被不同规则分层
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      是否需要合并或废弃旧标签
    </lark-td>
    <lark-td>
      存量治理问题同步沉淀
    </lark-td>
  </lark-tr>
</lark-table>

复用判断结果必须写入需求文档和元数据表。

#### 4.4.1 标签准入与退出规则

<callout emoji="💡" background-color="light-yellow" border-color="light-yellow">

标签准入和退出采用强约束：不满足准入条件的标签不得进入开发；未完成影响评估和替代方案说明的标签不得下线。
</callout>

<lark-table rows="4" cols="3" header-row="true" column-widths="160,280,280">

  <lark-tr>
    <lark-td>
      机制
    </lark-td>
    <lark-td>
      检查内容
    </lark-td>
    <lark-td>
      处理规则
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      准入
    </lark-td>
    <lark-td>
      分类是否唯一、编码是否唯一、是否已有同名/同义/近似标签、业务口径是否明确
    </lark-td>
    <lark-td>
      存在可复用标签时优先复用；存在冲突时必须先合并、废弃或明确边界
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      开发
    </lark-td>
    <lark-td>
      适用产品、适用市场/区域、责任人、来源表、产出表、验收方式是否齐全
    </lark-td>
    <lark-td>
      缺少任一必填元数据，不得进入开发排期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      退出
    </lark-td>
    <lark-td>
      下游使用、替代标签、历史口径影响、回溯需求是否已评估
    </lark-td>
    <lark-td>
      退出前必须记录替代标签、影响范围、下线原因和下线日期
    </lark-td>
  </lark-tr>
</lark-table>

### 4.5 验收标准

每个标签上线前至少要完成以下验收：

<lark-table rows="7" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      验收项
    </lark-td>
    <lark-td>
      要求
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      口径一致性
    </lark-td>
    <lark-td>
      业务口径和技术实现一致
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      覆盖人数
    </lark-td>
    <lark-td>
      覆盖量符合业务预期
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      分布合理性
    </lark-td>
    <lark-td>
      枚举值分布无明显异常
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      抽样校验
    </lark-td>
    <lark-td>
      抽样用户明细符合标签规则
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      产出稳定性
    </lark-td>
    <lark-td>
      调度任务成功，分区产出正常
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      下游可用性
    </lark-td>
    <lark-td>
      下游报表、圈人或系统能正常使用
    </lark-td>
  </lark-tr>
</lark-table>

### 4.6 版本和变更记录

标签口径、来源表、计算逻辑、产出字段发生变化时，必须记录版本。

<lark-table rows="9" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      字段
    </lark-td>
    <lark-td>
      示例
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      标签编码
    </lark-td>
    <lark-td>
      user_active_level_30d
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      版本号
    </lark-td>
    <lark-td>
      v1.1
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      变更类型
    </lark-td>
    <lark-td>
      口径调整
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      变更内容
    </lark-td>
    <lark-td>
      高活跃由近 30 日登录天数 >= 15 调整为 >= 12
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      生效日期
    </lark-td>
    <lark-td>
      2026-05-15
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      影响范围
    </lark-td>
    <lark-td>
      活跃等级分布、营销圈选人群
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      变更人
    </lark-td>
    <lark-td>
      数据开发负责人
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      业务确认人
    </lark-td>
    <lark-td>
      业务负责人
    </lark-td>
  </lark-tr>
</lark-table>

## 5. 存量治理实施计划
```sql
--Lovart注册用户画像表
CREATE TABLE IF NOT EXISTS dws_ad_uuid_user_profile_df_1d(
        uuid STRING COMMENT '登录用户UUID',
         user_id BIGINT COMMENT '登录用户ID',
         nickname STRING COMMENT '昵称',
         avatar STRING COMMENT '头像',
         `status` STRING COMMENT '用户状态',
         status_id BIGINT COMMENT '用户状态ID',
         first_bind_cid STRING COMMENT '首次绑定CID',
         first_access_pt STRING COMMENT '首次访问日期',
         last_record_cid STRING COMMENT '最后一个访问日期使用的第一个CID',
         last_access_pt STRING COMMENT '最后访问日期',
         active_pt_list ARRAY<STRING> COMMENT '访问日期列表',
         canvas_pt_list ARRAY<STRING> COMMENT '画布使用日期列表',
         agent_pt_list ARRAY<STRING> COMMENT 'Agent使用日期列表',
         sd_pt_list ARRAY<STRING> COMMENT '生图日期列表',
         copy_pt_list ARRAY<STRING> COMMENT '复制日期列表',
         download_pt_list ARRAY<STRING> COMMENT '下载日期列表',
         collect_pt_list ARRAY<STRING> COMMENT '收藏日期列表',
         share_pt_list ARRAY<STRING> COMMENT '分享日期列表',
         like_pt_list ARRAY<STRING> COMMENT '点赞日期列表',
         hate_pt_list ARRAY<STRING> COMMENT '点踩日期列表',
         comment_pt_list ARRAY<STRING> COMMENT '评论日期列表',
         is_vip STRING COMMENT '是否VIP',
         vip_type STRING COMMENT 'VIP类型',
         pay_pt_list ARRAY<STRING> COMMENT '付费日期列表',
         member_pay_pt_list ARRAY<STRING> COMMENT '会员付费日期列表。不含充值',
         recharge_pay_pt_list ARRAY<STRING> COMMENT '充值付费日期列表。不含购买会员商品',
         member_left_days BIGINT COMMENT '会员剩余天数',
         event_map MAP<STRING,
        BIGINT> COMMENT '用户事件map',
         event_count BIGINT COMMENT '用户事件总数',
         behave_pt_list ARRAY<STRING> COMMENT '行为日期列表',
         init_power_balance BIGINT COMMENT '初始算力余额',
         final_power_balance BIGINT COMMENT '最终算力余额',
         increase_power BIGINT COMMENT '增加的算力点数',
         decrease_power BIGINT COMMENT '消耗的算力点数。包含团队版',
         gift_power BIGINT COMMENT '赠送的算力点数',
         agent_consume_power BIGINT COMMENT 'Agent消耗的算力点数',
         dialog_thread_cnt BIGINT COMMENT '对话数',
         pay_order_cnt BIGINT COMMENT '支付订单数',
         pay_amount DECIMAL(38,18) COMMENT '支付金额',
         jwl_apply_pt STRING COMMENT 'JWL申请日期',
         jwl_give_pt STRING COMMENT 'JWL发放日期',
         invite_code_verified_pt STRING COMMENT '邀请码核销日期',
         inviter_uuid STRING COMMENT '邀请人UUID',
         show_paywall STRING COMMENT '是否显示付费墙',
         initiative_show_paywall STRING COMMENT '是否主动显示付费墙',
         passive_show_paywall STRING COMMENT '是否被动显示付费墙',
         click2pay STRING COMMENT '是否点击去付费',
         is_sign_member STRING COMMENT '是否签约会员。仅对在期会员生效',
         member_trade_biz_id STRING COMMENT '会员订单流水ID',
         member_contract_sign_biz_id STRING COMMENT '会员签约单流水ID。仅对在期签约会员有效',
         member_contract_sign_pt STRING COMMENT '会员签约日期。最新的会员签约日期。仅对在期签约会员有效',
         member_contract_cancel_pt STRING COMMENT '会员取消日期。最新的会员取消日期。仅对在期签约会员有效',
         member_sign_status STRING COMMENT '会员签约状态。签约中、已取消。仅对在期签约会员有效',
         auto_renew_status STRING COMMENT '自动续费状态。当用户前一日的会员剩余天数为1时，才统计此值，否则值被设置为「null」。仅对在期签约会员有效',
         manual_renew_status STRING COMMENT '手动续费状态。当用户前一日的会员剩余天数为0时，才统计此值，否则值被设置为「null」',
         psv_paywall_pt_list ARRAY<STRING> COMMENT '被弹付费墙日期列表',
         agent_api_call_times BIGINT COMMENT 'Agent API调用次数',
         agent_api_cost DECIMAL(38,18) COMMENT 'Agent API调用成本',
         member_end_time DATETIME COMMENT '会员到期时间',
         dialog_input_cnt BIGINT COMMENT '对话输入数',
         email STRING COMMENT '邮箱',
         total_pay_order_cnt BIGINT COMMENT '历史总支付订单数',
         total_pay_amount DECIMAL(38,18) COMMENT '历史总支付金额',
         total_decrease_power BIGINT COMMENT '历史总计消耗算力点数',
         generate_media_cnt BIGINT COMMENT '生成媒体数。媒体：图片、视频、音频',
         export_media_cnt BIGINT COMMENT '导出媒体数',
         export_self_gen_media_cnt BIGINT COMMENT '导出自己生成的媒体数',
         agent_generate_media_cnt BIGINT COMMENT 'Agent生成媒体数',
         agent_export_media_cnt BIGINT COMMENT 'Agent导出媒体数',
         agent_export_self_gen_media_cnt BIGINT COMMENT 'Agent导出自己生成的媒体数',
         generator_generate_media_cnt BIGINT COMMENT '生成器生成媒体数',
         generator_export_media_cnt BIGINT COMMENT '导出生成器生成媒体数',
         generator_export_self_gen_media_cnt BIGINT COMMENT '导出自己生成器生成的媒体数',
         af_level STRING COMMENT '反作弊评级',
         af_register_device_id STRING COMMENT '反作弊注册设备ID',
         af_last_login_device_id STRING COMMENT '反作弊最后登录设备ID',
         af_reason STRING COMMENT '反作弊原因',
         first_visit_country STRING COMMENT '首次访问国家',
         first_visit_channel_type STRING COMMENT '首次访问渠道类型',
         first_visit_channel_code STRING COMMENT '首次访问渠道代码',
         expired_pay_power BIGINT COMMENT '过期算力点数。应该包括会员算力过期和付费算力过期',
         decrease_pay_power BIGINT COMMENT '消耗的付费算力点数',
         decrease_free_power BIGINT COMMENT '消耗的免费算力点数',
         pays ARRAY<STRUCT<`day`:STRING,
         `count`:BIGINT,
         amount:DECIMAL(38,18)>> COMMENT '用户支付订单，按天统计',
         amortize_pays MAP<STRING,
        DOUBLE> COMMENT '用户支付订单按天分摊。key：日期，value：金额',
         to_renew_contract_biz_id STRING COMMENT '待续费签约单ID。当前按照业务指31天前（不含统计日期）的签约单',
         renew_status STRING COMMENT '续费状态。【已续费｜改签｜已取消｜代扣未成功】',
         historical_renew_contract_biz_id STRING COMMENT '已经不可变的签约单ID。35天前（不含统计日期）的签约单',
         historical_renew_status STRING COMMENT '已经不可变的续签状态。【已续费｜改签｜已取消｜代扣失败】',
         renew_order_cnt BIGINT COMMENT '续费订单数',
         renew_amount DECIMAL(38,18) COMMENT '续费金额',
         costs MAP<STRING,
        DOUBLE> COMMENT '成本',
         renew_pt_list ARRAY<STRING> COMMENT '续费日期列表',
         renews MAP<STRING,
        DOUBLE> COMMENT '续费',
         first_visit_ip STRING COMMENT '首次访问IP',
         deleted BIGINT COMMENT '是否删除',
         cid_first_access_pt STRING COMMENT '对应CID的首访日期',
         is_gift_member STRING COMMENT '是否赠送会员',
         signup_time DATETIME COMMENT '注册时间',
         decrease_individual_power BIGINT COMMENT '消耗的个人算力',
         decrease_team_power BIGINT COMMENT '消费的团队算力',
         first_visit_time DATETIME COMMENT '首次访问时间',
         first_visit_clickid STRING COMMENT '首次访问clickid',
         first_visit_utm_source STRING COMMENT '首次访问UTM来源',
         first_visit_utm_medium STRING COMMENT '首次访问UTM媒介',
         first_visit_utm_campaign STRING COMMENT '首次访问UTM活动',
         first_visit_utm_term STRING COMMENT '首次访问UTM关键词',
         first_visit_utm_content STRING COMMENT '首次访问UTM内容',
         first_visit_log STRING COMMENT '首次访问日志',
         first_pay_time DATETIME COMMENT '首次支付时间',
         first_pay_amount DECIMAL(38,18) COMMENT '首次支付金额',
         is_en_user STRING COMMENT '是否英语用户: 1=是 0=否'
) 
PARTITIONED BY (pt STRING) STORED AS aliorc 
TBLPROPERTIES ('columnar.nested.type'='true',
         'comment'='Lovart注册用户画像表');


--用户商业化支付画像
CREATE TABLE IF NOT EXISTS dws_ad_uuid_cp_user_profile_df(
        user_id BIGINT COMMENT '用户ID',
         user_uuid STRING COMMENT '用户UUID',
         ever_vip STRING COMMENT '是否曾经是VIP.y: 是;n: 否',
         first_pay_id BIGINT COMMENT '首次支付支付单ID',
         first_pay_biz_id STRING COMMENT '首次支付业务流水号',
         first_pay_time DATETIME COMMENT '首次支付时间',
         first_pay_pt STRING COMMENT '首次支付时间',
         first_pay_sku STRING COMMENT '首次支付SKU',
         first_pay_amount DECIMAL(38,18) COMMENT '首次付款金额',
         first_pay_vip_type STRING COMMENT '首次支付VIP类型',
         first_pay_vip_period_type STRING COMMENT '首次支付会员期限类型',
         pay_amount DECIMAL(38,18) COMMENT '支付金额',
         pay_cnt BIGINT COMMENT '支付笔数',
         renew_amount DECIMAL(38,18) COMMENT '续费金额',
         renew_cnt BIGINT COMMENT '续费笔数',
         total_pay_amount DECIMAL(38,18) COMMENT '总支付金额',
         total_pay_cnt BIGINT COMMENT '总支付笔数',
         pay_pt_list ARRAY<STRING> COMMENT '支付日期列表',
         is_vip STRING COMMENT '是否VIP. y:是;n:否',
         vip_biz_id STRING COMMENT 'VIP业务流水号',
         vip_type STRING COMMENT 'VIP类型',
         sku_name STRING COMMENT 'VIP SKU名称',
         vip_period_type STRING COMMENT '会员期限类型',
         vip_start_time DATETIME COMMENT '会员开始时间',
         vip_end_time DATETIME COMMENT '会员失效时间',
         vip_left_days BIGINT COMMENT '会员剩余天数',
         to_renew_contract_id STRING COMMENT '待续费合同ID',
         historical_to_renew_contract_id STRING COMMENT '历史待续费合同ID',
         to_renew STRING COMMENT '是否待续费会员（31天）',
         historical_to_renew STRING COMMENT '是否待续费会员（35天）',
         renew_status STRING COMMENT '续费状态（31天）。renew｜resign｜cancel｜refund｜break(default)',
         historical_renew_status STRING COMMENT '续费状态（35天）。renew｜resign｜cancel｜refund｜break(default)',
         amortize_month_amount DECIMAL(38,18) COMMENT '分摊到月的金额',
         contract_start_time DATETIME COMMENT '当前会员合约开始时间'
) 
PARTITIONED BY (pt STRING COMMENT '支付日期') STORED AS aliorc 
TBLPROPERTIES ('columnar.nested.type'='true',
         'comment'='用户商业化支付画像');


--uuid活跃画像表
CREATE TABLE IF NOT EXISTS dws_uuid_active_profile_df(
        uuid STRING,
         lovart_web_active_day_list ARRAY<STRING> COMMENT 'Lovart Web活跃日期列表(yyyymmdd, 增序)',
         lovart_web_first_visit_cid STRING COMMENT 'Lovart Web首次进站使用的cid',
         lovart_web_first_visit_referral_code STRING COMMENT 'Lovart Web首次进站使用的邀请码(没有则为空)',
         lovart_web_first_visit_utm_channel STRING COMMENT 'Lovart Web首次进站使用的渠道号(没有则为空)',
         lovart_web_first_visit_time DATETIME COMMENT 'Lovart Web首访时间',
         lovart_web_first_visit_pt STRING COMMENT 'Lovart Web首访日期(yyyymmdd)',
         lovart_web_first_visit_country STRING COMMENT 'Lovart Web首次访问所在国家',
         lovart_web_first_visit_province STRING COMMENT 'Lovart Web首次访问所在省份',
         lovart_web_last_visit_cid STRING COMMENT 'Lovart Web末次进站使用的cid',
         lovart_web_last_visit_referral_code STRING COMMENT 'Lovart Web末次进站使用的邀请码(没有则为空)',
         lovart_web_last_visit_utm_channel STRING COMMENT 'Lovart Web末次进站使用的渠道号(没有则为空)',
         lovart_web_last_visit_time DATETIME COMMENT 'Lovart Web末次访时间',
         lovart_web_last_visit_pt STRING COMMENT 'Lovart Web末次访日期(yyyymmdd)',
         lovart_web_last_visit_country STRING COMMENT 'Lovart Web末次访问所在国家',
         lovart_web_last_visit_province STRING COMMENT 'Lovart Web末次访问所在省份',
         first_use_referral_code STRING COMMENT 'Lovart Web首次使用的邀请码(没有则为空)',
         first_use_user_time DATETIME COMMENT 'Lovart Web首次使用邀请码时间(没有则为空)',
         first_use_user_pt STRING COMMENT 'Lovart Web首次使用邀请码日期(yyyymmdd,  没有则为空)'
) 
PARTITIONED BY (pt STRING) STORED AS aliorc 
TBLPROPERTIES ('columnar.nested.type'='true',
         'comment'='uuid活跃画像表') 
LIFECYCLE 36500;
```

### 5.1 存量治理流程

存量治理的目标不是一次性把所有历史标签都治理完，而是先把仍在被使用、影响业务决策和下游系统的标签盘清楚、录进去、对齐口径。

整体流程如下：

<whiteboard token="IzhlwKDcAhwomPbwGescKRmvnNd" align="left"/>

<lark-table rows="10" cols="4" header-row="true" column-widths="183,183,183,183">

  <lark-tr>
    <lark-td>
      步骤
    </lark-td>
    <lark-td>
      主要工作
    </lark-td>
    <lark-td>
      重点确认
    </lark-td>
    <lark-td>
      产出物
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      1. 收集存量标签资产
    </lark-td>
    <lark-td>
      收集现有标签表、画像宽表、临时标签表、下游报表、运营圈人任务和核心 SQL
    </lark-td>
    <lark-td>
      哪些标签仍在产出，哪些标签仍被业务或系统使用
    </lark-td>
    <lark-td>
      存量标签来源清单
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      2. 识别标签字段和使用情况
    </lark-td>
    <lark-td>
      从表结构、字段名、SQL 逻辑和下游引用中识别标签字段
    </lark-td>
    <lark-td>
      标签主键、产出表、产出字段、更新频率、下游使用方
    </lark-td>
    <lark-td>
      标签字段清单
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      3. 反查业务口径和技术口径
    </lark-td>
    <lark-td>
      通过历史文档、SQL、任务负责人和业务使用方补充标签定义
    </lark-td>
    <lark-td>
      标签到底是什么意思、怎么算、适用于什么场景
    </lark-td>
    <lark-td>
      标签口径草稿
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      4. 标签分类归档
    </lark-td>
    <lark-td>
      按「一级分类 + 二级分类 + 适用产品」对标签归类
    </lark-td>
    <lark-td>
      一级分类、二级分类、适用产品是否准确
    </lark-td>
    <lark-td>
      分类后的标签清单
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      5. 标记状态和问题类型
    </lark-td>
    <lark-td>
      标记标签是否已上线、是否仍在使用、是否口径不清、是否重复或无人负责
    </lark-td>
    <lark-td>
      状态、负责人、问题类型和处理优先级
    </lark-td>
    <lark-td>
      标签问题清单
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      6. 补录元数据表
    </lark-td>
    <lark-td>
      将已确认或阶段性确认的信息录入标签元数据表
    </lark-td>
    <lark-td>
      标签名称、编码、分类、口径、来源表、产出表、负责人
    </lark-td>
    <lark-td>
      标签元数据初版
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      7. 看板展示
    </lark-td>
    <lark-td>
      用 Quick BI 基于元数据表搭建标签目录查询看板
    </lark-td>
    <lark-td>
      是否能按分类、产品、状态、负责人、来源表检索
    </lark-td>
    <lark-td>
      标签目录看板
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      8. 业务和下游确认
    </lark-td>
    <lark-td>
      组织业务负责人、下游使用方、数据负责人对重点标签口径进行确认
    </lark-td>
    <lark-td>
      口径是否可继续使用，是否需要修正、合并或停止推荐
    </lark-td>
    <lark-td>
      口径确认记录
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      9. 形成后续处理计划
    </lark-td>
    <lark-td>
      对重复、冲突、无人负责、口径不清标签形成后续处理计划
    </lark-td>
    <lark-td>
      暂不在第一阶段强制下线，先完成标记和责任确认
    </lark-td>
    <lark-td>
      存量治理问题清单
    </lark-td>
  </lark-tr>
</lark-table>

### 5.2 存量治理步骤

<lark-table rows="8" cols="3" header-row="true" column-widths="244,244,244">

  <lark-tr>
    <lark-td>
      阶段
    </lark-td>
    <lark-td>
      工作内容
    </lark-td>
    <lark-td>
      产出
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      第 1 步：资产收集
    </lark-td>
    <lark-td>
      收集已有标签表、宽表、临时表、下游报表和任务
    </lark-td>
    <lark-td>
      存量标签来源清单
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      第 2 步：字段识别
    </lark-td>
    <lark-td>
      识别标签字段、主键、分区、更新频率
    </lark-td>
    <lark-td>
      标签字段清单
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      第 3 步：口径补录
    </lark-td>
    <lark-td>
      根据 SQL、任务、业务文档补充口径
    </lark-td>
    <lark-td>
      标签口径草稿
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      第 4 步：责任确认
    </lark-td>
    <lark-td>
      确认业务负责人、数据负责人、使用部门
    </lark-td>
    <lark-td>
      标签责任矩阵
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      第 5 步：问题标记
    </lark-td>
    <lark-td>
      标记重复、冲突、不清晰、无人使用标签
    </lark-td>
    <lark-td>
      标签问题清单
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      第 6 步：元数据入库
    </lark-td>
    <lark-td>
      将标签信息录入元数据表
    </lark-td>
    <lark-td>
      元数据初版
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      第 7 步：看板上线
    </lark-td>
    <lark-td>
      用 Quick BI 创建标签查询看板
    </lark-td>
    <lark-td>
      标签目录看板
    </lark-td>
  </lark-tr>
</lark-table>

### 5.3 存量标签处理规则

<lark-table rows="6" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      类型
    </lark-td>
    <lark-td>
      处理方式
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      口径明确且有人使用
    </lark-td>
    <lark-td>
      录入元数据，状态标记为已上线
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      口径不明确但有人使用
    </lark-td>
    <lark-td>
      标记为口径待确认，推动负责人确认
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      重复标签
    </lark-td>
    <lark-td>
      标记主标签和待合并标签
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      无人负责标签
    </lark-td>
    <lark-td>
      标记为待认领
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      长期无人使用标签
    </lark-td>
    <lark-td>
      暂不下线，先标记为低使用或待确认
    </lark-td>
  </lark-tr>
</lark-table>

## 6. 增量开发流程规范

### 6.1 流程门禁

<lark-table rows="7" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      节点
    </lark-td>
    <lark-td>
      门禁要求
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      需求提出
    </lark-td>
    <lark-td>
      必须填写飞书需求文档
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      进入开发前
    </lark-td>
    <lark-td>
      必须完成存量复用检查，并确认分类唯一、编码唯一、无可复用或冲突标签
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      口径确认前
    </lark-td>
    <lark-td>
      必须明确业务定义、标签值、使用场景
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      技术开发前
    </lark-td>
    <lark-td>
      必须完成元数据预登记，包含适用产品、适用市场/区域、责任人、来源表、产出表和验收方式
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      上线前
    </lark-td>
    <lark-td>
      必须完成测试验数和任务监控配置
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      需求关闭前
    </lark-td>
    <lark-td>
      必须完成业务验收
    </lark-td>
  </lark-tr>
</lark-table>

### 6.2 增量流程角色分工

<lark-table rows="6" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      角色
    </lark-td>
    <lark-td>
      责任
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      业务需求方
    </lark-td>
    <lark-td>
      提出需求、定义业务场景、确认口径、完成验收
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      数据产品/数据分析
    </lark-td>
    <lark-td>
      组织口径评审、检查复用、维护元数据
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      数据开发
    </lark-td>
    <lark-td>
      数据探查、技术方案、任务开发、上线发布
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      下游使用方
    </lark-td>
    <lark-td>
      确认可用性、反馈使用问题
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      数据负责人
    </lark-td>
    <lark-td>
      处理流程争议、把控标签规范
    </lark-td>
  </lark-tr>
</lark-table>

## 7. 看板建设方案

### 7.1 看板工具建议

建议使用 Quick BI / 阿里云 BI 承载标签查询看板。

原因：

- 能直接连接阿里云数仓数据源。
- 支持自动刷新、筛选、搜索、权限和统计图表。
- 后续可扩展覆盖率、标签值分布、任务产出状态等治理指标。
- 比飞书多维表格更适合承载数仓元数据和数据指标。

飞书继续承载需求文档、评审记录和验收记录。

### 7.2 看板视图设计

#### 业务视图

面向业务方，重点回答「有哪些标签、是什么意思、能不能用」。

筛选项：

- 标签名称
- 标签分类
- 标签状态
- 更新频率
- 业务负责人
- 使用部门

展示字段：

- 标签名称
- 标签编码
- 标签分类
- 业务定义
- 标签值说明
- 更新频率
- 标签状态
- 业务负责人
- 需求文档链接

#### 技术视图

面向数据方，重点回答「数据从哪里来、怎么算、产出到哪里、谁负责」。

筛选项：

- 来源表
- 产出表
- 调度任务
- 数据负责人
- 是否有监控
- 最近产出时间

展示字段：

- 标签编码
- 来源表
- 来源字段
- 计算逻辑摘要
- 产出表
- 产出字段
- 调度任务
- 数据负责人
- 最近产出时间

#### 治理视图

面向治理负责人，重点回答「标签资产是否健康」。

指标：

- 标签总数
- 已上线标签数
- 口径待确认标签数
- 无负责人标签数
- 重复/冲突标签数
- 有监控标签占比
- 各分类标签数量
- 各业务部门标签数量

## 8. 元数据表结构设计

### 8.1 标签元数据主表：dim_user_tag_metadata_df

用途：记录每个用户画像标签的基础信息、业务口径、技术口径、责任人和状态。
```sql
create table if not exists dim_user_tag_metadata_df (
    tag_id string comment '标签唯一ID，规则：TAG + 创建日期 + 当日流水号',
    tag_name string comment '标签中文名称',
    tag_code string comment '标签英文编码，规则：对象_主题_指标_窗口，用户主体标签范围内全局唯一',
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
    stat_period string comment '统计周期，如近7天、近30天、自然月',
    update_frequency string comment '更新频率：实时/小时/日/周/月',
    data_latency string comment '数据时效：实时/T+1/T+2',
    source_table string comment '来源表，记录到表级；多个表用逗号分隔，必要时通过 DataWorks 血缘下钻',
    output_table string comment '标签产出 DWS 宽表',
    output_field string comment '标签产出字段',
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
);

```

### 8.2 标签变更记录表：`dwd_user_tag_change_log`

用途：记录标签口径、来源、状态、负责人等变化，支持追溯。
```sql
create table if not exists dwd_user_tag_change_log (
    change_id string comment '变更记录ID',
    tag_id string comment '标签唯一ID',
    tag_code string comment '标签编码',
    version_no string comment '版本号，如v1.0、v1.1',
    change_type string comment '变更类型：新增/口径调整/技术调整/状态变更/负责人变更/下线',
    change_content string comment '变更内容说明',
    change_reason string comment '变更原因',
    impact_scope string comment '影响范围',
    effective_date string comment '生效日期',
    changed_by string comment '变更人',
    confirmed_by string comment '业务确认人',
    change_doc_url string comment '变更说明或评审文档链接',
    created_time string comment '记录创建时间'
)
comment '用户画像标签变更记录表'
partitioned by (
    dt string comment '分区日期'
);


```

### 8.3 标签质量统计表：`ads_user_tag_quality_stat`

用途：为 Quick BI 看板提供覆盖率、分布、产出状态等指标。
```sql
create table if not exists ads_user_tag_quality_stat (
    tag_id string comment '标签唯一ID',
    tag_code string comment '标签编码',
    tag_name string comment '标签名称',
    output_table string comment '产出表',
    output_field string comment '产出字段',
    total_user_cnt bigint comment '总用户数',
    covered_user_cnt bigint comment '标签覆盖用户数',
    coverage_rate decimal(18,6) comment '覆盖率',
    null_user_cnt bigint comment '标签值为空用户数',
    null_rate decimal(18,6) comment '空值率',
    value_distribution string comment '标签值分布，JSON格式',
    latest_partition string comment '最近产出分区',
    latest_output_time string comment '最近产出时间',
    task_status string comment '任务状态：success/failed/running/unknown',
    stat_time string comment '统计时间'
)
comment '用户画像标签质量统计表'
partitioned by (
    dt string comment '分区日期'
);


```

## 9. 实现计划

### 9.1 第一阶段：规范和元数据底座

周期建议：1-2 周。

<lark-table rows="6" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      工作
    </lark-td>
    <lark-td>
      产出
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      确认标签分类、编码、状态规范
    </lark-td>
    <lark-td>
      标签规范文档
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      建立飞书需求模板
    </lark-td>
    <lark-td>
      统一需求入口
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      建立标签元数据表结构
    </lark-td>
    <lark-td>
      元数据表 DDL
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      明确增量开发门禁
    </lark-td>
    <lark-td>
      流程规范
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      确认 Quick BI 看板字段
    </lark-td>
    <lark-td>
      看板设计稿
    </lark-td>
  </lark-tr>
</lark-table>

### 9.2 第二阶段：存量标签盘点入库

周期建议：2-4 周，取决于存量标签数量。

<lark-table rows="6" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      工作
    </lark-td>
    <lark-td>
      产出
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      收集现有标签表和任务
    </lark-td>
    <lark-td>
      存量标签来源清单
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      解析标签字段和 SQL 逻辑
    </lark-td>
    <lark-td>
      标签字段清单
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      补录业务口径和技术口径
    </lark-td>
    <lark-td>
      元数据初版
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      标记问题标签
    </lark-td>
    <lark-td>
      问题标签清单
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      组织业务口径确认
    </lark-td>
    <lark-td>
      口径确认记录
    </lark-td>
  </lark-tr>
</lark-table>

### 9.3 第三阶段：看板上线

周期建议：1 周。

<lark-table rows="6" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      工作
    </lark-td>
    <lark-td>
      产出
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Quick BI 接入元数据表
    </lark-td>
    <lark-td>
      数据集
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      创建业务视图
    </lark-td>
    <lark-td>
      标签目录查询
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      创建技术视图
    </lark-td>
    <lark-td>
      技术口径查询
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      创建治理视图
    </lark-td>
    <lark-td>
      标签健康统计
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      发布看板并同步使用说明
    </lark-td>
    <lark-td>
      标签查询入口
    </lark-td>
  </lark-tr>
</lark-table>

### 9.4 第四阶段：增量流程试运行

周期建议：2-4 周。

<lark-table rows="5" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      工作
    </lark-td>
    <lark-td>
      产出
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      选择 2-3 个新增标签需求试点
    </lark-td>
    <lark-td>
      试点需求
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      按新流程完成需求、评审、开发、验收
    </lark-td>
    <lark-td>
      完整流程样例
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      收集业务和开发反馈
    </lark-td>
    <lark-td>
      流程优化点
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      调整模板和字段
    </lark-td>
    <lark-td>
      规范 V1.1
    </lark-td>
  </lark-tr>
</lark-table>

## 10. 当前需要确认的事项

<lark-table rows="6" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      事项
    </lark-td>
    <lark-td>
      建议决策
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      元数据表落在哪个项目/库
    </lark-td>
    <lark-td>
      建议落在数仓治理或公共数据集市项目
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      标签主键粒度
    </lark-td>
    <lark-td>
      第一阶段用户标签以 `uuid` 为主键粒度，元数据字段使用 `tag_subject_key=uuid`；`uuid` 本身不作为标签。
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Quick BI 数据源
    </lark-td>
    <lark-td>
      优先连接 MaxCompute/Hologres/RDS 中的元数据表
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      流程 owner
    </lark-td>
    <lark-td>
      建议由数据产品/数据分析牵头，数据开发和业务配合
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      存量盘点优先级
    </lark-td>
    <lark-td>
      优先盘点仍在被报表、运营、推荐、CRM 使用的标签
    </lark-td>
  </lark-tr>
</lark-table>

## 11. 最终交付物清单

<lark-table rows="9" cols="2" header-row="true" column-widths="350,350">

  <lark-tr>
    <lark-td>
      交付物
    </lark-td>
    <lark-td>
      状态
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户画像标签治理实施方案
    </lark-td>
    <lark-td>
      本文档
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      用户画像标签需求文档模板
    </lark-td>
    <lark-td>
      单独飞书模板
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      标签元数据主表结构
    </lark-td>
    <lark-td>
      已包含
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      标签变更记录表结构
    </lark-td>
    <lark-td>
      已包含
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      标签质量统计表结构
    </lark-td>
    <lark-td>
      已包含
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      Quick BI 看板设计
    </lark-td>
    <lark-td>
      已包含
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      存量治理流程
    </lark-td>
    <lark-td>
      已包含
    </lark-td>
  </lark-tr>
  <lark-tr>
    <lark-td>
      增量开发流程
    </lark-td>
    <lark-td>
      已包含
    </lark-td>
  </lark-tr>
</lark-table>
