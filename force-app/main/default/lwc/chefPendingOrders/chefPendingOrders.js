import { LightningElement, wire, track } from 'lwc';
import getChefOrders from '@salesforce/apex/ChefListController.getChefOrders';
import updateItemStatus from '@salesforce/apex/ChefListController.updateItemStatus';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ChefPendingOrders extends LightningElement {
    @track wiredOrders = [];

    @wire(getChefOrders)
    orderItems(result) {
        this.wiredOrders = result; 
    }

    // FIX: Calculate 'cardClass', 'isPending', and 'isPreparing' here
    get processedOrders() {
        if (!this.wiredOrders.data) return [];
        
        return this.wiredOrders.data.map(item => {
            return {
                ...item, // Copy original item data
                // Add computed properties for the HTML to use directly
                cardClass: item.Status__c === 'Pending' ? 'card pending' : 'card preparing',
                isPending: item.Status__c === 'Pending',
                isPreparing: item.Status__c === 'Preparing'
            };
        });
    }

    handleAccept(event) {
        this.updateStatus(event.target.dataset.id, 'Preparing');
    }

    handleReady(event) {
        this.updateStatus(event.target.dataset.id, 'Ready');
    }

    updateStatus(id, status) {
        updateItemStatus({ recordId: id, newStatus: status })
            .then(() => {
                this.showToast('Success', `Order marked as ${status}`, 'success');
                return refreshApex(this.wiredOrders);
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    refreshList() {
        refreshApex(this.wiredOrders);
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}