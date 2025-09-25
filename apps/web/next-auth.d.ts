import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  type User = {
    avatar?: string;
    email?: string;
    enable_two_factor: boolean;
    expired_at: string;
    login_name: string;
    token: string;
    user_id: string;
  };

  type Session = {
    user: User;
  };

  type AdapterUser = {
    enable_two_factor: boolean;
    expired_at: string;
    login_name: string;
    refresh_token: string;
    token: string;
    user_id: string;
  };
}

declare module "next-auth/jwt" {
  type JWT = {
    user: User;
  };
}
