import { doc, updateDoc, arrayUnion, arrayRemove, collection, getDoc, getDocs, query, where, documentId, serverTimestamp, setDoc, addDoc } from 'firebase/firestore'
import { db, storage } from '../../firebase'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'

export const updateKnownUser = async (user, client, status) => {
  const validStatuses = ['add', 'pending', 'approved']
  // status validation
  if (!validStatuses.includes(status)) {
    console.error('Invalid status provided:', status)
    return
  }

  let newStatus = null
  if (status === 'add') newStatus = 'pending'
  if (status === 'pending') newStatus = 'aproved'
  if (!newStatus) return

  try {
    const userRef = doc(db, 'users', user.uid)
    await updateDoc(userRef, {
      knownUsers: arrayUnion({ uid: client.uid, status: newStatus, displayName: client.displayName, photoURL: client.photoURL, from: user.uid })
    })
    const clientRef = doc(db, 'users', client.uid)
    await updateDoc(clientRef, {
      knownUsers: arrayUnion({ uid: user.uid, status: newStatus, displayName: user.displayName, photoURL: user.photoURL, from: user.uid })
    })
  } catch (error) {
    console.log(error)
  }
}

export const deleteKnownUser = async (user, client, status) => {
  const userRef = doc(db, 'users', user.uid)
  const clientRef = doc(db, 'users', client.uid)
  try {
    await updateDoc(userRef, {
      knownUsers: arrayRemove({ uid: client.uid, status: status, displayName: client.displayName, photoURL: client.photoURL, from: client.from })
    })
    await updateDoc(clientRef, {
      knownUsers: arrayRemove({ uid: user.uid, status: status, displayName: user.displayName, photoURL: user.photoURL, from: client.from })
    })
  } catch (error) {
    console.log(error)
  }
}

export const getKnowUsers = async (userUid) => {
  const docRef = doc(db, 'users', userUid)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const friends = docSnap.data().knownUsers
    return friends
  } else {
    // docSnap.data() will be undefined in this case
    console.log('No such document!')
  }
}

export const getUsersData = async (userIds) => {
  try {
    const q = query(collection(db, 'users'), where(documentId(), 'in', userIds))
    const userssDocsSnap = await getDocs(q)
    const arr = userssDocsSnap.docs.map((element) => element.data())
    return arr
  } catch (error) {
    console.log(error)
  }
}

export const uploadImage = async (userUid, newFileUrii) => {
  const response = await fetch(newFileUrii)
  const blob = await response.blob()
  const fileName = `${userUid}_${Date.now()}`
  try {
    const storageRef = ref(storage, `${userUid}/${fileName}`)
    const uploadTask = uploadBytesResumable(storageRef, blob)

    // Wait for the upload to complete
    await uploadTask
    console.log('Blob uploaded successfully!')
    const downloadUrl = await getDownloadURL(storageRef)
    return downloadUrl
  } catch (error) {
    console.error('Error uploading file to Firestore:', error)
    throw error
  }
}

export const uploadMessage = async (chatId, message) => {
  try {
    const messagesRef = collection(db, 'userChats', chatId, 'messages')
    const lastMessageRef = doc(db, 'userChats', chatId)
    addDoc(messagesRef, { ...message, timestamp: serverTimestamp() })
    console.log(lastMessageRef, message)
    setDoc(lastMessageRef, { lastMessage: message.content })
  } catch (error) {
    console.error('Error uploading message to Firestore:', error)
  }
}
/* To avoid unnecessary firebase calls, I decided to use local storage.
export const getLastMessage = async (chatId) => {
  try {
    const lastMessageRef = doc(db, 'userChats', chatId)
    const docSnap = await getDoc(lastMessageRef)
    if (docSnap.exists()) {
      return docSnap.data().lastMessage
    } else {
      return ''
    }
  } catch (error) {
    console.log('getLastMessage', error)
  }
} */

export const updateFriendPhotoIfNeeded = async (client, userUid) => {
  try {
    const clientRef = doc(db, 'users', client.uid)
    const docSnap = await getDoc(clientRef)
    const clientData = docSnap.data()
    if (clientData.photoURL !== client.photoURL) {
      const userRef = doc(db, 'users', userUid)
      const docUser = await getDoc(userRef)
      const userData = docUser.data()

      const updateNewUsers = userData.knownUsers.map((element) => {
        if (element.uid === client.uid) return { ...element, photoURL: clientData.photoURL }
        return element
      })
      await setDoc(doc(db, 'users', userUid), { ...userData, knownUsers: updateNewUsers })
    }
  } catch (error) {
    console.error('Error uploading message to Firestore:', error)
  }
}
