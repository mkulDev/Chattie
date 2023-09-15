import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { auth } from '../../firebase'
import { getUnixTime, fromUnixTime, formatDistanceToNow, timeDifference } from 'date-fns'
const Message = ({ navigation, data }) => {
  //Checking if the log-in user is the Author of the message.
  const isAuthor = data.author === auth.currentUser.uid

  const getRelativeTime = (timestamp) => {
    if (timestamp) {
      const nowUnixTime = getUnixTime(new Date())
      const timestampUnixTime = getUnixTime(fromUnixTime(timestamp.seconds))
      const timeDifferenceInSeconds = nowUnixTime - timestampUnixTime
      if (timeDifferenceInSeconds < 60) {
        return 'Less than 1 minute ago'
      }
      return formatDistanceToNow(timestampUnixTime * 1000, {
        addSuffix: true
      })
    } else {
      return 'In past'
    }
  }

  const showImage = () => {
    // console.log('click')
    //  navigation.replace('ChatScreen')
    // I have planned to build that feature in the future.
  }

  return (
    <View className={`${isAuthor ? ' flex-row' : ' flex-row-reverse'} justify-end mb-2`}>
      <View className={`max-w-[70%]`}>
        <Text className={`${isAuthor ? `text-[#fff] bg-[#1a6553] self-end` : 'bg-[#dfdfdf] '} p-3 rounded-xl mx-2 text-xl  shadow-black shadow-lg`}>{data.content}</Text>
        {data?.file && (
          <TouchableOpacity onPress={showImage}>
            <Image
              source={{ uri: data.file }}
              className='w-[150]  aspect-[3/4] rounded-lg mx-2 mt-2 self-end'
            />
          </TouchableOpacity>
        )}
        <Text
          className={`${isAuthor ? ' self-end' : ' self-start'} text-xs mx-2`}
          style={{ maxWidth: 100 }}
        >
          {getRelativeTime(data.timestamp)}
        </Text>
      </View>
      <Image
        className='rounded-full w-12 aspect-square'
        source={data?.authorAvatar ? { uri: data.authorAvatar } : require('../assets/userProfile.png')}
      />
    </View>
  )
}

export default Message
