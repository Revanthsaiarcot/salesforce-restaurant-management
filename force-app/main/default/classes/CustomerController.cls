public without sharing class CustomerController {

    // 1. TABLE MAP
    @AuraEnabled(cacheable=true)
    public static List<Table__c> getAllTables() {
        return [SELECT Id, Name, Status__c, Image_URL__c FROM Table__c ORDER BY Name];
}

    // 2. MENU
    @AuraEnabled(cacheable=true)
    public static List<Menu_Item__c> getMenuItems() {
        return [SELECT Id, Name, Price__c, Description__c, Category__c, Image_URL__c 
                FROM Menu_Item__c 
                ORDER BY Category__c, Name];
    }

    // 3. ORDER (Updates Table to OCCUPIED)
    @AuraEnabled
    public static String placeOrder(String tableId, String orderItemsJson) {
        Savepoint sp = Database.setSavepoint();
        try {
            // A. Create the Order
            Order__c newOrder = new Order__c(
                Table__c = tableId,
                Status__c = 'New',
                Order_Date__c = System.now(),
                Tax__c = 0 
            );
            insert newOrder;

            // B. Create Order Items
            List<OrderItemWrapper> items = (List<OrderItemWrapper>) JSON.deserialize(orderItemsJson, List<OrderItemWrapper>.class);
            List<Order_Item__c> recordsToInsert = new List<Order_Item__c>();

            for(OrderItemWrapper item : items) {
                recordsToInsert.add(new Order_Item__c(
                    Order__c = newOrder.Id,
                    Menu_Item__c = item.menuItemId,
                    Quantity__c = item.quantity, 
                    Status__c = 'Pending', 
                    Notes__c = item.notes
                ));
            }
            insert recordsToInsert;

            // C. UPDATE TABLE STATUS TO 'OCCUPIED'
            Table__c tbl = new Table__c(Id = tableId, Status__c = 'Occupied');
            update tbl;

            return newOrder.Id;

        } catch (Exception e) {
            Database.rollback(sp);
            throw new AuraHandledException('Order Failed: ' + e.getMessage());
        }
    }

    // 4. BILL
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getBillDetails(String tableId) {
        List<Order_Item__c> items = [SELECT Menu_Item__r.Name, Menu_Item__r.Price__c, Quantity__c 
                                     FROM Order_Item__c 
                                     WHERE Order__r.Table__c = :tableId 
                                     AND Order__r.Status__c != 'Paid'];
        
        Decimal totalAmount = 0;
        for(Order_Item__c item : items) {
            Decimal price = item.Menu_Item__r.Price__c != null ? item.Menu_Item__r.Price__c : 0;
            Decimal qty = item.Quantity__c != null ? item.Quantity__c : 0;
            totalAmount += (price * qty);
        }

        Map<String, Object> result = new Map<String, Object>();
        result.put('items', items);
        result.put('totalAmount', totalAmount);
        result.put('tax', totalAmount * 0.05); 
        result.put('grandTotal', totalAmount * 1.05);
        return result;
    }

    // 5. PAYMENT (Updates Table to AVAILABLE)
    @AuraEnabled
    public static String processPayment(String tableId) {
        List<Order__c> openOrders = [SELECT Id, Status__c FROM Order__c 
                                     WHERE Table__c = :tableId 
                                     AND Status__c != 'Paid'];
        
        if(openOrders.isEmpty()) {
            throw new AuraHandledException('No open orders found to pay.');
        }
        for(Order__c ord : openOrders) {
            ord.Status__c = 'Paid';
        }
        update openOrders;

        // UPDATE TABLE STATUS BACK TO 'AVAILABLE'
        // (Optional: You can set this to 'Cleaning' if you want a waiter to clean it first)
        Table__c tbl = new Table__c(Id = tableId, Status__c = 'Available');
        update tbl;

        return 'Payment Successful';
    }

    // 6. FEEDBACK
    @AuraEnabled
    public static void submitFeedback(String tableId, Integer rating, String comments) {
        try {
            Feedback__c fb = new Feedback__c();
            fb.Table__c = tableId;
            fb.Rating__c = String.valueOf(rating);
            fb.Comments__c = comments;
            insert fb;
        } catch (Exception e) {
            throw new AuraHandledException('Server Error: ' + e.getMessage());
        }
    }

    public class OrderItemWrapper {
        public String menuItemId;
        public Integer quantity;
        public Decimal price;
        public String notes;
    }
}