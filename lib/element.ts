/**
 * 스크롤 위치 가져오기
 */
export const getScrollTop = () => {
  if (!document.body) return 0;
  if (document.documentElement && 'scrollTop' in document.documentElement) {
    return document.documentElement.scrollTop || document.body.scrollTop;
  } else {
    return document.body.scrollTop;
  }
};

/**
 * 페이지가 하단에 도달했는지 확인
 */
export const isAtBottom = () => {
  const scrollTop = getScrollTop();
  const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  const clientHeight = document.documentElement.clientHeight || window.innerHeight;

  // 바닥으로부터 30px 이내에 도달하면 하단으로 간주
  return scrollTop + clientHeight >= scrollHeight - 30;
};
