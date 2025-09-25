import type {
  StepperProps as MuiStepperProps,
  StepLabelProps,
} from "@mui/material";
import {
  Stepper as MuiStepper,
  Step,
  StepLabel,
  Box,
  Typography,
  useTheme,
  Stack,
} from "@mui/material";

type StepperProps = MuiStepperProps & {
  steps: { in_time?: string; out_time?: string }[];
  showActiveStepIcon?: boolean;
  stepLabelProps?: StepLabelProps;
};

export const StepperV3 = ({
  orientation = "horizontal",
  activeStep = 0,
  stepLabelProps = {},
  steps,
  ...rest
}: StepperProps) => {
  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  return (
    <Box>
      <MuiStepper activeStep={activeStep} orientation={orientation} {...rest}>
        {steps.map((label, index) => (
          // eslint-disable-next-line sonarjs/no-array-index-key
          <Step key={index}>
            <StepLabel
              {...stepLabelProps}
              sx={{
                ".Mui-active .css-18pqgpd-MuiSvgIcon-root-MuiStepIcon-root": {
                  color: `${butterflyBlue[900]} !important`,
                },
                ".Mui-completed .MuiStepIcon-root": {
                  color: `${butterflyBlue[900]} !important`,
                },
                ".MuiStepIcon-text": {
                  color: "transparent !important",
                  display: "none",
                },
              }}
            >
              <Stack>
                {label?.in_time ? (
                  <>
                    <Typography variant="caption">In at</Typography>
                    <Typography variant="caption">{label?.in_time}</Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="caption">Out at</Typography>
                    <Typography variant="caption">{label?.out_time}</Typography>
                  </>
                )}
              </Stack>
            </StepLabel>
          </Step>
        ))}
      </MuiStepper>
    </Box>
  );
};
