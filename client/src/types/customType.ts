export type UserImageType = {
    userImage: string;
}

export interface User extends UserImageType{
    userName: string;
    email: string;
    password: string;
}