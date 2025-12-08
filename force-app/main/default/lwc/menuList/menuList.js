import { LightningElement, wire, track } from 'lwc';
import getMenuItems from '@salesforce/apex/CustomerController.getMenuItems';
// 1. Import the Static Resource
import RESTAURANT_ASSETS from '@salesforce/resourceUrl/RestaurantImages';

export default class MenuList extends LightningElement {
    @track menuList = [];
    @track error;

    @wire(getMenuItems)
    wiredMenuItems({ error, data }) {
        if (data) {
            this.menuList = data.map(item => {
                // 2. Build the path: /resource/RestaurantImages/burger.jpg
                let imgUrl = 'https://via.placeholder.com/150'; // Default fallback

                if (item.Image_URL__c) {
                    // Combine the Base Resource Path + The Filename from the database
                    imgUrl = RESTAURANT_ASSETS + '/' + item.Image_URL__c;
                }

                return {
                    ...item,
                    displayImage: imgUrl
                };
            });
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.menuList = [];
        }
    }

    handleBtnClick(event) {
        const id = event.target.dataset.id;
        const selectedItem = this.menuList.find(item => item.Id === id);
        
        const addEvent = new CustomEvent('addtocart', {
            detail: selectedItem
        });
        this.dispatchEvent(addEvent);
    }
}