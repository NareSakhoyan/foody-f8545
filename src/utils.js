export const getStartDateOfThisWeek = () => {
  // find the first day of this week
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const currentDay = today.getDay()
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - currentDay + 1) // Start from Monday
  return startDate
}

export const generateCurrentWeek = () => {
  const startDate = getStartDateOfThisWeek()
  const weekDates = []

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    weekDates.push(currentDate)
  }
  return weekDates
}
