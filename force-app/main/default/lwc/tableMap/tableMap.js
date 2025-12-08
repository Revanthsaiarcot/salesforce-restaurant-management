import { LightningElement, wire, track } from 'lwc';
import getAllTables from '@salesforce/apex/CustomerController.getAllTables';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import RESTAURANT_ASSETS from '@salesforce/resourceUrl/RestaurantImages';

export default class TableMap extends NavigationMixin(LightningElement) {
    @track tables = [];
    @track selectedTableId;
    
   
    @track showFeedback = false; 
    
    wiredResult;

    @wire(getAllTables)
    wiredTables(result) {
        this.wiredResult = result;
        if (result.data) {
            this.tables = result.data.map(tbl => {
                let css = 'table-card ';
                if (tbl.Status__c === 'Available') css += 'available';
                else if (tbl.Status__c === 'Occupied') css += 'occupied';
                else if (tbl.Status__c === 'Reserved') css += 'reserved';
                else css += 'cleaning';
                
                let imgUrl = null;
                if (tbl.Image_URL__c) {
                    imgUrl = RESTAURANT_ASSETS + '/' + tbl.Image_URL__c;
                }

                return { 
                    ...tbl, 
                    cssClass: css,
                    displayImage: imgUrl, 
                    isOccupied: tbl.Status__c === 'Occupied'
                };
            });
        }
    }

    handleTableClick(event) {
        const tableId = event.currentTarget.dataset.id;
        const status = event.currentTarget.dataset.status;

        if (status === 'Available' || status === 'Occupied') {
            this[NavigationMixin.Navigate]({
                type: 'standard__navItemPage',
                attributes: { apiName: 'Restaurant_Ordering' },
                state: { c__tableId: tableId }
            });
        } else {
            this.showToast('Notice', `Table is currently ${status}`, 'warning');
        }
    }

    handleQuickBill(event) {
        event.stopPropagation();
        const tableId = event.target.dataset.id;
        this.selectedTableId = tableId;
        setTimeout(() => {
            const billComponent = this.template.querySelector('c-bill-summary');
            if (billComponent) billComponent.loadBill();
        }, 50);
    }

    // 2. Update this method to show Feedback
    handlePaymentSuccess() {
        this.showFeedback = true; // Switch screens
        refreshApex(this.wiredResult); // Turn table Green in background
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}