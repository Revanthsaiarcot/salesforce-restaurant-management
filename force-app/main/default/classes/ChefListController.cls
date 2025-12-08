public with sharing class ChefListController {
    
    
    @AuraEnabled(cacheable=true)
    public static List<Order_Item__c> getChefOrders() {
        return [SELECT Id, Name, Quantity__c, Status__c, Notes__c,
                       Menu_Item__r.Name, Order__r.Table__r.Name 
                FROM Order_Item__c 
                WHERE Status__c IN ('Pending', 'Preparing') 
                ORDER BY CreatedDate ASC];
    }

    
    @AuraEnabled
    public static String updateItemStatus(String recordId, String newStatus) {
        try {
            Order_Item__c item = new Order_Item__c(Id = recordId, Status__c = newStatus);
            update item;
            return 'Success';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}