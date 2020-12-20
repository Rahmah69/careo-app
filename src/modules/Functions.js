
import moment from "moment"

export function getTimeDiffString(strTime) {
  let curTime = moment()
  let time = moment(strTime, "YYYY-MM-DD hh:mm:ss")

  let yearAgo = curTime.diff(time, 'years')
  if (yearAgo > 0) {
    if (yearAgo == 1)
      return yearAgo + 'year ago'
    else
      return + 'years ago'
  }

  let monthAgo = curTime.diff(time, 'months')
  if (monthAgo > 0) {
    if (monthAgo == 1)
      return monthAgo + 'month ago'
    else
      return monthAgo + 'months ago'
  }

  let dayAgo = curTime.diff(time, 'days')
  if (dayAgo > 0) {
    if (dayAgo == 1)
      return dayAgo + 'day ago'
    else
      return dayAgo + 'days ago'
  }

  let hourAgo = curTime.diff(time, 'hours')
  if (hourAgo > 0) {
    if (hourAgo == 1)
      return hourAgo + 'hr ago'
    else
      return hourAgo + 'hrs ago'
  }

  let minAgo = curTime.diff(time, 'minutes')
  if (minAgo > 0) {
    if (minAgo == 1)
      return minAgo + 'min ago'
    else
      return minAgo + 'mins ago'
  }

  let secondAgo = curTime.diff(time, 'seconds')
  if (secondAgo >= 0) {
    if (secondAgo == 0)
      secondAgo = 1

    if (secondAgo == 1)
      return secondAgo + 'sec ago'
    else
      return secondAgo + 'secs ago'
  }

  return '0 sec ago'
}