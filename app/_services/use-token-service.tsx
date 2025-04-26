import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
export function useTokenService(): ITokenService {
  let { token } = tokenStore();
  return {
    getToken: () => token,
    fetchAccessToken: async () => {
      const baseUrl = process.env.DP_BASE_URL || "https://localhost:3999";
      const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
      const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
      const scope = process.env.NEXT_PUBLIC_ALL_SCOPE;

      const requestDateTime = new Date().toISOString().split(".")[0] + "Z";
      const headers = {
        "Request-DateTime": requestDateTime,
        "Request-ID": uuidv4(),
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        "Content-Type": "application/json",
      };
      try {
        const response = await axios({
          method: "POST",
          url: `${baseUrl}/ob/v1/oauth2/token`,
          data: {
            grant_type: "client_credentials",
            scope: scope,
          },
          headers,
        });

        return response.data.access_token;
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    },
  };
}
interface ITokenStore {
  token: string;
  setToken: (newToken: string) => void;
}

export const tokenStore = create<ITokenStore>((set) => ({
  token: "",
  setToken: (newToken) => set({ token: newToken }),
}));

export interface ITokenService {
  getToken: () => string;
  fetchAccessToken: () => Promise<void>;
}
