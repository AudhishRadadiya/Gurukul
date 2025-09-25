import { ForgotPasswordForm } from "@web/components/auth/forgot-password/ForgotPasswordForm";
import { AuthUiContainer } from "@web/components/auth/Layouts/AuthUiContainer";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  return (
    <AuthUiContainer>
      <ForgotPasswordForm />
    </AuthUiContainer>
  );
}
