export const objectComparer = (
  propertyName: string,
  inversed: boolean = false
) => (a: any, b: any) => {
  if (a[propertyName] < b[propertyName]) {
    return inversed ? 1 : -1;
  }
  if (a[propertyName] > b[propertyName]) {
    return inversed ? -1 : 1;
  }
  return 0;
};
