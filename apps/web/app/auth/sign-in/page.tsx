import { AuthUiContainer } from "@web/components/auth/Layouts/AuthUiContainer";
import { SignInForm } from "@web/components/auth/sign-in/SignInForm";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  return (
    <AuthUiContainer>
      <SignInForm />
    </AuthUiContainer>
  );
}
