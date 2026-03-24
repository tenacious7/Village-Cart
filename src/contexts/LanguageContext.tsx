import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'od';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    "landing.title": "Your village shop,\nnow on your phone",
    "landing.subtitle": "Order daily essentials, track deliveries, and pay easily.",
    "landing.getStarted": "Get Started",
    "landing.login": "Login",
    "landing.feature1": "Order from home",
    "landing.feature2": "Track your orders",
    "landing.feature3": "Pay on delivery",
    "login.welcome": "Welcome Back",
    "role.customer": "Customer",
    "role.admin": "Shop Owner",
    "form.phone": "Phone Number",
    "form.password": "Password",
    "form.faceImage": "Face Image",
    "login.button": "Login",
    "login.noAccount": "Don't have an account?",
    "login.register": "Register",
    "login.adminUsername": "Username",
    "login.adminPassword": "Password",
    "login.otp": "Enter OTP",
    "login.verifyOtp": "Verify OTP",
    "login.sendOtp": "Send OTP",
    "register.title": "Create Account",
    "register.areYou": "Are you a?",
    "form.fullName": "Full Name",
    "form.villageAddress": "Village / Address",
    "form.ownerName": "Owner Name",
    "form.shopName": "Shop Name",
    "form.village": "Village",
    "register.button": "Register",
    "register.hasAccount": "Already have an account?",
    "lang.en": "English",
    "lang.od": "ଓଡ଼ିଆ",
    
    // Customer Nav
    "nav.home": "Home",
    "nav.cart": "Cart",
    "nav.orders": "Orders",
    "nav.profile": "Profile",
    
    // Customer Layout
    "layout.shopName": "Ma Tarini Grocery Shop",
    "layout.shopAddress": "Bypass Road, Village",
    "layout.shop": "Shop",
    
    // Customer Home
    "home.search": "Search products...",
    "home.specialOffers": "Special Offers",
    "home.categories": "Categories",
    "home.popular": "Popular Items",
    "home.addToCart": "Add",
    "home.offer1.title": "20% OFF",
    "home.offer1.desc": "On all Dal & Pulses",
    "home.offer2.title": "Free Soap",
    "home.offer2.desc": "With 5kg Surf Excel",
    "cat.grocery": "Grocery",
    "cat.snacks": "Snacks",
    "cat.care": "Care",
    "cat.hardware": "Hardware",
    "cat.oil": "Oil & Ghee",
    "cat.paan": "Paan & Puja",
    "cat.drinks": "Cold Drinks",
    "cat.veg": "Vegetables",
    
    // Cart
    "cart.title": "Your Cart",
    "cart.subtotal": "Subtotal",
    "cart.discount": "Discount",
    "cart.total": "Total",
    "cart.checkout": "Proceed to Checkout",
    "cart.safePayment": "Safe and Secure Payments",
    "cart.authentic": "100% Authentic products",
    "cart.seller": "Seller",
    "cart.off": "Off",
    "cart.remove": "Remove",
    "cart.priceDetails": "Price Details",
    "cart.priceItems": "Price",
    "cart.deliveryCharges": "Delivery Charges",
    "cart.free": "Free",
    "cart.totalAmount": "Total Amount",
    "cart.saveAmount": "You will save",
    "cart.onThisOrder": "on this order",
    "cart.placeOrder": "Place Order",
    
    // Orders
    "orders.title": "My Orders",
    "orders.all": "All",
    "orders.active": "Active",
    "orders.delivered": "Delivered",
    "orders.items": "Items",
    "orders.status.packed": "Packed",
    "orders.status.delivered": "Delivered",
    "orders.search": "Search your orders here",
    "orders.pending": "Pending",
    "orders.readyForPickup": "Ready for Pickup",
    "orders.completed": "Completed",
    "orders.cancelled": "Cancelled",
    "orders.orderPlaced": "Order Placed",
    "orders.completedOn": "Completed on",
    "orders.multipleItems": "Multiple Items",
    "orders.orderId": "Order ID",
    "orders.cancelOrder": "Cancel Order",
    "orders.cancelConfirm": "Are you sure you want to cancel Order",
    "orders.cancelReason": "Reason for cancellation",
    "orders.cancelPlaceholder": "Tell us why you are cancelling...",
    "orders.keepOrder": "Keep Order",
    
    // Inventory
    "inventory.title": "Inventory",
    "inventory.add": "Add",
    "inventory.search": "Search products...",
    "inventory.all": "All",
    "inventory.lowStock": "Low Stock",
    "inventory.stock": "Stock",
    "inventory.nameEn": "Product Name (English)",
    "inventory.nameOd": "Product Name (Odia)",
    "inventory.price": "Price",
    "inventory.quantity": "Quantity",
    "inventory.imageUrl": "Image URL",
    "inventory.edit": "Edit Product",
    
    // Reports
    "reports.title": "Reports",
    "reports.today": "Today",
    "reports.thisWeek": "This Week",
    "reports.thisMonth": "This Month",
    "reports.totalRevenue": "Total Revenue",
    "reports.fromYesterday": "+12% from yesterday",
    "reports.totalOrders": "Total Orders",
    "reports.avgOrderValue": "Avg. Order Value",
    "reports.topProducts": "Top Products",
    "reports.sold": "sold",
    
    // Admin Orders
    "admin.orders.title": "Orders",
    "admin.orders.search": "Search by name or order #...",
    "admin.orders.all": "All",
    "admin.orders.pending": "Pending",
    "admin.orders.packed": "Packed",
    "admin.orders.delivered": "Delivered",
    "admin.orders.status.placed": "Placed",
    "admin.orders.status.packed": "Packed",
    "admin.orders.status.delivered": "Delivered",
    "admin.orders.items": "items",
    
    // Customer Profile
    "profile.title": "Profile",
    "profile.edit": "Edit",
    "profile.addresses": "My Addresses",
    "profile.notifications": "Notifications",
    "profile.help": "Help & Support",
    "profile.logout": "Logout",
    "profile.name": "Ramesh Kumar",
    "profile.orders": "Orders",
    "profile.wishlist": "Wishlist",
    "profile.accountSettings": "Account Settings",
    "profile.profileInfo": "Profile Information",
    "profile.savedCards": "Saved Cards & Wallet",
    "profile.save": "Save Changes",
    "profile.myActivity": "My Activity",
    
    // Admin Nav
    "admin.nav.dash": "Dash",
    "admin.nav.orders": "Orders",
    "admin.nav.inventory": "Inventory",
    "admin.nav.reports": "Reports",
    "admin.nav.settings": "Settings",
    
    // Checkout
    "checkout.title": "Checkout",
    "checkout.placed": "Order Placed! 🎉",
    "checkout.notify": "We'll notify you when it's ready.",
    "checkout.deliveryDetails": "Delivery Details",
    "checkout.addressPlaceholder": "Full Address / Landmark",
    "checkout.preferredTime": "Preferred Time",
    "checkout.morning": "Morning",
    "checkout.afternoon": "Afternoon",
    "checkout.evening": "Evening",
    "checkout.paymentMethod": "Payment Method",
    "checkout.cod": "Cash on Delivery",
    "checkout.placeOrder": "Place Order",
    "checkout.payAtShop": "Pay at Shop",
    "checkout.cashOrUpi": "Cash or UPI when you pick up",
    "checkout.upi": "UPI (GPay, PhonePe, Paytm)",
    "checkout.currentlyUnavailable": "Currently Unavailable",
    "checkout.collectionMethod": "Collection Method",
    "checkout.pickUpFromShop": "Pick up from shop",
    "checkout.readyIn": "Ready in 30 mins",
    "checkout.homeDelivery": "Home Delivery",
    "checkout.comingSoon": "Coming Soon",
    "checkout.change": "Change",
    
    // Admin Layout
    "admin.layout.shopName": "Ma Tarini Grocery Shop",
    "admin.layout.dashboard": "Admin Dashboard",
    
    // Admin Dashboard
    "admin.dash.title": "Namaste, Ramesh! 🙏",
    "admin.dash.subtitle": "Here's what's happening today.",
    "admin.dash.ordersToday": "Orders Today",
    "admin.dash.revenue": "Revenue",
    "admin.dash.lowStock": "Low Stock",
    "admin.dash.nearExpiry": "Near Expiry",
    "admin.dash.quickActions": "Quick Actions",
    "admin.dash.addProduct": "Add Product",
    "admin.dash.allOrders": "All Orders",
    "admin.dash.pendingOrders": "Pending Orders",
    "admin.dash.seeAll": "See All →",
    "admin.dash.markPacked": "Mark Packed",
    "admin.dash.customer": "Customer",
    
    // Admin Settings
    "admin.settings.title": "Settings",
    "admin.settings.staff": "Staff Management",
    "admin.settings.notifications": "Notifications",
    "admin.settings.autoDiscount": "Auto Discount Rules",
    "admin.settings.logout": "Logout",
    "admin.settings.homeCustomization": "Home Customization",
    "admin.settings.shopSettings": "Shop Settings",
    "admin.home.title": "Home Customization",
    "admin.home.save": "Save Changes",
    "admin.home.saving": "Saving...",
    "admin.home.addSection": "Add New Section",
    "admin.home.titleEn": "Title (English)",
    "admin.home.titleOd": "Title (Odia)",
    "admin.home.bannerUrl": "Banner Image URL",
    "admin.home.active": "Active",
    "admin.home.inactive": "Inactive",
    "admin.home.type": "Section Type",
    "admin.shop.title": "Shop Settings",
    "admin.shop.name": "Shop Name",
    "admin.shop.address": "Shop Address",
    "admin.shop.phone": "Shop Phone",
  },
  od: {
    "landing.title": "ଆପଣଙ୍କ ଗାଁ ଦୋକାନ,\nଏବେ ଆପଣଙ୍କ ଫୋନରେ",
    "landing.subtitle": "ଦୈନନ୍ଦିନ ଆବଶ୍ୟକୀୟ ସାମଗ୍ରୀ ଅର୍ଡର କରନ୍ତୁ, ଡେଲିଭରି ଟ୍ରାକ୍ କରନ୍ତୁ ଏବଂ ସହଜରେ ପେମେଣ୍ଟ କରନ୍ତୁ।",
    "landing.getStarted": "ଆରମ୍ଭ କରନ୍ତୁ",
    "landing.login": "ଲଗଇନ୍",
    "landing.feature1": "ଘରୁ ଅର୍ଡର କରନ୍ତୁ",
    "landing.feature2": "ଆପଣଙ୍କ ଅର୍ଡର ଟ୍ରାକ୍ କରନ୍ତୁ",
    "landing.feature3": "ଡେଲିଭରି ସମୟରେ ପେମେଣ୍ଟ କରନ୍ତୁ",
    "login.welcome": "ପୁଣି ସ୍ୱାଗତ",
    "role.customer": "ଗ୍ରାହକ",
    "role.admin": "ଦୋକାନ ମାଲିକ",
    "form.phone": "ଫୋନ୍ ନମ୍ବର",
    "form.password": "ପାସୱାର୍ଡ",
    "form.faceImage": "ମୁହଁର ଫଟୋ",
    "login.button": "ଲଗଇନ୍",
    "login.noAccount": "ଆକାଉଣ୍ଟ ନାହିଁ କି?",
    "login.register": "ରେଜିଷ୍ଟର",
    "login.adminUsername": "ୟୁଜରନେମ୍",
    "login.adminPassword": "ପାସୱାର୍ଡ",
    "login.otp": "ଓଟିପି ଦିଅନ୍ତୁ",
    "login.verifyOtp": "ଓଟିପି ଯାଞ୍ଚ କରନ୍ତୁ",
    "login.sendOtp": "ଓଟିପି ପଠାନ୍ତୁ",
    "register.title": "ଆକାଉଣ୍ଟ ତିଆରି କରନ୍ତୁ",
    "register.areYou": "ଆପଣ କିଏ?",
    "form.fullName": "ପୂରା ନାମ",
    "form.villageAddress": "ଗାଁ / ଠିକଣା",
    "form.ownerName": "ମାଲିକଙ୍କ ନାମ",
    "form.shopName": "ଦୋକାନ ନାମ",
    "form.village": "ଗାଁ",
    "register.button": "ରେଜିଷ୍ଟର",
    "register.hasAccount": "ପୂର୍ବରୁ ଆକାଉଣ୍ଟ ଅଛି କି?",
    "lang.en": "English",
    "lang.od": "ଓଡ଼ିଆ",
    
    // Customer Nav
    "nav.home": "ହୋମ୍",
    "nav.cart": "କାର୍ଟ",
    "nav.orders": "ଅର୍ଡର",
    "nav.profile": "ପ୍ରୋଫାଇଲ୍",
    
    // Customer Layout
    "layout.shopName": "ମା ତାରିଣୀ ଗ୍ରୋସରୀ ଶପ୍",
    "layout.shopAddress": "ବାଇପାସ୍ ରୋଡ୍, ଗାଁ",
    "layout.shop": "ଦୋକାନ",
    
    // Customer Home
    "home.search": "ସାମଗ୍ରୀ ଖୋଜନ୍ତୁ...",
    "home.specialOffers": "ସ୍ୱତନ୍ତ୍ର ଅଫର୍",
    "home.categories": "ବିଭାଗଗୁଡ଼ିକ",
    "home.popular": "ଲୋକପ୍ରିୟ ସାମଗ୍ରୀ",
    "home.addToCart": "ଯୋଡନ୍ତୁ",
    "home.offer1.title": "୨୦% ରିହାତି",
    "home.offer1.desc": "ସମସ୍ତ ଡାଲି ଉପରେ",
    "home.offer2.title": "ମାଗଣା ସାବୁନ୍",
    "home.offer2.desc": "୫ କିଲୋ ସର୍ଫ ଏକ୍ସେଲ ସହିତ",
    "cat.grocery": "ତେଜରାତି",
    "cat.snacks": "ଜଳଖିଆ",
    "cat.care": "ଯତ୍ନ",
    "cat.hardware": "ହାର୍ଡୱେର୍",
    "cat.oil": "ତେଲ ଓ ଘିଅ",
    "cat.paan": "ପାନ ଓ ପୂଜା",
    "cat.drinks": "ଥଣ୍ଡା ପାନୀୟ",
    "cat.veg": "ପନିପରିବା",
    
    // Cart
    "cart.title": "ଆପଣଙ୍କ କାର୍ଟ",
    "cart.subtotal": "ସବଟୋଟାଲ୍",
    "cart.discount": "ରିହାତି",
    "cart.total": "ମୋଟ",
    "cart.checkout": "ଚେକଆଉଟ୍ କରନ୍ତୁ",
    "cart.safePayment": "ସୁରକ୍ଷିତ ପେମେଣ୍ଟ",
    "cart.authentic": "୧୦୦% ଅସଲି ସାମଗ୍ରୀ",
    "cart.seller": "ବିକ୍ରେତା",
    "cart.off": "ରିହାତି",
    "cart.remove": "ହଟାନ୍ତୁ",
    "cart.priceDetails": "ମୂଲ୍ୟ ବିବରଣୀ",
    "cart.priceItems": "ମୂଲ୍ୟ",
    "cart.deliveryCharges": "ଡେଲିଭରି ଚାର୍ଜ",
    "cart.free": "ମାଗଣା",
    "cart.totalAmount": "ମୋଟ ମୂଲ୍ୟ",
    "cart.saveAmount": "ଆପଣ ସଞ୍ଚୟ କରିବେ",
    "cart.onThisOrder": "ଏହି ଅର୍ଡରରେ",
    "cart.placeOrder": "ଅର୍ଡର କରନ୍ତୁ",
    
    // Orders
    "orders.title": "ମୋର ଅର୍ଡର",
    "orders.all": "ସବୁ",
    "orders.active": "ଚାଲୁଥିବା",
    "orders.delivered": "ଦିଆଯାଇଛି",
    "orders.items": "ସାମଗ୍ରୀ",
    "orders.status.packed": "ପ୍ୟାକ୍ ହୋଇଛି",
    "orders.status.delivered": "ଦିଆଯାଇଛି",
    "orders.search": "ଆପଣଙ୍କ ଅର୍ଡର ଏଠାରେ ଖୋଜନ୍ତୁ",
    "orders.pending": "ପେଣ୍ଡିଂ",
    "orders.readyForPickup": "ନେବା ପାଇଁ ପ୍ରସ୍ତୁତ",
    "orders.completed": "ସମ୍ପୂର୍ଣ୍ଣ",
    "orders.cancelled": "ବାତିଲ୍",
    "orders.orderPlaced": "ଅର୍ଡର ହୋଇଛି",
    "orders.completedOn": "ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଛି",
    "orders.multipleItems": "ଏକାଧିକ ସାମଗ୍ରୀ",
    "orders.orderId": "ଅର୍ଡର ଆଇଡି",
    "orders.cancelOrder": "ଅର୍ଡର ବାତିଲ୍ କରନ୍ତୁ",
    "orders.cancelConfirm": "ଆପଣ ନିଶ୍ଚିତ କି ଆପଣ ଅର୍ଡର ବାତିଲ୍ କରିବାକୁ ଚାହୁଁଛନ୍ତି",
    "orders.cancelReason": "ବାତିଲ୍ କରିବାର କାରଣ",
    "orders.cancelPlaceholder": "ଆପଣ କାହିଁକି ବାତିଲ୍ କରୁଛନ୍ତି ଆମକୁ ଜଣାନ୍ତୁ...",
    "orders.keepOrder": "ଅର୍ଡର ରଖନ୍ତୁ",
    
    // Inventory
    "inventory.title": "ଇନଭେଣ୍ଟୋରୀ",
    "inventory.add": "ଯୋଡନ୍ତୁ",
    "inventory.search": "ସାମଗ୍ରୀ ଖୋଜନ୍ତୁ...",
    "inventory.all": "ସବୁ",
    "inventory.lowStock": "କମ୍ ଷ୍ଟକ୍",
    "inventory.stock": "ଷ୍ଟକ୍",
    "inventory.nameEn": "ଉତ୍ପାଦର ନାମ (ଇଂରାଜୀ)",
    "inventory.nameOd": "ଉତ୍ପାଦର ନାମ (ଓଡିଆ)",
    "inventory.price": "ମୂଲ୍ୟ",
    "inventory.quantity": "ପରିମାଣ",
    "inventory.imageUrl": "ଚିତ୍ର URL",
    "inventory.edit": "ଉତ୍ପାଦ ସମ୍ପାଦନ କରନ୍ତୁ",
    
    // Reports
    "reports.title": "ରିପୋର୍ଟ",
    "reports.today": "ଆଜି",
    "reports.thisWeek": "ଏହି ସପ୍ତାହ",
    "reports.thisMonth": "ଏହି ମାସ",
    "reports.totalRevenue": "ମୋଟ ଆୟ",
    "reports.fromYesterday": "ଗତକାଲି ଠାରୁ +୧୨%",
    "reports.totalOrders": "ମୋଟ ଅର୍ଡର",
    "reports.avgOrderValue": "ହାରାହାରି ଅର୍ଡର ମୂଲ୍ୟ",
    "reports.topProducts": "ଶ୍ରେଷ୍ଠ ସାମଗ୍ରୀ",
    "reports.sold": "ବିକ୍ରି ହୋଇଛି",
    
    // Admin Orders
    "admin.orders.title": "ଅର୍ଡର",
    "admin.orders.search": "ନାମ କିମ୍ବା ଅର୍ଡର # ଦ୍ୱାରା ଖୋଜନ୍ତୁ...",
    "admin.orders.all": "ସବୁ",
    "admin.orders.pending": "ବାକି ଅଛି",
    "admin.orders.packed": "ପ୍ୟାକ୍ ହୋଇଛି",
    "admin.orders.delivered": "ଦିଆଯାଇଛି",
    "admin.orders.status.placed": "ଅର୍ଡର ହୋଇଛି",
    "admin.orders.status.packed": "ପ୍ୟାକ୍ ହୋଇଛି",
    "admin.orders.status.delivered": "ଦିଆଯାଇଛି",
    "admin.orders.items": "ସାମଗ୍ରୀ",
    
    // Customer Profile
    "profile.title": "ପ୍ରୋଫାଇଲ୍",
    "profile.edit": "ଏଡିଟ୍",
    "profile.addresses": "ମୋର ଠିକଣା",
    "profile.notifications": "ନୋଟିଫିକେସନ୍",
    "profile.help": "ସାହାଯ୍ୟ ଏବଂ ସମର୍ଥନ",
    "profile.logout": "ଲଗଆଉଟ୍",
    "profile.name": "ରମେଶ କୁମାର",
    "profile.orders": "ଅର୍ଡରଗୁଡିକ",
    "profile.wishlist": "ଇଚ୍ଛା ତାଲିକା",
    "profile.accountSettings": "ଆକାଉଣ୍ଟ ସେଟିଂସ",
    "profile.profileInfo": "ପ୍ରୋଫାଇଲ୍ ସୂଚନା",
    "profile.savedCards": "ସେଭ୍ ହୋଇଥିବା କାର୍ଡ ଏବଂ ୱାଲେଟ୍",
    "profile.save": "ପରିବର୍ତ୍ତନଗୁଡିକ ସେଭ୍ କରନ୍ତୁ",
    "profile.myActivity": "ମୋର କାର୍ଯ୍ୟକଳାପ",
    
    // Admin Nav
    "admin.nav.dash": "ଡ୍ୟାସବୋର୍ଡ",
    "admin.nav.orders": "ଅର୍ଡର",
    "admin.nav.inventory": "ଷ୍ଟକ୍",
    "admin.nav.reports": "ରିପୋର୍ଟ",
    "admin.nav.settings": "ସେଟିଂସ୍",
    
    // Checkout
    "checkout.title": "ଚେକଆଉଟ୍",
    "checkout.placed": "ଅର୍ଡର ଦିଆଗଲା! 🎉",
    "checkout.notify": "ଏହା ପ୍ରସ୍ତୁତ ହେଲେ ଆମେ ଆପଣଙ୍କୁ ଜଣାଇବୁ।",
    "checkout.deliveryDetails": "ବିତରଣ ବିବରଣୀ",
    "checkout.addressPlaceholder": "ସମ୍ପୂର୍ଣ୍ଣ ଠିକଣା / ଲ୍ୟାଣ୍ଡମାର୍କ",
    "checkout.preferredTime": "ପସନ୍ଦ ସମୟ",
    "checkout.morning": "ସକାଳ",
    "checkout.afternoon": "ଦ୍ୱିପ୍ରହର",
    "checkout.evening": "ସନ୍ଧ୍ୟା",
    "checkout.paymentMethod": "ପେମେଣ୍ଟ୍ ପଦ୍ଧତି",
    "checkout.cod": "କ୍ୟାସ୍ ଅନ୍ ଡେଲିଭରୀ",
    "checkout.placeOrder": "ଅର୍ଡର କରନ୍ତୁ",
    "checkout.payAtShop": "ଦୋକାନରେ ପେମେଣ୍ଟ କରନ୍ତୁ",
    "checkout.cashOrUpi": "ନେବା ସମୟରେ କ୍ୟାସ୍ କିମ୍ବା ୟୁପିଆଇ",
    "checkout.upi": "ୟୁପିଆଇ (ଜିପେ, ଫୋନପେ, ପେଟିଏମ୍)",
    "checkout.currentlyUnavailable": "ବର୍ତ୍ତମାନ ଉପଲବ୍ଧ ନାହିଁ",
    "checkout.collectionMethod": "ସଂଗ୍ରହ ପଦ୍ଧତି",
    "checkout.pickUpFromShop": "ଦୋକାନରୁ ନିଅନ୍ତୁ",
    "checkout.readyIn": "୩୦ ମିନିଟରେ ପ୍ରସ୍ତୁତ",
    "checkout.homeDelivery": "ହୋମ୍ ଡେଲିଭରି",
    "checkout.comingSoon": "ଖୁବ୍ ଶୀଘ୍ର ଆସୁଛି",
    "checkout.change": "ପରିବର୍ତ୍ତନ କରନ୍ତୁ",
    
    // Admin Layout
    "admin.layout.shopName": "ମା ତାରିଣୀ ଗ୍ରୋସରୀ ଶପ୍",
    "admin.layout.dashboard": "ଆଡମିନ୍ ଡ୍ୟାସବୋର୍ଡ",
    
    // Admin Dashboard
    "admin.dash.title": "ନମସ୍ତେ, ରମେଶ! 🙏",
    "admin.dash.subtitle": "ଆଜିର ବିବରଣୀ ଏଠାରେ ଅଛି।",
    "admin.dash.ordersToday": "ଆଜିର ଅର୍ଡର",
    "admin.dash.revenue": "ରୋଜଗାର",
    "admin.dash.lowStock": "କମ୍ ଷ୍ଟକ୍",
    "admin.dash.nearExpiry": "ଏକ୍ସପାୟାରୀ ପାଖାପାଖି",
    "admin.dash.quickActions": "ତୁରନ୍ତ କାର୍ଯ୍ୟ",
    "admin.dash.addProduct": "ସାମଗ୍ରୀ ଯୋଡନ୍ତୁ",
    "admin.dash.allOrders": "ସବୁ ଅର୍ଡର",
    "admin.dash.pendingOrders": "ବାକିଥିବା ଅର୍ଡର",
    "admin.dash.seeAll": "ସବୁ ଦେଖନ୍ତୁ →",
    "admin.dash.markPacked": "ପ୍ୟାକ୍ ହୋଇଛି",
    "admin.dash.customer": "ଗ୍ରାହକ",
    
    // Admin Settings
    "admin.settings.title": "ସେଟିଂସ୍",
    "admin.settings.staff": "ଷ୍ଟାଫ୍ ପରିଚାଳନା",
    "admin.settings.notifications": "ନୋଟିଫିକେସନ୍",
    "admin.settings.autoDiscount": "ଅଟୋ ଡିସକାଉଣ୍ଟ ରୁଲ୍ସ",
    "admin.settings.logout": "ଲଗଆଉଟ୍",
    "admin.settings.homeCustomization": "ହୋମ୍ କଷ୍ଟମାଇଜେସନ୍",
    "admin.settings.shopSettings": "ଦୋକାନ ସେଟିଂସ୍",
    "admin.home.title": "ହୋମ୍ କଷ୍ଟମାଇଜେସନ୍",
    "admin.home.save": "ସେଭ୍ କରନ୍ତୁ",
    "admin.home.saving": "ସେଭ୍ ହେଉଛି...",
    "admin.home.addSection": "ନୂଆ ବିଭାଗ ଯୋଡନ୍ତୁ",
    "admin.home.titleEn": "ଶୀର୍ଷକ (ଇଂରାଜୀ)",
    "admin.home.titleOd": "ଶୀର୍ଷକ (ଓଡିଆ)",
    "admin.home.bannerUrl": "ବ୍ୟାନର ଚିତ୍ର URL",
    "admin.home.active": "ସକ୍ରିୟ",
    "admin.home.inactive": "ନିଷ୍କ୍ରିୟ",
    "admin.home.type": "ବିଭାଗ ପ୍ରକାର",
    "admin.shop.title": "ଦୋକାନ ସେଟିଂସ୍",
    "admin.shop.name": "ଦୋକାନ ନାମ",
    "admin.shop.address": "ଦୋକାନ ଠିକଣା",
    "admin.shop.phone": "ଦୋକାନ ଫୋନ୍",
  }
};

// Dynamic translation dictionary for common words
const dynamicDictionary: Record<string, string> = {
  "Aashirvaad Atta 5kg": "ଆଶୀର୍ବାଦ ଅଟା ୫ କେଜି",
  "Tata Salt 1kg": "ଟାଟା ଲୁଣ ୧ କେଜି",
  "Parle-G Gold": "ପାର୍ଲେ-ଜି ଗୋଲ୍ଡ",
  "Brooke Bond Red Label": "ବ୍ରୁକ୍ ବଣ୍ଡ ରେଡ୍ ଲେବଲ୍",
  "Lifebuoy Soap": "ଲାଇଫବୟ ସାବୁନ୍",
  "SuperMart": "ସୁପରମାର୍ଟ",
  "Multiple Items": "ଏକାଧିକ ସାମଗ୍ରୀ",
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    let text = (translations[language] as any)[key];
    
    // Dynamic fallback for unknown keys (like product names)
    if (!text) {
      if (language === 'od') {
        // Try to translate using dynamic dictionary
        text = dynamicDictionary[key] || key;
      } else {
        text = key;
      }
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
