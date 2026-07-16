export const toggleExclusive = (activeId, clickedId) => activeId === clickedId ? null : clickedId;
export const clampPercent = value => Math.min(100, Math.max(0, Number(value) || 0));
export const pairPageCount = (items, perPage = 2) => Math.max(1, Math.ceil(items / perPage));
export const movePage = (page, delta, pages) => (page + delta + pages) % pages;
export const activateStep = (currentIndex, requestedIndex, total) =>
  Number.isInteger(requestedIndex) && requestedIndex >= 0 && requestedIndex < total
    ? requestedIndex
    : currentIndex;
export const nextFactIndex = (currentIndex, count) => count > 0 ? (currentIndex + 1) % count : 0;
