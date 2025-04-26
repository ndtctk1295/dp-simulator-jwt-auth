"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PromotionalProgramsComponents } from "@/app/(page)/(secure)/dashboard/components/PromotionBanner";
import { useUserService } from "@/app/_services";
import { useTransactionService } from "@/app/_services/use-transactions-service";
import { useAccountService } from "@/app/_services/use-accounts-service";
import { useHomepageStore } from "@/app/store/use-homepage-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@radix-ui/react-progress";
import { Eye, EyeOff } from "lucide-react";
import { useEffect } from "react";
import { set } from "mongoose";
import prepareAccountsForDisplay from "@/lib/accountDisplayHelper";
import { IPreparedAccount } from "@/lib/accountDisplayHelper";
import { useAccountStore } from "@/app/store/use-account-store";
import { useTransactionStore } from "@/app/store/use-transaction-store";
import { useUserStore } from "@/app/store/use-user-store";
import useLoadingStore from "@/app/store/LoadingStore";
export default function OverviewHomepageComp() {
  const {currentUser} = useUserStore();
  const {accounts} = useAccountStore();
  const accountService = useAccountService();
  const transactionService = useTransactionService();
  const {transactions} = useTransactionStore();
  const { isShowBalance, setShowBalance } = useHomepageStore();
  const preparedAccounts = useMemo(() => prepareAccountsForDisplay(accounts), [accounts])
  // SKELETON MOCK START
  const [loading, setLoading] = useState(true);
  const renderSkeleton = () => {
    if (loading) {
      return (
        <>
          <Card key="skeleton-1" x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24 bg-gray-700" />
              <Skeleton className="h-8 w-36 bg-gray-700" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-24 bg-gray-700" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-4 w-full bg-gray-700" />
            </CardFooter>
          </Card>
          <Card key="skeleton-2" x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24 bg-gray-700" />
              <Skeleton className="h-8 w-36 bg-gray-700" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-24 bg-gray-700" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-4 w-full bg-gray-700" />
            </CardFooter>
          </Card>
        </>
      );
    } else {
      return (
        <>
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-4xl">$1,329</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +25% from last week
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={25} aria-label="25% increase" />
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-4xl">$5,329</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +10% from last month
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={12} aria-label="12% increase" />
            </CardFooter>
          </Card>
        </>
      );
    }
  };
  // SKELETON MOCK END
  useEffect(() => {
    const fetchData = async () => {
      // console.log("currentuser:", currentUser);
      try {
        const userId = currentUser?.id;
        if (userId) {
          setLoading(true); // Start loading
  
          // Use Promise.all to fetch accounts and transactions simultaneously
          await Promise.all([
            accountService.getByUserId(userId),
            transactionService.getByUserId(userId),
            setLoading(false) // Stop loading after data is fetched
          ]);
  
          // console.log("Accounts Data:", accounts);
          // console.log("Transactions Data:", transactions);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // setLoading(false); // Stop loading after data is fetched
      }
    };
  
    fetchData();
  }, [currentUser]);
  

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            Tổng quan tài khoản
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowBalance(!isShowBalance);
            }}
            aria-label={isShowBalance ? "Ẩn số dư" : "Hiện số dư"}
          >
            {isShowBalance ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </Button>
        </CardHeader>
        <CardContent className="w-full">
          {
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {preparedAccounts && preparedAccounts.length > 0 ? (
                preparedAccounts
                  .filter((acc) => acc.type !== "TRAN")
                  .map((acc, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-secondary rounded-lg"
                    >
                      {acc.icon && (
                        <acc.icon className="h-6 w-6 text-primary" />
                      )}
                      <div>
                        <p className="font-medium">{acc.accountLabel}</p>
                        <p className="text-sm">
                          {isShowBalance
                            ? acc.currency === "VND"
                              ? `${acc.availableBalance} VND`
                              : acc.currency === "USD"
                              ? `${acc.availableBalance} $`
                              : `${acc.availableBalance} ${acc.currency}`
                            : "••••••••••"}
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-secondary rounded-lg"
                    >
                      <Skeleton className="h-6 w-6 rounded-lg bg-gray-700" />
                      <div className="h-full space-y-2">
                        <div className="font-medium">
                          <Skeleton className="w-36 h-4 bg-gray-700" />
                        </div>
                        <div className="text-sm">
                          <Skeleton className="w-36 h-4 bg-gray-700" />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          }
          <div className="bg-primary/10 p-4 rounded-lg max-w-md mr-auto">
            {preparedAccounts.filter((acc) => acc.type === "TRAN").length === 0 ? (
              <>
                <Skeleton className="w-48 h-6 bg-gray-700" />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-sm text-muted-foreground">
                    Số dư hiện tại
                  </div>
                  <div className="text-xl font-bold">
                    <Skeleton className="w-24 sm:w-36 h-4 bg-gray-700" />
                  </div>
                </div>
              </>
            ) : (
              preparedAccounts
                .filter((acc) => acc.type === "TRAN")
                .map((acc) => (
                  <>
                    <h3 className="font-semibold mb-2">{acc.accountLabel}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Số dư hiện tại
                      </p>
                      <p className="text-xl font-bold">
                        {isShowBalance
                          ? acc.currency === "VND"
                            ? `${acc.availableBalance} VND`
                            : acc.currency === "USD"
                            ? `${acc.availableBalance} $`
                            : `${acc.availableBalance} ${acc.currency}`
                          : "••••••••••"}
                      </p>
                    </div>
                  </>
                ))
            )}
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
          <CardHeader className="pb-3">
            <CardTitle>Lịch sử giao dịch</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {Array.isArray(transactions) && transactions.length > 0 ? (
                transactions
                  .slice(0, 3) // Limit to the first 3 transactions
                  .map((trans, index) => (
                    <li key={index} className={`flex justify-between`}>
                      <div>
                        <p className="font-medium">
                          Chuyển tiền cho {trans.relatedParties.creditor.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(trans.commitDate).toLocaleDateString()}
                        </p>
                      </div>
                      <p
                        className={`font-bold text-sm text-red-600`}
                      >
                        -
                        {trans.instructedAmount.value.toLocaleString()}
                        {trans.instructedAmount.currency === "USD" ? " $" : " VND"}
                      </p>
                    </li>
                  ))
              ) : (
                <>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <li key={index} className="flex justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-36 bg-gray-700" />
                        <Skeleton className="h-6 w-24 bg-gray-700" />
                      </div>
                      <div>
                        <Skeleton className="h-8 w-24 bg-gray-700" />
                      </div>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </CardContent>
          <CardFooter>
            <Link href={"/transaction-history"}>
              <Button>Tra cứu lịch sử giao dịch</Button>
            </Link>
          </CardFooter>
        </Card>
        {renderSkeleton()}
      </div>
      <PromotionalProgramsComponents />
    </div>
  );
}
