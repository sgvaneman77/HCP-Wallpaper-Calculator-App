
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Button, ScrollView, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Card from '../components/Card';
import Stat from '../components/Stat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Brand } from '../theme/colors';
import { DEFAULT_ROLLS, DEFAULT_WALLS, computeRoom } from '../math/wallpaper';

type WallRow = { width: number; height: number; openingWidth: number; openingHeight: number; };

export default function RoomScreen() {
  const [rolls, setRolls] = useState(DEFAULT_ROLLS);
  const [match, setMatch] = useState(0.5);
  const [walls, setWalls] = useState<WallRow[]>(DEFAULT_WALLS);

  useEffect(() => {
    (async () => {
      const a = await AsyncStorage.getItem('rolls'); if (a) setRolls(JSON.parse(a));
      const b = await AsyncStorage.getItem('match'); if (b) setMatch(JSON.parse(b));
      const c = await AsyncStorage.getItem('walls'); if (c) setWalls(JSON.parse(c));
    })();
  }, []);

  useEffect(() => { AsyncStorage.setItem('rolls', JSON.stringify(rolls)); }, [rolls]);
  useEffect(() => { AsyncStorage.setItem('match', JSON.stringify(match)); }, [match]);
  useEffect(() => { AsyncStorage.setItem('walls', JSON.stringify(walls)); }, [walls]);

  const calc = useMemo(() => computeRoom(walls, { ...rolls, m: match }), [walls, rolls, match]);

  function updateWall(idx: number, patch: Partial<WallRow>) {
    setWalls(ws => ws.map((w, i) => i === idx ? { ...w, ...patch } : w));
  }
  function removeWall(idx: number) {
    setWalls(ws => ws.filter((_, i) => i !== idx));
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FAFAFA' }} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <View style={styles.brandRow}>
        <Image source={require('../../assets/hc-logo.png')} style={{ width: 40, height: 40, marginRight: 10 }} />
        <Text style={styles.brandText}>Whole-Room Calculator</Text>
      </View>

      <Card title="Roll & Pattern Settings">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <Input label="Roll width Pw (in)" value={rolls.Pw} onChange={(n)=>setRolls({ ...rolls, Pw: n })} />
          <Input label="Roll length Pl (in)" value={rolls.Pl} onChange={(n)=>setRolls({ ...rolls, Pl: n })} />
          <Input label="Repeat Rpt (in)" value={rolls.Rpt} onChange={(n)=>setRolls({ ...rolls, Rpt: n })} />
          <Input label="Trim T (in)" value={rolls.T} onChange={(n)=>setRolls({ ...rolls, T: n })} />
          <Input label="Match m (0 or 0.5)" value={match} onChange={(n)=>setMatch(n)} />
        </View>
        <Text style={styles.helper}>Credit openings only if opening height ≥ 50% of the wall height.</Text>
      </Card>

      <Card title="Walls & Openings">
        {walls.map((w, i) => (
          <View key={i} style={styles.row}>
            <Text style={{ width: 20, textAlign: 'center' }}>{i+1}</Text>
            <Input label="Wi" value={w.width} onChange={(n)=>updateWall(i,{ width:n })} compact />
            <Input label="Hi" value={w.height} onChange={(n)=>updateWall(i,{ height:n })} compact />
            <Input label="Open W" value={w.openingWidth} onChange={(n)=>updateWall(i,{ openingWidth:n })} compact />
            <Input label="Open H" value={w.openingHeight} onChange={(n)=>updateWall(i,{ openingHeight:n })} compact />
            <TouchableOpacity onPress={()=>removeWall(i)} style={styles.removeBtn}><Text style={{ color: 'white', fontWeight: '700' }}>×</Text></TouchableOpacity>
          </View>
        ))}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <Button title="Add wall" onPress={()=>setWalls(ws => [...ws, { width: 0, height: 0, openingWidth: 0, openingHeight: 0 }])} />
          <Button title="Reset example" onPress={()=>setWalls(DEFAULT_WALLS)} />
        </View>
      </Card>

      {calc && (
        <Card title="Results">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <Stat label="Tallest wall Hmax (in)" value={calc.Hmax} />
            <Stat label="Strip length Sl_room (in)" value={calc.Sl_room} />
            <Stat label="Total eff. width (in)" value={calc.Wtotal_eff} />
            <Stat label="Total strips S_total" value={calc.S_total} />
            <Stat label="Strips/roll Sr_room" value={calc.Sr_room} />
            <Stat label="Rolls (Conservative)" value={calc.R_room} highlight />
            <Stat label="Total yards (Cons.)" value={Math.round(calc.Y_total_cons*10)/10} />
            <Stat label="Total length (in)" value={calc.Total_length_needed} />
            <Stat label="Rolls (Packing)" value={calc.R_room_packing} highlight />
            <Stat label="Total yards (Pack.)" value={Math.round(calc.Y_total_packing*10)/10} />
          </View>
          <View style={{ marginTop: 12, padding: 12, backgroundColor: '#F8F8F8', borderRadius: 12, borderWidth: 1, borderColor: '#EEE' }}>
            <Text style={{ fontWeight: '700' }}>Recommended Rolls: {calc.Recommended}</Text>
            <Text style={{ color: '#666', marginTop: 4 }}>We take the higher of both methods. Add 1 extra for tricky layouts.</Text>
          </View>
        </Card>
      )}
    </ScrollView>
  );
}

function Input({ label, value, onChange, compact }: { label: string; value: number; onChange: (n:number)=>void; compact?: boolean }) {
  return (
    <View style={{ marginBottom: compact ? 0 : 12, width: compact ? 72 : '48%' }}>
      <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{label}</Text>
      <TextInput keyboardType='numeric' value={String(value ?? '')} onChangeText={(t)=>onChange(Number(t||0))}
        style={{ height: 44, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', paddingHorizontal: 12, backgroundColor: 'white' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandText: { fontSize: 20, fontWeight: '800', color: Brand.dark },
  helper: { marginTop: 8, fontSize: 12, color: '#666' },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 8 },
  removeBtn: { backgroundColor: '#CC3A3A', borderRadius: 10, width: 36, height: 44, alignItems: 'center', justifyContent: 'center' }
});
