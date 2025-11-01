import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View>{children}</View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 2, borderWidth: 1, borderColor: '#eee' },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#222' }
});
