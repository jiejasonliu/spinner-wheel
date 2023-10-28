import { piecewiseBinarySearch } from "@/helpers/search";

export function tryFitText(
  currentText: string,
  maxWidth: number,
  calculateTextLength: (text: string) => number
) {
  const width = calculateTextLength(currentText);
  if (width <= maxWidth) {
    return currentText;
  }

  const ellipsis = "…";
  const ellipsisWidth = calculateTextLength(ellipsis);

  const index = piecewiseBinarySearch({
    target: maxWidth - ellipsisWidth,
    max: maxWidth,
    calculateScore: (val) => calculateTextLength(currentText.substring(0, val)),
  });
  if (index === undefined) {
    return currentText;
  }

  return currentText.substring(0, index) + ellipsis;
}
