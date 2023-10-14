import "./stats-table.scss";

export interface StatEntry {
  name: string;
  weight: number;
}

export interface StatsTableProps {
  entries: StatEntry[];
}

export const StatsTable = ({ entries }: StatsTableProps) => {
  const entriesSortedByHighestWeight = [...entries].sort((a, b) =>
    a.weight > b.weight ? -1 : 1
  );

  return (
    <>
      {entriesSortedByHighestWeight.map((entry) => (
        <div
          className="stats-table-entry"
          key={`${entry.name}-${entry.weight}`}
        >
          <div className="stats-table-text">{entry.name}</div>
          <div className="stats-table-text">{round(entry.weight, 3)}</div>
        </div>
      ))}
    </>
  );
};
