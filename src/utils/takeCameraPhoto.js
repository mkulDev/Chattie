import * as ImagePicker from 'expo-image-picker'

export const takePhoto = async (input) => {
  if (input != 0 && input != 1) {
    console.log(`wrong input press 0 for disk or 1 for camera`)
    return null
  }
  const mode = input === 0 ? 'launchImageLibraryAsync' : 'launchCameraAsync'
  try {
    let uri = null
    const result = await ImagePicker[mode]({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.5
    })

    if (!result.canceled) {
      uri = result.assets[0].uri
      return uri
    }
  } catch (error) {
    console.error('Error taking photo:', error)
  }
}
