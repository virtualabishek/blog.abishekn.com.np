import {useEffect, useRef} from "react";
import {useThemeConfig} from "@docusaurus/theme-common";

// Local copy of Docusaurus hook with a null-safe navbar height lookup.
function getVisibleBoundingClientRect(element) {
  const rect = element.getBoundingClientRect();
  const hasNoHeight = rect.top === rect.bottom;
  if (hasNoHeight) {
    return getVisibleBoundingClientRect(element.parentNode);
  }
  return rect;
}

function isInViewportTopHalf(boundingRect) {
  return boundingRect.top > 0 && boundingRect.bottom < window.innerHeight / 2;
}

function getAnchors({minHeadingLevel, maxHeadingLevel}) {
  const selectors = [];
  for (let i = minHeadingLevel; i <= maxHeadingLevel; i += 1) {
    selectors.push(`h${i}.anchor`);
  }
  return Array.from(document.querySelectorAll(selectors.join()));
}

function getActiveAnchor(anchors, {anchorTopOffset}) {
  const nextVisibleAnchor = anchors.find((anchor) => {
    const boundingRect = getVisibleBoundingClientRect(anchor);
    return boundingRect.top >= anchorTopOffset;
  });

  if (nextVisibleAnchor) {
    const boundingRect = getVisibleBoundingClientRect(nextVisibleAnchor);
    if (isInViewportTopHalf(boundingRect)) {
      return nextVisibleAnchor;
    }
    return anchors[anchors.indexOf(nextVisibleAnchor) - 1] ?? null;
  }
  return anchors[anchors.length - 1] ?? null;
}

function getLinkAnchorValue(link) {
  return decodeURIComponent(link.href.substring(link.href.indexOf("#") + 1));
}

function getLinks(linkClassName) {
  return Array.from(document.getElementsByClassName(linkClassName));
}

function getNavbarHeight() {
  const navbar = document.querySelector(".navbar") || null;
  return navbar ? navbar.clientHeight : 0;
}

function useAnchorTopOffsetRef() {
  const anchorTopOffsetRef = useRef(0);
  const {
    navbar: {hideOnScroll},
  } = useThemeConfig();

  useEffect(() => {
    anchorTopOffsetRef.current = hideOnScroll ? 0 : getNavbarHeight();
  }, [hideOnScroll]);

  return anchorTopOffsetRef;
}

export default function useTOCHighlightSafe(config) {
  const lastActiveLinkRef = useRef(undefined);
  const anchorTopOffsetRef = useAnchorTopOffsetRef();

  useEffect(() => {
    if (!config) {
      return () => {};
    }

    const {
      linkClassName,
      linkActiveClassName,
      minHeadingLevel,
      maxHeadingLevel,
    } = config;

    function updateLinkActiveClass(link, active) {
      if (active) {
        if (lastActiveLinkRef.current && lastActiveLinkRef.current !== link) {
          lastActiveLinkRef.current.classList.remove(linkActiveClassName);
        }
        link.classList.add(linkActiveClassName);
        lastActiveLinkRef.current = link;
      } else {
        link.classList.remove(linkActiveClassName);
      }
    }

    function updateActiveLink() {
      const links = getLinks(linkClassName);
      const anchors = getAnchors({minHeadingLevel, maxHeadingLevel});
      const activeAnchor = getActiveAnchor(anchors, {
        anchorTopOffset: anchorTopOffsetRef.current,
      });
      const activeLink = links.find(
        (link) => activeAnchor && activeAnchor.id === getLinkAnchorValue(link)
      );

      links.forEach((link) => {
        updateLinkActiveClass(link, link === activeLink);
      });
    }

    document.addEventListener("scroll", updateActiveLink);
    document.addEventListener("resize", updateActiveLink);

    updateActiveLink();

    return () => {
      document.removeEventListener("scroll", updateActiveLink);
      document.removeEventListener("resize", updateActiveLink);
    };
  }, [config, anchorTopOffsetRef]);
}
