export enum FoodCategory {
  Meat = "meat",
  Dairy = "dairy",
  Fruit = "fruit",
  Vegetable = "vegetable",
  Snack = "snack",
  Junk = "junk",
  Other = "other"
}

export interface FoodProps {
  name: string;
  amount: number;
  unit?: string;
  category?: FoodCategory; 
  iconUrl?: string;
  expDate?: Date | null; 
}

export default class Food {
  name: string;
  amount: number;
  unit?: string;
  category?: FoodCategory;
  iconUrl?: string;
  expDate?: Date | null;

  constructor(props: FoodProps) {
    this.name = props.name;
    this.amount = props.amount;
    this.unit = props.unit;
    this.category = props.category;
    this.iconUrl = props.iconUrl;
    this.expDate = props.expDate;
  }
}