/* Menu Masi — weekly veg meal planner. Plain JS, no dependencies, localStorage.
   Profiles: each profile has its own dish selection (from the master list + custom
   dishes), preferences, weeks and grocery ticks. */

"use strict";

// ---------- constants ----------
var CUI = {
  gu: "Gujarati", pu: "Punjabi", mx: "Mexican", si: "South Indian",
  st: "Street & Snacks", gn: "Light & General", dr: "Drinks", ds: "Desserts"
};
var CUI_ORDER = ["gu", "pu", "mx", "si", "st", "gn", "dr", "ds"];
var OCCASIONS = [
  ["normal", "Normal week"], ["light", "Light & healthy"], ["street", "Street-food weekend"],
  ["guest", "Guests on weekend"], ["festival", "Festival week"]
];
var DAYNAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var CAT_LABEL = {
  veg: "Vegetables & fresh", fruit: "Fruits", dairy: "Dairy",
  bakery: "Bread & bakery", packaged: "Packaged & namkeen", staple: "Pantry staples"
};
var FRESH_CATS = ["veg", "fruit", "dairy", "bakery", "packaged"];
var ING_CATS = ["veg", "fruit", "dairy", "bakery", "packaged", "staple"];
var ING_UNITS = ["g", "kg", "ml", "l", "pcs", "cup", "tbsp", "tsp", "bunch", "pack", "slices"];
var LS_KEY = "foodypanda_v1";

// master list = built-in dishes from the data files
var MASTER = DISHES.slice();
var MASTER_IDS = {};
MASTER.forEach(function (d) { MASTER_IDS[d.id] = 1; });

// ---------- state & profiles ----------
function defaultPrefs() { return { fav: [], avoid: [], jain: false, people: 3, faraalDay: "" }; }
function makeProfile(name, withAll) {
  var en = {};
  if (withAll) MASTER.forEach(function (d) { en[d.id] = 1; });
  return { id: "p" + Date.now() + Math.floor(Math.random() * 1000), name: name, enabled: en,
    custom: [], overrides: {}, weeks: [], prefs: defaultPrefs(), groceryChecked: {} };
}
function migrate(s) {
  if (s && s.profiles && s.profiles.length) {
    if (!s.helpDone) s.helpDone = s.hintsDone ? { plan: true } : {};
    s.profiles.forEach(function (p) {
      if (!p.enabled) { p.enabled = {}; MASTER.forEach(function (d) { p.enabled[d.id] = 1; }); }
      if (!p.custom) p.custom = [];
      if (!p.overrides) p.overrides = {};
      if (!p.weeks) p.weeks = [];
      if (!p.prefs) p.prefs = defaultPrefs();
      if (!p.groceryChecked) p.groceryChecked = {};
    });
    return s;
  }
  // old flat shape → wrap into a "Family" profile with the full master list
  var prof = makeProfile("Family", true);
  if (s && s.weeks) prof.weeks = s.weeks;
  if (s && s.prefs) prof.prefs = Object.assign(defaultPrefs(), s.prefs);
  if (s && s.groceryChecked) prof.groceryChecked = s.groceryChecked;
  return { v: 2, seen: !!(s && s.seen), helpDone: (s && s.hintsDone) ? { plan: true } : {}, active: prof.id, profiles: [prof] };
}
var S = load();
function load() {
  try {
    var raw = localStorage.getItem(LS_KEY);
    if (raw) return migrate(JSON.parse(raw));
  } catch (e) {}
  return migrate(null);
}
function save() { localStorage.setItem(LS_KEY, JSON.stringify(S)); }
function P() {
  return S.profiles.find(function (p) { return p.id === S.active; }) || S.profiles[0];
}

// effective dish lists for the active profile
var ALL = [], ACTIVE = [], byId = {};
function refreshDishes() {
  var p = P();
  ALL = MASTER.map(function (d) { return p.overrides[d.id] || d; }).concat(p.custom);
  byId = {};
  ALL.forEach(function (d) { byId[d.id] = d; });
  ACTIVE = ALL.filter(function (d) { return p.enabled[d.id]; });
}
refreshDishes();

