import { Text, TouchableOpacity } from 'react-native'
import React, { useCallback } from 'react'
import { Ionicons } from '@expo/vector-icons'

const CustomHeaderBackBtn = ({ title, navigation }) => {
  const renderHeaderLeft = useCallback(
    () => (
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className='flex-row items-center'
      >
        <Ionicons
          name='ios-arrow-back-outline'
          size={24}
          color='#fff'
        />
        <Text className='text-white text-md'>{title}</Text>
      </TouchableOpacity>
    ),
    [navigation]
  )
  return renderHeaderLeft()
}

export default CustomHeaderBackBtn
