import { useEffect, useMemo, useState } from "react";
import { Loading } from "@/components/loading/loading";
import { toHumanReadableDate } from "@/helpers/date";
import { roundPlaces } from "@/helpers/math";
import { groupBy } from "@/helpers/object";
import { HistoryModel } from "@/models/history";
import { Wheel } from "@/models/wheel";
import { getHistoriesClient } from "@/services/histories-client";
import "./spin-history.scss";

interface SpinHistoryProps {
  wheel: Wheel;
  onHistoryLoaded?: () => void;
}

const MAX_HISTORIES = 8;

export const SpinHistory = ({ wheel, onHistoryLoaded }: SpinHistoryProps) => {
  const [histories, setHistories] = useState<HistoryModel[] | undefined>(
    undefined
  );

  const historiesClient = useMemo(getHistoriesClient, []);

  useEffect(() => {
    (async () => {
      const newHistories = await historiesClient.getHistoriesByWheelId(
        wheel._id
      );
      setHistories(newHistories);
      onHistoryLoaded?.();
    })();
  }, [wheel]);

  if (histories === undefined) {
    return (
      <div className="c-spin-history-loading">
        <Loading size="medium"></Loading>
      </div>
    );
  }

  if (histories.length === 0) {
    return <div className="c-spin-history-loading">No spin history was found.</div>;
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
            <div className="winner-time">
              {toHumanReadableDate(history.time)}
            </div>
            <div className="winner-data">
              <span className="winner-name">{history.winner.name} </span>
              <span>({roundPlaces(history.winner.weight, 3)} chance)</span>
            </div>
          </div>
        ))}
        <div className="disclaimer">(only showing last {MAX_HISTORIES})</div>
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
