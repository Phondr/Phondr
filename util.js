export const calcProgress = chat => {
  const messages = chat.messages
  let sum = 0
  let userIds = []
  messages.forEach(cur => {
    if (!userIds.length) {
      userIds.push(cur.userId)
    } else if (userIds[0] !== cur.userId) {
      sum++
      userIds = []
    }
  })
  const hoursSince = chat.sinceCreation / 60
  console.log(
    'in calcProgress',
    sum,
    hoursSince,
    ((sum / (hoursSince * 0.1)) * sum) / 4 / 100
  )
  return ((sum / hoursSince) * sum) / 4 / 100
}
// const sum = 200;
// const hoursSince = 48;
// console.log(
//   'in calcProgress',
//   sum,
//   hoursSince, 
//   (sum*sum / (hoursSince*hoursSince* 0.1*2)), //After 3 days
//   (sum*sum / (hoursSince*hoursSince*0.15))   //First 3 days
// )