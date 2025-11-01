
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

type Props = { label: string; value: number; onChange: (n: number) => void; };
export default function NumberField({ label, value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        keyboardType="numeric"
        value={String(value ?? '')}
        onChangeText={(t) => onChange(Number(t || 0))}
        style={styles.input}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { fontSize: 13, color: '#333', marginBottom: 6 },
  input: { height: 44, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', paddingHorizontal: 12, backgroundColor: 'white' }
});
