import {
  useConsentService,
} from "@/app/_services/use-consents-service";
import { useTransactionService } from "@/app/_services/use-transactions-service";
import { CONSENT_STATUS, PAYMENT_STATUS } from "@/app/constant/constant";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
// TODO: finish form data to ready for submit

const consentFormSchema = z.object({
  id: z.string(),
  psuId: z.string(),
  apiAccess: z.string(),
  selectedAccounts: z.array(z.string()),
  dpTransactionId: z.string(),
  paymentStatus: z.string(),
  orderId: z.string(),
  approvalAccounts: z.array(z.string()),
  created: z.date(),
  updated: z.date(),
  tppId: z.string(),
  permissions: z.string(),
  period: z.number(),
  psuType: z.string(),
  status: z.string(),
});
type ConsentFormValues = z.infer<typeof consentFormSchema>;
export default function ApprovePartnerModal({
  isOpen,
  setIsOpen,
  consentData,
  accountsData = [],
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  consentData: IConsent;
  accountsData: IAccount[];
}) {
  const form = useForm<ConsentFormValues>();
  const consentService = useConsentService();
  const transactionService = useTransactionService();
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  useEffect(() => {
    if (consentData?.status) {
      let selectedAccounts = [];

      if (consentData.psuType === "ACCOUNT_NO" && consentData.psuId) {
        selectedAccounts.push(consentData.psuId);
      }

      if (consentData.status === CONSENT_STATUS.AUTHORIZED) {
        selectedAccounts = consentData.approvalAccounts;
      }
      setSelectedAccounts(selectedAccounts);

      form.reset({
        id: consentData.id || "",
        psuId: consentData.tppId || "",
        permissions: consentData.permissions,
        apiAccess: consentData.permissions.includes("PAYMENT") ? "PIS" : "AIS",
        period: consentData.period || 0,
        selectedAccounts,
      });
    } else {
      setSelectedAccounts([]);
    }
  }, [consentData, form]);

  const handleAccountSelection = (accountNo: string) => {
    const updatedAccounts = selectedAccounts.includes(accountNo)
      ? selectedAccounts.filter((id) => id !== accountNo)
      : [...selectedAccounts, accountNo];
    setSelectedAccounts(updatedAccounts);
    form.setValue("selectedAccounts", updatedAccounts);
  };

  const onSubmit = async (value: ConsentFormValues) => {
    let updateConsentData: any = {
      consentStatus: CONSENT_STATUS.AUTHORIZED,
      dpTransactionId: consentData.dpTransactionId,
    };

    let consentId = "";

    if (consentData.dpTransactionId) {
      const transactions = await transactionService.findByDpTransactionId(
        consentData.dpTransactionId
      );
      consentId = transactions.orderId;
    }

    if (value.apiAccess === "AIS") {
      updateConsentData.accounts = value.selectedAccounts;
      updateConsentData.consentId = consentData.id;
    } else {
      updateConsentData.orderId = consentId;
      updateConsentData.paymentStatus = PAYMENT_STATUS.ACSP;
    }

    if (consentData.status === "AWAITING_AUTH") {
      consentService.approveConsent(updateConsentData, consentData.id);
    } else {
      consentService.revokeConsent(consentData.id);
    }

    setIsOpen(false);
  };

  const handleCancel = () => {
    form.reset({ selectedAccounts: [] });
    setIsOpen(false);
  };
  const renderAccountTypeLabel = (type: string) => {
    switch (type) {
      case "TRAN":
        return "Tài khoản giao dịch";
      case "SVGS":
        return "Tài khoản tiết kiệm";
      case "LOAN":
        return "Tài khoản vay";
      case "CARD":
        return "Tài khoản tín dụng";
      default:
        return type;
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>
            {consentData.status === "AWAITING_AUTH"
              ? "Approve Consent"
              : consentData.status === "AUTHORIZED"
              ? "Revoke Consent"
              : "Consent Details"}
          </DialogTitle>
          <DialogDescription>
            {consentData.status === "AWAITING_AUTH"
              ? "You are about to approve this consent."
              : consentData.status === "AUTHORIZED"
              ? "You are about to revoke this consent."
              : "No further actions available."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem hidden>
                  <FormLabel>ConsentId</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className={`focus-visible:ring-0`}
                      readOnly
                      // defaultValue={consentData.id}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your third party Provider display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="psuId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Third Party Provider Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className={`focus-visible:ring-0`}
                      readOnly
                    />
                  </FormControl>
                  <FormDescription>
                    This is your third party Provider display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiAccess"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Access</FormLabel>
                  <FormControl>
                    {consentData.status === "AUTHORIZED" ? (
                      consentData.permissions.includes("PAYMENT") ? (
                        <Input
                          {...field}
                          readOnly
                          className="focus-visible:ring-0 cursor-not-allowed"
                        />
                      ) : (
                        <Input
                          {...field}
                          value="AIS"
                          readOnly
                          className="focus-visible:ring-0 cursor-not-allowed"
                        />
                      )
                    ) : consentData.status === "AWAITING_AUTH" ? (
                      <Input
                        {...field}
                        readOnly
                        className="focus-visible:ring-0"
                      />
                    ) : null}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permission</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className={`focus-visible:ring-0`}
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="selectedAccounts"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Danh sách tài khoản...</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      className="flex flex-col space-y-1"
                    >
                      <div className="grid gap-4 ">
                        <div className="grid grid-cols-2 gap-4">
                          {accountsData.map(
                            (account: { accountNo: string; type: string }) => (
                              <>
                                <div
                                  key={account.accountNo}
                                  className="flex flex-row flex-wrap items-center space-x-2 space-y-2"
                                >
                                  <Checkbox
                                    className={`mr-2 disabled:!opacity-100 ${
                                      consentData.status === "AUTHORIZED"
                                        ? "disabled:!cursor-default"
                                        : ""
                                    }`}
                                    disabled={
                                      consentData.status === "AUTHORIZED" || consentData.status === "REVOKE"
                                    }
                                    checked={selectedAccounts.includes(
                                      account.accountNo
                                    )}
                                    onCheckedChange={() =>
                                      handleAccountSelection(account.accountNo)
                                    }
                                  />
                                  {renderAccountTypeLabel(account.type)}
                                  <i className="text-sm w-full md:pl-4">
                                    {account.accountNo}
                                  </i>
                                </div>
                              </>
                            )
                          )}
                        </div>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 ">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <div className="relative w-max">
                        <FormControl>
                          <Input
                            {...field}
                            readOnly
                            className="focus-visible:ring-0 cursor-not-allowed"
                          />
                        </FormControl>
                        {/* <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 opacity-50" /> */}
                      </div>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" type="button" onClick={handleCancel}>
                Hủy
              </Button>
              {(consentData.status === "AWAITING_AUTH" ||
                consentData.status === "AUTHORIZED") && (
                <Button
                  variant={
                    consentData.status === "AWAITING_AUTH"
                      ? "default"
                      : "destructive"
                  }
                  disabled={
                    consentData.status === "AWAITING_AUTH" &&
                    selectedAccounts.length === 0
                  }
                  type="submit"
                >
                  {consentData.status === "AWAITING_AUTH"
                    ? "Approve Consent"
                    : "Revoke Consent"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
