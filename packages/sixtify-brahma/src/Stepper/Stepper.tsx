import type {
  StepperProps as MuiStepperProps,
  StepLabelProps,
} from "@mui/material";
import {
  Box,
  Stepper as MuiStepper,
  Step,
  StepLabel,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";

type StepperProps = MuiStepperProps & {
  steps: string[];
  stepUrls?: string[];
  errorSteps?: number[];
  showActiveStepIcon?: boolean;
  stepLabelProps?: StepLabelProps;
  onStepClick?: (stepIndex: number) => void;
  showTooltips?: boolean;
  showStepLabels?: boolean;
};

export const Stepper = ({
  orientation = "horizontal",
  activeStep = 0,
  stepLabelProps = {},
  steps,
  stepUrls = [],
  errorSteps = [],
  onStepClick,
  showTooltips = false,
  showStepLabels = true,
  ...rest
}: StepperProps) => {
  const theme = useTheme();

  const router = useRouter();

  const { butterflyBlue, red } = theme.palette.app.color;

  const handleStepClick = (index: number) => {
    if (onStepClick) {
      onStepClick(index);
    } else if (stepUrls[index]) {
      router.push(stepUrls[index]);
    }
  };

  return (
    <Box>
      <MuiStepper activeStep={activeStep} orientation={orientation} {...rest}>
        {steps.map((label, index) => {
          const isError = errorSteps.includes(index);

          const stepLabelContent = (
            <StepLabel
              {...stepLabelProps}
              error={isError}
              sx={{
                cursor:
                  (stepUrls[index] ?? onStepClick) ? "pointer" : "default",
                ".Mui-active .MuiStepIcon-root": {
                  color: `${butterflyBlue[900]} !important`,
                },
                ".Mui-completed .MuiStepIcon-root": {
                  color: `${butterflyBlue[900]} !important`,
                },
                ...(isError && {
                  ".MuiStepIcon-root": {
                    color: `${red[900]} !important`,
                  },
                  ".MuiStepLabel-label": {
                    color: `${red[900]} !important`,
                  },
                }),
                ...stepLabelProps.sx,
              }}
              onClick={() => handleStepClick(index)}
            >
              {showStepLabels && (
                <Typography variant="body2">{label}</Typography>
              )}
            </StepLabel>
          );

          return (
            <Step key={label}>
              {showTooltips ? (
                <Tooltip title={label} placement="top">
                  {stepLabelContent}
                </Tooltip>
              ) : (
                stepLabelContent
              )}
            </Step>
          );
        })}
      </MuiStepper>
    </Box>
  );
};
