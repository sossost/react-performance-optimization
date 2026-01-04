// ✅ After: lodash-es에서 필요한 함수만 import (약 2KB, Tree Shaking 지원)
import { debounce as lodashDebounce } from "lodash-es";

// ✅ After: date-fns에서 필요한 함수만 import (약 2KB, Tree Shaking 지원)
import { format } from "date-fns";

// 실제로 사용하는 함수만 import하므로, 사용하지 않는 코드는 번들에서 제거됨
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
) => {
  return lodashDebounce(fn, delay);
};

export const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};
