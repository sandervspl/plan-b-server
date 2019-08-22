export const sortByDate = (type: 'asc' | 'desc') => {
  if (type === 'desc') {
    return (a: string, b: string) => new Date(b).getTime() - new Date(a).getTime();
  } else {
    return (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime();
  }
};
