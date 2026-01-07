# 🍔 Salesforce Restaurant E-Management System

![Salesforce](https://img.shields.io/badge/Platform-Salesforce-blue?style=for-the-badge&logo=salesforce)
![LWC](https://img.shields.io/badge/Frontend-LWC-orange?style=for-the-badge&logo=javascript)
![Apex](https://img.shields.io/badge/Backend-Apex-green?style=for-the-badge&logo=salesforce)
![Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)

## 📌 Project Overview
The **Restaurant E-Management System** is a full-stack Salesforce application designed to digitize the entire dining experience. It replaces manual paper tickets with a real-time digital ecosystem, connecting Customers, Kitchen Staff (Chefs), and Servers (Waiters) in a unified loop.

This project demonstrates a complex **Single Page Application (SPA)** architecture using **Lightning Web Components (LWC)** and **Apex Controllers**, capable of handling real-time state management, complex transactions, and static resource asset handling.

---

## 🚀 Key Features

### 1. 🥘 Customer Digital Kiosk
- **Interactive Table Map:** Visual grid layout showing real-time table status (Green = Available, Red = Occupied).
- **Dynamic Menu:** Fetches menu items and images from Salesforce records and Static Resources.
- **Smart Cart:** Client-side cart management allowing users to modify orders before submission.
- **Billing & Feedback:** Auto-generates receipts with tax calculations and collects 5-star feedback post-payment.

### 2. 👨‍🍳 Kitchen Display System (KDS)
- **Real-Time Dashboard:** Chefs see incoming "Pending" orders instantly.
- **Status Control:** One-click actions to move orders to **"Preparing"** (locking customer edits) and **"Ready"**.

### 3. 🤵 Service Dashboard
- **"Uber-Style" Queue:** Waiters see a filtered list of only "Ready" items.
- **Service Tracking:** Single-click "Serve" action updates inventory and order status.

---

## 🛠 Tech Stack

| Component | Technology Used |
|-----------|----------------|
| **Frontend** | Lightning Web Components (LWC), CSS Grid, NavigationMixin |
| **Backend** | Apex Controllers, SOQL, DML Transactions |
| **Database** | Custom Objects (`Table__c`, `Menu_Item__c`, `Order__c`, `Feedback__c`) |
| **Assets** | Salesforce Static Resources (High-performance image loading) |
| **Security** | Field Level Security (FLS), Apex `without sharing` contexts for Guest Users |
| **Tools** | VS Code, Salesforce CLI (SFDX), Git |

---

## 🏗 Architecture & Data Model

The application creates a circular workflow:
1.  **Map:** User selects a table.
2.  **Order:** `CustomerController.cls` creates `Order__c` and `Order_Item__c` transactionally.
3.  **Kitchen:** `ChefListController.cls` queries pending items.
4.  **Service:** `WaiterListController.cls` closes the loop.

### Custom Objects
- **Restaurant Table (`Table__c`):** Tracks status (Available/Occupied) and Table Image.
- **Menu Item (`Menu_Item__c`):** Stores Product Name, Price, Category, and Image Filename.
- **Order (`Order__c`):** The transaction header.
- **Order Item (`Order_Item__c`):** The specific food items (Master-Detail).
- **Feedback (`Feedback__c`):** Stores customer ratings linked to the table session.

---

## 📂 Project Structure
```text
force-app
 └── main
     └── default
         ├── classes
         │   ├── CustomerController.cls       // Handles Ordering, Billing, Feedback
         │   ├── ChefListController.cls       // Handles Kitchen Logic
         │   └── WaiterListController.cls     // Handles Service Logic
         ├── lwc
         │   ├── tableMap                     // Entry Point (Table Selection)
         │   ├── customerApp                  // Parent Container
         │   ├── menuList                     // Digital Menu Grid
         │   ├── cartSummary                  // Shopping Cart
         │   ├── chefPendingOrders            // Kitchen Dashboard
         │   └── billSummary                  // Receipt Generator
         └── staticresources
             └── RestaurantImages             // Stores food & table images
```
## 📊 Project Presentation
Get a complete visual overview of the project, including the architecture, user flows, and future roadmap.

Click here to view the full Restaurant E-Management System Presentation

## 📄 Project Documentation
For a deep dive into the technical specifications, data model, and functional requirements, refer to the full project blueprint.

### 📄 Salesforce Restaurant E-Management Blueprint.docx (Note: Make sure to upload your .docx file to your GitHub repository root folder for this link to work!)

## ⚡ Installation & Setup
Follow these steps to deploy the application to your own Salesforce environment.

1️⃣ Prerequisites
A Salesforce Developer Org.

VS Code installed with the Salesforce Extension Pack.

Git installed on your machine.

2️⃣ Clone the Repository
Open your terminal and run:

Bash

git clone [https://github.com/Revanthsaiarcot/salesforce-restaurant-management.git](https://github.com/Revanthsaiarcot/salesforce-restaurant-management.git)
3️⃣ Deploy to Salesforce
Open the project folder in VS Code.

Authorize your Org: Ctrl+Shift+P > SFDX: Authorize an Org.

Right-click the force-app folder in the file explorer.

Select SFDX: Deploy Source to Org.

4️⃣ Post-Deployment Setup
Once the code is deployed, you need to configure the data:

## 🖼️ Upload Images:

Ensure the RestaurantImages Static Resource is deployed (check force-app/main/default/staticresources).

🗂️ Create Data:

Create 4-5 Restaurant Table records (e.g., "Table 1", "Table 2").

Create Menu Item records (e.g., "Burger", "Pizza").

Important: Set the Image URL field on these records to match the filenames in your Static Resource (e.g., burger.jpg, pizza.png).

5️⃣ Add to App Builder
Go to Setup > Lightning App Builder.

Create a new App Page named "Restaurant Ordering".

Drag and drop the tableMap custom component onto the page.

Create a second page named "Kitchen Display" and drop the chefPendingOrders component there.

Activate both pages for your profile.

# 📸 Usage Guide (The "Happy Path")
Open the App: Navigate to the Restaurant Ordering tab in Salesforce.

Select a Table: Click on a Green (Available) table card.

Order Food: Browse the menu, add items to your cart 🛒, and click Place Order.

Chef View: Switch to the Kitchen Display tab. You will see the new order instantly.

Cook It: Click "Start Cooking" (Status: Preparing) → then "Mark Ready" (Status: Ready).

Pay & Finish: Go back to the Table Map, click the Red (Occupied) table, and select "Pay Bill" 💳.

Feedback: Submit a 5-Star Rating ⭐ to reset the table and complete the loop!

## 🔮 Future Enhancements
[ ] Inventory Integration: Auto-decrement stock levels when orders are placed.

[ ] Payment Gateway: Integrate Stripe API for real-time credit card processing.

[ ] Live Notifications: Implement Platform Events for instant push notifications to the Kitchen.

## 📬 Contact
Have questions or want to connect?

Developer: Revanth Sai Arcot

LinkedIn: [Link to your LinkedIn Profile]

Email: [Your Email Address]
