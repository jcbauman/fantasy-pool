import { mockGame, mockSession } from "../../backend/fixtures";
import { GameStatKeys } from "../../types";
import { combineGameToExistingSession } from "../sessionUtils";

describe("combineGameToExistingSession", () => {
  const mockUpdateSession = jest.fn();
  jest.mock("../../backend/sessions", () => ({
    updateExistingSession: mockUpdateSession,
  }));

  test("it aggregates correctly for an existing player", () => {
    const result = combineGameToExistingSession(mockSession, mockGame);
    expect(result).toEqual({
      ...mockSession,
      games: [...mockSession.games, mockGame],
    });
    expect(result?.statsByPlayer).toEqual([
      {
        playerId: mockSession.playerIds[0],
        [GameStatKeys.winsBy8BallSink]: 2,
        [GameStatKeys.winsByOpponentScratch]: 6,
        [GameStatKeys.lossesBy8BallSink]: 2,
        [GameStatKeys.lossesByScratch]: 6,
        [GameStatKeys.threeBallsPocketedInRow]: 12,
        [GameStatKeys.fourBallsPocketedInRow]: 0,
        [GameStatKeys.fiveBallsPocketedInRow]: 0,
        [GameStatKeys.sixBallsPocketedInRow]: 0,
        [GameStatKeys.sevenBallsPocketedInRow]: 0,
        [GameStatKeys.runTheTable]: 0,
        [GameStatKeys.scratches]: 4,
        [GameStatKeys.skillShots]: 2,
      },
    ]);
  });

  test("it adds correctly for an new player", () => {
    const mockPlayerId = "mock-id";
    const result = combineGameToExistingSession(mockSession, {
      ...mockGame,
      playerIds: [mockPlayerId],
      statsByPlayer: [{ ...mockGame.statsByPlayer[0], playerId: mockPlayerId }],
    });
    expect(result).toEqual({
      ...mockSession,
      playerIds: [...mockSession.playerIds, mockPlayerId],
      statsByPlayer: [
        ...mockSession.statsByPlayer,
        { ...mockGame.statsByPlayer[0], playerId: mockPlayerId },
      ],
      games: [
        mockGame,
        {
          ...mockGame,
          playerIds: [mockPlayerId],
          statsByPlayer: [
            { ...mockGame.statsByPlayer[0], playerId: mockPlayerId },
          ],
        },
      ],
    });
  });
});
