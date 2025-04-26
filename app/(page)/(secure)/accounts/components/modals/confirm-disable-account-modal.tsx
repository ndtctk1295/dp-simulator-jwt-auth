'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAccountService } from '@/app/_services/use-accounts-service';
import { useModal } from '@/app/_services';

export const ConfirmDisableAccountModal = () => {
    const { isModalOpen, type, onModalClose, data } = useModal();
    const isOpen = isModalOpen && type === 'confirm-disable-account';
    const accountService = useAccountService();

    const handleConfirm = async () => {
        try {
            // await accountService.update(data.id, { isActive: false });
            onModalClose();
            alert('Account successfully disabled (for demo purpose)');
        } catch (error) {
            console.error('Error disabling account:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onModalClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Disable Account</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to disable this account? This action cannot be undone.</p>
                <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={onModalClose} variant="outline">
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleConfirm}>
                        Confirm Disable
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
