import OverviewConsentComp from "@/app/(page)/(secure)/consent/components/OverviewConsent";
import { LoadingOverlay } from "@/app/_components/loading/LoadingComp";

export default function DashboardPage() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 ">
      <h1 className="text-2xl font-bold mb-4">Quản lý Consents</h1>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        <OverviewConsentComp />
      </div>
      <div></div>
      <LoadingOverlay/>
    </main>
  );
}