// ---------- date utils ----------
function todayISO() {
  var d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function parseISO(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
function addDays(iso, n) {
  var d = parseISO(iso); d.setDate(d.getDate() + n);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function daysSince(iso, ref) { return Math.round((parseISO(ref) - parseISO(iso)) / 86400000); }
function fmtDate(iso) {
  var d = parseISO(iso);
  return DAYNAMES[d.getDay()] + " " + d.getDate() + " " + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()];
}
function dayName(iso) { return DAYNAMES[parseISO(iso).getDay()]; }
function isWeekendISO(iso) { var g = parseISO(iso).getDay(); return g === 0 || g === 6; }

// ---------- history index ----------
function buildHist() {
  // no per-meal tracking anymore: a past planned meal counts as "had",
  // a today/future meal counts as "planned" (keeps repeats away)
  var h = { lastCooked: {}, lastSkipped: {}, lastPlanned: {} };
  var t = todayISO();
  P().weeks.forEach(function (w) {
    w.days.forEach(function (day) {
      ["b", "d"].forEach(function (slot) {
        var m = day[slot];
        if (!m || !m.id) return;
        if (day.date < t) {
          if (!h.lastCooked[m.id] || day.date > h.lastCooked[m.id]) h.lastCooked[m.id] = day.date;
        } else {
          if (!h.lastPlanned[m.id] || day.date > h.lastPlanned[m.id]) h.lastPlanned[m.id] = day.date;
        }
      });
    });
  });
  return h;
}

// ---------- generator ----------
function seasonAdj(d) {
  var m = new Date().getMonth() + 1;
  if (d.tags.indexOf("winter") >= 0 && m >= 4 && m <= 9) return -30;
  if (d.tags.indexOf("summer") >= 0 && (m >= 11 || m <= 2)) return -25;
  return 0;
}
function freshNames(d) {
  return d.ing.filter(function (i) { return i[3] !== "staple"; }).map(function (i) { return i[0]; });
}
function scoreDish(d, hist, ref, basket) {
  var s = 0;
  var lc = hist.lastCooked[d.id];
  s += lc ? Math.min(daysSince(lc, ref), 90) : 90;
  var lp = hist.lastPlanned[d.id];
  if (lp && Math.abs(daysSince(lp, ref)) <= 7) s -= 50;
  var ls = hist.lastSkipped[d.id];
  if (ls && daysSince(ls, ref) >= 0 && daysSince(ls, ref) <= 14) s += 15; // skipped recently → retry soon
  if (P().prefs.fav.indexOf(d.id) >= 0) s += 20;
  if (d.tags.indexOf("protein") >= 0) s += 3;
  if (basket) {
    // grocery-overlap bonus: reuse ingredients already in this week's basket
    var overlap = 0;
    freshNames(d).forEach(function (n) { if (basket[n]) overlap++; });
    s += Math.min(overlap * 10, 40);
  }
  s += seasonAdj(d);
  s += Math.random() * (basket ? 20 : 30);
  return s;
}
function isTreat(d) { return d.tags.indexOf("treat") >= 0 || d.tags.indexOf("sweet") >= 0; }

function candidateFilter(d, slot, cui, ctx) {
  if (d.cui === "dr" || d.cui === "ds") return false; // drinks/desserts: manual add only
  if (d.slots.indexOf(slot === "b" ? "B" : "D") < 0) return false;
  if (P().prefs.avoid.indexOf(d.id) >= 0) return false;
  if (ctx.jain && d.tags.indexOf("jain") < 0) return false;
  if (ctx.faraal) return d.tags.indexOf("faraal") >= 0;
  if (d.tags.indexOf("faraal") >= 0) return false;
  if (ctx.used[d.id]) return false;
  if (cui && d.cui !== cui) return false;
  if (ctx.relax) return true;
  if (ctx.quick && d.tags.indexOf("quick") < 0 && d.mins > 25) return false;
  if (ctx.pairWt === 3 && d.wt === 3) return false;
  if (d.wt === 3 && ctx.heavyLeft <= 0) return false;
  if (d.tags.indexOf("fried") >= 0 && ctx.friedLeft <= 0) return false;
  if (isTreat(d)) {
    if (ctx.occasion !== "festival" && (!ctx.isWeekend || ctx.treatLeft <= 0)) return false;
  }
  if (ctx.occasion === "light" && (d.tags.indexOf("fried") >= 0 || d.wt === 3 || isTreat(d))) return false;
  if (ctx.needTags && !ctx.needTags.some(function (t) { return d.tags.indexOf(t) >= 0; })) return false;
  return true;
}
function pickDish(slot, cui, ctx, hist, ref) {
  var tries = [{ cui: cui }, { cui: null }, { cui: null, relax: true }];
  for (var i = 0; i < tries.length; i++) {
    var c2 = Object.assign({}, ctx, tries[i]);
    c2.needTags = i === 0 ? ctx.needTags : null;
    var pool = ACTIVE.filter(function (d) { return candidateFilter(d, slot, tries[i].cui !== undefined ? tries[i].cui : cui, c2); });
    if (pool.length) {
      var scored = pool.map(function (d) { return { d: d, s: scoreDish(d, hist, ref, ctx.basket) }; });
      scored.sort(function (a, b) { return b.s - a.s; });
      return scored[Math.floor(Math.random() * Math.min(3, scored.length))].d;
    }
  }
  return null;
}
function shuffle(a) {
  a = a.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function genWeek(startIso, occasion, quick, existing) {
  var hist = buildHist();
  var bSeq = shuffle(["gu", "gu", "gu", "si", "si", "gn", Math.random() < 0.5 ? "gu" : "st"]);
  var dSeq = shuffle(["gu", "gu", "gu", "pu", "mx"].concat(shuffle(["pu", "si", "st", "gu"]).slice(0, 2)));
  if (occasion === "light") {
    bSeq = shuffle(["gn", "gn", "gu", "si", "si", "gn", "gu"]);
    dSeq = shuffle(["gu", "gu", "si", "gn", "mx", "gu", "gn"]);
  }
  var ctx = {
    used: {}, jain: P().prefs.jain, quick: !!quick, occasion: occasion,
    friedLeft: 3, treatLeft: 1, heavyLeft: 2, basket: {}
  };
  var week = existing || { id: "w" + Date.now(), start: startIso, occasion: occasion, quick: !!quick, days: [] };
  if (!existing) {
    for (var i = 0; i < 7; i++) week.days.push({ date: addDays(startIso, i), b: null, d: null });
  }
  var today = todayISO();
  week.days.forEach(function (day) {
    ["b", "d"].forEach(function (slot) {
      var m = day[slot];
      if (m && m.id && (m.locked || m.status !== "planned" || day.date < today)) {
        ctx.used[m.id] = 1;
        var dd = byId[m.id];
        if (dd) {
          if (dd.tags.indexOf("fried") >= 0) ctx.friedLeft--;
          if (isTreat(dd)) ctx.treatLeft--;
          if (dd.wt === 3) ctx.heavyLeft--;
          freshNames(dd).forEach(function (n) { ctx.basket[n] = 1; });
        }
      }
    });
  });
  var festivalDone = false;
  week.days.forEach(function (day, i) {
    var keepB = day.b && day.b.id && (day.b.locked || day.b.status !== "planned" || (existing && day.date < today));
    var keepD = day.d && day.d.id && (day.d.locked || day.d.status !== "planned" || (existing && day.date < today));
    var faraal = P().prefs.faraalDay && dayName(day.date) === P().prefs.faraalDay;
    var wknd = isWeekendISO(day.date);
    var dayCtx = Object.assign({}, ctx, { faraal: faraal, isWeekend: wknd });

    if (!keepB) {
      var bd = pickDish("b", bSeq[i], dayCtx, hist, day.date);
      if (bd) {
        day.b = { id: bd.id, status: "planned", locked: false };
        ctx.used[bd.id] = 1;
        if (bd.tags.indexOf("fried") >= 0) ctx.friedLeft--;
        if (isTreat(bd)) ctx.treatLeft--;
        if (bd.wt === 3) ctx.heavyLeft--;
        freshNames(bd).forEach(function (n) { ctx.basket[n] = 1; });
      }
    }
    if (!keepD) {
      var bwt = day.b && byId[day.b.id] ? byId[day.b.id].wt : 1;
      var dCui = dSeq[i], needTags = null;
      if (occasion === "street" && wknd) dCui = "st";
      if (occasion === "guest" && wknd) { dCui = null; needTags = ["guest"]; }
      if (occasion === "festival" && wknd && !festivalDone) { dCui = null; needTags = ["festival"]; festivalDone = true; }
      var dayCtx2 = Object.assign({}, dayCtx, { pairWt: bwt, needTags: needTags });
      var dd = pickDish("d", dCui, dayCtx2, hist, day.date);
      if (dd) {
        day.d = { id: dd.id, status: "planned", locked: false };
        ctx.used[dd.id] = 1;
        if (dd.tags.indexOf("fried") >= 0) ctx.friedLeft--;
        if (isTreat(dd)) ctx.treatLeft--;
        if (dd.wt === 3) ctx.heavyLeft--;
        freshNames(dd).forEach(function (n) { ctx.basket[n] = 1; });
      }
    }
  });
  proteinPass(week, ctx, hist);
  return week;
}

function isProteiny(d) { return d && (d.tags.indexOf("protein") >= 0 || d.nut[1] >= 14); }
function proteinPass(week, ctx, hist) {
  var count = 0;
  week.days.forEach(function (day) {
    ["b", "d"].forEach(function (s) { if (day[s] && isProteiny(byId[day[s].id])) count++; });
  });
  var guard = 0;
  var today = todayISO();
  while (count < 5 && guard < 4) {
    guard++;
    var target = null;
    week.days.forEach(function (day) {
      var m = day.d;
      if (!m || m.locked || m.status !== "planned" || day.date < today) return;
      if (isProteiny(byId[m.id])) return;
      if (P().prefs.faraalDay && dayName(day.date) === P().prefs.faraalDay) return;
      if (!target) target = day;
    });
    if (!target) break;
    var old = byId[target.d.id];
    var dayCtx = Object.assign({}, ctx, { needTags: ["protein"], isWeekend: isWeekendISO(target.date), pairWt: target.b && byId[target.b.id] ? byId[target.b.id].wt : 1 });
    var nd = pickDish("d", old ? old.cui : null, dayCtx, hist, target.date);
    if (nd && isProteiny(nd)) {
      delete ctx.used[target.d.id];
      target.d = { id: nd.id, status: "planned", locked: false };
      ctx.used[nd.id] = 1;
      count++;
    } else break;
  }
}

// ---------- week helpers ----------
function currentWeek() {
  var t = todayISO(), best = null;
  P().weeks.forEach(function (w) {
    if (w.start <= t && t <= addDays(w.start, 6)) best = w;
  });
  if (best) return best;
  var future = P().weeks.filter(function (w) { return w.start > t; }).sort(function (a, b) { return a.start < b.start ? -1 : 1; });
  return future[0] || null;
}
function weekById(id) { return P().weeks.find(function (w) { return w.id === id; }); }
var planViewId = null;
function viewedWeek() { return weekById(planViewId) || currentWeek(); }
function sortedWeeks() { return P().weeks.slice().sort(function (a, b) { return a.start < b.start ? -1 : 1; }); }
function weekRelation(w) {
  var t = todayISO();
  if (w.start <= t && t <= addDays(w.start, 6)) return "current";
  return w.start > t ? "upcoming" : "past";
}
function nextFreeStart() {
  var t = todayISO(), latestEnd = null;
  P().weeks.forEach(function (w) {
    var end = addDays(w.start, 6);
    if (!latestEnd || end > latestEnd) latestEnd = end;
  });
  if (latestEnd && latestEnd >= t) return addDays(latestEnd, 1);
  return t;
}

// ---------- nutrition & balance ----------
function weekNutrition(w) {
  var tot = [0, 0, 0, 0, 0], meals = 0, fried = 0, heavy = 0;
  w.days.forEach(function (day) {
    ["b", "d"].forEach(function (s) {
      var m = day[s]; if (!m || !m.id) return;
      var d = byId[m.id]; if (!d) return;
      meals++;
      for (var i = 0; i < 5; i++) tot[i] += d.nut[i];
      if (d.tags.indexOf("fried") >= 0) fried++;
      if (d.wt === 3) heavy++;
    });
  });
  return { tot: tot, meals: meals, fried: fried, heavy: heavy,
    perDay: tot.map(function (x) { return Math.round(x / 7); }) };
}
function weekFlags(w) {
  // thresholds are for the 2 tracked meals only (breakfast + dinner)
  var n = weekNutrition(w), f = [];
  if (n.perDay[1] < 25) f.push(["warn", "Protein low (" + n.perDay[1] + "g/day from 2 meals) — add dal, paneer, sprouts"]);
  else if (n.perDay[1] >= 33) f.push(["ok", "Protein solid: " + n.perDay[1] + "g/day"]);
  if (n.fried > 3) f.push(["warn", n.fried + " fried meals — thodu control"]);
  if (n.heavy > 2) f.push(["warn", n.heavy + " heavy meals this week"]);
  if (n.perDay[4] < 11) f.push(["warn", "Fiber low (" + n.perDay[4] + "g/day) — more veg and fruits"]);
  if (n.perDay[0] > 1400) f.push(["warn", "Calorie-heavy week (~" + n.perDay[0] + " kcal/day from 2 meals)"]);
  if (!f.some(function (x) { return x[0] === "warn"; })) f.push(["ok", "Week looks balanced"]);
  return { flags: f, n: n };
}

// ---------- grocery ----------
function fmtQty(q, u) {
  if (u === "g") { return q >= 1000 ? (Math.round(q / 100) / 10) + " kg" : Math.round(q) + " g"; }
  if (u === "ml") { return q >= 1000 ? (Math.round(q / 100) / 10) + " L" : Math.round(q) + " ml"; }
  if (u === "l") return (Math.round(q * 10) / 10) + " L";
  if (u === "kg") return (Math.round(q * 10) / 10) + " kg";
  if (u === "pcs" || u === "bunch" || u === "pack" || u === "slices") return Math.ceil(q) + " " + u;
  return (Math.round(q * 2) / 2) + " " + u;
}
function aggWeek(w, slot) {
  var map = {};
  var scale = (P().prefs.people || 3) / 3;
  w.days.forEach(function (day) {
    var m = day[slot]; if (!m || !m.id) return;
    var d = byId[m.id]; if (!d) return;
    d.ing.forEach(function (ing) {
      var key = ing[0] + "|" + ing[2] + "|" + ing[3];
      map[key] = (map[key] || 0) + ing[1] * scale;
    });
  });
  return map;
}

// ---------- rendering plumbing ----------
function el(id) { return document.getElementById(id); }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

// per-page dismissible help
function helpCard(tab, lines) {
  if (S.helpDone && S.helpDone[tab]) return "";
  return '<div class="card hint noprint"><button class="hclose" onclick="closeHelp(\'' + tab + '\')">×</button>' +
    "<h2>What to do on this page</h2>" +
    lines.map(function (l, i) { return '<div class="hline"><span class="hnum">' + (i + 1) + "</span><p>" + l + "</p></div>"; }).join("") +
    '<div style="margin-top:10px"><button class="btn small" onclick="closeHelp(\'' + tab + '\')">Got it</button></div></div>';
}
function closeHelp(tab) {
  if (!S.helpDone) S.helpDone = {};
  S.helpDone[tab] = true;
  save(); render();
}

var activeTab = "plan";
function switchTab(t) {
  activeTab = t;
  document.querySelectorAll("nav.nav button").forEach(function (b) { b.classList.toggle("on", b.dataset.tab === t); });
  document.querySelectorAll("section.tabpane").forEach(function (p) { p.classList.toggle("on", p.id === "pane-" + t); });
  render();
}
function render() {
  if (activeTab === "plan") renderPlan();
  if (activeTab === "grocery") renderGrocery();
  if (activeTab === "dishes") renderDishes();
  if (activeTab === "guide") renderGuide();
  if (activeTab === "settings") renderSettings();
}

// ---------- Plan tab ----------
function profileReady() {
  var b = 0, d = 0;
  ACTIVE.forEach(function (x) {
    if (x.cui === "dr" || x.cui === "ds") return;
    if (x.slots.indexOf("B") >= 0) b++;
    if (x.slots.indexOf("D") >= 0) d++;
  });
  return { ok: b >= 7 && d >= 7, b: b, d: d };
}
function renderPlan() {
  var w = viewedWeek(), h = "";
  var pr = profileReady();
  if (!pr.ok) {
    h += '<div class="card gen">' +
      '<span class="kicker">' + esc(P().name) + " — profile setup</span>" +
      "<h2>First, pick your dishes</h2>" +
      '<p class="sub">This profile has ' + pr.b + " breakfast and " + pr.d + " dinner options. The planner needs at least 7 of each. Go to Dishes and add from the master list of " + MASTER.length + " (or create your own).</p>" +
      '<div style="margin-top:14px"><button class="btn" onclick="switchTab(\'dishes\')">Choose dishes</button></div></div>';
    el("pane-plan").innerHTML = h;
    return;
  }
  if (!w) {
    h += '<div class="card gen">' +
      '<span class="kicker">New week</span>' +
      "<h2>Aaje su banavvu? Sorted.</h2>" +
      '<p class="sub">One tap plans breakfast and dinner for 7 days — half Gujarati, no recent repeats, balanced, grocery list ready.</p>' +
      '<div class="row"><input type="date" id="genStart" value="' + todayISO() + '">' +
      '<select id="genOcc">' + OCCASIONS.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + "</option>"; }).join("") + "</select></div>" +
      '<div class="row"><label class="opt"><input type="checkbox" id="genQuick"> Quick week (busy days)</label></div>' +
      '<div style="margin-top:14px"><button class="btn" onclick="doGenerate()">Plan my week</button></div></div>';
    el("pane-plan").innerHTML = h;
    return;
  }
  var t = todayISO();
  var occLabel = (OCCASIONS.find(function (o) { return o[0] === w.occasion; }) || ["", ""])[1];
  var all = sortedWeeks();
  var idx = all.findIndex(function (x) { return x.id === w.id; });
  var rel = weekRelation(w);
  var relLabel = rel === "current" ? "This week" : rel === "upcoming" ? "Next week (planned)" : "Past week";
  if (all.length > 1 || rel !== "current") {
    h += '<div class="card noprint weeknav"><div class="row between">' +
      (idx > 0 ? '<button class="btn ghost small" onclick="planViewId=\'' + all[idx - 1].id + '\';render()">&lsaquo; ' + fmtDate(all[idx - 1].start) + "</button>" : "<span></span>") +
      '<b style="font-size:13px">' + relLabel + "</b>" +
      (idx < all.length - 1 ? '<button class="btn ghost small" onclick="planViewId=\'' + all[idx + 1].id + '\';render()">' + fmtDate(all[idx + 1].start) + " &rsaquo;</button>" : "<span></span>") +
      "</div>" +
      (rel !== "current" && currentWeek() ? '<div style="text-align:center;margin-top:6px"><button class="btn ghost small" onclick="planViewId=null;render()">Back to this week</button></div>' : "") +
      "</div>";
  }
  h += helpCard("plan", [
    "<b>Today card</b> below — that is what to cook today, breakfast and dinner.",
    "<b>Tap any meal</b> in the week to swap the dish, move it to another day, lock it, or read the recipe.",
    "<b>Grocery tab</b> has the whole week’s shopping — it updates itself whenever you change the menu."
  ]);
  // Today hero
  if (rel === "current") {
    var tdi = w.days.findIndex(function (d) { return d.date === t; });
    if (tdi >= 0) {
      var td = w.days[tdi];
      h += '<div class="card hero"><span class="kicker">Today</span><div class="hdate">' + fmtDate(t) + "</div>";
      ["b", "d"].forEach(function (slot) {
        var m = td[slot];
        var d = m && m.id ? byId[m.id] : null;
        h += '<div class="todaymeal" onclick="openMealSheet(\'' + w.id + "'," + tdi + ",'" + slot + "')\">" +
          '<span class="slotchip">' + (slot === "b" ? "B" : "D") + "</span>";
        if (d) {
          h += '<span class="tname"><b>' + esc(d.name) + '</b><span class="meta">' + CUI[d.cui] + " · " + d.nut[0] + " kcal · " + d.mins + " min</span></span>";
        } else {
          h += '<span class="tname"><b class="sub">Tap to choose a dish</b></span>';
        }
        h += "</div>";
      });
      h += "</div>";
    }
  }
  h += '<div class="card noprint"><div class="row between">' +
    "<div><h2 style='margin-bottom:2px'>" + fmtDate(w.start) + " – " + fmtDate(addDays(w.start, 6)) + "</h2>" +
    '<span class="sub">' + occLabel + (w.quick ? " · quick" : "") + (P().prefs.jain ? " · Jain" : "") + " · " + esc(P().name) + "</span></div>" +
    '<div class="row">' +
    '<button class="btn ghost small" onclick="surpriseMe()">Surprise me</button>' +
    '<button class="btn ghost small" onclick="planNext()">Plan next week</button>' +
    "</div></div>";

  var wf = weekFlags(w);
  h += '<div class="card"><div class="flags">' +
    wf.flags.map(function (f) { return '<span class="flag ' + f[0] + '">' + esc(f[1]) + "</span>"; }).join("") +
    '</div><p class="sub" style="margin-top:8px">Per person/day: ~' + wf.n.perDay[0] + " kcal · P " + wf.n.perDay[1] + "g · C " + wf.n.perDay[2] + "g · F " + wf.n.perDay[3] + "g · fiber " + wf.n.perDay[4] + "g (2 meals, rough)</p></div>";

  h += '<div class="daygrid">';
  w.days.forEach(function (day, di) {
    h += '<div class="card day' + (day.date === t ? " today" : "") + '">' +
      '<div class="dhead"><span class="dt">' + fmtDate(day.date) + "</span>" + (day.date === t ? '<span class="dn">today</span>' : "") + "</div>";
    ["b", "d"].forEach(function (slot) {
      var m = day[slot];
      var d = m && m.id ? byId[m.id] : null;
      h += '<div class="meal" onclick="openMealSheet(\'' + w.id + "'," + di + ",'" + slot + "')\">" +
        '<span class="slot">' + (slot === "b" ? "B" : "D") + "</span>";
      if (d) {
        h += '<span class="dot ' + d.cui + '"></span>' +
          '<span class="name">' + esc(d.name) +
          '<span class="meta">' + CUI[d.cui] + " · " + d.nut[0] + " kcal · " + d.mins + " min" + "</span></span>" +
          (m.locked ? '<span class="lockmark">locked</span>' : "");
      } else {
        h += '<span class="name sub">Tap to choose a dish</span>';
      }
      h += "</div>";
    });
    h += "</div>";
  });
  h += "</div>";
  el("pane-plan").innerHTML = h;
}

function doGenerate() {
  var start = el("genStart").value || todayISO();
  var occ = el("genOcc").value;
  var quick = el("genQuick").checked;
  var w = genWeek(start, occ, quick, null);
  P().weeks.push(w);
  planViewId = w.id;
  save(); render();
}
function planNext() {
  var start = nextFreeStart();
  var w = genWeek(start, "normal", false, null);
  P().weeks.push(w);
  planViewId = w.id;
  save(); render();
  window.scrollTo(0, 0);
}

// ---------- meal sheet ----------
function openMealSheet(weekId, di, slot) {
  var w = weekById(weekId); if (!w) return;
  var m = w.days[di][slot];
  if (!m || !m.id) { openPicker(weekId, di, slot); return; }
  var d = byId[m.id];
  var h = '<button class="close" onclick="closeSheet()">×</button>' +
    "<h2>" + esc(d.name) + "</h2>" +
    '<p class="sub">' + CUI[d.cui] + " · " + fmtDate(w.days[di].date) + " · " + (slot === "b" ? "Breakfast" : "Dinner") + "</p>" +
    '<div class="btngrid">' +
    '<button class="btn ghost" onclick="openDishDetail(\'' + d.id + '\')">Recipe & nutrition</button>' +
    '<button class="btn ghost" onclick="openPicker(\'' + weekId + "'," + di + ",'" + slot + "')\">Swap dish</button>" +
    '<button class="btn ghost" onclick="toggleLock(\'' + weekId + "'," + di + ",'" + slot + "')\">" + (m.locked ? "Unlock" : "Lock this meal") + "</button>" +
    '<button class="btn ghost" onclick="openMove(\'' + weekId + "'," + di + ",'" + slot + "')\">Move to another day</button>" +
    "</div>";
  openSheet(h);
}
function toggleLock(weekId, di, slot) {
  var w = weekById(weekId); if (!w) return;
  w.days[di][slot].locked = !w.days[di][slot].locked;
  save(); closeSheet(); render();
}
function openMove(weekId, di, slot) {
  var w = weekById(weekId); if (!w) return;
  var h = '<button class="close" onclick="closeSheet()">×</button><h2>Swap with which day?</h2><div class="btngrid">';
  w.days.forEach(function (day, i) {
    if (i === di) return;
    var other = day[slot], od = other && other.id ? byId[other.id] : null;
    h += '<button class="btn ghost" onclick="doMove(\'' + weekId + "'," + di + "," + i + ",'" + slot + "')\">" + fmtDate(day.date) + (od ? "<br><small>" + esc(od.name) + "</small>" : "") + "</button>";
  });
  h += "</div>";
  openSheet(h);
}
function doMove(weekId, di, ti, slot) {
  var w = weekById(weekId); if (!w) return;
  var a = w.days[di][slot];
  w.days[di][slot] = w.days[ti][slot];
  w.days[ti][slot] = a;
  save(); closeSheet(); render();
}

// ---------- picker ----------
var pickerCtx = null;
function openPicker(weekId, di, slot) {
  pickerCtx = { weekId: weekId, di: di, slot: slot, cui: "", q: "", quick: false };
  renderPicker();
}
function renderPicker() {
  var p = pickerCtx;
  var hist = buildHist();
  var ref = todayISO();
  var pool = ACTIVE.filter(function (d) {
    if (d.slots.indexOf(p.slot === "b" ? "B" : "D") < 0) return false;
    if (P().prefs.jain && d.tags.indexOf("jain") < 0) return false;
    if (p.cui && d.cui !== p.cui) return false;
    if (p.quick && d.tags.indexOf("quick") < 0 && d.mins > 25) return false;
    if (p.q && d.name.toLowerCase().indexOf(p.q) < 0) return false;
    return true;
  });
  pool.sort(function (a, b) { return scoreBase(b, hist, ref) - scoreBase(a, hist, ref); });
  var h = '<button class="close" onclick="closeSheet()">×</button><h2>Pick a dish</h2>' +
    '<input type="search" placeholder="Search…" value="' + esc(p.q) + '" oninput="pickerCtx.q=this.value.toLowerCase();renderPicker()" style="width:100%;margin:8px 0">' +
    '<div class="chips">' +
    '<button class="chip ' + (p.cui === "" ? "on" : "") + '" onclick="pickerCtx.cui=\'\';renderPicker()">All</button>' +
    CUI_ORDER.map(function (c) { return '<button class="chip ' + (p.cui === c ? "on" : "") + '" onclick="pickerCtx.cui=\'' + c + '\';renderPicker()">' + CUI[c] + "</button>"; }).join("") +
    '<button class="chip ' + (p.quick ? "on" : "") + '" onclick="pickerCtx.quick=!pickerCtx.quick;renderPicker()">Quick</button>' +
    "</div>";
  pool.slice(0, 60).forEach(function (d) {
    var lc = hist.lastCooked[d.id];
    h += '<div class="dishrow" onclick="pickDishManual(\'' + d.id + '\')">' +
      '<span class="dot ' + d.cui + '"></span>' +
      '<span class="name">' + esc(d.name) + '<span class="meta">' + CUI[d.cui] + " · " + d.nut[0] + " kcal · " + d.mins + " min" +
      (lc ? " · had " + daysSince(lc, ref) + "d ago" : " · not had yet") + "</span></span></div>";
  });
  if (!pool.length) h += '<p class="empty">Nothing matches.</p>';
  openSheet(h);
}
function scoreBase(d, hist, ref) {
  var lc = hist.lastCooked[d.id];
  var s = lc ? Math.min(daysSince(lc, ref), 90) : 90;
  if (P().prefs.fav.indexOf(d.id) >= 0) s += 20;
  if (P().prefs.avoid.indexOf(d.id) >= 0) s -= 100;
  return s;
}
function pickDishManual(id) {
  var p = pickerCtx; if (!p) return;
  var w = weekById(p.weekId); if (!w) return;
  w.days[p.di][p.slot] = { id: id, status: "planned", locked: false };
  save(); closeSheet(); render(); // grocery recomputes from the week on next view
}

// ---------- surprise ----------
function surpriseMe() {
  var hist = buildHist(), ref = todayISO();
  var pool = ACTIVE.filter(function (d) {
    if (d.cui === "dr" || d.cui === "ds") return false;
    if (P().prefs.avoid.indexOf(d.id) >= 0) return false;
    if (P().prefs.jain && d.tags.indexOf("jain") < 0) return false;
    if (d.tags.indexOf("faraal") >= 0) return false;
    return !hist.lastCooked[d.id] || daysSince(hist.lastCooked[d.id], ref) > 21;
  });
  if (!pool.length) { openSheet("<h2>Wah!</h2><p class='sub'>Everything has been on the menu recently. No underused dishes left.</p>"); return; }
  var d = pool[Math.floor(Math.random() * pool.length)];
  var w = currentWeek();
  var h = '<button class="close" onclick="closeSheet()">×</button><h2>Try this: ' + esc(d.name) + "</h2>" +
    '<p class="sub">' + CUI[d.cui] + " · " + d.nut[0] + " kcal · " + d.mins + " min · " +
    (hist.lastCooked[d.id] ? "last on the menu long back" : "never tried yet") + "</p>" +
    '<div class="btngrid">' +
    '<button class="btn ghost" onclick="openDishDetail(\'' + d.id + '\')">See recipe</button>' +
    '<button class="btn ghost" onclick="surpriseMe()">Show another</button>';
  if (w) {
    var t = todayISO();
    var di = w.days.findIndex(function (day) { return day.date === t; });
    if (di >= 0) {
      if (d.slots.indexOf("D") >= 0) h += '<button class="btn" onclick="setSurprise(\'' + w.id + "'," + di + ",'d','" + d.id + "')\">Make it today's dinner</button>";
      if (d.slots.indexOf("B") >= 0) h += '<button class="btn ghost" onclick="setSurprise(\'' + w.id + "'," + di + ",'b','" + d.id + "')\">Make it today's breakfast</button>";
    }
  }
  h += "</div>";
  openSheet(h);
}
function setSurprise(weekId, di, slot, id) {
  var w = weekById(weekId); if (!w) return;
  w.days[di][slot] = { id: id, status: "planned", locked: true };
  save(); closeSheet(); render();
}

// ---------- dish detail ----------
function openDishDetail(id) {
  var d = byId[id]; if (!d) return;
  var fav = P().prefs.fav.indexOf(id) >= 0, avoid = P().prefs.avoid.indexOf(id) >= 0;
  var scale = (P().prefs.people || 3) / 3;
  var h = '<button class="close" onclick="closeSheet()">×</button>' +
    "<h2>" + esc(d.name) + "</h2>" +
    '<p class="sub">' + CUI[d.cui] + " · " + d.mins + " min · " + ["", "light", "medium", "heavy"][d.wt] + (MASTER_IDS[d.id] ? "" : " · your dish") + "</p>" +
    '<div class="tagline">' + d.tags.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</div>" +
    '<div class="nutline"><span><b>' + d.nut[0] + "</b> kcal</span><span><b>" + d.nut[1] + "g</b> protein</span><span><b>" + d.nut[2] + "g</b> carbs</span><span><b>" + d.nut[3] + "g</b> fat</span><span><b>" + d.nut[4] + "g</b> fiber</span></div>" +
    '<p class="sub">Per person, rough estimate.</p>' +
    "<h3>Ingredients (for " + (P().prefs.people || 3) + ")</h3><table class='ingtable'>" +
    d.ing.map(function (i) { return "<tr><td>" + esc(i[0]) + "</td><td>" + fmtQty(i[1] * scale, i[2]) + "</td></tr>"; }).join("") +
    "</table><h3>Method</h3><p style='font-size:14px'>" + esc(d.steps) + "</p>" +
    '<div class="btngrid">' +
    '<button class="btn ghost ' + (fav ? "on-fav" : "") + '" onclick="toggleMark(\'' + id + '\',\'fav\');openDishDetail(\'' + id + '\')">' + (fav ? "Unmark favourite" : "Mark favourite") + "</button>" +
    '<button class="btn ghost" onclick="toggleMark(\'' + id + '\',\'avoid\');openDishDetail(\'' + id + '\')">' + (avoid ? "Remove from avoid" : "Avoid this dish") + "</button>" +
    '<button class="btn ghost" onclick="openDishForm(\'' + id + '\')">Edit dish</button>' +
    (P().overrides[id] ? '<button class="btn ghost" onclick="resetOverride(\'' + id + '\')">Reset to original</button>' : "") +
    "</div>";
  openSheet(h);
}
function toggleMark(id, kind) {
  var arr = P().prefs[kind];
  var i = arr.indexOf(id);
  if (i >= 0) arr.splice(i, 1); else arr.push(id);
  if (kind === "fav" && i < 0) { var j = P().prefs.avoid.indexOf(id); if (j >= 0) P().prefs.avoid.splice(j, 1); }
  if (kind === "avoid" && i < 0) { var k = P().prefs.fav.indexOf(id); if (k >= 0) P().prefs.fav.splice(k, 1); }
  save(); render();
}

// ---------- dish add/edit form ----------
function openDishForm(id) {
  var d = id ? byId[id] : null;
  var isCustom = d && !MASTER_IDS[d.id];
  var h = '<button class="close" onclick="closeSheet()">×</button>' +
    "<h2>" + (d ? "Edit dish" : "Add your own dish") + "</h2>" +
    (d && !isCustom ? '<p class="sub">Editing a master dish saves your version in this profile; you can reset it any time.</p>' : "") +
    '<div class="frow" style="margin-top:12px"><div style="flex:2;min-width:180px"><label>Dish name</label>' +
    '<input type="text" id="df-name" value="' + (d ? esc(d.name) : "") + '" placeholder="e.g. Mummy na Muthiya"></div>' +
    "<div><label>Category</label><select id='df-cui'>" +
    CUI_ORDER.map(function (c) { return '<option value="' + c + '"' + (d && d.cui === c ? " selected" : "") + ">" + CUI[c] + "</option>"; }).join("") +
    "</select></div></div>" +
    '<div class="frow">' +
    "<div><label>Served at</label><select id='df-slots'>" +
    [["BD", "Breakfast + Dinner"], ["B", "Breakfast only"], ["D", "Dinner only"]].map(function (s) {
      return '<option value="' + s[0] + '"' + (d && d.slots === s[0] ? " selected" : "") + ">" + s[1] + "</option>";
    }).join("") + "</select></div>" +
    "<div><label>Heaviness</label><select id='df-wt'>" +
    [[1, "Light"], [2, "Medium"], [3, "Heavy"]].map(function (s) {
      return '<option value="' + s[0] + '"' + (d && d.wt === s[0] ? " selected" : "") + ">" + s[1] + "</option>";
    }).join("") + "</select></div>" +
    "<div><label>Time (min)</label><input type='number' id='df-mins' min='5' value='" + (d ? d.mins : 30) + "'></div></div>" +
    '<div class="frow">' +
    ["kcal", "Protein g", "Carbs g", "Fat g", "Fiber g"].map(function (lbl, i) {
      return "<div><label>" + lbl + "</label><input type='number' id='df-n" + i + "' min='0' value='" + (d ? d.nut[i] : 0) + "'></div>";
    }).join("") + "</div>" +
    "<div class='frow'><div><label>Tags (comma separated: quick, jain, protein, fried, sweet, kid, weekend, guest, festival, winter, summer, faraal, leftover, treat)</label>" +
    '<input type="text" id="df-tags" value="' + (d ? esc(d.tags.join(", ")) : "") + '"></div></div>' +
    "<h3>Ingredients (for 3 people)</h3><div id='df-ing'>" +
    (d ? d.ing.map(function (i) { return ingRowHTML(i); }).join("") : ingRowHTML(null)) +
    "</div>" +
    '<button class="btn ghost small" onclick="addIngRow()">Add ingredient</button>' +
    "<h3>Method (short)</h3><textarea id='df-steps' rows='3'>" + (d ? esc(d.steps) : "") + "</textarea>" +
    '<div class="btngrid">' +
    '<button class="btn" onclick="saveDishForm(' + (d ? "'" + d.id + "'" : "null") + ')">Save dish</button>' +
    (isCustom ? '<button class="btn ghost" onclick="deleteCustomDish(\'' + d.id + '\')">Delete dish</button>' : '<button class="btn ghost" onclick="closeSheet()">Cancel</button>') +
    "</div>";
  openSheet(h);
}
function ingRowHTML(i) {
  return '<div class="ingrow">' +
    '<input type="text" placeholder="Ingredient" value="' + (i ? esc(i[0]) : "") + '">' +
    '<input type="number" placeholder="Qty" min="0" step="0.25" value="' + (i ? i[1] : "") + '">' +
    "<select>" + ING_UNITS.map(function (u) { return '<option value="' + u + '"' + (i && i[2] === u ? " selected" : "") + ">" + u + "</option>"; }).join("") + "</select>" +
    "<select>" + ING_CATS.map(function (c) { return '<option value="' + c + '"' + (i && i[3] === c ? " selected" : "") + ">" + c + "</option>"; }).join("") + "</select>" +
    '<button class="rm" onclick="this.parentNode.remove()">×</button></div>';
}
function addIngRow() { el("df-ing").insertAdjacentHTML("beforeend", ingRowHTML(null)); }
function saveDishForm(id) {
  var name = el("df-name").value.trim();
  if (!name) { alert("Dish needs a name."); return; }
  var ing = [];
  el("df-ing").querySelectorAll(".ingrow").forEach(function (row) {
    var inputs = row.querySelectorAll("input, select");
    var n = inputs[0].value.trim(), q = parseFloat(inputs[1].value);
    if (n && q > 0) ing.push([n, q, inputs[2].value, inputs[3].value]);
  });
  var dish = {
    id: id || "c" + Date.now(),
    cui: el("df-cui").value,
    name: name,
    slots: el("df-slots").value,
    wt: +el("df-wt").value,
    mins: Math.max(5, +el("df-mins").value || 30),
    nut: [0, 1, 2, 3, 4].map(function (i) { return Math.max(0, +el("df-n" + i).value || 0); }),
    tags: el("df-tags").value.split(",").map(function (t) { return t.trim().toLowerCase(); }).filter(Boolean),
    ing: ing,
    steps: el("df-steps").value.trim()
  };
  var p = P();
  if (id && MASTER_IDS[id]) p.overrides[id] = dish;
  else if (id) {
    var ci = p.custom.findIndex(function (c) { return c.id === id; });
    if (ci >= 0) p.custom[ci] = dish; else p.custom.push(dish);
  } else {
    p.custom.push(dish);
    p.enabled[dish.id] = 1;
  }
  refreshDishes(); save(); closeSheet(); render();
}
function deleteCustomDish(id) {
  if (!confirm("Delete this dish?")) return;
  var p = P();
  p.custom = p.custom.filter(function (c) { return c.id !== id; });
  delete p.enabled[id];
  refreshDishes(); save(); closeSheet(); render();
}
function resetOverride(id) {
  delete P().overrides[id];
  refreshDishes(); save(); closeSheet(); render();
}
function toggleEnabled(id) {
  var p = P();
  if (p.enabled[id]) delete p.enabled[id]; else p.enabled[id] = 1;
  refreshDishes(); save(); render();
}
function bulkEnable(on) {
  var p = P();
  filteredDishes().forEach(function (d) {
    if (on) p.enabled[d.id] = 1; else delete p.enabled[d.id];
  });
  refreshDishes(); save(); render();
}

// ---------- Grocery tab ----------
function renderGrocery() {
  var w = viewedWeek();
  if (!w) { el("pane-grocery").innerHTML = '<p class="empty">Plan a week first — grocery list generates from it.</p>'; return; }
  if (!P().groceryChecked[w.id]) P().groceryChecked[w.id] = {};
  var checked = P().groceryChecked[w.id];
  var h = helpCard("grocery", [
    "<b>Three sections:</b> breakfast shopping, dinner shopping, and pantry staples — check the staples at home before buying.",
    "<b>Tick items</b> while you shop — ticks are saved. “Clear ticks” starts fresh.",
    "This list <b>updates itself</b> when you swap or change meals on the Week tab."
  ]);
  h += '<div class="card noprint"><div class="row between"><h2 style="margin:0">Grocery · ' + fmtDate(w.start) + " – " + fmtDate(addDays(w.start, 6)) + "</h2>" +
    '<button class="btn ghost small" onclick="clearChecks(\'' + w.id + '\')">Clear ticks</button></div>' +
    '<p class="sub" style="margin-top:6px">For ' + (P().prefs.people || 3) + " people. Auto-updates whenever you swap or change meals.</p></div>";

  var bAgg = aggWeek(w, "b"), dAgg = aggWeek(w, "d");
  h += grocerySection(w.id, "Breakfast — fresh shopping", bAgg, FRESH_CATS, checked, "b");
  h += grocerySection(w.id, "Dinner — fresh shopping", dAgg, FRESH_CATS, checked, "d");
  var stapleAgg = {};
  [bAgg, dAgg].forEach(function (agg) {
    Object.keys(agg).forEach(function (k) {
      if (k.split("|")[2] === "staple") stapleAgg[k] = (stapleAgg[k] || 0) + agg[k];
    });
  });
  h += grocerySection(w.id, "Pantry staples — check at home first", stapleAgg, ["staple"], checked, "s");
  h += '<div class="card"><p class="sub">Assumed always in pantry: salt, oil, ghee for tadka, haldi, mirchi, dhana-jeeru, rai, jeera, hing, garam masala, chai-sugar. Restock when low.</p></div>';
  el("pane-grocery").innerHTML = h;
}
function grocerySection(weekId, title, agg, cats, checked, prefix) {
  var h = '<div class="card"><h2>' + title + "</h2>";
  var any = false;
  cats.forEach(function (cat) {
    var items = Object.keys(agg).filter(function (k) { return k.split("|")[2] === cat; })
      .map(function (k) { var p = k.split("|"); return { name: p[0], unit: p[1], qty: agg[k], key: prefix + "|" + k }; })
      .sort(function (a, b) { return a.name < b.name ? -1 : 1; });
    if (!items.length) return;
    any = true;
    h += '<div class="gcat"><div class="gcth">' + CAT_LABEL[cat] + "</div>";
    items.forEach(function (it) {
      var done = checked[it.key];
      h += '<div class="gitem' + (done ? " done" : "") + '"><input type="checkbox" ' + (done ? "checked" : "") +
        ' onchange="tickItem(\'' + weekId + "','" + esc(it.key).replace(/'/g, "\\'") + '\')"><span class="gname">' + esc(it.name) + '</span><span class="gqty">' + fmtQty(it.qty, it.unit) + "</span></div>";
    });
    h += "</div>";
  });
  if (!any) h += '<p class="sub">Nothing needed.</p>';
  return h + "</div>";
}
function tickItem(weekId, key) {
  var c = P().groceryChecked[weekId] || (P().groceryChecked[weekId] = {});
  c[key] = !c[key];
  save(); renderGrocery();
}
function clearChecks(weekId) { P().groceryChecked[weekId] = {}; save(); renderGrocery(); }

// ---------- Dishes tab ----------
var dishFilter = { cui: "", q: "", tag: "" };
function filteredDishes() {
  return ALL.filter(function (d) {
    if (dishFilter.cui && d.cui !== dishFilter.cui) return false;
    if (dishFilter.tag && d.tags.indexOf(dishFilter.tag) < 0) return false;
    if (dishFilter.q && d.name.toLowerCase().indexOf(dishFilter.q) < 0) return false;
    return true;
  });
}
function renderDishes() {
  var hist = buildHist(), ref = todayISO();
  var p = P();
  var inCount = ACTIVE.length;
  var h = helpCard("dishes", [
    "<b>Two lists:</b> breakfast options left, dinner options right (a dish can be in both).",
    "<b>“Add to profile”</b> puts a dish into your planning pool — only added dishes get planned. “Remove from profile” takes it out.",
    "<b>Tap a dish name</b> for recipe, nutrition, favourite/avoid marks, or to edit it.",
    "<b>“Add your own dish”</b> saves your family recipes into the planner."
  ]);
  h += '<div class="card noprint"><div class="row between">' +
    "<div><h2 style='margin:0'>" + esc(p.name) + "'s dishes</h2>" +
    '<span class="sub">' + inCount + " of " + ALL.length + " added to this profile — only added dishes get planned.</span></div>" +
    '<button class="btn small" onclick="openDishForm(null)">Add your own dish</button></div>' +
    '<input type="search" placeholder="Search ' + ALL.length + ' dishes…" value="' + esc(dishFilter.q) + '" oninput="dishFilter.q=this.value.toLowerCase();renderDishes()" style="width:100%;margin-top:10px">' +
    '<div class="chips">' +
    '<button class="chip ' + (dishFilter.cui === "" ? "on" : "") + '" onclick="dishFilter.cui=\'\';renderDishes()">All</button>' +
    CUI_ORDER.map(function (c) { return '<button class="chip ' + (dishFilter.cui === c ? "on" : "") + '" onclick="dishFilter.cui=\'' + c + '\';renderDishes()">' + CUI[c] + "</button>"; }).join("") +
    "</div><div class='chips'>" +
    ["quick", "protein", "jain", "faraal", "kid", "guest", "fried", "sweet"].map(function (t) {
      return '<button class="chip ' + (dishFilter.tag === t ? "on" : "") + '" onclick="dishFilter.tag=dishFilter.tag===\'' + t + "'?'':'" + t + '\';renderDishes()">' + t + "</button>";
    }).join("") + "</div>" +
    '<div class="row" style="margin-top:6px">' +
    '<button class="btn ghost small" onclick="bulkEnable(true)">Add all shown to profile</button>' +
    '<button class="btn ghost small" onclick="bulkEnable(false)">Remove all shown</button></div></div>';

  var pool = filteredDishes();
  var bPool = pool.filter(function (d) { return d.slots.indexOf("B") >= 0; });
  var dPool = pool.filter(function (d) { return d.slots.indexOf("D") >= 0; });
  h += '<div class="dishcols">' +
    dishColumn("Breakfast options (" + bPool.length + ")", bPool, hist, ref) +
    dishColumn("Dinner options (" + dPool.length + ")", dPool, hist, ref) +
    "</div>";
  el("pane-dishes").innerHTML = h;
}
function dishColumn(title, pool, hist, ref) {
  var h = '<div class="card"><h2>' + title + "</h2>";
  pool.forEach(function (d) {
    var p = P();
    var inProf = !!p.enabled[d.id];
    var lc = hist.lastCooked[d.id];
    var fav = p.prefs.fav.indexOf(d.id) >= 0, avoid = p.prefs.avoid.indexOf(d.id) >= 0;
    h += '<div class="dishrow"><span class="dot ' + d.cui + '"></span>' +
      '<span class="name" onclick="openDishDetail(\'' + d.id + '\')">' + esc(d.name) +
      '<span class="meta">' + CUI[d.cui] + " · " + d.nut[0] + " kcal · " + d.mins + " min" +
      (MASTER_IDS[d.id] ? "" : " · yours") + (p.overrides[d.id] ? " · edited" : "") +
      (fav ? " · favourite" : "") + (avoid ? " · avoided" : "") +
      (lc ? " · " + daysSince(lc, ref) + "d ago" : "") + "</span></span>" +
      (inProf
        ? '<button class="markbtn" onclick="toggleEnabled(\'' + d.id + '\')">Remove from profile</button>'
        : '<button class="markbtn on-fav" onclick="toggleEnabled(\'' + d.id + '\')">Add to profile</button>') +
      "</div>";
  });
  if (!pool.length) h += '<p class="empty">Nothing matches.</p>';
  return h + "</div>";
}

// ---------- past weeks (inside Settings) ----------
function pastWeeksHTML() {
  if (!P().weeks.length) return "";
  var t = todayISO();
  var weeks = sortedWeeks().slice().reverse();
  var h = '<div class="card"><h2>Past & planned weeks</h2>';
  weeks.forEach(function (w) {
    var live = w.start <= t && t <= addDays(w.start, 6);
    h += '<div class="histrow"><div class="grow"><b>' + fmtDate(w.start) + " – " + fmtDate(addDays(w.start, 6)) + "</b>" + (live ? ' <span class="sub">(current)</span>' : "") +
      '<div class="sub">' + ((OCCASIONS.find(function (o) { return o[0] === w.occasion; }) || ["", "normal"])[1]) + "</div></div>" +
      '<button class="btn ghost small" onclick="viewWeek(\'' + w.id + '\')">View</button>' +
      '<button class="btn ghost small" onclick="repeatWeek(\'' + w.id + '\')">Repeat</button>' +
      '<button class="btn ghost small" onclick="deleteWeek(\'' + w.id + '\')">Delete</button></div>';
  });
  return h + "</div>";
}
function viewWeek(id) {
  var w = weekById(id); if (!w) return;
  var h = '<button class="close" onclick="closeSheet()">×</button><h2>' + fmtDate(w.start) + " – " + fmtDate(addDays(w.start, 6)) + "</h2>";
  w.days.forEach(function (day) {
    h += "<h3>" + fmtDate(day.date) + "</h3>";
    ["b", "d"].forEach(function (s) {
      var m = day[s]; var d = m && m.id ? byId[m.id] : null;
      h += '<div class="meal" style="cursor:default"><span class="slot">' + (s === "b" ? "B" : "D") + "</span>" +
        (d ? '<span class="dot ' + d.cui + '"></span><span class="name">' + esc(d.name) + "</span>" : '<span class="name sub">—</span>') + "</div>";
    });
  });
  openSheet(h);
}
function repeatWeek(id) {
  var w = weekById(id); if (!w) return;
  var start = nextFreeStart();
  var nw = { id: "w" + Date.now(), start: start, occasion: w.occasion, quick: w.quick, days: [] };
  for (var i = 0; i < 7; i++) {
    var src = w.days[i];
    nw.days.push({
      date: addDays(start, i),
      b: src.b && src.b.id ? { id: src.b.id, status: "planned", locked: false } : null,
      d: src.d && src.d.id ? { id: src.d.id, status: "planned", locked: false } : null
    });
  }
  P().weeks.push(nw);
  save(); closeSheet();
  openSheet("<h2>Week repeated</h2><p class='sub'>Same menu planned for " + fmtDate(start) + " – " + fmtDate(addDays(start, 6)) + ". Find it with the arrows on the Week tab.</p>");
  render();
}
function deleteWeek(id) {
  if (!confirm("Delete this week and its tracking?")) return;
  P().weeks = P().weeks.filter(function (w) { return w.id !== id; });
  delete P().groceryChecked[id];
  if (planViewId === id) planViewId = null;
  save(); render();
}

// ---------- Guide tab ----------
function renderGuide() {
  function steps(arr) {
    return arr.map(function (l, i) { return '<div class="hline"><span class="hnum">' + (i + 1) + "</span><p>" + l + "</p></div>"; }).join("");
  }
  var h = '<div class="card gen">' +
    '<span class="kicker">Why this app exists</span>' +
    "<h2>Ghar nu khavanu, tension vagar</h2>" +
    '<p class="sub">Every evening the same question — “aaje su banavvu?” — and somehow the same 10 dishes keep repeating while groceries get forgotten. Menu Masi ends that: it plans the whole week, writes the shopping list, keeps meals balanced, and slowly learns what your family actually loves.</p></div>';

  h += '<div class="card"><h2>Once a week — plan (2 minutes)</h2>' + steps([
    "Go to <b>Week</b> and tap <b>“Plan my week”</b>. You get breakfast + dinner for 7 days: half Gujarati, some Punjabi/Mexican, street food sprinkled in — nothing from recent menus.",
    "Don't like something? <b>Tap the meal → Swap dish</b>. Love something? <b>Lock</b> it. Wrong day? <b>Move</b> it.",
    "Special week? Choose an occasion while planning: light week, guests, festival, street-food weekend, or quick week for busy days."
  ]) + "</div>";

  h += '<div class="card"><h2>Once a week — shop (with the list)</h2>' + steps([
    "Open <b>Grocery</b>. It is already written from your menu: breakfast shopping, dinner shopping, pantry staples — quantities for your family size.",
    "First check the <b>staples section at home</b> — you probably have most of it.",
    "Take the phone to the shop and <b>tick items off</b> as you buy. Swapped a dish later? The list updates itself."
  ]) + "</div>";

  h += '<div class="card"><h2>Every day — 10 seconds</h2>' + steps([
    "Open the app. The <b>Today card</b> shows what to cook — breakfast and dinner. That is it.",
    "Plans changed? Tap the meal and <b>swap or move</b> it — grocery adjusts on its own.",
    "Dishes from past menus rest for a few weeks automatically, so the same thing never keeps repeating."
  ]) + "</div>";

  h += '<div class="card"><h2>Make it yours</h2>' + steps([
    "In <b>Dishes</b>, keep only what your family eats: <b>“Add to profile” / “Remove from profile”</b>. Only added dishes get planned.",
    "Add your own family recipes with <b>“Add your own dish”</b> — they plan, shop and count like any other dish. Edit any master dish to match your style.",
    "In <b>Settings</b>, make a <b>profile</b> per person or per mode (normal / diet / mummy's kitchen). Each has its own dishes, menus and history. Jain mode, faraal day and family size live there too."
  ]) + "</div>";

  h += '<div class="card"><h2>Keep your data safe</h2>' + steps([
    "Everything is saved <b>in this browser automatically</b> — it survives closing the browser and restarting the machine.",
    "But clearing browser data/cache wipes it. So tap <b>Export</b> (top right, always there) once in a while — it downloads a backup file of everything.",
    "Browser got cleaned or new machine? <b>Settings → Import</b> that file and you are back exactly where you were."
  ]) + "</div>";

  h += '<div class="card"><h2>Quick answers</h2>' + steps([
    "<b>Bored of options?</b> “Surprise me” on the Week tab digs out dishes you haven't touched in weeks.",
    "<b>Want next week ready?</b> “Plan next week” — arrows on top switch between weeks, and Grocery follows the week you are viewing.",
    "<b>Juices, mocktails, desserts?</b> All in Dishes — they are never auto-planned, add them to any meal via Swap.",
    "<b>Forgot how a page works?</b> Settings → “Show page tips again”, or replay the full tour."
  ]) + "</div>";
  el("pane-guide").innerHTML = h;
}

// ---------- Settings tab ----------
function renderSettings() {
  var p = P();
  var h = helpCard("settings", [
    "<b>Profiles</b> — each profile keeps its own dish selection, menus, preferences and history. Make one per person or per mode (normal / diet).",
    "<b>Preferences</b> — Jain mode, weekly faraal day and family size for the active profile.",
    "<b>Past & planned weeks</b> — view, repeat a good week, or delete old ones.",
    "<b>Data</b> — export a backup regularly; everything lives only in this browser."
  ]);
  h += '<div class="card"><h2>Profile</h2>' +
    '<div class="row" style="margin-bottom:10px">' +
    '<select onchange="switchProfile(this.value)">' +
    S.profiles.map(function (x) { return '<option value="' + x.id + '"' + (x.id === S.active ? " selected" : "") + ">" + esc(x.name) + "</option>"; }).join("") +
    "</select>" +
    '<button class="btn ghost small" onclick="openNewProfile()">New profile</button>' +
    (S.profiles.length > 1 ? '<button class="btn ghost small" onclick="deleteProfile()">Delete this profile</button>' : "") +
    "</div>" +
    '<p class="sub">Active: <b>' + esc(p.name) + "</b> · " + ACTIVE.length + " dishes in, " + p.custom.length + " own dishes, " + p.weeks.length + " weeks planned. Each profile keeps its own dishes, menus, preferences and history.</p></div>";

  h += '<div class="card"><h2>Preferences</h2>' +
    '<label class="opt" style="margin-bottom:10px"><input type="checkbox" ' + (p.prefs.jain ? "checked" : "") + ' onchange="P().prefs.jain=this.checked;save();render()"> Jain mode (no onion-garlic dishes only)</label>' +
    '<div class="row" style="margin-bottom:10px"><span style="font-size:14.5px">Weekly faraal (fasting) day</span>' +
    '<select onchange="P().prefs.faraalDay=this.value;save();render()">' +
    '<option value="">None</option>' + DAYNAMES.map(function (d) { return '<option value="' + d + '" ' + (p.prefs.faraalDay === d ? "selected" : "") + ">" + d + "</option>"; }).join("") +
    "</select></div>" +
    '<div class="row"><span style="font-size:14.5px">Family size</span>' +
    '<input type="number" min="1" max="10" value="' + (p.prefs.people || 3) + '" style="width:80px" onchange="P().prefs.people=Math.max(1,+this.value||3);save();render()"></div>' +
    '<p class="sub" style="margin-top:10px">Grocery quantities and recipe amounts scale to family size. Jain and faraal apply to newly generated menus.</p></div>';

  h += pastWeeksHTML();

  h += '<div class="card"><h2>Data & backups</h2><div class="row">' +
    '<button class="btn ghost small" onclick="exportData()">Export everything (all profiles)</button>' +
    '<button class="btn ghost small" onclick="exportProfile()">Export only "' + esc(p.name) + '"</button>' +
    '<label class="btn ghost small" style="display:inline-block;cursor:pointer">Import backup or profile<input type="file" accept=".json" style="display:none" onchange="importData(this)"></label>' +
    '<button class="btn ghost small" onclick="resetAll()">Reset everything</button>' +
    "</div><p class='sub' style='margin-top:10px'>Everything lives only in this browser's local storage. It survives closing the browser and restarting the machine — but clearing browser data wipes it. The Export button on the top right is always one tap away; importing a profile file adds it alongside existing profiles, importing a full backup replaces everything.</p></div>";

  h += '<div class="card"><h2>About</h2><p class="sub">' + MASTER.length + " master vegetarian dishes across Gujarati, Punjabi, Mexican, South Indian, street food, light meals, drinks and desserts. " +
    "Weekly generator targets ~50% Gujarati, avoids recent repeats, balances heavy/fried/protein and reuses grocery across the week. Nutrition numbers are rough home-cooking estimates.</p>" +
    '<div class="row" style="margin-top:12px">' +
    '<button class="btn ghost small" onclick="showTour()">Show the app tour again</button>' +
    '<button class="btn ghost small" onclick="S.helpDone={};save();render()">Show page tips again</button></div></div>';
  el("pane-settings").innerHTML = h;
}
function switchProfile(id) {
  S.active = id;
  planViewId = null;
  refreshDishes(); save(); render();
}
function openNewProfile() {
  var h = '<button class="close" onclick="closeSheet()">×</button><h2>New profile</h2>' +
    '<div class="frow" style="margin-top:12px"><div><label>Profile name</label><input type="text" id="np-name" placeholder="e.g. Mummy, Weekday, Diet"></div></div>' +
    '<label class="opt" style="margin-bottom:8px"><input type="radio" name="np-mode" value="empty" checked> Start empty — I will pick my dishes from the master list</label>' +
    '<label class="opt"><input type="radio" name="np-mode" value="full"> Start with the full master list (' + MASTER.length + " dishes)</label>" +
    '<div class="btngrid"><button class="btn" onclick="createProfile()">Create profile</button>' +
    '<button class="btn ghost" onclick="closeSheet()">Cancel</button></div>';
  openSheet(h);
}
function createProfile() {
  var name = el("np-name").value.trim();
  if (!name) { alert("Profile needs a name."); return; }
  var full = document.querySelector('input[name="np-mode"]:checked').value === "full";
  var prof = makeProfile(name, full);
  S.profiles.push(prof);
  S.active = prof.id;
  planViewId = null;
  refreshDishes(); save(); closeSheet();
  switchTab(full ? "plan" : "dishes");
}
function deleteProfile() {
  if (S.profiles.length < 2) return;
  if (!confirm('Delete profile "' + P().name + '" with all its menus and history?')) return;
  var id = S.active;
  S.profiles = S.profiles.filter(function (p) { return p.id !== id; });
  S.active = S.profiles[0].id;
  planViewId = null;
  refreshDishes(); save(); render();
}

// ---------- data export/import ----------
function downloadJSON(obj, name) {
  var blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}
function exportData() {
  downloadJSON(S, "menu-masi-backup-" + todayISO() + ".json");
}
function exportProfile() {
  var p = P();
  downloadJSON({ fpProfile: true, profile: p },
    "menu-masi-profile-" + p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + todayISO() + ".json");
}
function importData(input) {
  var f = input.files[0]; if (!f) return;
  var r = new FileReader();
  r.onload = function () {
    try {
      var s = JSON.parse(r.result);
      input.value = "";
      if (s && s.fpProfile && s.profile && s.profile.name) {
        // single-profile file → add alongside existing profiles
        var prof = s.profile;
        prof.id = "p" + Date.now() + Math.floor(Math.random() * 1000);
        var mig = migrate({ profiles: [prof], helpDone: S.helpDone, seen: true });
        S.profiles.push(mig.profiles[0]);
        S.active = mig.profiles[0].id;
        planViewId = null;
        refreshDishes(); save(); render();
        openSheet("<h2>Profile imported</h2><p class='sub'>“" + esc(prof.name) + "” added and made active.</p>");
        return;
      }
      if (!s || (!s.profiles && !s.weeks)) throw new Error("bad file");
      S = migrate(s);
      planViewId = null;
      refreshDishes(); save(); render();
      openSheet("<h2>Imported</h2><p class='sub'>Backup restored: " + S.profiles.length + " profile(s).</p>");
    } catch (e) { alert("Could not read that file — is it a Menu Masi backup or profile file?"); }
  };
  r.readAsText(f);
}
function resetAll() {
  if (!confirm("Delete ALL profiles, weeks, history, preferences?")) return;
  if (!confirm("Really sure? Export a backup first if in doubt.")) return;
  localStorage.removeItem(LS_KEY);
  S = load();
  planViewId = null;
  refreshDishes(); render();
}

// ---------- onboarding tour ----------
var TOUR = [
  {
    kicker: "Kem cho!",
    title: "Welcome to Menu Masi",
    body: "Your family's personal menu manager. No more staring at the fridge asking “aaje su banavvu?” — Menu Masi plans the whole week, writes the grocery list, and learns what your family loves. Quick tour? Takes 30 seconds, promise."
  },
  {
    kicker: "Step 1 of 5",
    title: "Plan your week in one tap",
    body: "Hit “Plan my week” on the Week tab and boom — breakfast and dinner for all 7 days. Half Gujarati, some Punjabi and Mexican, street food sprinkled in. Nothing from recent menus, everything balanced automatically."
  },
  {
    kicker: "Step 2 of 5",
    title: "Shape the week your way",
    body: "Tap any meal to swap it for something else, move it to another day, lock a favourite, or read the recipe. Menu Masi remembers what was on recent menus, so next week never repeats last week."
  },
  {
    kicker: "Step 3 of 5",
    title: "Grocery list writes itself",
    body: "The Grocery tab builds the whole week's shopping — breakfast and dinner separate, pantry staples separate, quantities for your family size. Swap any dish and the list updates itself instantly. Tick items off while you shop."
  },
  {
    kicker: "Step 4 of 5",
    title: "Your dishes, your profile",
    body: "Create a profile in Settings and fill it your way: pick from " + MASTER.length + " master dishes — Gujarati to Mexican, juices, mocktails, desserts — or add your own family recipes in Dishes. Favourites, avoid-list, Jain mode, faraal day: all yours."
  },
  {
    kicker: "Step 5 of 5 — Important",
    title: "Your data lives in this browser",
    warn: true,
    body: "",
    warnLines: [
      "<b>Everything is saved automatically</b> in this browser's local storage — menus, profiles, history survive closing the browser or restarting the machine.",
      "<b>But:</b> clearing browser data/cache/history, using another browser, or incognito mode means your data is gone or not visible.",
      "<b>To use daily:</b> always open the same URL in the same browser, and take an “Export backup” from Settings once in a while. That file restores everything."
    ]
  }
];
var tourStep = 0;
function showTour() { tourStep = 0; renderTour(); }
function renderTour() {
  var s = TOUR[tourStep];
  var last = tourStep === TOUR.length - 1;
  var h = '<div class="tourwrap"><div class="tourcard">' +
    '<div class="tkicker">' + s.kicker + "</div>" +
    "<h1>" + s.title + "</h1>";
  if (s.warn) {
    h += '<div class="warnbox">' + s.warnLines.map(function (l) { return "<p>" + l + "</p>"; }).join("") + "</div>";
  } else {
    h += "<p>" + s.body + "</p>";
  }
  if (tourStep > 0) {
    h += '<div class="tourdots">';
    for (var i = 1; i < TOUR.length; i++) h += "<i" + (i <= tourStep ? ' class="on"' : "") + "></i>";
    h += "</div>";
  }
  h += '<div class="tourbtns">';
  if (tourStep === 0) {
    h += '<button class="btn" onclick="tourStep=1;renderTour()">Show me around</button>' +
      '<button class="btn ghost" onclick="endTour(false)">Skip, I’ll explore</button>';
  } else if (!last) {
    h += '<button class="btn ghost" onclick="tourStep--;renderTour()">Back</button>' +
      '<button class="btn" onclick="tourStep++;renderTour()">Next</button>' +
      '<button class="btn ghost" onclick="endTour(false)">Skip</button>';
  } else {
    h += '<button class="btn ghost" onclick="tourStep--;renderTour()">Back</button>' +
      '<button class="btn" onclick="endTour(true)">Understood — plan my first week</button>';
  }
  h += "</div></div></div>";
  el("tour").innerHTML = h;
}
function endTour(goPlan) {
  S.seen = true;
  save();
  el("tour").innerHTML = "";
  if (goPlan) { switchTab("plan"); window.scrollTo(0, 0); }
}

// ---------- sheet plumbing ----------
function openSheet(html) {
  el("sheet").innerHTML = html;
  el("overlay").classList.add("on");
}
function closeSheet() { el("overlay").classList.remove("on"); pickerCtx = null; }
el("overlay").addEventListener("click", function (e) { if (e.target === el("overlay")) closeSheet(); });

// ---------- boot ----------
document.querySelectorAll("nav.nav button").forEach(function (b) {
  b.addEventListener("click", function () { switchTab(b.dataset.tab); });
});
render();
if (!S.seen) showTour();
