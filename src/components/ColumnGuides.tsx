const ColumnGuides = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] flex justify-center">
      <div className="w-full max-w-[1080px] h-full flex">
        <div className="flex-1 border-l border-border/60" />
        <div className="flex-1 border-l border-r border-border/60" />
      </div>
    </div>
  );
};

export default ColumnGuides;
