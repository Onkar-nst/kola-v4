// <spline-viewer> is a custom element registered by the script loaded in
// index.html, so TypeScript needs to be told it exists in JSX.
declare namespace JSX {
  interface IntrinsicElements {
    "spline-viewer": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      url: string;
      "loading-anim-type"?: string;
    };
  }
}
