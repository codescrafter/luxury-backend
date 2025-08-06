export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  PARTNER = 'partner',
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
  isPartnerApplicationSubmitted: boolean;
  isPartnerApplicationApproved: boolean;
  language: string;
};

export type TSendVerificationCodeReturn =
  | {
      message: string;
      emailCodeSentAt: number;
    }
  | {
      message: string;
      phoneCodeSentAt: number;
    }
  | {
      message: string;
      emailCodeSentAt: number;
      phoneCodeSentAt: number;
    };

export enum ESignInMethods {
  GOOGLE = 'google',
  PASSWORD = 'password',
  APPLE = 'apple',
}