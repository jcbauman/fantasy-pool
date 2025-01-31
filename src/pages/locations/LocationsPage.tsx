import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FC, useMemo } from "react";
import { PoolHallLocation } from "../../types";
import { PageContainer } from "../../shared-components/PageContainer";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setPlayerSortBy } from "../../redux/navSlice";
import { useFetchLocations } from "../../backend/getters";
import { Timestamp } from "firebase/firestore";
import { LocationCell } from "./components/LocationCell";

const SortableStatsOrder = [
  { label: "Name", value: "name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" },
  { label: "Added", value: "dateAdded" },
];

export const LocationsPage: FC = () => {
  const { players } = useAppContext();
  const locations = useFetchLocations();
  const { sortBy } = useSelector((state: RootState) => state.nav);
  const { hideInactivePlayers } = useSelector(
    (state: RootState) => state.settings
  );
  const dispatch = useDispatch();

  const alphabeticalLocations = useMemo(
    () => (locations ?? []).sort((a, b) => a?.name?.localeCompare(b?.name)),
    [locations]
  );

  //   const isKeyOfRankings = (
  //     key: string,
  //     obj: Record<string, string[]>
  //   ): key is keyof Record<string, string[]> => {
  //     return key in obj;
  //   };

  //   const sortPlayers = (
  //     players: Player[],
  //     sortedPlayerIds: string[]
  //   ): Player[] => {
  //     return players.sort(
  //       (a, b) => sortedPlayerIds.indexOf(a.id) - sortedPlayerIds.indexOf(b.id)
  //     );
  //   };

  //   const sortedPlayers = useMemo(() => {
  //     if (sortBy === "name") {
  //       return alphabeticalPlayers;
  //     } else if (isKeyOfRankings(sortBy, rankings)) {
  //       return sortPlayers([...alphabeticalPlayers], rankings[sortBy] ?? []);
  //     } else {
  //       return alphabeticalPlayers;
  //     }
  //   }, [alphabeticalPlayers, rankings, sortBy]);

  const sortByProps = (field: string) => {
    return {
      onClick: () => dispatch(setPlayerSortBy(field)),
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
                        : { position: "relative" }
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
            {alphabeticalLocations.map((loc) => {
              return <LocationRow rowKey={loc.id} location={loc} />;
            })}
          </TableBody>
        </Table>
        {hideInactivePlayers && (
          <Stack sx={{ pt: 1, pl: 2 }}>
            <Typography variant="caption">Inactive players hidden</Typography>
          </Stack>
        )}
      </Stack>
    </PageContainer>
  );
};

const LocationRow: FC<{
  location: PoolHallLocation;
  rowKey: string;
}> = ({ location, rowKey }) => {
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
            <TableCell
              key={rowKey}
              style={{
                position: "sticky",
                left: 0,
                zIndex: 1,
                backgroundColor: "#303030",
              }}
            >
              <LocationCell location={location} />
            </TableCell>
          );
        } else {
          return (
            <TableCell sx={{ textAlign: "center" }} key={rowKey}>
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
