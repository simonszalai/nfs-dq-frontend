import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("reports/:reporttoken", "routes/reports.$reporttoken.tsx"),
  route("enrichments/:reporttoken", "routes/enrichments.$reporttoken.tsx"),
] satisfies RouteConfig;
