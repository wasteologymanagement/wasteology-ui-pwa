import React from "react";
import {
  Box,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import VisionMissionGoalPage from "./VisionMissionGoalPage";
import TeamPage from "./TeamPage";
import MilestonePage from "./MilestonePage";
import CompanyDescriptionPage from "./CompanyDescriptionPage";
import HeroPage from "./HeroPage";
import CtaPage from "./CtaPage";

const AboutUsPage = ({ showTeam = true, showMilestones = true }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box className="bg-white">
      {/* Hero */}
      <HeroPage isMobile={isMobile} />

      {/* Company Description */}
      <CompanyDescriptionPage />

      {/* Vision / Mission / Goal */}
      <VisionMissionGoalPage />

      {/* Optional: Team */}
      {/* <TeamPage showTeam={true} /> */}

      {/* Optional: Milestones */}
      {/* <MilestonePage showMilestones={true} /> */}

      <Divider className="my-12" />

      {/* CTA */}
      <CtaPage />
    </Box>
  );
};

export default AboutUsPage;
