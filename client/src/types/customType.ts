export type UserImageType = {
    userImage: string;
}

export interface User extends UserImageType{
    avatar: {secure_url: string};
    userName: string;
    email: string;
    password: string;
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
    userProfile: User;
}