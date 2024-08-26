import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import { FAQS_COPY } from "./hooks/constants";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export const RulesPage: FC = () => {
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
          return (
            <Accordion key={`rule-${idx}`}>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
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
