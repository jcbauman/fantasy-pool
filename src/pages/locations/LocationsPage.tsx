import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Link,
} from "@mui/material";
import { FC, useMemo } from "react";
import { PoolHallLocation } from "../../types";
import { PageContainer } from "../../shared-components/PageContainer";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setLocationSortBy } from "../../redux/navSlice";
import { Timestamp } from "firebase/firestore";
import { useFetchLocations } from "../../backend/endpoints/locations";
import { LocationCell } from "./components/LocationCell";
import { bucketGamesByLocation } from "./hooks/utils";
import { setHideInactiveLocations } from "../../redux/settingsSlice";

const SortableStatsOrder = [
  { label: "Name", value: "name" },
  { label: "Games", value: "games" },
  { label: "City", value: "city" },
  { label: "State", value: "state" },
];

export const LocationsPage: FC = () => {
  const { games } = useAppContext();
  const locations = useFetchLocations();
  const { locationSortBy: sortBy } = useSelector(
    (state: RootState) => state.nav
  );
  const { hideInactiveLocations } = useSelector(
    (state: RootState) => state.settings
  );
  const dispatch = useDispatch();

  const alphabeticalLocations = useMemo(
    () => (locations ?? []).sort((a, b) => a?.name?.localeCompare(b?.name)),
    [locations]
  );

  const bucketedGames = useMemo(() => {
    return bucketGamesByLocation(games);
  }, [games]);

  const filteredLocations = useMemo(() => {
    if (!hideInactiveLocations) return alphabeticalLocations;
    return alphabeticalLocations.filter(
      (l) => (bucketedGames?.[l.name] ?? 0) > 0
    );
  }, [hideInactiveLocations, alphabeticalLocations, bucketedGames]);

  const sortedLocations = useMemo(() => {
    if (sortBy === "name") {
      return filteredLocations;
    } else if (sortBy === "city") {
      return [...filteredLocations].sort((a, b) => {
        const ac = (a?.city ?? "").trim();
        const bc = (b?.city ?? "").trim();
        if (!ac && bc) return 1;
        if (ac && !bc) return -1;
        return ac.localeCompare(bc);
      });
    } else if (sortBy === "state") {
      return [...filteredLocations].sort((a, b) => {
        const as = (a?.state ?? "").trim();
        const bs = (b?.state ?? "").trim();
        if (!as && bs) return 1;
        if (as && !bs) return -1;
        return as.localeCompare(bs);
      });
    } else if (sortBy === "games") {
      return [...filteredLocations].sort(
        (a, b) =>
          (bucketedGames?.[b.name] ?? 0) - (bucketedGames?.[a.name] ?? 0)
      );
    } else {
      return filteredLocations;
    }
  }, [filteredLocations, sortBy, bucketedGames]);

  const sortByProps = (field: string) => {
    return {
      onClick: () => dispatch(setLocationSortBy(field)),
      cursor: "pointer",
      sx: {
        cursor: "pointer",
        textAlign: field === "name" ? "left" : "center",
        textDecoration: sortBy === field ? "underline" : "default",
      },
    };
  };

  return (
    <PageContainer>
      <Stack
        direction="column"
        sx={{ width: "100%", height: "100%", overflowX: "auto" }}
      >
        <Table sx={{ width: "100%" }} stickyHeader>
          <TableHead>
            <TableRow>
              {SortableStatsOrder.map((f) => {
                return (
                  <TableCell
                    style={
                      f.value === "name"
                        ? {
                            position: "sticky",
                            left: 0,
                            zIndex: 10,
                            backgroundColor: "#303030",
                          }
                        : { position: "sticky" }
                    }
                    {...sortByProps(f.value)}
                    key={`${f.label}-cell"`}
                  >
                    <Typography variant="overline" noWrap>
                      {f.label}
                    </Typography>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedLocations.map((loc) => {
              return (
                <LocationRow
                  rowKey={loc.id}
                  location={loc}
                  count={bucketedGames?.[loc.name] ?? 0}
                />
              );
            })}
          </TableBody>
        </Table>
        <Stack
          direction="row"
          sx={{ pt: 1, pl: 2, mb: 6, alignItems: "center" }}
        >
          <Typography variant="caption">
            {hideInactiveLocations
              ? "Inactive pool halls hidden"
              : "Showing all pool halls"}
          </Typography>
          <Link
            color="secondary"
            sx={{
              ml: 1,
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={() =>
              dispatch(setHideInactiveLocations(!hideInactiveLocations))
            }
          >
            <Typography variant="caption">
              {hideInactiveLocations ? "Show all" : "Hide inactive"}
            </Typography>
          </Link>
        </Stack>
      </Stack>
    </PageContainer>
  );
};

const LocationRow: FC<{
  location: PoolHallLocation;
  rowKey: string;
  count: number;
}> = ({ location, rowKey, count }) => {
  const navigate = useNavigate();
  const handleRowClick = (): void => {
    navigate("/locations/" + location.id);
  };

  const isKeyOfLocation = (
    key: string,
    obj: PoolHallLocation
  ): key is keyof PoolHallLocation => {
    return key in obj;
  };

  return (
    <TableRow onClick={handleRowClick} key={rowKey}>
      {SortableStatsOrder.map((f) => {
        if (f.value === "name") {
          return (
            <TableCell>
              <LocationCell location={location} />
            </TableCell>
          );
        } else if (f.value === "games") {
          return <TableCell sx={{ textAlign: "center" }}>{count}</TableCell>;
        } else {
          return (
            <TableCell sx={{ textAlign: "center" }}>
              {isKeyOfLocation(f.value, location)
                ? location[f.value] instanceof Timestamp
                  ? (location[f.value] as Timestamp).toDate().toLocaleString()
                  : location[f.value]?.toString()
                : "-"}
            </TableCell>
          );
        }
      })}
    </TableRow>
  );
};
