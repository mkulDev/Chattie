import React, { useState, useEffect } from 'react'
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import Backgorund from '../assets/4.jpg'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { auth } from '../../firebase'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { Entypo } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'

const Login = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
    onAuthStateChanged(auth, (user) => {
      if (user) navigation.replace('ChatScreen')
    })
  }, [navigation])

  const handleLogIn = () => {
    signInWithEmailAndPassword(auth, userEmail, userPassword)
      .then((userCredential) => {
        navigation.replace('ChatScreen')
      })
      .catch((error) => {
        setError('Incorrect e-mail or password')
      })
  }

  const [fontsLoaded] = useFonts({
    'Inter-Black': require('../assets/fonts/Fasthand-Regular.ttf')
  }) //destructuring an array

  const onLayoutRootView = async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }

  if (!fontsLoaded) {
    return null
  }

  const isdisabled = !(userEmail && userPassword)

  return (
    <View onLayout={onLayoutRootView}>
      <ImageBackground
        source={Backgorund}
        resizeMode='cover'
        className='w-full h-full bg-[#0b2637]'
      >
        {/* Header */}
        <View className=' justify-center items-center flex-1 '>
          <Text className='text-gray-100 text-2xl font-[700] mt-8'> Welcome to </Text>
          <Text style={{ fontFamily: 'Inter-Black', color: '#fff', fontSize: 70, lineHeight: 100 }}>Chattie</Text>
        </View>
        <View className='bg-gray-100 w-[100%] h-[70%] border-t-4 border-t-[#6dc59f] items-center justify-center rounded-tl-[50]'>
          <Text className=' text-2xl font-[700] mb-2'>Please Login:</Text>
          {error && <Text className='text-red-600 text-md font-bold self-center pb-2 max-w text-center'>{error}</Text>}
          <View className='flex-row justify-center items-center bg-gray-200 p-2 rounded-2xl mb-2'>
            <Ionicons
              name='mail'
              size={24}
              color='#1a8575'
              style={styles.icons}
            />
            <TextInput
              placeholder='Enter email'
              value={userEmail}
              keyboardType='email-address'
              onChangeText={(text) => setUserEmail(text)}
              style={styles.input}
              type='email'
            />
          </View>
          <View className='flex-row justify-center items-center bg-gray-200 p-2 rounded-2xl  mb-4'>
            <Entypo
              name='lock'
              size={24}
              color='#1a8575'
              style={styles.icons}
            />
            <TextInput
              placeholder='Enter password'
              value={userPassword}
              secureTextEntry={true}
              onChangeText={(text) => setUserPassword(text)}
              style={styles.input}
            />
          </View>

          <TouchableOpacity
            className={`${isdisabled ? 'bg-[#e5e7eb]' : 'bg-[#1a6553]'} rounded-lg py-3 w-[300]`}
            disabled={isdisabled}
            onPress={handleLogIn}
          >
            <Text className={`${isdisabled ? 'text-gray-400' : 'text-gray-100'} text-2xl  self-center`}>{'Log In'}</Text>
          </TouchableOpacity>
          {/* Sign up section*/}
          <View className='items-baseline flex-row mt-2'>
            <Text className='items-center mr-1 text-md'>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
              <Text className='text-[#1a6553] font-[700] text-lg'>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

export default Login

export const styles = StyleSheet.create({
  input: { backgroundColor: 'rgb(229 231 235)', paddingVertical: 6, paddingHorizontal: 10, width: 250, alignSelf: 'center' },
  icons: { backgroundColor: 'rgb(229 231 235)', paddingVertical: 6, paddingHorizontal: 10 }
})
