import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Login from './src/screens/Login'
import Register from './src/screens/Register'
import Chat from './src/screens/Chat'
import HeaderTitle from './src/components/HeaderComponents/HeaderTitle'
import ChatContent from './src/screens/ChatContent'

const Stack = createNativeStackNavigator()

const globalOptions = {
  headerStyle: { backgroundColor: '#1a6553' },
  headerTitleStyle: { color: '#fff' },
  headerTintColor: '#fff',
  headerTitleAlign: 'center'
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='LoginScreen'
        screenOptions={globalOptions}
      >
        <Stack.Screen
          name='LoginScreen'
          component={Login}
          options={{
            headerTitle: 'Login'
          }}
        />
        <Stack.Screen
          name='RegisterScreen'
          component={Register}
          options={{
            headerTitle: 'Register'
          }}
        />
        <Stack.Screen
          name='ChatScreen'
          component={Chat}
          options={{
            headerTitle: (props) => <HeaderTitle {...props} /> // Use my empty header component
          }}
        />
        <Stack.Screen
          name='ChatContent'
          component={ChatContent}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
