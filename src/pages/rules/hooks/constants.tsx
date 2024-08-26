import { Typography } from "@mui/material";
import { FC, ReactNode } from "react";

const ContentWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return <Typography variant="body2">{children}</Typography>;
};

export const FAQS_COPY = [
  {
    title: "Do I have to track all stats in a games honestly?",
    content: (
      <ContentWrapper>
        We are running this league entirely on the honor code, so please put
        accurate stats in. It would be nice if there were third party observers
        writing down everything we do, but we only have ourselves. Additionally,
        if we all keep tracking game location and dates accurately, it will
        allow more neat features to be added in the future based on this data.
      </ContentWrapper>
    ),
  },
  {
    title: "Do I have to track every time I play pool?",
    content: (
      <ContentWrapper>
        No, but Fantasy Pool players should decide{" "}
        <strong>before starting a game</strong> whether they want to exclude the
        game from tracking.
      </ContentWrapper>
    ),
  },
  {
    title: "How does doubles scoring work?",
    content: (
      <ContentWrapper>
        When you're tracking doubles games, a team's overall win or loss
        (whether by 8-ball or scratch) should apply to every member of the team.
        Personal shots like potting runs of balls, scratching, skill shots, etc.
        are applied on a per-player basis.
      </ContentWrapper>
    ),
  },
  {
    title: "How do skill shots work?",
    content: (
      <ContentWrapper>
        Skill shots are made shots that either include bank shots (off the
        wall), combos (2 or more non-cue balls hitting each other), and caroms
        (ball glancing off another).{" "}
        <ul>
          <li>
            Skill shots can only be counted for succesful called shots, not
            incidentals and slops - i.e. if you did not clearly mean to do it,
            it doesn't count.{" "}
          </li>{" "}
          <li>
            Skill shots only apply to the shooting player and not to every
            member of a doubles team.
          </li>
        </ul>
      </ContentWrapper>
    ),
  },
  {
    title: "How do scratches work?",
    content: (
      <ContentWrapper>
        Scratches in fantasy pool involve the cue ball going into the pocket.
        Table scratches need not count to the scratches stat unless you and any
        partner/opponent agree to include them beforehand.
        <ul>
          <li>
            Don't count scratches that result in the end of a game for this
            stat, those count towards the 'Loss by 8-ball' scratch stat.{" "}
          </li>
          <li>
            Scratches only apply to the shooting player and not to every member
            of a doubles team.
          </li>
        </ul>
      </ContentWrapper>
    ),
  },
  {
    title: "How do runs work?",
    content: (
      <ContentWrapper>
        Runs count when you pocket 3 or more balls in a row before missing.
        Enter your total number of balls pocketed in-a-row after your run is
        finished.
        <ul>
          <li>
            If you sink at least one ball in off the break, you may count that
            towards a run. However, no matter how many balls you sink off the
            break, that counts as 1 ball in a row.
          </li>
          <li>
            Runs only apply to the shooting player and not to every member of a
            doubles team.
          </li>
          <li>
            If you are playing scotch doubles, count any personal run and your
            partner's run seperately - don't add them together for both players.
          </li>
        </ul>
      </ContentWrapper>
    ),
  },
  {
    title: "Should I submit by game or by full session?",
    content: (
      <ContentWrapper>
        It's entirely up to you if you want to aggregate your night of pool into
        one session or track each game individually.
      </ContentWrapper>
    ),
  },
  {
    title: "What happened to George Washingtons and Cue-hauler stats?",
    content: (
      <ContentWrapper>
        If you have any cool stat ideas, we can discuss adding them. Don't want
        to be overly confusing. Any stats that you have previously tracked in
        these areas are still there, they just aren't counting towards Fantasy
        points at the moment.
      </ContentWrapper>
    ),
  },
  {
    title: "Can you track all cue sports in Fantasy Pool?",
    content: (
      <ContentWrapper>
        At the moment the app is only setup to track standard 8-ball pool games.
      </ContentWrapper>
    ),
  },
];
