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
    ((sum / hoursSince) * sum) / 4 / 100
  )
  return ((sum / hoursSince) * sum) / 4 / 100
}
