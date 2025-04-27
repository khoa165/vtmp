interface StatusCardProps {
  value: string;
  applicationStatus: string;
  color: string;
}

const StatusCard = ({ value, applicationStatus, color }: StatusCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center bg-card rounded-xl shadow-md p-4 min-w-[100px]">
      <span>{value}</span>
      <span>{applicationStatus}</span>
      <span>{color}</span>
    </div>
  );
};
export default StatusCard;
