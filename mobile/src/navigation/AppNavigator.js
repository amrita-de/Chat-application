import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Pressable, Text } from 'react-native';
import { colors } from '../theme';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ChatScreen from '../screens/ChatScreen';
import { getUser, clearAuth } from '../utils/storage';

const Stack = createStackNavigator();

function LogoutButton({ navigation }) {
  const handleLogout = async () => {
    await clearAuth();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <Pressable
      onPress={handleLogout}
      style={({ pressed }) => ({
        marginRight: 16,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Text style={{ color: colors.accent, fontSize: 14, fontWeight: '700' }}>Logout</Text>
    </Pressable>
  );
}

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [initialParams, setInitialParams] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getUser();
      if (user?.token && user?.username) {
        setInitialRoute('Chat');
        setInitialParams(user);
      } else {
        setInitialRoute('Login');
      }
    };
    checkAuth();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerStyle: { backgroundColor: colors.header, borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '700', fontSize: 17, color: colors.textPrimary },
          cardStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Create Account' }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          initialParams={initialParams}
          options={({ route, navigation }) => ({
            title: `Chat — ${route.params?.username ?? ''}`,
            headerRight: () => <LogoutButton navigation={navigation} />,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
