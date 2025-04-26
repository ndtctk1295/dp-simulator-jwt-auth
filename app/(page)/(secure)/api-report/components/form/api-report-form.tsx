"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { REPORT_NAMES, ORGANIZATION_TYPES, API_GROUPS, API_TYPES, ORGANIZATION_CODES } from "@/app/constant/reportConstant"
import { Calendar } from "@/components/ui/calendar"
import { CustomCalendar } from "@/components/ui/custom-calendar"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ReportDialog } from "../dialog/report-dialog"

const FormSchema = z.object({
  reportName: z.string().min(1, { message: "Vui lòng chọn tên báo cáo" }),
  orgType: z.string().min(1, { message: "Vui lòng chọn loại tổ chức" }),
  apiGroup: z.string().min(1, { message: "Vui lòng chọn nhóm API" }),
  apiType: z.string().min(1, { message: "Vui lòng chọn loại API" }),
  orgCode: z.string().min(1, { message: "Vui lòng chọn mã tổ chức" }),
  fromDate: z.date({ required_error: "Vui lòng chọn từ ngày" }),
  toDate: z.date({ required_error: "Vui lòng chọn đến ngày" }).refine(
    (date) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return date <= today
    },
    {
      message: "Đến ngày không được lớn hơn ngày hiện tại",
    }
  ),
})
.refine((data) => data.fromDate <= data.toDate, {
  message: "Từ ngày không được lớn hơn đến ngày",
  path: ["toDate"],
});

export default function ApiReportForm() {
  const [showDialog, setShowDialog] = useState(false)
  const [apiGroupOptions, setApiGroupOptions] = useState<string[]>(Object.values(API_GROUPS));
  const [apiTypeOptions, setApiTypeOptions] = useState<string[]>();
  const currentDate = new Date();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      reportName: "",
      orgType: "",
      apiGroup: "",
      apiType: "",
      orgCode: "",
      fromDate: undefined,
      toDate: undefined,
    },
  })

  const handleReportNameChange = (value: string) => {
    form.setValue("reportName", value);
    if (value === REPORT_NAMES.AIS_SUMMARY) {
      form.setValue("apiGroup", API_GROUPS.AIS);
      setApiGroupOptions([API_GROUPS.AIS]);
      setApiTypeOptions(API_TYPES[API_GROUPS.AIS] || []); // Set API types for AIS
    } else if (value === REPORT_NAMES.PIS_SUMMARY) {
      form.setValue("apiGroup", API_GROUPS.PIS);
      setApiGroupOptions([API_GROUPS.PIS]);
      setApiTypeOptions(API_TYPES[API_GROUPS.PIS] || []); // Set API types for PIS
    } else if (value === REPORT_NAMES.DETAILED_API) {
      form.setValue("apiGroup", API_GROUPS.ALL);
      setApiGroupOptions(Object.values(API_GROUPS));
      setApiTypeOptions(API_TYPES[API_GROUPS.ALL] || []); // Set API types for ALL initially
    } else {
      form.setValue("apiGroup", "");
      setApiGroupOptions(Object.values(API_GROUPS));
      setApiTypeOptions([]);
    }
    form.setValue("apiType", "");
  }

  const handleApiGroupChange = (value: string) => {
    form.setValue("apiGroup", value);
    setApiTypeOptions(API_TYPES[value as keyof typeof API_TYPES] || []);
    form.setValue("apiType", ""); // Reset apiType when apiGroup changes
  }

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log('data :>> ', data);
    setShowDialog(true);
  }

  const minEndDate = form.watch("fromDate") || undefined;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-center mb-6">Tổng hợp báo cáo API</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="reportName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên báo cáo:</FormLabel>
                <Select value={field.value} onValueChange={(value) => {
                  field.onChange(value);
                  handleReportNameChange(value);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tên báo cáo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(REPORT_NAMES).map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orgType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại tổ chức:</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại tổ chức" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ORGANIZATION_TYPES).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apiGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhóm API:</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleApiGroupChange(value);
                  }}
                  disabled={form.watch("reportName") === REPORT_NAMES.AIS_SUMMARY || form.watch("reportName") === REPORT_NAMES.PIS_SUMMARY}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhóm API" />
                  </SelectTrigger>
                  <SelectContent>
                    {apiGroupOptions.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apiType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại API:</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại API" />
                  </SelectTrigger>
                  <SelectContent>
                    {apiTypeOptions && apiTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orgCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã tổ chức:</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn mã tổ chức" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORGANIZATION_CODES.map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fromDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Từ ngày:</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "dd/MM/yyyy") : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CustomCalendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      maxDate={currentDate}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="toDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đến ngày:</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "dd/MM/yyyy") : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CustomCalendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      minDate={minEndDate}
                      maxDate={currentDate}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="mt-8 flex justify-center">
        <Button onClick={() => form.handleSubmit(onSubmit)()}>Export</Button>
      </div>

      {showDialog && form.getValues("reportName") && form.getValues("fromDate") && form.getValues("toDate") && form.getValues("orgCode") && form.getValues("orgType") && (
        <ReportDialog
          reportType={form.getValues("reportName")}
          fromDate={form.getValues("fromDate")}
          toDate={form.getValues("toDate")}
          orgCode={form.getValues("orgCode")}
          orgType={form.getValues("orgType")}
          open={showDialog}
          onOpenChange={setShowDialog}
        />
      )}
    </div>
  )
}