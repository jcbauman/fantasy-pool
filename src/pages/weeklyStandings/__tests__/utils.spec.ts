import { getStartOfWeek } from "../hooks/utils";

describe("getStartOfWeek", () => {
  test("it gets the correct start of week", () => {
    expect(getStartOfWeek(new Date("2024-08-17T12:30:49.672Z"))).toEqual(
      new Date("2024-08-12T12:30:49.672Z")
    );
    expect(getStartOfWeek(new Date("2024-08-16T12:30:49.672Z"))).toEqual(
      new Date("2024-08-12T12:30:49.672Z")
    );
    expect(getStartOfWeek(new Date("2024-08-15T12:30:49.672Z"))).toEqual(
      new Date("2024-08-12T12:30:49.672Z")
    );
    expect(getStartOfWeek(new Date("2024-08-14T12:30:49.672Z"))).toEqual(
      new Date("2024-08-12T12:30:49.672Z")
    );
    expect(getStartOfWeek(new Date("2024-08-13T12:30:49.672Z"))).toEqual(
      new Date("2024-08-12T12:30:49.672Z")
    );
    expect(getStartOfWeek(new Date("2024-08-12T12:30:49.672Z"))).toEqual(
      new Date("2024-08-12T12:30:49.672Z")
    );
    expect(getStartOfWeek(new Date("2024-08-11T12:30:49.672Z"))).toEqual(
      new Date("2024-08-05T12:30:49.672Z")
    );
  });
});
