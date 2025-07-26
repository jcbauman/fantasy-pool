import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Stack,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import { FAQS_COPY } from "./constants";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { fireAnalyticsEvent } from "../../shared-components/hooks/analytics";

export const RulesPage: FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <PageContainer>
      <Stack
        direction="column"
        sx={{ width: "100%", height: "100%", p: 1 }}
        spacing={2}
      >
        <Typography variant="caption" sx={{ mb: 4 }}>
          Below is a helpful reference of commonly asked questions about scoring
          in the Fantasy Pool app.
        </Typography>
        {FAQS_COPY.map((faq, idx) => {
          const STORAGE_KEY = `rule-${idx}-update-${faq.lastUpdated}`;
          const hasSeenLatestRuleUpdate = Boolean(
            faq.lastUpdated ? localStorage.getItem(STORAGE_KEY) : "true"
          );
          const isExpanded = expandedIndex === idx;

          return (
            <Accordion
              key={`rule-${idx}`}
              expanded={isExpanded}
              onChange={(_, newExpanded) => {
                setExpandedIndex(newExpanded ? idx : null);
                if (!hasSeenLatestRuleUpdate && newExpanded) {
                  localStorage.setItem(STORAGE_KEY, "true");
                }
                if (newExpanded) {
                  fireAnalyticsEvent("Rules_Opened_Rule", { rule: faq.title });
                }
              }}
            >
              <AccordionSummary
                expandIcon={
                  <Badge
                    variant="dot"
                    color="info"
                    invisible={hasSeenLatestRuleUpdate || isExpanded}
                  >
                    <ArrowDropDownIcon />
                  </Badge>
                }
              >
                <Typography>{faq.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>{faq.content}</AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>
    </PageContainer>
  );
};
