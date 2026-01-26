import axios, { isAxiosError } from "axios";
import { toast } from "sonner";

const serverUrl =
  process.env.NEXT_PUBLIC_SERVER_URL || "https://server.eazika.com";

const axiosInstance = axios.create({
  baseURL: `${serverUrl}/api/v2`,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

async function getToken(tokenName: string): Promise<string | null> {
  try {
    return (
      (await cookieStore.get(tokenName))?.value ||
      (await localStorage.getItem(tokenName))
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error getting token:", error.message);
    }
    return null;
  }
}
/* =============== Request Interceptor =============== */
axiosInstance.interceptors.request.use(
  async (config) => {
    config.withCredentials = true; // Ensure cookies are sent with requests
    return config;
  },
  (error) => Promise.reject(error),
);

/* ============== Response Interceptor =============== */
axiosInstance.interceptors.response.use(
  // (response) => {
  // const setCookieHeader = response.headers["set-cookie"];
  // console.log("Set-Cookie Header:", setCookieHeader);
  // if (setCookieHeader)
  //   setCookieHeader.forEach((cookie: string) => (document.cookie = cookie));
  //   return response;
  // },
  (response) => response,

  async (error) => {
    if (isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const message = [
        "Access token is required",
        "Invalid or expired access token",
      ];

      if (status === 401 && message.includes(data.message)) {
        try {
          await axiosInstance.post("/auth/refresh-tokens");
          window.location.reload();
          return Promise.resolve();
        } catch (error) {
          if (isAxiosError(error)) {
            toast.error("Session expired. Please log in again.");
            localStorage.clear();
          }
          return Promise.reject(error);
        }
      }
    }
    {
      // toast.error(error.response.data.message);
      return Promise.reject(error);
    }
  },
);

export default axiosInstance;
export { isAxiosError, getToken };
