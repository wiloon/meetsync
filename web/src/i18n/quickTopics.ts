import type { Locale } from "./dictionary";

/**
 * Quick-topic chip labels, in stable order across locales so a click always
 * produces the same real-world topic regardless of which language it was
 * clicked in.
 */
export const quickTopics: Record<Locale, string[]> = {
  en: ["Dinner", "Coffee", "Online game", "Video call", "Outing"],
  zh: ["吃饭", "喝咖啡", "线上游戏", "视频通话", "出去玩"],
};
