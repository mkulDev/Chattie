import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState, useLayoutEffect } from 'react'
import { auth, storage, db } from '../../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import RenderHeaderLeft from '../components/HeaderComponents/CustomHeaderBackBtn'
import { doc, setDoc } from 'firebase/firestore'
import { styles } from './Login'
import { Entypo } from '@expo/vector-icons'
import { takePhoto } from '../utils/takeCameraPhoto'
import { FontAwesome } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'

const Register = ({ navigation }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  // const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [file, setFile] = useState(null)
  const [isError, setIsError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const createFireStoreCollection = async (user, downloadUrl) => {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: name,
        email: email,
        photoURL: downloadUrl
      })
    } catch (error) {
      console.log(`createFireStoreCollection: ${error.message}`)
    }
  }

  const updateUserProfile = async (user, downloadUrl) => {
    try {
      await createFireStoreCollection(user, downloadUrl)
      await updateProfile(user, {
        displayName: name,
        photoURL: downloadUrl
      })
      navigation.replace('ChatScreen')
    } catch (error) {
      console.error('Error updating user profile:', error)
    }
  }

  const uploadFileToFirestore = async (localFileURI, userUID) => {
    try {
      // Create a Blob from the image data
      const response = await fetch(localFileURI)
      const blob = await response.blob()
      const fileName = `${name}_${Date.now()}`

      const storageRef = ref(storage, `${userUID}/${fileName}`)
      const uploadTask = uploadBytesResumable(storageRef, blob)
      await uploadTask
      console.log('Blob uploaded successfully!')
      // Get the public URL of the uploaded file
      const url = await getDownloadURL(storageRef)

      return url
    } catch (error) {
      console.error('Error uploading file to Firestore:', error)
    }
  }

  const handleSignup = async () => {
    try {
      setIsLoading(true)
      const response = await createUserWithEmailAndPassword(auth, email, password)
      if (file) {
        const downloadUrl = await uploadFileToFirestore(file, response.user.uid)
        updateUserProfile(response.user, downloadUrl)
      } else {
        updateUserProfile(response.user, null)
      }
    } catch (error) {
      setIsError('Error during signup:', error.message)
    }
    setIsLoading(false)
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <RenderHeaderLeft
          title='Login'
          navigation={navigation}
        />
      )
    })
  }, [navigation])

  const isdisabled = !(name.length > 3 && email && password.length > 5 && file && !isLoading)
  return (
    <View className='justify-center flex-1 items-center'>
      <Text className=' text-2xl font-[700] mb-3'>
        Create a <Text className='text-[#1a6553] text-3xl'>Chattie</Text> Account
      </Text>

      {isError && <Text className='text-red-600 text-3xl'>{isError}</Text>}

      <View className='flex-row justify-center items-center bg-gray-200 p-2 rounded-2xl mb-2'>
        <FontAwesome
          name='user'
          size={24}
          color='#1a6553'
        />
        <TextInput
          placeholder='Full Name'
          onChangeText={(text) => setName(text.trim())}
          style={styles.input}
        />
      </View>
      <View className='flex-row justify-center items-center bg-gray-200 p-2 rounded-2xl mb-2'>
        <Ionicons
          name='mail'
          size={24}
          color='#1a6553'
        />
        <TextInput
          keyboardType='email-address'
          placeholder='E-mail'
          secureTextEntry={true}
          onChangeText={(text) => setEmail(text.trim())}
          style={styles.input}
        />
      </View>
      <View className='flex-row justify-center items-center bg-gray-200 p-2 rounded-2xl mb-2'>
        <Entypo
          name='lock'
          size={24}
          color='#1a6553'
        />
        <TextInput
          placeholder='Password'
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text.trim())}
          style={styles.input}
        />
      </View>
      {/* In the future, this feature will be available. <Input
        placeholder='Phone number (optional)'
        secureTextEntry={true}
        onChangeText={(text) => setPhoneNumber(text.trim())}
        inputContainerStyle={styles.input}
        leftIcon={{ type: 'font-awesome', name: 'phone', color: '#1a6553' }}
  />*/}

      <TouchableOpacity
        className='bg-[#1a6553] rounded-lg py-3 w-[300] flex-row justify-center '
        onPress={async () => {
          const chosenImage = await takePhoto(0)
          if (chosenImage) setFile(chosenImage)
        }}
        style={{ elevation: 3 }}
      >
        <Entypo
          name='add-user'
          size={24}
          color='white'
        />
        <Text className='text-gray-100 text-md  self-center ml-2'>Add Profile Picture</Text>
      </TouchableOpacity>
      {file && (
        <Image
          source={{ uri: file }}
          style={{ width: 150, height: 150 }}
          className='mt-3 rounded-full'
        />
      )}

      <TouchableOpacity
        className={`${isdisabled ? 'bg-[#e5e7eb]' : 'bg-[#1a6553]'} rounded-lg py-4 w-[300] m-5`}
        onPress={handleSignup}
        style={{ elevation: 3 }}
        disabled={isdisabled}
      >
        <Text className={`${isdisabled ? 'text-gray-400' : 'text-gray-100'} text-2xl  self-center`}>Sign In</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Register
