const calcMan = (sum, hoursSince) => {
  return (((sum / (hoursSince * 0.1)) * sum) / (sum * hoursSince)) * 10000
}

console.log(calcMan(300, 504))
