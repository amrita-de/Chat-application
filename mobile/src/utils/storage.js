import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const saveToken = (token) => AsyncStorage.setItem(TOKEN_KEY, token);

export const getToken = () => AsyncStorage.getItem(TOKEN_KEY);

export const saveUser = (user) =>
  AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

export const getUser = async () => {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearAuth = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
};
