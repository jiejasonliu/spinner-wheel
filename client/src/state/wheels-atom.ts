import { Wheel } from "@/models/wheel";
import { atom } from "recoil";

export const wheelsState = atom<Wheel[]>({
  key: "wheelsState",
  default: [],
});
