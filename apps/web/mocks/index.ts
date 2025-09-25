async function initMocks() {
  if (typeof window !== "undefined") {
    if (process.env.NEXT_PUBLIC_MOCKING_ENABLED === "true") {
      const { worker } = await import("./browser");

      await worker.start({
        onUnhandledRequest: "bypass", // This will bypass unhandled requests
        serviceWorker: {
          url: "/mockServiceWorker.js",
        },
      });
    }
  }
}

initMocks();
