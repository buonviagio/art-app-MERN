export type UserImageType = {
    userImage: string;
}

export interface User extends UserImageType{
    avatar: {secure_url: string};
    userName: string;
    email: string;
    password: string;
}

export type ExistingUserInDB = {
    avatar?: { secure_url: string };
    userName: string;
    email: string;
    userId: string;
}
export type Token = string;  

export type LoginOkResponse = {
    message: string;
    user: {
        email: string,
        userName: string,
        avatar: string
    },
    token: Token
}

export type GetProfileOkResponse = {
    userProfile: ExistingUserInDB;
}

export interface ArtsObjectResponce {
  picture: Picture
  _id: string
  location: string
  nameOfTheAuthor: string
  nameOfThePainting: string
  style: string
  year: number
  description: string
  userWhoPostedArt: string
}

export interface Picture {
  secure_url: string
  public_id: string
}

export type CommentsResponce = {
    artId: string
    text: string
    avatar: string | undefined
    userId: string
    userName: string
    createdAt: Date
    updatedAt: Date
    commentId: string
}