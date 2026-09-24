export type Locale = "en" | "zh";

const en = {
  "nav.createGathering": "+ Create a Gathering",
  "home.tagline":
    "Agree on a time, a topic, and who's covering the cost — no login needed.",

  "create.title": "Create a Gathering",
  "create.subtitle":
    "Pick some candidate dates and, if you like, a few topics to get people started. Anyone can add more topics later.",
  "create.nameLabel": "Gathering name",
  "create.namePlaceholder": "e.g. Catching up with the old team",
  "create.dateSectionLabel": "Candidate dates",
  "create.dateHint":
    "Click a date to select it, or click-and-drag across several days to select a run.",
  "create.noDatesSelected": "No dates selected yet.",
  "create.timezoneLabel": "Gathering timezone",
  "create.timezoneHint":
    "Auto-detected from your browser — change it if it's wrong.",
  "create.topicsLabel": "Topics",
  "create.topicsOptional": "(optional — add now or later)",
  "create.addCustomTopic": "+ Add a custom topic",
  "create.topicPlaceholder": "Topic name",
  "create.submit": "Create Gathering",
  "create.submitting": "Creating…",
  "create.genericError": "Something went wrong — please try again.",

  "done.subWithOne": "Started with 1 topic: {list}.",
  "done.subWithMany": "Started with {n} topics: {list}.",
  "done.subNone": "No topics yet — participants can propose the first one.",
  "done.shareLinkLabel": "Share this link",
  "done.copy": "Copy",
  "done.copied": "Copied!",
  "done.nextHint":
    "Anyone with this link can join, pick a name, and start adding their availability and topic votes.",
  "done.backHome": "Back to meetsync",
};

const zh: Record<keyof typeof en, string> = {
  "nav.createGathering": "+ 创建活动",
  "home.tagline": "无需登录,一起定下时间、主题和谁请客。",

  "create.title": "创建活动",
  "create.subtitle":
    "先选几个候选日期,也可以顺便加几个主题让大家有个方向,之后谁都可以再加主题。",
  "create.nameLabel": "活动名称",
  "create.namePlaceholder": "例如:老同事聚聚",
  "create.dateSectionLabel": "候选日期",
  "create.dateHint": "点击选择单个日期,或者拖拽选择连续几天。",
  "create.noDatesSelected": "还没有选日期。",
  "create.timezoneLabel": "活动时区",
  "create.timezoneHint": "已根据你的浏览器自动检测——如果不对可以改。",
  "create.topicsLabel": "主题",
  "create.topicsOptional": "(可选——现在加或以后加都行)",
  "create.addCustomTopic": "+ 添加自定义主题",
  "create.topicPlaceholder": "主题名称",
  "create.submit": "创建活动",
  "create.submitting": "创建中…",
  "create.genericError": "出错了——请重试。",

  "done.subWithOne": "已包含 1 个主题:{list}。",
  "done.subWithMany": "已包含 {n} 个主题:{list}。",
  "done.subNone": "还没有主题——参与者可以提出第一个。",
  "done.shareLinkLabel": "分享这个链接",
  "done.copy": "复制",
  "done.copied": "已复制!",
  "done.nextHint": "拿到这个链接的人都可以加入、选个名字,然后填自己的空闲时间和主题投票。",
  "done.backHome": "返回 meetsync",
};

export const dictionaries: Record<Locale, Record<keyof typeof en, string>> = {
  en,
  zh,
};

export type TranslationKey = keyof typeof en;

export function formatTemplate(
  template: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(vars[key] ?? ""),
  );
}
