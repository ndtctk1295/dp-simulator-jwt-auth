import {
  useConsentService,
  useNotiStore,
  useUserService
} from "@/app/_services";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserStore } from "@/app/store/use-user-store";
export default function NotificationButton() {
  const { notifications } = useNotiStore();
  const userService = useUserService();
  const consentService = useConsentService();
  const router = useRouter();
  const {currentUser} = useUserStore();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!currentUser) {
          // console.error("Failed to fetch current user");
          return;
        }
        const userId = currentUser.id;

        if (userId) {
          await consentService.getByStatus(userId);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleNotificationClick = (notification: any) => {
    router.push(`/${notification.target}`);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="relative">
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-white text-xs">
                {notifications.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4">
          <h4 className="text-lg font-bold mb-2">Thông báo</h4>
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">Không có thông báo mới.</p>
          ) : (
            <ul className="space-y-2">
              {notifications.map((notification) => (
                <li key={notification.id} className="text-sm">
                  <button
                    onClick={() => handleNotificationClick(notification)}
                    className="w-full text-left hover:bg-gray-100 p-2 rounded"
                  >
                    <p>{notification.message}</p>
                    <span className="text-xs text-gray-400">
                      {notification.time}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
}
