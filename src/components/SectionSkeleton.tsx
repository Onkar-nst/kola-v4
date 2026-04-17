const SectionSkeleton = () => {
  return (
    <div className="py-20 px-4 md:px-10 animate-pulse">
      <div className="max-w-[1100px] mx-auto space-y-6">

        {/* Title */}
        <div className="h-6 w-1/3 bg-black/[0.08] rounded" />

        {/* Subtitle */}
        <div className="h-4 w-1/2 bg-black/[0.06] rounded" />

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-40 bg-black/[0.06] rounded-xl" />
              <div className="h-4 w-3/4 bg-black/[0.06] rounded" />
              <div className="h-3 w-1/2 bg-black/[0.05] rounded" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SectionSkeleton;