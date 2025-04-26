"use client";

import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { formatISO } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/app/_components/icons";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { CustomCalendar } from "@/components/ui/custom-calendar";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { useParticipantService } from "@/app/_services/use-participants-service";
const formSchema = z
  .object({
    participantId: z
      .string()
      .min(3, "Mã định danh phải có ít nhất 3 ký tự")
      .regex(/^[A-Za-z0-9]+$/, "Mã định danh chỉ chứa chữ và số"),
    dpTppId: z
      .string()
      .min(3, "Mã DP/TPP phải có ít nhất 3 ký tự")
      .regex(/^[A-Za-z0-9]+$/, "Mã DP/TPP chỉ chứa chữ và số"),
    shortName: z
      .string()
      .min(2, "Tên viết tắt phải có ít nhất 2 ký tự")
      .regex(/^[A-Za-z0-9\s]+$/, "Tên viết tắt chỉ chứa chữ và số"),
    fullName: z
      .string()
      .min(5, "Tên đầy đủ phải có ít nhất 5 ký tự")
      .regex(/^[A-Za-z0-9\s]+$/, "Tên đầy đủ chỉ chứa chữ và số"),
    role: z.enum(["TPP", "DP"], { required_error: "Vui lòng chọn vai trò" }),
    status: z.enum(
      ["PENDING", "REJECTED", "ACCEPTED", "AUTHORISED", "WITHDRAWN"],
      { required_error: "Vui lòng chọn trạng thái" }
    ),
    email: z.string().email("Email không hợp lệ"),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, "Số điện thoại không hợp lệ"),
      logo: z.union([z.literal(""), z.string().url("URL logo không hợp lệ")]),
      scopes: z.string().min(1, "Vui lòng chọn ít nhất một scope"),
    joinDate: z.date({
      required_error: "Vui lòng chọn ngày tham gia",
    }),
    activeDate: z.date({
      required_error: "Vui lòng chọn ngày hoạt động",
    }),
    endDate: z.date({
      required_error: "Vui lòng chọn ngày kết thúc",
    }),
    // ... rest of fields ...
  })
  .refine((data) => {
    if (data.activeDate && data.joinDate) {
      return data.activeDate >= data.joinDate;
    }
    return true;
  }, {
    message: "Ngày hoạt động phải sau ngày tham gia",
    path: ["activeDate"],
  })
  .refine((data) => {
    if (data.endDate) {
      const comparisonDate = data.activeDate || data.joinDate;
      return comparisonDate ? data.endDate >= comparisonDate : true;
    }
    return true;
  }, {
    message: "Ngày kết thúc phải sau ngày hoạt động hoặc ngày tham gia",
    path: ["endDate"],
  });

type ParticipantFormValues = z.infer<typeof formSchema>;

interface RegisterParticipantFormProps {
  onClose?: () => void;
}

