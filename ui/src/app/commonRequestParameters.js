export function commonRequestParameters(pageNumber, pageSize, fromDate, toDate) {
  const searchParamsWithPage = new URLSearchParams({
    page: pageNumber,
    pageSize: pageSize
  }).toString()

  const searchParamsWithFromDate = fromDate ? searchParamsWithPage + '&' + new URLSearchParams({
    fromDate: fromDate
  }) : searchParamsWithPage

  const searchParamsWithToDate = toDate ? searchParamsWithFromDate + '&' + new URLSearchParams({
    toDate: toDate
  }) : searchParamsWithFromDate

  return (fromDate || toDate) ? searchParamsWithToDate + '&' + new URLSearchParams({
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }) : searchParamsWithToDate;
}

export default commonRequestParameters;
