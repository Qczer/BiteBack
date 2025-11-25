export interface NotificationInterface {
  userID: string;
  title: string;
  body: string;
  data: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default class Notification {
  userID: string;
  title: string;
  body: string;
  data: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: NotificationInterface) {
    this.userID = props.userID;
    this.title = props.title;
    this.body = props.body;
    this.data = props.data;
    this.isRead = props.isRead;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

}