import { LightningElement, track } from 'lwc';
import getReadyItems from '@salesforce/apex/WaiterListController.getReadyItems';
import updateItemStatus from '@salesforce/apex/WaiterListController.updateItemStatus';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class WaiterPendingOrders extends LightningElement {
    @track formattedOrders = [];
    @track hasOrders = false;

    connectedCallback() {
        this.loadData();
    }

    loadData() {
        getReadyItems()
            .then(result => {
                this.formattedOrders = result.map(row => ({
                    Id: row.Id,
                    Quantity: row.Quantity__c,
                    MenuItemName: row.Menu_Item__r ? row.Menu_Item__r.Name : 'Unknown Item',
                    TableName: (row.Order__r && row.Order__r.Table__r) ? row.Order__r.Table__r.Name : 'Walk-in'
                }));
                this.hasOrders = this.formattedOrders.length > 0;
            })
            .catch(error => {
                console.error('Error:', error);
                this.hasOrders = false;
            });
    }

    handlePickup(event) {
        const id = event.target.dataset.id;
        updateItemStatus({ recordId: id })
            .then(() => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Served!', message: 'Item removed from queue.', variant: 'success'
                }));
                this.loadData(); // Reload list to show it's gone
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error', message: error.body.message, variant: 'error'
                }));
            });
    }

    refreshList() {
        this.loadData();
    }
}