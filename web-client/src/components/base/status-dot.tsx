export const StatusDot = <T extends string>({
  status,
  colorMapping,
}: {
  status: T;
  colorMapping: Record<T, string>;
}) => {
  const color = colorMapping[status];
  return (
    <div
      className={`w-[1rem] h-[1rem] rounded-full ${color} max-lg:w-[0.7rem] max-lg:h-[0.7rem]`}
    />
  );
};
