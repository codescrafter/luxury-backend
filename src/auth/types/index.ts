export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}
export type TUserReturn = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role[];
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: Date;
  avatar: string;
};

export type TSendVerificationCodeReturn =
  | {
      message: string;
      emailCodeSentAt: number;
    }
  | {
      message: string;
      phoneCodeSentAt: number;
    };
