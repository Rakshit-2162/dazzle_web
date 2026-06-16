import { Box, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material";
import { tokens } from "../../styles/theme";
import { DazzleButton } from ".";

interface DazzleStepperProps {
  steps: string[];
  stepContents: React.ReactNode[];
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

const DazzleStepper = ({
  steps,
  stepContents,
  onConfirm,
  isLoading = false,
}: DazzleStepperProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [activeStep, setActiveStep] = useState(0);

  const isLastStep = activeStep === steps.length - 1;
  const isFirstStep = activeStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onConfirm();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Box>
      {/* Stepper header */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: activeStep >= steps.indexOf(label) ? 600 : 400,
                  color: colors.text.primary,
                }}
              >
                {label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step content */}
      <Box sx={{ minHeight: 300 }}>{stepContents[activeStep]}</Box>

      {/* Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 3,
          pt: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <DazzleButton
          label={t("common.back")}
          variant="outlined"
          onClick={handleBack}
          disabled={isFirstStep || isLoading}
        />
        <DazzleButton
          label={isLastStep ? t("common.confirm") : t("common.next")}
          variant="primary"
          onClick={handleNext}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default DazzleStepper;
