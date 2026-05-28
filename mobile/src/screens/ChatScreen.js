import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import MessageBubble from '../components/MessageBubble';
import ConnectionStatus from '../components/ConnectionStatus';
import { useSocket } from '../hooks/useSocket';
import { useMessages } from '../hooks/useMessages';
import { colors } from '../theme';

export default function ChatScreen({ route }) {
  const { username, token } = route.params;
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const { socket, isConnected } = useSocket(token);
  const { messages, loading, sendMessage } = useMessages(socket);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text || !isConnected) return;
    sendMessage(text);
    setInputText('');
  }, [inputText, isConnected, sendMessage]);

  const scrollToBottom = useCallback(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ConnectionStatus isConnected={isConnected} />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loaderText}>Loading messages...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id?.toString() || String(item.timestamp)}
          renderItem={({ item }) => (
            <MessageBubble message={item} isOwn={item.senderName === username} />
          )}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>💬</Text>
              <Text style={styles.emptyText}>No messages yet.</Text>
              <Text style={styles.emptySubtext}>Say hello!</Text>
            </View>
          }
        />
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={isConnected ? 'Type a message...' : 'Connecting...'}
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={500}
          editable={isConnected}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || !isConnected) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || !isConnected}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loaderText: { color: colors.textSecondary, fontSize: 14 },

  messageList: { paddingVertical: 16, paddingHorizontal: 4 },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: colors.textSecondary, fontSize: 16, fontWeight: '600' },
  emptySubtext: { color: colors.textMuted, fontSize: 13, marginTop: 4 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 110,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.textPrimary,
    marginRight: 10,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: colors.surfaceAlt,
    shadowOpacity: 0,
    elevation: 0,
  },
  sendIcon: { color: '#fff', fontSize: 16, marginLeft: 2 },
});
