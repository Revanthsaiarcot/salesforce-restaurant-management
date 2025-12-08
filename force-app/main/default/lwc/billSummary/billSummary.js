import { LightningElement, api, track } from 'lwc';
import getBillDetails from '@salesforce/apex/CustomerController.getBillDetails';
import processPayment from '@salesforce/apex/CustomerController.processPayment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class BillSummary extends LightningElement {
    @api tableId;
    @api isOpen = false;
    @track billData;
    isLoading = false;

    @api
    loadBill() {
        this.isLoading = true;
        this.isOpen = true;
        getBillDetails({ tableId: this.tableId })
            .then(result => {
                const itemsWithTotal = result.items.map(item => ({
                    ...item,
                    totalLine: item.Menu_Item__r.Price__c * item.Quantity__c
                }));
                this.billData = { ...result, items: itemsWithTotal };
                this.isLoading = false;
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
                this.isLoading = false;
            });
    }

    closeModal() {
        this.isOpen = false;
        this.dispatchEvent(new CustomEvent('close'));
    }

    handlePay() {
        this.isLoading = true;
        processPayment({ tableId: this.tableId })
            .then(() => {
                this.showToast('Success', 'Payment Received! Thank you for dining with us.', 'success');
                this.isOpen = false;
                this.isLoading = false;
                this.dispatchEvent(new CustomEvent('paymentcomplete'));
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
                this.isLoading = false;
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}