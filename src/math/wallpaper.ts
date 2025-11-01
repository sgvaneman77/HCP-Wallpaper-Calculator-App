
export type RollInputs = {
  Pw: number; // roll width (in)
  Pl: number; // roll length (in)
  Rpt: number; // repeat (in)
  T: number;   // trim total (in)
  m: number;   // match type 0 or 0.5
};

export type OneWallInputs = {
  Ww: number; // wall width (in)
  Wh: number; // wall height (in)
};

export type Wall = {
  width: number; // Wi (in)
  height: number; // Hi (in)
  openingWidth: number;  // (in)
  openingHeight: number; // (in)
};

export function ceilDiv(a: number, b: number) { return Math.ceil(a / b); }
export function floorDiv(a: number, b: number) { return Math.floor(a / b); }

export function stripLength(Wh: number, Rpt: number, T: number, m: number) {
  if (Rpt > 0) {
    const raw = Wh + T + m * Rpt;
    return Math.ceil(raw / Rpt) * Rpt;
  }
  return Wh + T;
}

export function computeOneWall(one: OneWallInputs, rolls: RollInputs) {
  const Sl = stripLength(one.Wh, rolls.Rpt, rolls.T, rolls.m);
  const S  = ceilDiv(one.Ww, rolls.Pw);
  const Sr = floorDiv(rolls.Pl, Sl) || 1;
  const R  = ceilDiv(S, Sr);
  const yardsPerRoll = rolls.Pl / 36;
  const Y = R * yardsPerRoll;
  return { Sl, S, Sr, R, yardsPerRoll, Y };
}

export function computeRoom(walls: Wall[], rolls: RollInputs) {
  if (!walls || walls.length === 0) return null;

  const hmax = Math.max(...walls.map(w => Math.max(0, w.height)));
  const Sl_room = stripLength(hmax, rolls.Rpt, rolls.T, rolls.m);

  const effectiveWidth = (w: Wall) => {
    const credit = w.openingHeight >= 0.5 * w.height ? w.openingWidth : 0;
    return Math.max(0, w.width - credit);
  };

  const Wtotal_eff = walls.reduce((a, w) => a + effectiveWidth(w), 0);
  const S_total = ceilDiv(Wtotal_eff, rolls.Pw);
  const Sr_room = floorDiv(rolls.Pl, Sl_room) || 1;
  const R_room  = ceilDiv(S_total, Sr_room);
  const Y_total_cons = (R_room * rolls.Pl) / 36;

  const strips = walls.map(w => ({
    S_i: ceilDiv(effectiveWidth(w), rolls.Pw),
    Sl_i: stripLength(w.height, rolls.Rpt, rolls.T, rolls.m)
  }));

  const Total_length_needed = strips.reduce((a, s) => a + s.S_i * s.Sl_i, 0);
  const R_room_packing = ceilDiv(Total_length_needed, rolls.Pl);
  const Y_total_packing = (R_room_packing * rolls.Pl) / 36;

  const Recommended = Math.max(R_room, R_room_packing);

  return {
    Hmax: hmax,
    Sl_room,
    Wtotal_eff,
    S_total,
    Sr_room,
    R_room,
    Y_total_cons,
    Total_length_needed,
    R_room_packing,
    Y_total_packing,
    Recommended
  };
}

export const DEFAULT_ROLLS: RollInputs = { Pw: 27, Pl: 396, Rpt: 25, T: 4, m: 0.5 };
export const DEFAULT_ONE: OneWallInputs = { Ww: 150, Wh: 96 };
export const DEFAULT_WALLS: Wall[] = [
  { width: 144, height: 96, openingWidth: 0, openingHeight: 0 },
  { width: 144, height: 96, openingWidth: 36, openingHeight: 84 },
  { width: 120, height: 96, openingWidth: 0, openingHeight: 0 },
  { width: 120, height: 96, openingWidth: 0, openingHeight: 0 }
];
