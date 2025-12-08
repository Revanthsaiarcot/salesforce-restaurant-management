import { LightningElement, track, wire, api } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

export default class CustomerApp extends LightningElement {
    // FIX: Using @api ensures this property exists and satisfies your metadata file
    @api tableId; 
    
    @track cartItems = [];
    @track showFeedback = false; 
    isCartOpen = false;

    // 1. Get the Table ID from the URL (Navigation State)
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference && currentPageReference.state) {
            // Check if we arrived here via navigation from the Map
            const navTableId = currentPageReference.state.c__tableId;
            if (navTableId) {
                this.tableId = navTableId;
            }
        }
    }

    // 2. Logic to check if we have a table (to show/hide content)
    get hasTable() {
        return this.tableId != null;
    }

    get cartCount() {
        return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    }

    get cartClass() {
        return this.isCartOpen ? 'cart-sidebar open' : 'cart-sidebar';
    }

    toggleCart() {
        this.isCartOpen = !this.isCartOpen;
    }

    handleAddToCart(event) {
        const product = event.detail;
        const existingItem = this.cartItems.find(item => item.menuItemId === product.Id);

        if (existingItem) {
            existingItem.quantity += 1;
            this.cartItems = [...this.cartItems]; 
        } else {
            this.cartItems = [...this.cartItems, {
                menuItemId: product.Id,
                name: product.Name,
                price: product.Price__c,
                quantity: 1,
                notes: ''
            }];
        }
        if(!this.isCartOpen) this.isCartOpen = true;
    }

    handleRemoveItem(event) {
        const itemId = event.detail;
        this.cartItems = this.cartItems.filter(item => item.menuItemId !== itemId);
    }

    handleOrderPlaced() {
        this.cartItems = [];
        this.isCartOpen = false;
    }

    openBill() {
        const billComponent = this.template.querySelector('c-bill-summary');
        if(billComponent) {
            billComponent.loadBill();
        }
    }

    handlePaymentSuccess() {
        this.cartItems = [];
        this.isCartOpen = false;
        this.showFeedback = true; 
    }
}