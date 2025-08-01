import React from "react";
import { Box, keyframes, useTheme } from "@mui/material";
import { Egg } from "lucide-react";
import { GridPosition } from "../types/grid";

const float = keyframes`
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(0, -10px) rotate(var(--rotation-angle));
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
`;

interface AnimatedEggProps {
  position: GridPosition;
  size: number;
  color: string;
  delay: number;
  isAnimating?: boolean;
  animationKey?: number;
}

export const AnimatedEgg: React.FC<AnimatedEggProps> = ({
  position,
  size,
  color,
  delay,
  isAnimating = false,
  animationKey = 0,
}) => {
  const theme = useTheme();
  
  // Generate a random rotation angle between -30 and 30 degrees
  const rotationAngle = React.useMemo(
    () => Math.floor(Math.random() * 61) - 30,
    [animationKey]
  );

  // Generate random movement values when animating
  const randomMovement = React.useMemo(() => {
    if (!isAnimating) return { x: 0, y: 0, rotation: 0, scale: 1 };
    return {
      x: (Math.random() - 0.5) * 400, // Random movement up to 200px in each direction
      y: (Math.random() - 0.5) * 200,
      rotation: Math.random() * 1440 - 720, // Random rotation up to 720 degrees
      scale: 0.5 + Math.random() * 1.5, // Random scale between 0.5x and 2x
    };
  }, [isAnimating, animationKey]);

  // Adjust opacity based on theme mode
  const baseOpacity = theme.palette.mode === 'light' ? 0.15 : 0.08;
  const hoverOpacity = theme.palette.mode === 'light' ? 0.25 : 0.15;

  const moveAnimation = keyframes`
    0% {
      transform: translate(0, 0) rotate(0deg) scale(1);
    }
    50% {
      transform: translate(${randomMovement.x}px, ${randomMovement.y}px) rotate(${randomMovement.rotation}deg) scale(${randomMovement.scale});
    }
    100% {
      transform: translate(0, 0) rotate(0deg) scale(1);
    }
  `;

  return (
    <Box
      sx={{
        position: "absolute",
        left: `${position.x}%`,
        top: `${position.y}%`,
        animation: isAnimating 
          ? `${moveAnimation} 2s ease-in-out`
          : `${float} 8s infinite ease-in-out`,
        animationDelay: `${delay}s`,
        opacity: baseOpacity,
        transition: "opacity 0.3s ease-in-out",
        "--rotation-angle": `${rotationAngle}deg`,
        "&:hover": {
          opacity: hoverOpacity,
        },
      }}
    >
      <Box
        sx={{
          transform: `rotate(${Math.random() * 360}deg)`,
          display: "inline-flex",
        }}
      >
        <Egg size={size} color={color} />
      </Box>
    </Box>
  );
};
