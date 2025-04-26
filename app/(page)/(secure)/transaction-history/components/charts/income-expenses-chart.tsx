"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    name: "Jan",
    income: 2400,
    expenses: 1800,
  },
  {
    name: "Feb",
    income: 2800,
    expenses: 2100,
  },
  {
    name: "Mar",
    income: 3200,
    expenses: 2400,
  },
  {
    name: "Apr",
    income: 3600,
    expenses: 2700,
  },
  {
    name: "May",
    income: 3200,
    expenses: 2400,
  },
  {
    name: "Jun",
    income: 3600,
    expenses: 2700,
  },
]

export function IncomeExpensesChart() {
  return (
    <ChartContainer
      config={{
        income: {
          label: "Income",
          color: "hsl(var(--chart-1))",
        },
        expenses: {
          label: "Expenses",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={20}  >
          <XAxis dataKey="name" tick={{ fontSize: 12 }} tickMargin={5} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="income" fill="var(--color-income)" radius={[2, 2, 0, 0]} />
          <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

