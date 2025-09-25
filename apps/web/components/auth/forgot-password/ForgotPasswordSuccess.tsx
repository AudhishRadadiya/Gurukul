import { Button, FormAction } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export const ForgotPasswordSuccess = () => {
  const router = useRouter();

  return (
    <Stack gap="25px" alignItems="center" textAlign="center">
      <FormAction />

      <Typography>
        We have sent you an email with steps to reset your password. Click on
        the link in your email to change your password.
      </Typography>

      <Button
        fullWidth
        variant="outlined"
        onClick={() => router.push("/auth/sign-in")}
      >
        Back to Sign In
      </Button>
    </Stack>
  );
};
