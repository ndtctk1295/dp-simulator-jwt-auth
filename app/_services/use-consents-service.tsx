import { useConsentStore, IFilterConsent } from "@/app/store/use-consent-store";
import { toast } from "react-hot-toast";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useFetch } from "@/app/_helpers/client";
import { tokenStore, useTokenService } from "./use-token-service";
import { CONSENT_STATUS } from "@/app/constant/constant";
import { useNotiStore } from "@/app/store/use-noti-store";

export function useConsentService(): IConsentService {
  const customFetch = useFetch();
  const tokenService = useTokenService();
  const { setNotifications } = useNotiStore();
  const { setConsents, consents } = useConsentStore();

  const timeAgo = (createdDate: any) => {
    const now = new Date();
    const createdDateObj = new Date(createdDate);
    const diffInSeconds = Math.floor((now.getTime() - createdDateObj.getTime()) / 1000);
    const intervals = [
      { label: "second", duration: 60 },
      { label: "minute", duration: 60 },
      { label: "hour", duration: 24 },
      { label: "day", duration: 30 },
      { label: "month", duration: 12 },
      { label: "year", duration: Infinity },
    ];
    let time = diffInSeconds;
    for (let i = 0; i < intervals.length; i++) {
      const { label, duration } = intervals[i];
      const result = Math.floor(time / duration);
      if (result >= 1) {
        if (i === 0) return `${result} ${label}${result > 1 ? "s" : ""} ago`;
        time = result;
      }
    }
    return `${time} year${time > 1 ? "s" : ""} ago`;
  };

  return {
    getByUserId: async (userId: string) => {
      try {
        const consents = await customFetch.get(`/api/consents/${userId}`);
        setConsents(consents);
      } catch (error) {
        console.error("Error fetching consents:", error);
        toast.error("Failed to fetch consents");
      }
    },
    getByStatus: async (userId: string) => {
      try {
        const consentNoti = await customFetch.get(`/api/consents/${userId}`);
        const notification = consentNoti
          .filter((consent: any) => consent.status === CONSENT_STATUS.AWAITING_AUTH)
          .map((consent: any) => ({
            id: consent.id,
            message: "You have a new consent waiting to be approved!",
            details: "Approve new consent request from partner.",
            time: timeAgo(consent.created),
            target: "consent",
          }));
        setNotifications(notification);
      } catch (error) {
        console.error("Error fetching consents:", error);
        toast.error("Failed to fetch consents");
      }
    },
    revokeConsent: async (consentId: string) => {
      try {
        await customFetch.put(`/api/consents/${consentId}`, {
          status: CONSENT_STATUS.REVOKE,
        });
        const updatedConsents = consents.map((consent) =>
          consent.id === consentId ? { ...consent, status: "REVOKE" } : consent
        );
        setConsents(updatedConsents);
        toast.success("Consent revoked successfully");
      } catch (error) {
        console.error("Error revoking consent:", error);
        toast.error("Failed to revoke consent");
      }
    },
    approveConsent: async (updateConsentData, consentId) => {
      try {
        const token = await tokenService.fetchAccessToken();
        const baseUrl = process.env.DP_BASE_URL || "https://localhost:3999";
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Request-DateTime": new Date().toISOString().split(".")[0] + "Z",
          "Request-ID": uuidv4(),
          "Provider-ID": "BANK01",
        };

        await axios({
          method: "POST",
          url: `${baseUrl}/ob/decoupled/v1/update-consent`,
          data: updateConsentData,
          headers,
        });

        await customFetch.put(`/api/consents/${consentId}`, {
          status: CONSENT_STATUS.AUTHORIZED,
        });

        const updatedConsents = consents.map((consent) =>
          consent.id === consentId
            ? { ...consent, status: CONSENT_STATUS.AUTHORIZED }
            : consent
        );
        setConsents(updatedConsents);
        toast.success("Consent approved successfully");
      } catch (error) {
        console.error("Error approving consent:", error);
        toast.error("Failed to approve consent");
      }
    },
    getFilteredConsents: async (userId: string, filters: IFilterConsent) => {
      try {
        const response = await customFetch.post(`/api/consents`, {
          userId,
          filters
        });
        console.log("Filtered response", response);
        setConsents(response);
      } catch (error) {
        console.error("Error fetching filtered consents:", error);
        toast.error("Failed to fetch filtered consents");
      }
    },
  };
}

interface IConsentService {
  getByUserId: (userId: string) => Promise<void>;
  getByStatus: (userId: string) => Promise<void>;
  revokeConsent: (consentId: string) => Promise<void>;
  approveConsent: (updateConsentData: IUpdateConsent, consentId: string) => Promise<void>;
  getFilteredConsents: (userId: string, filters: IFilterConsent) => Promise<void>;
}

export interface IUpdateConsent {
  consentStatus: string;
  dpTransactionId: string;
  accounts: string[];
  consentId: string;
}
