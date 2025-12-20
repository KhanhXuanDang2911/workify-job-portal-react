const SEARCH_HISTORY_KEY = "job_search_history";
const MAX_HISTORY_ITEMS = 10;

export interface SearchHistoryItem {
  keyword: string;
  industryId?: string;
  provinceId?: string;
  timestamp: number;
}

/**
 * Lấy lịch sử tìm kiếm từ localStorage
 */
export const getSearchHistory = (): SearchHistoryItem[] => {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!stored) return [];
    const history = JSON.parse(stored) as SearchHistoryItem[];

    return history
      .filter((item) => item.keyword && item.keyword.trim())
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch (e) {
    return [];
  }
};

/**
 * Lưu một mục tìm kiếm vào lịch sử
 */
export const saveSearchHistory = (
  keyword: string,
  industryId?: string,
  provinceId?: string
): void => {
  try {
    if (!keyword || !keyword.trim()) {
      return;
    }

    const history = getSearchHistory();

    const newItem: SearchHistoryItem = {
      keyword: keyword.trim(),
      industryId,
      provinceId,
      timestamp: Date.now(),
    };

    const filtered = history.filter(
      (item) =>
        item.keyword !== newItem.keyword ||
        item.industryId !== newItem.industryId ||
        item.provinceId !== newItem.provinceId
    );

    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {}
};

/**
 * Xóa một mục khỏi lịch sử bằng timestamp
 */
export const removeSearchHistoryItem = (timestamp: number): void => {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!stored) return;
    const history = JSON.parse(stored) as SearchHistoryItem[];

    const updated = history.filter((item) => item.timestamp !== timestamp);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {}
};

/**
 * Xóa toàn bộ lịch sử
 */
export const clearSearchHistory = (): void => {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (e) {}
};
