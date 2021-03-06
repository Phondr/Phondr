export const calcProgress = chat => {
  const messages = chat.messages
  let sum = 0
  let userIds = []
  if (!messages) {
    return 0
  } //For newly created active chats, make it 0 progress because there are no initial messages
  messages.forEach(cur => {
    if (!userIds.length) {
      userIds.push(cur.userId)
    } else if (userIds[0] !== cur.userId) {
      sum++
      userIds = []
    }
  })
  const secondsSince = chat.sinceCreation * 60
  let progress
  if (secondsSince /60 /60 > 336) { //Two weeks
    progress = (sum * sum) / (secondsSince * 0.000055)
  } else if (secondsSince /60 /60> 240) { //10 days
    progress = (sum * sum) / (secondsSince * 0.00006)
  } else if (secondsSince /60 /60 > 168) { //1 week
    progress = (sum * sum) / (secondsSince * 0.00008)
  } else if (secondsSince /60 /60 > 72) { // 4 days
    progress = (sum * sum) / (secondsSince * 0.00007)
  } else if (secondsSince /60/60 > 24){ // 1 day
    progress = (sum * sum) / (secondsSince * 0.000045)
  } else if(secondsSince /60/60 > 12) { //12 hours
    progress = (sum*sum) / (secondsSince * 0.0002)
  } else if(secondsSince /60/60 > 1) { //1 hour
    progress = (sum*sum) / (secondsSince * 0.0003) //.0003
  } else if(secondsSince /60 > 30) { //30 minutes
    progress = (sum*sum) / (secondsSince * 0.0005) //.0003
  } else if(secondsSince /60 > 10) { //10 minutes
    progress = (sum*sum) / (secondsSince * 0.0006) //.0003
  } else if(secondsSince /60 > 1) { //1 minutes
    progress = (sum*sum) / (secondsSince * 0.003) //.0003
  } else { //Less than a minute
    progress = (sum * sum) / (secondsSince + 20)
  }
  // progress = ((sum / (hoursSince * 0.5)) * sum) / 500
  // console.log('in calcProgress', sum, hoursSince, progress)
  if(progress>100) {
    return 100
  } else if(progress<1.5 && secondsSince/60/60>336) {
    console.log('delete meeting')
  } else
  return progress
}

// const sum = 10
// const hoursSince = 24
// const sec = 3600
// console.log(
//   'First 3 days',
//   (sum * sum) / (hoursSince *  0.000045 * sec) //First 3 days
// )
// console.log(
//   ' 3 days',
//   (30 * 30) / (72 *  0.000045 * sec) //First 3 days
// )
// console.log(
//   'After 3 days',
//   (sum*sum) / (96 * 0.000070 * sec)
// ) //After 3 days
// console.log(
//   'After 3 days-scaled',
//   (40*40) / (96  * 0.000070 * sec)
// ) //After 3 days
// console.log(
//   'After 7 days',
//   (sum*sum) / (178 * 0.000080 * sec)
// ) //After 7 days
// console.log(
//   'After 7 days-scaled',
//   (70 * 70) / (178 * 0.000080 * sec)
// ) //After 7 days-scaled
// console.log(
//   'After 10 days',
//   (sum * sum) / (240 * 0.000060 * sec)
// ) //After 10 days
// console.log(
//   'After 10 days-scaled',
//   (100 * 100) / (240 * 0.000060 * sec)
// ) //After 10 days-scaled
// console.log(
//   'After 14 days',
//   (sum * sum) / (336 * 0.000055 * sec)
// ) //After 10 days
// console.log(
//   'After 14 days-scaled',
//   (140 * 140) / (336 * 0.000055 * sec)
// ) //After 10 days-scaled
