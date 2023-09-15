import { View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { signOut } from '../../../firebase'
import { Ionicons } from '@expo/vector-icons'
import { replaceProfilePhoto } from '../../utils/replaceProfilePhoto'
import { takePhoto } from '../../utils/takeCameraPhoto'
import { updateUserProfile } from '../../utils/updateProfie'

const HeaderOption = ({ navigation, onPhotoChange, auth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const handlePhotoSwitch = async (auth, mode) => {
    try {
      const uri = await takePhoto(mode)
      console.log(uri)
      if (uri) {
        const downloadUrl = await replaceProfilePhoto(auth, uri)
        onPhotoChange(uri)
        await updateUserProfile(auth.currentUser, downloadUrl)
      }
    } catch (error) {
      console.error('Error handling photo switch:', error)
      // Handle any errors that occurred during the process
    }
  }

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace('LoginScreen')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const MenuBtn = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          setIsMenuOpen(!isMenuOpen)
        }}
      >
        <Ionicons
          name='menu'
          size={30}
          color='white'
        />
      </TouchableOpacity>
    )
  }

  const MenuOptionBtn = () => {
    return (
      <View className='flex-row  p-2 justify-start'>
        <TouchableOpacity
          onPress={() => handlePhotoSwitch(auth, 1)}
          className='px-2'
        >
          <Ionicons
            name='camera-outline'
            size={30}
            color='white'
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={async () => handlePhotoSwitch(auth, 0)}>
          <Ionicons
            name='attach'
            size={30}
            color='white'
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleLogOut}
          className='px-2'
        >
          <Ionicons
            name='log-out-outline'
            size={30}
            color='white'
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setIsMenuOpen(!isMenuOpen)
          }}
        >
          <Ionicons
            name='close'
            size={30}
            color='white'
            style={{ marginLeft: 12 }}
          />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View>
      {!isMenuOpen && <MenuBtn />}
      {isMenuOpen && <MenuOptionBtn />}
    </View>
  )
}

export default HeaderOption
