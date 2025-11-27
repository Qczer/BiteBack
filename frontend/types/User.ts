import Food from "./Food";

export interface Profile {
  username: string;
  avatar: string;
  bitescore: number;
  createDate: Date;
}

export interface FriendInterface {
  "_id": string,
  "username": string,
  "email": string,
  "avatar": string,
  "bitescore": number
}

export interface MutualFriendInterface {
  "_id": string;
  "avatar": string;
  "username": string;
  "bitescore": number;
}

export interface MutualFriendsInterface {
  "mutualCount": number;
  "mutualFriends": MutualFriendInterface[];
  "userA": string;
  "userB": string;
}

export interface RequestInterface {
  "_id": string,
  "username": string,
  "avatar": string
}

export interface UserFriendsInterface {
  "userID": string;
  "username": string;
  "friends": FriendInterface[],
  "requests": RequestInterface[]
}

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
  friends: string[];
  requests: string[];
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
  friends: string[];
  requests: string[];

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
    this.friends = props.friends;
    this.requests = props.requests;
  }
}