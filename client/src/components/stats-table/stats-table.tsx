import './stats-table.scss';

export interface StatEntry {
  name: string;
  value: number;
}

export interface StatsTableProps {
  entries: StatEntry[];
}

export const StatsTable = ({ entries }: StatsTableProps) => {
  return (
    <>
      {entries.map((entry) => (
        <div className="stats-table-entry" key={`${entry.name}-${entry.value}`}>
          <div className="stats-table-text">{entry.name}</div>
          <div className="stats-table-text">{entry.value}</div>
        </div>
      ))}
    </>
  );
};
