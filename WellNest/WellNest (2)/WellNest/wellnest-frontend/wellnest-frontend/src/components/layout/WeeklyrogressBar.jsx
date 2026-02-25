export default function WeeklyProgressBar({ progress }) {
  return (
    <div className="progress-container">
      <div
        className="progress-bar"
        style={{ width: `${progress}%` }}
      ></div>
      <span>{Math.round(progress)}%</span>
    </div>
  );
}
