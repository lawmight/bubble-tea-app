export function SkipNav(): JSX.Element {
  return (
    <a
      href="#main-content"
      className="sr-only z-50 rounded-md bg-white px-4 py-2 text-sm font-medium text-[#245741] focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#245741]"
    >
      Skip to main content
    </a>
  );
}
