import { FoodCategory } from "./Food";

export default interface FoodFilter {
  FoodCategory: FoodCategory;
  active: boolean;
}