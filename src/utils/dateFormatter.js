export const formatToYMDWithSlashes = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${year}/${month}/${day}`;
};
// Output: "2025/04/17"

export const formatToDMY = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};
// Output: "17/04/2025"

export const formatToMDY = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${month}/${day}/${year}`;
};
// Output: "04/17/2025"

export const formatToReadableDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
// Output: "17 Apr 2025"

export const formatToFullDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
// Output: "Thursday, April 17, 2025"

// exports = {
//     formatToYMDWithSlashes,
//     formatToDMY,
//     formatToMDY,
//     formatToReadableDate,
//     formatToFullDate,
// };
