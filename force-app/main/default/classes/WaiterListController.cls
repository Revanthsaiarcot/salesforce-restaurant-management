public with sharing class WaiterListController {
    
    @AuraEnabled(cacheable=true)
    public static List<Order_Item__c> getReadyItems() {
        // Query specific fields - ensure these match your object exactly
        return [SELECT Id, Name, Quantity__c, Status__c, 
                       Menu_Item__r.Name, Order__r.Table__r.Name 
                FROM Order_Item__c 
                WHERE Status__c = 'Ready' 
                ORDER BY CreatedDate DESC];
    }

    @AuraEnabled
    public static String updateItemStatus(String recordId) {
        Order_Item__c item = new Order_Item__c(Id = recordId, Status__c = 'Delivered');
        update item;
        return 'Success';
    }
}