
//https://github.com/react-native-community/async-storage/blob/HEAD/docs/API.md

export default class AsyncUtils {
  constructor() {
    this.bind.storeData = this.bind.storeData(this)
    this.bind.getData = this.bind.getData(this)
  }

  storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (e) {
      // saving error
      console.log(e)
    }
  }

  getData = async key => {
    try {
      const value = await AsyncStorage.getItem(key)
      if (value) {
        // value previously stored
        return value
      }
    } catch (e) {
      // error reading value
      console.log(e)
    }
  }
}
