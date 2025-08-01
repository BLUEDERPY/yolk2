import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const BackgroundOverlay = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        background: theme.palette.mode === 'light' 
          ? 'radial-gradient(circle at 20% 80%, rgba(232, 137, 10, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(252, 156, 4, 0.05) 0%, transparent 50%)'
          : 'radial-gradient(circle at 20% 80%, rgba(252, 156, 4, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(232, 137, 10, 0.03) 0%, transparent 50%)',
      }}
    />
  );
};
