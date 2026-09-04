import { useEffect } from "react";

/**
 * Triple-click should select the whole heading or paragraph, everywhere.
 *
 * Chrome ends a triple-click "paragraph" at a <br>, and several headings on the
 * site are built line-by-line (AnimatedHeading joins its lines with <br />), so
 * the native behaviour only ever grabs one visual line. This normalises it: on
 * any triple click we extend the selection to the full text block that was hit,
 * regardless of how that block is marked up internally.
 */
const TEXT_BLOCKS = "h1,h2,h3,h4,h5,h6,p,blockquote,li,figcaption,dt,dd";

export const useTextBlockSelection = () => {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.detail < 3) return;

      const target = event.target as Element | null;
      const block = target?.closest?.(TEXT_BLOCKS);
      if (!block) return;

      // Leave form controls and editable regions to the browser.
      if (block.closest("input,textarea,[contenteditable='true']")) return;

      const selection = window.getSelection();
      if (!selection) return;

      const range = document.createRange();
      range.selectNodeContents(block);
      selection.removeAllRanges();
      selection.addRange(range);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
};

export default useTextBlockSelection;
