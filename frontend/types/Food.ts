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
  _id?: string;
  name: string;
  amount: number;
  unit?: string;
  category?: FoodCategory; 
  iconUrl?: string;
  expDate?: Date | null; 
}

export default class Food {
  _id?: string;

  name: string;
  amount: number;
  unit?: string;
  category?: FoodCategory;
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