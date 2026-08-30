-- Fuel Route Optimizer — project insert
-- Run against production D1:
--   npx wrangler d1 execute kinetiq-db --remote --file=seed-fuel-route.sql
-- Run against local D1:
--   npx wrangler d1 execute kinetiq-db --local --file=seed-fuel-route.sql

INSERT OR IGNORE INTO projects (
  slug,
  title,
  category,
  tags,
  summary,
  thumbnail,
  images,
  year,
  featured,
  challenge,
  solution,
  result,
  metrics,
  quote,
  sort_order
) VALUES (
  'fuel-route-optimizer',
  'Fuel Route Optimizer',
  'AI Automation',
  '["Route Optimization","Geospatial AI","REST API","Cost Modeling"]',
  'A Django REST API that plans cross-country US truck routes with cost-optimal fuel stops — telling drivers exactly where to stop and how many gallons to buy at each station to minimize total spend.',
  '/fuel-route-optimizer/route_map_demo.png',
  '["/fuel-route-optimizer/route_map_demo.png","/fuel-route-optimizer/fuel_price_chart.png"]',
  '2026',
  0,
  'Long-haul trucking has a fuel problem that goes beyond finding the nearest gas station. Prices swing by 10–20% along any major route, and a 50-gallon tank forces multiple stops on trips over 500 miles. The real question is not where to stop, but which stations to choose and exactly how many gallons to buy at each — because buying too much at a pricey station is just as costly as running low before a cheap one.',
  'We built a Django REST API that answers this problem end-to-end using only free, open-source tools. The pipeline works in five stages: it geocodes the start and finish locations against a 30,000-city US dataset (falling back to Nominatim/Photon only when needed), fetches the real driving route from OSRM, runs a two-stage H3 hexagonal spatial search to find all fuel stations within a corridor around the route without brute-force scanning the 6,000+ station dataset, maps each station to its cumulative distance from the start, then runs a greedy look-ahead optimizer that decides at each stop whether to fill up or buy just enough fuel to reach the next cheaper station ahead.',
  'The API returns a complete fuel plan for any US city-to-city route in a single POST request: every stop with the station name, price, gallons purchased, cost, and running fuel level — plus total cost, total gallons, and the dollar value of the fuel safety buffer remaining at the destination. On a 2,801-mile Los Angeles → New York run it plans 13 stops and a total fuel cost of $708.74, consistently finding the cheapest viable path through the station data.',
  '[{"value":"2,801 mi","label":"LA → NY demo route"},{"value":"$708.74","label":"total fuel cost on demo run"},{"value":"13","label":"optimized stops planned"},{"value":"0","label":"paid APIs or keys required"}]',
  NULL,
  10
);

