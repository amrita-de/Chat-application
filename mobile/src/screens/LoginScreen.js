import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { login } from '../services/api';
import { saveToken, saveUser } from '../utils/storage';
import { colors } from '../theme';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Please enter your username and password.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await login(username.trim(), password);
      await saveToken(data.token);
      await saveUser({ username: data.username, token: data.token });
      navigation.replace('Chat', { username: data.username, token: data.token });
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.innerWrapper}>

          {/* Logo area */}
          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>💬</Text>
            </View>
            <Text style={styles.appName}>ChatApp</Text>
            <Text style={styles.tagline}>Sign in to continue</Text>
          </View>

          {/* Form card */}
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={colors.textMuted}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={colors.textMuted}
            />

            {error !== '' && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠  {error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.buttonText}>Login</Text>
              }
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>
              Don't have an account?{'  '}
              <Text style={styles.linkBold}>Register</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },

  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 48,
    ...Platform.select({
      web: { alignItems: 'center', paddingVertical: 60 },
      default: { paddingHorizontal: 24 },
    }),
  },

  innerWrapper: {
    width: '100%',
    ...Platform.select({
      web: { maxWidth: 440, paddingHorizontal: 24 },
      default: {},
    }),
  },

  // Logo
  logoArea: { alignItems: 'center', marginBottom: 36 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: colors.accent,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  logoEmoji: { fontSize: 34 },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    ...Platform.select({
      web: {
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 8 },
      },
      default: {},
    }),
  },

  input: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 14,
    ...Platform.select({
      web: { outlineStyle: 'none' },
      default: {},
    }),
  },

  button: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
    ...Platform.select({
      web: { cursor: 'pointer' },
      default: {},
    }),
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Error
  errorBox: {
    backgroundColor: colors.errorBg,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  errorText: { color: colors.error, fontSize: 13, fontWeight: '600' },

  // Footer link
  link: { color: colors.textSecondary, textAlign: 'center', fontSize: 14 },
  linkBold: { color: colors.accent, fontWeight: '700' },
});
