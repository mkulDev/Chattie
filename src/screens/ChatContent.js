import React, { useState, useLayoutEffect, useEffect, useRef } from 'react'
import { View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image, ImageBackground } from 'react-native'
import { db, auth } from '../../firebase'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { takePhoto } from '../utils/takeCameraPhoto' // 0 for disc : 1 for camera
import { uploadImage, uploadMessage } from '../utils/handleChats'
import { onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore'
import Message from '../components/Message'
import image from '../assets/chat-bg.jpg'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ChatContent = ({ route }) => {
  const navigation = useNavigation()
  const [message, setMessage] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [chats, setChats] = useState([])
  const { client, chatId } = route.params

  if (!chatId) navigation.replace('ChatScreen')
  const newtMessageRef = useRef()

  useEffect(() => {
    newtMessageRef.current?.scrollToEnd({ animated: true })
  }, [chats])

  useEffect(() => {
    const messageRef = collection(db, 'userChats', chatId, 'messages')
    // Create a query to get all messages in the subcollection
    const messageQuery = query(messageRef, orderBy('timestamp', 'asc'), limit(100))

    // Attach the listenner
    const unsubscribe = onSnapshot(messageQuery, (querySnapshot) => {
      const messages = []
      querySnapshot.forEach((doc) => {
        messages.push(doc.data())
      })
      // Now 'messages' array contains all the message data from the subcollection in real-time.
      setChats(messages)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Chattie with ${client.displayName}`
    })
  }, [chatId])

  const handleSendMessage = async () => {
    let attachmentURL = null
    if (attachment) {
      try {
        attachmentURL = await uploadImage(auth.currentUser.uid, attachment)
        localStorage.setItem('')
      } catch (error) {
        console.log(error)
      }
    }

    try {
      const messageObject = {
        chatId: chatId,
        author: auth.currentUser.uid,
        authorAvatar: auth.currentUser.photoURL,
        content: message,
        file: attachmentURL
      }

      await uploadMessage(chatId, messageObject)
      await AsyncStorage.setItem(chatId, JSON.stringify(messageObject.content))
      console.log(AsyncStorage)
    } catch (error) {
      console.log(error)
    }

    setAttachment(null)
    setMessage('')
  }

  return (
    <SafeAreaView className='flex-col bg-gray-200 h-full'>
      <ImageBackground
        source={image}
        resizeMode='cover'
        className='w-full h-full'
      >
        <ScrollView
          contentContainerStyle={{ justifyContent: 'flex-end', marginHorizontal: 10, marginTop: 10 }}
          ref={newtMessageRef}
        >
          {chats?.map((message, index) => (
            <Message
              data={message}
              key={index}
              navigation={navigation}
            />
          ))}
        </ScrollView>
        <View className='flex-row items-center rounded-xl m-2 pl-2 bg-gray-300'>
          <React.Fragment>
            {attachment && (
              <Image
                source={{ uri: attachment }}
                className='w-[30] h-[40] rounded-md'
              />
            )}
            <TextInput
              placeholder='Start type a message'
              value={message}
              onChangeText={(text) => setMessage(text)}
              onEndEditing={(text) => {
                if (message) {
                  setMessage(text), handleSendMessage()
                }
              }}
              className='p-2 flex-1 text-xl'
            />
          </React.Fragment>
          <TouchableOpacity
            onPress={async () => {
              const chosenImage = await takePhoto(1)
              if (chosenImage) setAttachment(chosenImage)
            }}
            className='p-2'
          >
            <Ionicons
              name='camera-outline'
              size={24}
              color='#575757'
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              const chosenImage = await takePhoto(0)
              if (chosenImage) setAttachment(chosenImage)
            }}
            className='p-2'
          >
            <Ionicons
              name='attach'
              size={24}
              color='#575757'
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (message) {
                handleSendMessage()
              }
            }}
            className={`${message ? 'bg-[#1a6553]' : 'bg-[#a0a0a0]'} p-4  rounded-r-xl`}
          >
            <Ionicons
              name='send-outline'
              size={20}
              color='#eaeaea'
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

export default ChatContent
