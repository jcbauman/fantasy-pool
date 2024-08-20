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
              <AccordionDetails>
                <Typography variant="body2">{faq.content}</Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>
    </PageContainer>
  );
};
