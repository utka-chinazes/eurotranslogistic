// =============================================================================
// Маршрутизація: відстані та пошук шляху по мережі.
// Граф будується один раз, а знайдені шляхи кешуються — мережа статична,
// тож повторний пошук (картки замовлень, прогнози) коштує O(1).
// =============================================================================

const Routing = (() => {
  const R = 6371; // км
  const toRad = d => d * Math.PI / 180;

  function haversine(lat1, lon1, lat2, lon2) {
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  const distCache = new Map();
  function cityDistance(a, b) {
    if (a === b) return 0;
    const key = a < b ? `${a}|${b}` : `${b}|${a}`;
    let d = distCache.get(key);
    if (d === undefined) {
      d = haversine(CITIES[a].lat, CITIES[a].lon, CITIES[b].lat, CITIES[b].lon);
      distCache.set(key, d);
    }
    return d;
  }

  // Списки суміжності для доріг і залізниці
  const graphs = { road: {}, rail: {} };
  Object.keys(CITIES).forEach(id => { graphs.road[id] = []; graphs.rail[id] = []; });
  CONNECTIONS.forEach(conn => {
    const g = conn.type === 'rail' ? graphs.rail : graphs.road;
    if (!g[conn.from] || !g[conn.to]) return;
    g[conn.from].push({ to: conn.to, w: conn.distance });
    g[conn.to].push({ to: conn.from, w: conn.distance });
  });

  function dijkstra(start, end, network) {
    const adj = graphs[network];
    const dist = { [start]: 0 };
    const prev = {};
    const done = new Set();
    const nodes = Object.keys(adj);

    while (done.size < nodes.length) {
      let u = null;
      let best = Infinity;
      for (const n of nodes) {
        if (!done.has(n) && dist[n] !== undefined && dist[n] < best) { best = dist[n]; u = n; }
      }
      if (u === null || u === end) break;
      done.add(u);
      for (const { to, w } of adj[u]) {
        const alt = best + w;
        if (dist[to] === undefined || alt < dist[to]) { dist[to] = alt; prev[to] = u; }
      }
    }
    if (dist[end] === undefined) return null;
    const path = [end];
    while (path[0] !== start) path.unshift(prev[path[0]]);
    return path;
  }

  const pathCache = new Map();

  // Повертає масив id міст або null, якщо маршруту немає
  function findPath(start, end, network) {
    if (!CITIES[start] || !CITIES[end]) return null;
    if (start === end) return [start];
    if (network === 'air') return [start, end];
    const net = network === 'rail' ? 'rail' : 'road';
    const key = `${net}|${start}|${end}`;
    if (!pathCache.has(key)) {
      const p = dijkstra(start, end, net);
      pathCache.set(key, p);
      pathCache.set(`${net}|${end}|${start}`, p ? [...p].reverse() : null);
    }
    const cached = pathCache.get(key);
    return cached ? [...cached] : null;
  }

  function pathDistance(path) {
    if (!path || path.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < path.length - 1; i++) total += cityDistance(path[i], path[i + 1]);
    return Math.round(total);
  }

  return { haversine, cityDistance, findPath, pathDistance, graphs };
})();

// Тонкі обгортки для решти коду гри
if (typeof EuroLogisticsGame !== "undefined") Object.assign(EuroLogisticsGame.prototype, {
  findPath(start, end, network) { return Routing.findPath(start, end, network); },
  calculatePathDistance(path) { return Routing.pathDistance(path); },
  haversineDistance(lat1, lon1, lat2, lon2) { return Routing.haversine(lat1, lon1, lat2, lon2); },
  cityDistance(a, b) { return Routing.cityDistance(a, b); }
});
