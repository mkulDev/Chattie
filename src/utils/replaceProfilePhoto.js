import { storage } from '../../firebase'
import { deleteObject, ref, getDownloadURL, uploadBytes } from 'firebase/storage'
import 'firebase/storage'

export const replaceProfilePhoto = async (auth, newFileUrii) => {
  const name = auth?.currentUser?.displayName
  const userUid = auth?.currentUser?.uid
  const userPhotoUrl = auth?.currentUser?.photoURL
  try {
    if (userPhotoUrl) {
      const fileRef = ref(storage, userPhotoUrl)
      deleteObject(fileRef)
    }
    // Create a Blob from the image data
    const response = await fetch(newFileUrii)
    const blob = await response.blob()
    const fileName = `${name}_${Date.now()}`

    // Get a reference to the Firebase storage
    const storageRef = ref(storage, `${userUid}/${fileName}`)
    // Upload the Blob
    const uploadTask = uploadBytes(storageRef, blob)
    await uploadTask
    console.log('Blob uploaded successfully!')
    const downloadUrl = await getDownloadURL(storageRef)
    return downloadUrl
  } catch (error) {
    console.error('Error uploading file to Firestore:', error.message)
  }
}
