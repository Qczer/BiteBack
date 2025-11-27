export enum FoodCategory {
  Meat = "meat",
  Dairy = "dairy",
  Fruit = "fruit",
  Vegetable = "vegetable",
  Snack = "snack",
  Junk = "junk",
  Other = "other"
}

export enum FoodUnit {
  g = "g",
  kg = "kg",
  ml = "ml",
  l = "l",
  pcs = "pcs",
}

export interface FoodProps {
  _id?: string;
  name: string;
  amount: number;
  unit: FoodUnit;
  category: FoodCategory;
  iconUrl?: string;
  expDate?: Date | null; 
}

export default class Food {
  _id?: string;
  name: string;
  amount: number;
  unit: FoodUnit;
  category: FoodCategory;
  iconUrl?: string;
  expDate?: Date | null;

  constructor(props: FoodProps) {
    this._id = props._id;
    this.name = props.name;
    this.amount = props.amount;
    this.unit = props.unit;
    this.category = props.category;
    this.iconUrl = props.iconUrl;
    this.expDate = props.expDate;
  }
}