import { Typography } from "@mui/material";
import { FC, ReactNode } from "react";

const ContentWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return <Typography variant="body2">{children}</Typography>;
};

export const FAQS_COPY = [
  {
    title: "Do you have to track all stats in a game honestly?",
    content: (
      <ContentWrapper>
        We are running this league entirely on the honor code, so please put
        accurate stats in. It would be nice if there were third party observers
        writing down everything we do, but we only have ourselves. Additionally,
        if we all keep tracking game location and dates accurately, it will
        allow more neat features to be added in the future based on this data.
        <ul>
          <li>
            If you find an issue/error with the stats of an already-submitted
            game, the league manager can help make adjustments to it.
          </li>
        </ul>
      </ContentWrapper>
    ),
  },
  {
    title: "Do you have to track every time you play pool?",
    content: (
      <ContentWrapper>
        No, but Fantasy Pool players should decide{" "}
        <strong>before starting a game</strong> whether they want to exclude the
        game from tracking.
        <ul>
          <li>
            If multiple Fantasy Pool players are playing in a game, everyone
            should agree whether the game will count or not. No partial tracking
            please.
          </li>
        </ul>
      </ContentWrapper>
    ),
  },
  {
    title: "How does doubles scoring work?",
    content: (
      <ContentWrapper>
        When you're tracking doubles games, a team's overall win or loss
        (whether by 8-ball or scratch) should apply to every member of the team,
        even to players not involved in the game-ending shot.{" "}
        <ul>
          <li>
            Personal shots like potting runs of balls, scratching, skill shots,
            etc. are applied on a per-player basis.{" "}
          </li>
        </ul>
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
            Skill shots can only be counted for successful called shots, not
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
            stat, those count towards the 'Loss by scratch' stat.{" "}
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
            partner's run separately - don't add them together for both players.
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
    title: "Can you track all cue sports in Fantasy Pool?",
    content: (
      <ContentWrapper>
        At the moment the app is only setup to track standard 8-ball pool games.
      </ContentWrapper>
    ),
  },
];
