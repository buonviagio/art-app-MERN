const baseURL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_LOCAL_HOST
    : import.meta.env.VITE_SERVER_URL;

export { baseURL };