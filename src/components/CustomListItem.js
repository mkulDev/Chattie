import React, { useState } from 'react'
import { TouchableOpacity, View, Image, Text } from 'react-native'
import { updateKnownUser, deleteKnownUser, getLastMessage } from '../utils/handleChats'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { auth } from '../../firebase'
import { Ionicons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import defaultUser from '../assets/userProfile.png'
import AsyncStorage from '@react-native-async-storage/async-storage'

const CustomListItem = ({ client, status, setSearchResults }) => {
  const [lastMessage, setLastMessage] = useState('')
  const currentUser = auth.currentUser
  const chatId = [client?.uid, currentUser?.uid].sort().join('')

  // The useFocusEffect hook is used to trigger a function or effect when a component gets focused !!! Remember
  useFocusEffect(
    React.useCallback(() => {
      // to avoid getLastMessage unnecessary calls
      if (!client) return
      /*
      getLastMessage(chatId).then((res) => {
        setLastMessage(res)
      }) To avoid unnecessary firebase calls, I decided to use local storage. */
      const getLastMessage = async () => {
        const message = await AsyncStorage.getItem(chatId)
        if (message) return setLastMessage(JSON.parse(message))
      }
      getLastMessage()
    }, [chatId, client])
  )

  const navigation = useNavigation()
  if (!client) return null
  return (
    <View className={`w-full my-1 rounded-full flex-row justify-between shadow-lg items-center px-2 py-2 ${status !== 'aproved' ? 'bg-gray-300' : 'bg-white'}`}>
      <Image
        className='rounded-full w-[80px] aspect-square '
        source={client.photoURL ? { uri: client.photoURL } : defaultUser}
      />
      <View className='ml-2 flex-1 justify-start'>
        <Text className='font-[700] text-md'>{client?.displayName}</Text>

        <Text
          numberOfLines={2}
          ellipsizeMode='tail'
          className='mr-2'
        >
          {status === 'add' ? 'Would you like to extend an invitation to connect with this user?' : status === 'pending' ? 'This user sent you an invitation. Would you be interested in accepting' : lastMessage ? lastMessage : 'No messages yet'}
        </Text>
        {(status === 'add' || status === 'pending') && (
          <View className='flex-row m-1'>
            <TouchableOpacity
              onPress={() => {
                if (status === 'add') {
                  updateKnownUser(currentUser, client, status), setSearchResults('')
                }
                if (status === 'pending') {
                  deleteKnownUser(currentUser?.uid, client, status)
                  updateKnownUser(currentUser, client, status)
                  setSearchResults(null)
                }
              }}
              className='mr-2'
            >
              <AntDesign
                name='checkcircleo'
                size={24}
                color='#454545'
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (status === 'pending') deleteKnownUser(currentUser, client, status)
              }}
            >
              <AntDesign
                name='closecircleo'
                size={24}
                color='#454545'
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {status === 'aproved' && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ChatContent', { client, chatId })
          }}
        >
          <Ionicons
            name='arrow-forward-circle-outline'
            size={30}
            color='#1a6553'
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default CustomListItem
