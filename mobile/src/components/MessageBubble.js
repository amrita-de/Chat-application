import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

const formatTime = (timestamp) =>
  new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function MessageBubble({ message, isOwn }) {
  return (
    <View style={[styles.wrapper, isOwn ? styles.wrapperOwn : styles.wrapperOther]}>
      <Text style={[styles.sender, isOwn ? styles.senderOwn : styles.senderOther]}>
        {isOwn ? 'You' : message.senderName}
      </Text>
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={[styles.content, isOwn ? styles.contentOwn : styles.contentOther]}>
          {message.content}
        </Text>
      </View>
      <Text style={[styles.timestamp, isOwn ? styles.timestampOwn : styles.timestampOther]}>
        {formatTime(message.timestamp)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 5,
    marginHorizontal: 12,
    maxWidth: '75%',
  },
  wrapperOwn: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  wrapperOther: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },

  sender: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 3,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  senderOwn: {
    color: colors.accent,
    marginRight: 6,
  },
  senderOther: {
    color: colors.textSecondary,
    marginLeft: 6,
  },

  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleOwn: {
    backgroundColor: colors.bubbleOwn,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.bubbleOther,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#2a2f4a',
  },

  content: { fontSize: 15, lineHeight: 21 },
  contentOwn: { color: '#fff' },
  contentOther: { color: colors.textPrimary },

  timestamp: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
  },
  timestampOwn: { marginRight: 4 },
  timestampOther: { marginLeft: 4 },
});
