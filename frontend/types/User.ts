import Food from "./Food";

export interface UserProps {
  _id: string;
  __v?: number;
  avatar: string;
  bitescore: number;
  createDate: Date;
  email: string;
  fridge: Food[];
  lang: string;
  username: string;
}

export default class User {
  _id: string;
  __v?: number;
  avatar: string;
  bitescore: number;
  createDate: Date;
  email: string;
  fridge: Food[];
  lang: string;
  username: string;

  constructor(props: UserProps) {
    this._id = props._id;
    this.__v = props.__v;
    this.avatar = props.avatar;
    this.bitescore = props.bitescore;
    this.createDate = props.createDate;
    this.email = props.email;
    this.fridge = props.fridge;
    this.lang  = props.lang;
    this.username = props.username;
  }
}