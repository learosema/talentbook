export function arrayReplace<T>(
  arr: Array<T>, 
  index: number, 
  newElement: T,
): Array<T> {
  return [
    ...arr.slice(0, index),
    newElement,
    ...arr.slice(index + 1)
  ];
}
