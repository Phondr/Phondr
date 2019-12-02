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
  const progress = ((sum / (hoursSince * 0.5)) * sum) / 500
  console.log('in calcProgress', sum, hoursSince, progress)
  return progress
}

export const colors = [
  'indigo',
  'gold',
  'purple',
  'plum',
  'aqua',
  'teal',
  'turquoise',
  'tomato',
  'navy',
  'linen',
  'yellow',
  'violet',
  'blue',
  'red',
  'orange',
  'wheat',
  'tan',
  'green',
  '#9F8170',
  '#5F9EA0'
]
export const PlaceTypes = [
  'amusement_park',
  'aquarium',
  'art_gallery',
  'bakery',
  'bar',
  'book_store',
  'bus_station',
  'cafe',
  'cemetery',
  'clothing_store',
  'convenience_store',
  'department_store',
  'electronics_store',
  'funeral_home',
  'furniture_store',
  'gas_station',
  'grocery_or_supermarket',
  'gym',
  'hardware_store',
  'home_goods_store',
  'jewelry_store',
  'library',
  'liquor_store',
  'movie_theater',
  'museum',
  'night_club',
  'park',
  'pet_store',
  'restaurant',
  'shoe_store',
  'shopping_mall',
  'spa',
  'stadium',
  'store',
  'subway_station',
  'tourist_attraction',
  'train_station',
  'transit_station',
  'university',
  'zoo'
]
