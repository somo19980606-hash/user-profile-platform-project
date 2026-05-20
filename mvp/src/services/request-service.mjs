export function createRequestService() {
  async function getRequests() {
    return [
      {
        request_id: "REQ202605140001",
        title: "沉默用户召回人群标签",
        requester: "运营",
        status: "口径确认中",
        expected_online_date: "2026-05-24",
        doc_url: "https://www.feishu.cn/docx/P84BdnQZHo7JjfxiXRhc4AoNnyc",
      },
      {
        request_id: "REQ202605140002",
        title: "高价值会员续费风险标签",
        requester: "会员业务",
        status: "待开发",
        expected_online_date: "2026-05-28",
        doc_url: "https://www.feishu.cn/docx/P84BdnQZHo7JjfxiXRhc4AoNnyc",
      },
    ];
  }

  return { getRequests };
}
