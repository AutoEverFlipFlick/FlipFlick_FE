export function timeForToday(dateString: string): string {
  const today = new Date()
  const timeValue = new Date(dateString)

  const between = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60) // 분 단위

  if (between < 1) return '방금 전'
  if (between < 60) return `${between}분 전`

  const betweenHour = Math.floor(between / 60)
  if (betweenHour < 24) return `${betweenHour}시간 전`

  const betweenDay = Math.floor(between / 60 / 24)
  if (betweenDay < 365) return `${betweenDay}일 전`

  return `${Math.floor(betweenDay / 365)}년 전`
}
