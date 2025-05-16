import { useCallback, useEffect, useState } from 'react';

interface UseHashNavigationOptions {
  sectionIds: string[];
  scrollDuration?: number;
  scrollOffset?: number;
}

export function useActiveSection({
  sectionIds,
  scrollDuration = 500,
  scrollOffset = 80,
}: UseHashNavigationOptions) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // 현재 스크롤 위치 가져오기
  const getScrollPosition = useCallback(() => {
    return {
      x: window.scrollX || window.pageXOffset,
      y: window.scrollY || window.pageYOffset,
    };
  }, []);

  // 부드러운 스크롤 구현
  const smoothScroll = useCallback(
    (targetY: number, duration: number) => {
      const startY = getScrollPosition().y;
      const diff = targetY - startY;
      let startTime: number | null = null;

      // 애니메이션 함수
      const animateScroll = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // 이징 함수 (ease-in-out)
        const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

        window.scrollTo(0, startY + diff * ease(progress));

        if (timeElapsed < duration) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    },
    [getScrollPosition]
  );

  // 해시 기반 네비게이션 처리
  const handleHashNavigation = useCallback(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash.replace('#', '');

    if (hash && sectionIds.includes(hash)) {
      // 300ms 후 스크롤 (DOM이 완전히 렌더링된 후)
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          // 오프셋을 적용한 위치로 스크롤
          smoothScroll(elementPosition - scrollOffset, scrollDuration);
          setActiveId(hash);
        }
      }, 300);
    }
  }, [sectionIds, smoothScroll, scrollOffset, scrollDuration]);

  // 페이지 로드 시 해시 처리
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 페이지 로드 완료 시 실행
    window.addEventListener('load', handleHashNavigation);

    // 해시 변경 시 실행
    window.addEventListener('hashchange', handleHashNavigation);

    // 컴포넌트 마운트 시 즉시 실행
    handleHashNavigation();

    return () => {
      window.removeEventListener('load', handleHashNavigation);
      window.removeEventListener('hashchange', handleHashNavigation);
    };
  }, [handleHashNavigation]);

  // 현재 스크롤 위치에 따른 활성 섹션 업데이트
  useEffect(() => {
    if (!sectionIds.length) return;

    const handleScroll = () => {
      const { y: scrollY } = getScrollPosition();
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 페이지 하단에 도달했는지 확인
      if (scrollY + viewportHeight >= documentHeight - 30) {
        // 마지막 섹션 활성화
        setActiveId(sectionIds[sectionIds.length - 1]);
        return;
      }

      // 모든 섹션의 위치 확인
      let currentSection: string | null = null;
      let minDistance = Infinity;

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          const { top } = element.getBoundingClientRect();
          // 뷰포트 상단에서부터의 거리
          const distance = Math.abs(top - scrollOffset);

          // 화면에 보이는 섹션 중 가장 가까운 것 선택
          if (top <= scrollOffset + 5 && distance < minDistance) {
            minDistance = distance;
            currentSection = id;
          }
        }
      });

      if (currentSection) {
        setActiveId(currentSection);
      } else if (scrollY < 100 && sectionIds.length > 0) {
        // 페이지 상단일 경우 첫 번째 섹션 활성화
        setActiveId(sectionIds[0]);
      }
    };

    // 초기 실행
    handleScroll();

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionIds, getScrollPosition, scrollOffset]);

  // 목차 항목 클릭 처리 함수
  const navigateToSection = useCallback(
    (sectionId: string) => {
      if (!sectionIds.includes(sectionId)) return;

      // URL 해시 업데이트
      window.location.hash = sectionId;

      // 활성 섹션 업데이트
      setActiveId(sectionId);

      // 섹션으로 스크롤
      const element = document.getElementById(sectionId);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        smoothScroll(elementPosition - scrollOffset, scrollDuration);
      }
    },
    [sectionIds, smoothScroll, scrollOffset, scrollDuration]
  );

  return { activeId, navigateToSection };
}
