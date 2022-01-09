import { get } from "./base";

export function getTopList() {
  return get("/api/getTopList");
}

export function getTopDetail({ id, period }) {
  return get("/api/getTopDetail", { id, period });
}
