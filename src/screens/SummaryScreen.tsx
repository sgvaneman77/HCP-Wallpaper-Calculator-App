
import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Image } from 'react-native';
import Card from '../components/Card';
import Stat from '../components/Stat';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Brand } from '../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_ROLLS, DEFAULT_WALLS, computeRoom } from '../math/wallpaper';

export default function SummaryScreen() {
  const [projectName, setProjectName] = useState('Room 1');
  const [rolls, setRolls] = useState(DEFAULT_ROLLS);
  const [match, setMatch] = useState(0.5);
  const [walls, setWalls] = useState(DEFAULT_WALLS);

  useEffect(() => {
    (async () => {
      const a = await AsyncStorage.getItem('rolls'); if (a) setRolls(JSON.parse(a));
      const b = await AsyncStorage.getItem('match'); if (b) setMatch(JSON.parse(b));
      const c = await AsyncStorage.getItem('walls'); if (c) setWalls(JSON.parse(c));
      const d = await AsyncStorage.getItem('projectName'); if (d) setProjectName(JSON.parse(d));
    })();
  }, []);

  useEffect(() => { AsyncStorage.setItem('projectName', JSON.stringify(projectName)); }, [projectName]);

  const calc = useMemo(() => computeRoom(walls, { ...rolls, m: match }), [walls, rolls, match]);
  const recommended = calc?.Recommended ?? 0;
  const yards = recommended * (rolls.Pl / 36);

  async function exportPDF() {
    const html = `
      <html><head><meta name='viewport' content='width=device-width,initial-scale=1' />
      <style>
        body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; padding: 24px; }
        .title { font-size: 22px; font-weight: 800; }
        .pill { padding: 6px 10px; border-radius: 999px; background: #f4f4f4; display:inline-block; margin-right: 6px; font-size: 12px; }
        table { border-collapse: collapse; width: 100%; margin-top: 12px; }
        td, th { border: 1px solid #e6e6e6; padding: 8px; font-size: 13px; }
        .big { font-size: 26px; font-weight: 900; }
      </style></head><body>
        <div class='title'>Hi-Country Paperworks — Wallpaper Calculator</div>
        <div style='margin-top: 8px; font-size: 13px;'>Project: <strong>${projectName}</strong></div>
        <div style='margin-top: 12px;'>
          <span class='pill'>Roll width: ${rolls.Pw} in</span>
          <span class='pill'>Roll length: ${rolls.Pl} in</span>
          <span class='pill'>Repeat: ${rolls.Rpt} in</span>
          <span class='pill'>Trim: ${rolls.T} in</span>
          <span class='pill'>Match: ${match}</span>
        </div>
        <table>
          <tr><th>Method</th><th>Rolls</th><th>Total Yards</th></tr>
          <tr><td>Conservative</td><td>${calc?.R_room ?? '-'}</td><td>${(calc?.Y_total_cons ?? 0).toFixed(1)}</td></tr>
          <tr><td>Packing</td><td>${calc?.R_room_packing ?? '-'}</td><td>${(calc?.Y_total_packing ?? 0).toFixed(1)}</td></tr>
        </table>
        <div style='margin-top:16px;'>Recommended Rolls (higher of both): <span class='big'>${recommended}</span></div>
        <div style='margin-top:6px;'>Estimated Yards from Recommended: <strong>${yards.toFixed(1)}</strong></div>
        <div style='margin-top:12px; font-size:12px; color:#666;'>These are estimates. Always verify on site. Add 1 extra roll for tricky layouts, niches, or angled ceilings.</div>
      </body></html>
    `;
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FAFAFA' }} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <View style={styles.brandRow}>
        <Image source={require('../../assets/hc-logo.png')} style={{ width: 40, height: 40, marginRight: 10 }} />
        <Text style={styles.brandText}>Summary & Export</Text>
      </View>

      <Card title="Overview">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <Stat label="Recommended Rolls" value={recommended} highlight />
          <Stat label="Total Yards (from Recommended)" value={Math.round(yards*10)/10} />
        </View>
        <View style={{ marginTop: 12 }}>
          <Button title="Export PDF" onPress={exportPDF} />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandText: { fontSize: 20, fontWeight: '800', color: Brand.dark }
});
