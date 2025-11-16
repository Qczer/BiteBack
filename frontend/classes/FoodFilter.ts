import { FoodType } from "./Food";

export default interface FoodFilter {
  foodType: FoodType;
  active: boolean;
}