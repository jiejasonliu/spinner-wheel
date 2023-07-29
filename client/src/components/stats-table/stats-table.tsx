import './stats-table.scss';

export interface StatEntry {
  name: string;
  weight: number;
}

export interface StatsTableProps {
  entries: StatEntry[];
}

export const StatsTable = ({ entries }: StatsTableProps) => {
  return (
    <>
      {entries.map((entry) => (
        <div className="stats-table-entry" key={`${entry.name}-${entry.weight}`}>
          <div className="stats-table-text">{entry.name}</div>
          <div className="stats-table-text">{entry.weight}</div>
        </div>
      ))}
    </>
  );
};
