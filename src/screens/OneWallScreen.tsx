
import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, Image, StyleSheet } from 'react-native';
import NumberField from '../components/NumberField';
import Card from '../components/Card';
import Stat from '../components/Stat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Brand } from '../theme/colors';
import { DEFAULT_ONE, DEFAULT_ROLLS, computeOneWall } from '../math/wallpaper';

export default function OneWallScreen() {
  const [rolls, setRolls] = useState(DEFAULT_ROLLS);
  const [one, setOne] = useState(DEFAULT_ONE);
  const [match, setMatch] = useState(0.5);

  useEffect(() => {
    (async () => {
      const a = await AsyncStorage.getItem('rolls'); if (a) setRolls(JSON.parse(a));
      const b = await AsyncStorage.getItem('one'); if (b) setOne(JSON.parse(b));
      const c = await AsyncStorage.getItem('match'); if (c) setMatch(JSON.parse(c));
    })();
  }, []);

  useEffect(() => { AsyncStorage.setItem('rolls', JSON.stringify(rolls)); }, [rolls]);
  useEffect(() => { AsyncStorage.setItem('one', JSON.stringify(one)); }, [one]);
  useEffect(() => { AsyncStorage.setItem('match', JSON.stringify(match)); }, [match]);

  const calc = useMemo(() => computeOneWall(one, { ...rolls, m: match }), [one, rolls, match]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FAFAFA' }} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <View style={styles.brandRow}>
        <Image source={require('../../assets/hc-logo.png')} style={{ width: 40, height: 40, marginRight: 10 }} />
        <Text style={styles.brandText}>One-Wall Calculator</Text>
      </View>

      <Card title="Roll & Pattern Settings">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <View style={{ width: '48%' }}><NumberField label="Roll width Pw (in)" value={rolls.Pw} onChange={(n)=>setRolls({ ...rolls, Pw: n })} /></View>
          <View style={{ width: '48%' }}><NumberField label="Roll length Pl (in)" value={rolls.Pl} onChange={(n)=>setRolls({ ...rolls, Pl: n })} /></View>
          <View style={{ width: '48%' }}><NumberField label="Repeat Rpt (in)" value={rolls.Rpt} onChange={(n)=>setRolls({ ...rolls, Rpt: n })} /></View>
          <View style={{ width: '48%' }}><NumberField label="Trim T (in)" value={rolls.T} onChange={(n)=>setRolls({ ...rolls, T: n })} /></View>
          <View style={{ width: '48%' }}><NumberField label="Match m (0 or 0.5)" value={match} onChange={(n)=>setMatch(n)} /></View>
        </View>
        <Text style={styles.helper}>All dimensions in inches. Yards are auto-calculated. We round up on strips & rolls.</Text>
      </Card>

      <Card title="One-Wall Inputs">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <View style={{ width: '48%' }}><NumberField label="Wall width Ww (in)" value={one.Ww} onChange={(n)=>setOne({ ...one, Ww: n })} /></View>
          <View style={{ width: '48%' }}><NumberField label="Wall height Wh (in)" value={one.Wh} onChange={(n)=>setOne({ ...one, Wh: n })} /></View>
        </View>
        <View style={{ marginTop: 12 }}>
          <Button title="Reset example" onPress={()=>{ setOne(DEFAULT_ONE); setRolls(DEFAULT_ROLLS); setMatch(0.5); }} />
        </View>
      </Card>

      <Card title="Results">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <View style={{ width: '48%' }}><Stat label="Strip length Sl (in)" value={calc.Sl} /></View>
          <View style={{ width: '48%' }}><Stat label="Strips S" value={calc.S} /></View>
          <View style={{ width: '48%' }}><Stat label="Strips/roll Sr" value={calc.Sr} /></View>
          <View style={{ width: '48%' }}><Stat label="Rolls R" value={calc.R} highlight /></View>
          <View style={{ width: '48%' }}><Stat label="Yards/roll" value={Math.round(calc.yardsPerRoll * 10)/10} /></View>
          <View style={{ width: '48%' }}><Stat label="Total yards" value={Math.round(calc.Y * 10)/10} highlight /></View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandText: { fontSize: 20, fontWeight: '800', color: Brand.dark },
  helper: { marginTop: 8, fontSize: 12, color: '#666' }
});
