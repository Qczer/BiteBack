import Food from "./Food";

export interface UserProps {
  name: string;
  email: string;
  hash: string;
  salt: string;
  avatar?: string;
  lang: string;
  biteScore: number;
  fridge: Food[];
}

export default class User {
  name: string;
  email: string;
  hash: string;
  salt: string;
  avatar?: string;
  lang: string;
  biteScore: number;
  fridge: Food[];

  constructor(props: UserProps) {
    this.name = props.name;
    this.email = props.email;
    this.hash  = props.hash;
    this.salt  = props.salt;
    this.avatar = props.avatar;
    this.lang  = props.lang;
    this.biteScore = props.biteScore;
    this.fridge = props.fridge;
  }
}