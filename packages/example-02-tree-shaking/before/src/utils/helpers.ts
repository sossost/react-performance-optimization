// ❌ Before: lodash 전체를 import (약 70KB, 모든 함수 포함)
import _ from "lodash";

// ❌ Before: moment 전체를 import (약 290KB, Tree Shaking 불가)
import moment from "moment";

// 실제로는 debounce와 format만 사용하지만, 전체 라이브러리가 번들에 포함됨
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
) => {
  return _.debounce(fn, delay);
};

export const formatDate = (date: Date) => {
  return moment(date).format("YYYY-MM-DD");
};

// 사용하지 않는 함수들 (번들에 포함되지만 실제로는 사용하지 않음)
// Tree Shaking이 작동하지 않아서 이 함수들도 번들에 포함됨
export const unusedLodashFunctions = () => {
  // 실제로는 사용하지 않지만 lodash 전체가 import되어 있으므로 번들에 포함됨
  const chunked = _.chunk([1, 2, 3, 4], 2); // 사용하지 않음
  const mapped = _.map([1, 2, 3], (n) => n * 2); // 사용하지 않음
  const filtered = _.filter([1, 2, 3, 4], (n) => n % 2 === 0); // 사용하지 않음
  return { chunked, mapped, filtered };
};

export const unusedMomentFunctions = () => {
  // 실제로는 사용하지 않지만 moment 전체가 import되어 있으므로 번들에 포함됨
  const added = moment().add(1, "day"); // 사용하지 않음
  const subtracted = moment().subtract(1, "month"); // 사용하지 않음
  const diff = moment().diff(moment().subtract(1, "year")); // 사용하지 않음
  return { added, subtracted, diff };
};
