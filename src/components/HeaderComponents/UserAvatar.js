import { View, Text, Image } from 'react-native'
import { auth } from '../../../firebase'

const UserAvatar = ({ photoURL }) => {
  const userName = auth.currentUser.displayName

  return (
    <View className='flex-row items-center py-2'>
      <Image
        source={photoURL ? { uri: photoURL } : require('../../assets/userProfile.png')}
        className='w-16 aspect-square rounded-full '
      />
      <Text className='text-white ml-2 text-sm items-baseline'>{userName ? userName : 'Anonymous'}</Text>
    </View>
  )
}

export default UserAvatar
