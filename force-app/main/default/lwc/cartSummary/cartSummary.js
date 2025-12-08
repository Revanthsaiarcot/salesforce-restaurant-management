import { LightningElement, api } from 'lwc';
import placeOrderApex from '@salesforce/apex/CustomerController.placeOrder';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CartSummary extends LightningElement {
    @api cartItems = [];
    @api tableId;

    get totalAmount() {
        return this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
    }

    get isCartEmpty() {
        return this.cartItems.length === 0;
    }

    closeCart() {
        this.dispatchEvent(new CustomEvent('closecart'));
    }

    removeItem(event) {
        const id = event.target.dataset.id;
        this.dispatchEvent(new CustomEvent('removeitem', { detail: id }));
    }

    placeOrder() {
        if(!this.tableId) {
            this.showToast('Error', 'Table ID is missing. Please scan QR code again.', 'error');
            return;
        }

        // Convert cart structure to match Apex Wrapper
        const orderPayload = JSON.stringify(this.cartItems);

        placeOrderApex({ tableId: this.tableId, orderItemsJson: orderPayload })
            .then(result => {
                this.showToast('Success', 'Order Sent to Kitchen!', 'success');
                this.dispatchEvent(new CustomEvent('orderplaced'));
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}