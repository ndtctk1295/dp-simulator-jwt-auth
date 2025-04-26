"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
const desktopData = [
  { month: "Shopping", desktop: 186, fill: "var(--color-shopping)" },
  { month: "Investment", desktop: 190, fill: "var(--color-investment)" },
  { month: "Family", desktop: 237, fill: "var(--color-family)" },
  { month: "Savings", desktop: 173, fill: "var(--color-savings)" },
  { month: "Entertainment", desktop: 209, fill: "var(--color-entertainment)" },
  { month: "Others", desktop: 15, fill: "var(--color-others)" },
];

const mobileData = [
  { month: "Shopping", mobile: 80, fill: "var(--color-shopping)" },
  { month: "Investment", mobile: 200, fill: "var(--color-investment)" },
  { month: "Family", mobile: 120, fill: "var(--color-family)" },
  { month: "Savings", mobile: 170, fill: "var(--color-savings)" },
  { month: "Entertainment", mobile: 130, fill: "var(--color-entertainment)" },
  { month: "Others", mobile: 170, fill: "var(--color-others)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Thu",
  },
  mobile: {
    label: "Chi",
  },
  shopping: {
    label: "Shopping",
    color: "hsl(var(--chart-1))",
  },
  investment: {
    label: "Investment",
    color: "hsl(var(--chart-2))",
  },
  family: {
    label: "Family",
    color: "hsl(var(--chart-3))",
  },
  savings: {
    label: "Savings",
    color: "hsl(var(--chart-4))",
  },
  entertainment: {
    label: "Entertainment",
    color: "hsl(var(--chart-5))",
  },
  others: {
    label: "Others",
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig;

const expenseCategories = [
  { category: "Shopping", percentage: 30 },
  { category: "Investment", percentage: 20 },
  { category: "Family", percentage: 25 },
  { category: "Savings", percentage: 15 },
  { category: "Entertainment", percentage: 5 },
  { category: "Other", percentage: 5 },
];

export function PieChartComponents() {

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const renderPieSkeleton = () => {
    if (loading) {
      return (
        <div className="grid gap-4 md:gap-8">
          <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>Biểu đồ Thu/ Chi</CardTitle>
              <CardDescription>November 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <Skeleton className="mx-auto aspect-square rounded-full mb-4 max-h-[250px]" />
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
          <Card className="w-full" x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <CardTitle>Bảng</CardTitle>
              <CardDescription>Recent orders from your store.</CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </div>
      );
    }
    else return (
      <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Biểu đồ Thu/ Chi</CardTitle>
        <CardDescription>November 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelKey="visitors"
                  nameKey="month"
                  indicator="line"
                  labelFormatter={(_, payload) => {
                    return chartConfig[
                      payload?.[0].dataKey as keyof typeof chartConfig
                    ].label;
                  }}
                />
              }
            />
            <Pie data={desktopData} dataKey="desktop" outerRadius={60} />
            <Pie
              data={mobileData}
              dataKey="mobile"
              innerRadius={70}
              outerRadius={90}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <Link href={"/transaction-history"}>
          <Button>Tra cứu lịch sử giao dịch</Button>
        </Link>
      </CardFooter>
    </Card>
    )
  }
  return (
    <div className="grid gap-4 md:gap-8">
      {renderPieSkeleton()}
      <Card className="w-full" x-chunk="dashboard-05-chunk-3">
        <CardHeader className="px-7">
          <CardTitle>Bảng</CardTitle>
          <CardDescription>Recent orders from your store.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenseCategories.map((item) => (
                <TableRow key={item.category}>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.percentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
