function fillArrayFromNumber(x: number) {
  const array = [];
  for (let index = 1; index <= x; index++) {
    array.push(index.toString());
  }
  return array;
}

export function getPages(totalPages: number, currentPage: number) {
  if (totalPages <= 7)
    return fillArrayFromNumber(totalPages);

  if (currentPage <= 3)
    return [...fillArrayFromNumber(5), '...', (totalPages - 1).toString(), totalPages.toString()]

  if (currentPage >= totalPages - 4)
    return ['1', '2', '...', (totalPages - 4).toString(), (totalPages - 3).toString(), (totalPages - 2).toString(), (totalPages - 1).toString(), (totalPages).toString()]

  return ['1', '...', (currentPage - 2).toString(), (currentPage - 1).toString(), currentPage.toString(), (currentPage + 1).toString(), (currentPage + 2).toString(), '...', totalPages.toString()];
}
