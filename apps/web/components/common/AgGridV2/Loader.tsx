export const Loader = () => {
  return (
    <div className="ag-overlay-loading-center" role="presentation">
      <div
        role="presentation"
        className="custom-loading-overlay"
        style={{
          background:
            "url(https://www.ag-grid.com/images/ag-grid-loading-spinner.svg) center / contain no-repeat",
          height: 100,
          margin: "0 auto",
          width: 100,
        }}
      ></div>

      <div aria-live="polite" aria-atomic="true">
        One moment please...
      </div>
    </div>
  );
};

Loader.displayName = "Loader";
