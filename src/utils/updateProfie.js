import { updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
export const updateUserProfile = async (user, downloadUrl) => {
  try {
    await updateProfile(user, {
      photoURL: downloadUrl
    })
    await setDoc(
      doc(db, 'users', user.uid),
      {
        photoURL: downloadUrl
      },
      { merge: true }
    )
    console.log('profile updated')
  } catch (error) {
    console.error('Error updating user profile:', error)
  }
}
