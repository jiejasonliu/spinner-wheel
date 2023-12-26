import './loading.scss';

interface LoadingProps {
  className?: string;
  size?: "small" | "medium" | "large";
}

export const Loading = ({ className = "", size = "small" }: LoadingProps) => {
  return (
    <div className={`c-loading ${size} ${className}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};
