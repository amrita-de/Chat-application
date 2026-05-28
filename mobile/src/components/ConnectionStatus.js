import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function ConnectionStatus({ isConnected }) {
  return (
    <View style={[styles.bar, isConnected ? styles.connected : styles.disconnected]}>
      <View style={[styles.dot, isConnected ? styles.dotConnected : styles.dotDisconnected]} />
      <Text style={[styles.text, isConnected ? styles.textConnected : styles.textDisconnected]}>
        {isConnected ? 'Connected' : 'Connecting to server...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  connected: { backgroundColor: colors.connectedBg },
  disconnected: { backgroundColor: colors.disconnectedBg },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  dotConnected: { backgroundColor: colors.connected },
  dotDisconnected: { backgroundColor: colors.disconnected },

  text: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
  textConnected: { color: colors.connected },
  textDisconnected: { color: colors.disconnected },
});
