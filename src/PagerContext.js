import { createContext, useContext } from "react";

/**
 * Shared by SectionPager to the Navbar/Footer so their links can jump to a
 * slide by id instead of the old document.querySelector + scrollIntoView
 * approach, which stops working once native page scrolling is replaced by
 * the pager's own transform-driven paging.
 */
export const PagerContext = createContext(null);

export function usePager() {
  const ctx = useContext(PagerContext);
  if (!ctx) {
    throw new Error("usePager must be used within a SectionPager");
  }
  return ctx;
}
