export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  PARTNER = 'partner',
  SECURITY = 'security',
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
  isPartnerApplicationRejected: boolean;
  partnerApplicationRejectionReason: string;
  language: string;
};

export type TSendVerificationCodeReturn =
  | {
      messageCode: string;
      emailCodeSentAt: number;
    }
  | {
      messageCode: string;
      phoneCodeSentAt: number;
    }
  | {
      messageCode: string;
      emailCodeSentAt: number;
      phoneCodeSentAt: number;
    };

export enum ESignInMethods {
  GOOGLE = 'google',
  PASSWORD = 'password',
  APPLE = 'apple',
}
