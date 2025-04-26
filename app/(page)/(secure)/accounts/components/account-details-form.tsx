'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAccountService } from '@/app/_services/use-accounts-service'

const accountFormSchema = z.object({
    accountNo: z.string().min(10, 'Account number must be at least 10 characters.'),
    accountName: z.string().min(2, 'Account name is required.'),
    availableBalance: z.coerce.number().min(0, 'Balance cannot be negative.'),
    currency: z.string().min(2, 'Currency is required.'),
    isActive: z.boolean(),
    type: z.string(),
    status: z.string(),
    openDate: z.date(),
    accountLabel: z.string(),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

interface AccountDetailsFormProps {
    defaultValues?: AccountFormValues;
}

export const AccountDetailsForm: React.FC<AccountDetailsFormProps> = ({ defaultValues }) => {
    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues: defaultValues || {
            accountName: '',
            accountNo: '',
            availableBalance: 0,
            currency: '',
            type: '',
            isActive: false,
            status: 'inactive',
            openDate: new Date(),
            accountLabel: '',
        }
    });

    return (
        <Form {...form} >
            <form className='space-y-4'>
                <FormField control={form.control} name="accountNo" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Số Tài Khoản</FormLabel>
                        <FormControl><Input readOnly {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="accountLabel" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Loại Tài Khoản</FormLabel>
                        <FormControl><Input readOnly {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="availableBalance" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Số Dư</FormLabel>
                        <FormControl><Input readOnly {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="currency" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Đơn Vị Tiền Tệ</FormLabel>
                        <FormControl><Input readOnly {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tình Trạng Tài Khoản</FormLabel>
                        <FormControl><Input readOnly className='uppercase' {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="openDate" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ngày Mở Tài Khoản</FormLabel>
                        <FormControl><Input readOnly value={field.value.toLocaleString().slice(0,10)} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                {/* <Button className='mt-4' type="submit">Đóng</Button> */}
            </form>
        </Form>
    );
};
