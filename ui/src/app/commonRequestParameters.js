export function commonRequestParameters(pageNumber, pageSize, fromDate, toDate) {
  const searchParamsWithPage = new URLSearchParams({
    page: pageNumber,
    pageSize: pageSize
  }).toString()

  const searchParamsWithFromDate = fromDate ? searchParamsWithPage + '&' + new URLSearchParams({
    fromDate: fromDate.slice(0, 10)
  }) : searchParamsWithPage

  const searchParamsWithToDate = toDate ? searchParamsWithFromDate + '&' + new URLSearchParams({
    toDate: toDate.slice(0, 10)
  }) : searchParamsWithFromDate

  return (fromDate || toDate) ? searchParamsWithToDate + '&' + new URLSearchParams({
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }) : searchParamsWithToDate;
}

export default commonRequestParameters;
