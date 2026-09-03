const SectionDivider = () => {
  // Runs the full width of the viewport rather than stopping at the 1080
  // column, so it reads as a rule across the page and crosses the guides.
  return <hr className="border-t border-border w-full" />;
};

export default SectionDivider;
