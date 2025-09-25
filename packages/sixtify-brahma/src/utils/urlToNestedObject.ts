import { isEmpty as _isEmpty } from "lodash";

export function urlToNestedObject(url: string) {
  const segments = url.split("/").filter((segment) => segment !== ""); // Split and remove empty segments

  return segments.reduceRight((acc, segment) => {
    return { [segment]: _isEmpty(acc) ? true : acc }; // Build the nested structure from right to left
  }, {});
}
