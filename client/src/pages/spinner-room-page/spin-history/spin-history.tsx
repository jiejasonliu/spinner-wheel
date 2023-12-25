import { useEffect, useMemo, useState } from "react";
import { HistoryModel } from "@/models/history";
import { toHumanReadableDate } from "@/helpers/date";
import { roundPlaces } from "@/helpers/math";
import { getHistoriesClient } from "@/services/histories-client";
import { groupBy } from "@/helpers/object";
import "./spin-history.scss";

interface SpinHistoryProps {
  wheelId: string;
}

const MAX_HISTORIES = 8;

export const SpinHistory = ({ wheelId }: SpinHistoryProps) => {
  const [histories, setHistories] = useState<HistoryModel[] | undefined>(
    undefined
  );

  const historiesClient = useMemo(getHistoriesClient, []);

  useEffect(() => {
    (async () => {
      const newHistories = await historiesClient.getHistoriesByWheelId(wheelId);
      setHistories(newHistories);
    })();
  }, []);

  if (histories === undefined) {
    return <div>Loading</div>;
  }

  const limitedHistories = histories.slice(0, MAX_HISTORIES);
  const nameToHistory = groupBy(histories, (history) => history.winner.name);
  const nameAndWinCountPairs = Object.entries(nameToHistory)
    .map(([name, histories]) => [name, histories.length] as const)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="c-spin-history">
      <div className="history-entries">
        {limitedHistories.map((history) => (
          <div className="entry">
            <div className="winner-time">{toHumanReadableDate(history.time)}</div>
            <div className="winner-data">
              <span className="winner-name">{history.winner.name} </span>
              <span>({roundPlaces(history.winner.weight, 3)} chance)</span>
            </div>
          </div>
        ))}
        <div className="disclaimer">
          (only showing last {MAX_HISTORIES})
        </div>
      </div>
      <div className="summary-container">
        {nameAndWinCountPairs.map(([name, count]) => (
          <div className="summary-row">
            <span className="winner-name">{name}</span>
            <span>{count} wins</span>
          </div>
        ))}
      </div>
    </div>
  );
};
