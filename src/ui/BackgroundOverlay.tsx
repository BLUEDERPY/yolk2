import { Box } from "@mui/material";
import { AnimatedEgg } from "./AnimatedEgg";
import { createGridPositions } from "../utils/gridUtils";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

export const BackgroundOverlay = () => {
  const theme = useTheme();
  const [animationKey, setAnimationKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Create a 6x4 grid for 24 eggs
  const gridPositions = createGridPositions(6, 4);

  // Create three different sizes for visual hierarchy
  const sizes = [32, 48, 64];

  // Use different colors based on theme mode
  const eggColor = theme.palette.mode === 'light' ? '#e8890a' : '#fc9c04';

  const handleBackgroundClick = () => {
    setIsAnimating(true);
    setAnimationKey(prev => prev + 1);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };

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
      }}
    >
      {/* Invisible clickable overlay */}
      <Box
        onClick={handleBackgroundClick}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "auto",
          cursor: "pointer",
          zIndex: 1,
        }}
      />
      {gridPositions.map((position, index) => (
        <AnimatedEgg
          key={index}
          position={position}
          size={sizes[index % sizes.length]}
          color={eggColor}
          delay={index * 0.2}
          isAnimating={isAnimating}
          animationKey={animationKey}
        />
      ))}
    </Box>
  );
};
