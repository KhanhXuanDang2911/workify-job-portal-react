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
    // Lọc bỏ các item có keyword rỗng và sort
    return history
      .filter((item) => item.keyword && item.keyword.trim())
      .sort((a, b) => b.timestamp - a.timestamp); // Mới nhất trước
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
    // Không lưu nếu keyword rỗng
    if (!keyword || !keyword.trim()) {
      return;
    }

    const history = getSearchHistory();

    // Tạo item mới
    const newItem: SearchHistoryItem = {
      keyword: keyword.trim(),
      industryId,
      provinceId,
      timestamp: Date.now(),
    };

    // Loại bỏ các item trùng lặp (cùng keyword, industryId, provinceId)
    const filtered = history.filter(
      (item) =>
        item.keyword !== newItem.keyword ||
        item.industryId !== newItem.industryId ||
        item.provinceId !== newItem.provinceId
    );

    // Thêm item mới vào đầu
    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save search history:", e);
  }
};

/**
 * Xóa một mục khỏi lịch sử bằng timestamp
 */
export const removeSearchHistoryItem = (timestamp: number): void => {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!stored) return;
    const history = JSON.parse(stored) as SearchHistoryItem[];
    // Xóa item có timestamp khớp
    const updated = history.filter((item) => item.timestamp !== timestamp);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to remove search history item:", e);
  }
};

/**
 * Xóa toàn bộ lịch sử
 */
export const clearSearchHistory = (): void => {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (e) {
    console.error("Failed to clear search history:", e);
  }
};
