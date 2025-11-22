import Food from "./Food";

export interface UserProps {
  _id?: string;
  username: string;
  email: string;
  hash: string;
  salt: string;
  avatar: string;
  lang: string;
  biteScore: number;
  fridge: Food[];
}

export default class User {
  _id?: string;
  username: string;
  email: string;
  hash: string;
  salt: string;
  avatar: string;
  lang: string;
  biteScore: number;
  fridge: Food[];

  constructor(props: UserProps) {
    this._id = props._id;
    this.username = props.username;
    this.email = props.email;
    this.hash  = props.hash;
    this.salt  = props.salt;
    this.avatar = props.avatar;
    this.lang  = props.lang;
    this.biteScore = props.biteScore;
    this.fridge = props.fridge;
  }
}