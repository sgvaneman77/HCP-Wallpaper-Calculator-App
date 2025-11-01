
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Stat({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <View style={[styles.box, highlight && styles.hl]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{String(value)}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  box: { backgroundColor: '#F7F7F7', borderWidth: 1, borderColor: '#E6E6E6', padding: 12, borderRadius: 12 },
  hl: { backgroundColor: '#FFF7E6', borderColor: '#FFE8B5' },
  label: { fontSize: 12, color: '#666' },
  value: { fontSize: 18, fontWeight: '700', color: '#222', marginTop: 4 }
});
