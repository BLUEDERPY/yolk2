import React from "react";
import { Stack, Box } from "@mui/material";
import { FooterLink } from "./FooterLink";
import { SocialIcon } from "./SocialIcon";
import twitterIcon from "../../assets/icons8-x (1).svg";
import telegramIcon from "../../assets/icons8-telegram.svg";

export const FooterLinks: React.FC = () => {
  return (
    <Stack direction="row" spacing={3} alignItems="center">
      <Stack
        direction="row"
        spacing={2}
        sx={{
          "& > a": {
            fontSize: "0.875rem",
          },
        }}
      >
        <FooterLink href="https://eggs-finance.gitbook.io/docs/disclaimer">
          Terms
        </FooterLink>
        <FooterLink href="https://eggs-finance.gitbook.io/docs/documentation">
          Docs
        </FooterLink>
      </Stack>
      
      <Box sx={{ display: "flex", gap: 1 }}>
        <SocialIcon
          iconSrc={twitterIcon}
          label="Follow us on X"
          href="https://twitter.com/eggsonsonic"
        />
        <SocialIcon
          iconSrc={telegramIcon}
          label="Join our Telegram"
          href="https://t.me/eggsonsonic"
        />
      </Box>
    </Stack>
  );
};
