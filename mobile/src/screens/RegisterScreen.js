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
import { register } from '../services/api';
import { saveToken, saveUser } from '../utils/storage';
import { colors } from '../theme';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Please enter a username and password.');
      return;
    }
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await register(username.trim(), password);
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

          <View style={styles.headerArea}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the conversation</Text>
          </View>

          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Username (min 3 characters)"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={colors.textMuted}
            />
            <TextInput
              style={styles.input}
              placeholder="Password (min 6 characters)"
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
              onPress={handleRegister}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.buttonText}>Create Account</Text>
              }
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.link}>
              Already have an account?{'  '}
              <Text style={styles.linkBold}>Login</Text>
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

  headerArea: { alignItems: 'center', marginBottom: 32 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 6,
  },

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

  link: { color: colors.textSecondary, textAlign: 'center', fontSize: 14 },
  linkBold: { color: colors.accent, fontWeight: '700' },
});
