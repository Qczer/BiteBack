export enum FoodCategory {
  Meat = "meat",
  Dairy = "dairy",
  Fruit = "fruit",
  Vegetable = "vegetable",
  Snack = "snack",
  Junk = "junk",
  Other = "other",
}

export interface FoodProps {
  name: string;
  amount: number;
  unit?: string;
  category?: FoodCategory; 
  icon?: string;
  expirationDate?: Date | null; 
}

export default class Food {
  name: string;
  amount: number;
  unit?: string;
  category?: FoodCategory;
  icon?: string;
  expirationDate?: Date | null;

  constructor(props: FoodProps) {
    this.name = props.name;
    this.amount = props.amount;
    this.unit = props.unit;
    this.category = props.category;
    this.icon = props.icon;
    this.expirationDate = props.expirationDate;
  }
}