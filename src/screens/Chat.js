import { SafeAreaView, TextInput, ScrollView } from 'react-native'
import React, { useLayoutEffect, useState, useEffect } from 'react'
import { collection, query, where, getDocs, onSnapshot, doc } from 'firebase/firestore'
import HeaderOption from '../components/HeaderComponents/HeaderOption'
import UserAvatar from '../components/HeaderComponents/UserAvatar'
import { auth, db } from '../../firebase'
import CustomListItem from '../components/CustomListItem'

const Chat = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [photoURL, setPhotURL] = useState(auth.currentUser.photoURL)
  const [knownFriends, setKnownFriend] = useState(null)

  useEffect(() => {
    const userRef = doc(db, 'users', auth.currentUser.uid)

    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data()
        setKnownFriend(userData.knownUsers || [])
      }
    })

    return () => unsubscribe() // Unsubscribe when the component unmounts
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderOption
          navigation={navigation}
          auth={auth}
          onPhotoChange={setPhotURL}
        />
      ),
      headerLeft: () => <UserAvatar photoURL={photoURL} />,
      headerBackVisible: false
    })
  }, [photoURL])

  // handle search query
  const handleSearch = async () => {
    try {
      const usersCollection = collection(db, 'users')
      const searchQueryRef = query(usersCollection, where('displayName', '==', searchQuery))
      const querySnapshot = await getDocs(searchQueryRef)
      console.log('querySnapshot', querySnapshot)
      const searchResultsArray = querySnapshot.docs.map((doc) => doc.data())

      setSearchResults(searchResultsArray)
      setSearchQuery('')
    } catch (error) {
      console.error('Error searching for users:', error)
    }
  }

  return (
    <SafeAreaView className='p-4'>
      <TextInput
        style={{ paddingHorizontal: 10, paddingVertical: 8, borderColor: '#ccc', borderWidth: 1 }}
        placeholder='Search for other users...'
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text.trim())}
        onEndEditing={handleSearch}
      />
      {searchResults && (
        <ScrollView className='border-b-2 border-b-[#1a6553]'>
          {searchResults?.map((client) => (
            <CustomListItem
              key={client.uid} // Make sure to add a unique key prop when using map
              client={client}
              status='add'
              setSearchResults={setSearchResults}
            />
          ))}
        </ScrollView>
      )}
      {/* known users*/}
      <ScrollView>
        {knownFriends &&
          knownFriends
            .filter((friend) => {
              return !(friend.status === 'pending' && friend.from === auth.currentUser.uid)
            })
            .map((client) => (
              <CustomListItem
                key={client.displayName}
                client={client}
                status={client.status}
                setSearchResults={setSearchResults}
              />
            ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Chat