export const ParticipantRegisterForm: React.FC<RegisterParticipantFormProps> = ({onClose}) => {
  const participationService = useParticipantService();
  const form = useForm<ParticipantFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      participantId: "",
      dpTppId: "",
      shortName: "",
      fullName: "",
      role: undefined,
      status: undefined,
      joinDate: undefined,
      activeDate: undefined,
      endDate: undefined,
      email: "",
      phone: "",
      logo: "",
      scopes:  "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: ParticipantFormValues) => {
    console.log('data', data);
    participationService.addNewParticipant(data);
    onClose && onClose();
  };

  const joinDate = form.watch('joinDate');
  const activeDate = form.watch('activeDate');

  const renderDatePicker = (
    name: 'joinDate' | 'activeDate' | 'endDate',
    label: string
  ) => {
    let minDate: Date | undefined
    const maxDate = new Date()
  
    if (name === 'activeDate' && joinDate) {
        minDate = new Date(joinDate)
        minDate.setHours(0, 0, 0, 0)
      } else if (name === 'endDate') {
        const baseDate = activeDate || joinDate
        if (baseDate) {
          minDate = new Date(baseDate)
          minDate.setHours(0, 0, 0, 0)
        }
      }
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className="pl-3 text-left font-normal w-full justify-start"
                  >
                    {field.value ? (
                      format(field.value, 'dd/MM/yyyy')
                    ) : (
                      <span>Chọn ngày</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="bg-background rounded-lg border">
                    <CustomCalendar
                    mode="single"
                    selected={field.value || undefined}
                    onSelect={(date) => {
                        if (date) {
                        const adjustedDate = new Date(date)
                        adjustedDate.setHours(0, 0, 0, 0)
                        field.onChange(adjustedDate)
                        }
                    }}
                    minDate={minDate}
                    maxDate={maxDate}
                    />
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const scopeOptions = [
    { value: "ob.oauth2.token", label: "OAuth Token" },
    { value: "ob.providers", label: "Get Providers" },
    { value: "ob.decoupled.v1.auth-request", label: "Decouple Auth Request" },
    { value: "ob.decoupled.v1.auth-status.*", label: "Decouple Get Auth Status" },
    { value: "ob.decoupled.v1.auth-revoke", label: "Decouple Auth Revoke" },
    { value: "ob.decoupled.v1.update-consent", label: "Decouple Update Consent" },
    { value: "ob.ais.v1.accounts", label: "AIS Get All Accounts" },
    { value: "ob.ais.v1.accounts.information", label: "AIS Get Account Information" },
    { value: "ob.ais.v1.accounts.balances", label: "AIS Get Account Balances" },
    { value: "ob.ais.v1.accounts.transactions", label: "AIS Get Account Transactions" },
    { value: "ob.pis.v1.payments", label: "PIS Payments" },
    { value: "ob.pis.v1.payments.submit", label: "PIS Payments Submit" },
    { value: "ob.pis.v1.payments.cancel", label: "PIS Payments Cancel" },
    { value: "ob.pis.v1.payments.status.*", label: "PIS Payments Status" },
  ];

  const ScopeSelection = () => {
    const { control, setValue, watch } = useFormContext<ParticipantFormValues>();
    const scopesValue = watch("scopes") || "";
    
    // Determine selected state
    const isAllSelected = scopesValue === "all_scopes";
    const selectedScopes = isAllSelected 
      ? scopeOptions.map(opt => opt.value)
      : scopesValue.split(', ').filter(Boolean);
  
    const toggleAllScopes = () => {
      setValue("scopes", isAllSelected ? "" : "all_scopes");
    };
  
    const handleScopeChange = (scopeValue: string, checked: boolean) => {
      let currentScopes = isAllSelected 
        ? scopeOptions.map(opt => opt.value)
        : scopesValue.split(', ').filter(Boolean);
  
      if (checked) {
        if (!currentScopes.includes(scopeValue)) {
          currentScopes.push(scopeValue);
        }
      } else {
        currentScopes = currentScopes.filter(v => v !== scopeValue);
      }
  
      // Update the form value
      if (currentScopes.length === scopeOptions.length) {
        setValue("scopes", "all_scopes");
      } else {
        setValue("scopes", currentScopes.join(', '));
      }
    };
  
    return (
      <FormField
        control={control}
        name="scopes"
        render={({ field }) => (
          <FormItem className="md:col-span-4">
            <FormLabel>Scopes</FormLabel>
            <div className="space-y-3">
              {/* Select All checkbox */}
              <div className="flex items-center space-x-2 pb-2">
                <Checkbox
                  id="select-all"
                  checked={isAllSelected}
                  onCheckedChange={toggleAllScopes}
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Select All
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {scopeOptions.map((option) => (
                  <FormItem key={option.value} className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={isAllSelected || selectedScopes.includes(option.value)}
                        onCheckedChange={(checked) => 
                          handleScopeChange(option.value, checked as boolean)
                        }
                      />
                    </FormControl>
                    <FormLabel className="font-normal text-sm">
                      {option.label}
                    </FormLabel>
                  </FormItem>
                ))}
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };
  

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-6xl"
        >
          {" "}
          {/* Changed to max-w-4xl */}
            <CardHeader>
              <CardTitle className="text-2xl">Đăng ký Thành viên Mới</CardTitle>
              <CardDescription>
                Vui lòng điền đầy đủ thông tin bên dưới để đăng ký thành viên
                mới
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {" "}
                {/* Changed to 3 columns on large screens */}
                {/* Participant ID */}
                <FormField
                  control={form.control}
                  name="participantId"
                  render={({ field }) => (
                    <FormItem className="space-y-2 md:col-span-2">
                      <FormLabel>Mã định danh</FormLabel>
                      <FormControl>
                        <Input placeholder="NAPAS-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* DP/TPP ID */}
                <FormField
                  control={form.control}
                  name="dpTppId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Mã DP/TPP</FormLabel>
                      <FormControl>
                        <Input placeholder="DP-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Short Name */}
                <FormField
                  control={form.control}
                  name="shortName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Tên viết tắt</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="space-y-2 md:col-span-3">
                      {" "}
                      {/* Span 2 columns on medium screens */}
                      <FormLabel>Tên đầy đủ</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Role Selection */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Vai trò</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn vai trò" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TPP">TPP</SelectItem>
                          <SelectItem value="DP">DP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Status Selection */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Trạng thái</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            "PENDING",
                            "REJECTED",
                            "ACCEPTED",
                            "AUTHORISED",
                            "WITHDRAWN",
                          ].map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {renderDatePicker("joinDate", "Ngày tham gia")}
                {renderDatePicker("activeDate", "Ngày hoạt động")}
                {renderDatePicker("endDate", "Ngày kết thúc")}
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2 md:col-span-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contact@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="+84123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Logo URL */}
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem className="space-y-2 md:col-span-3">
                      {" "}
                      {/* Span 2 columns on medium screens */}
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                        //   disabled={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <ScopeSelection />
              </div>

              <div className="md:col-span-4 pt-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Đăng ký Thành viên
                  </Button>
                </div>
            </CardContent>
 
        </form>
      </Form>
    </div>
  );
}
