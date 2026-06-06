Detailed Project Prompt – Rent Farming Web Application for Indian Farmers
Project Title

Rent Farming – Agricultural Land Rental Marketplace

Project Overview

Develop a full-stack web application called Rent Farming that connects Indian landowners/farmers who want to rent out their agricultural land with buyers/tenants who are interested in farming on rented land.

The application should provide:

Secure user registration and authentication
OTP-based mobile verification
Land listing management
Admin approval workflow
Public land browsing
Masked contact details for non-logged-in users
Responsive and user-friendly UI for rural and semi-urban Indian users

The system should support:

Farmer/Land Holder Users
Buyer/Tenant Users
Admin Users

The platform should be scalable, secure, and optimized for mobile devices because many Indian farmers access applications using smartphones.

Technology Stack
Frontend
HTML5
CSS3
JavaScript (ES6+)
React.js (vite application)
Tailwind CSS
Redux Toolkit
Backend
Node.js
Express.js
Database
Microsoft SQL Server
Authentication & Verification
JWT Authentication
OTP verification using SMS API
User Roles
1. Farmer / Land Holder

A farmer or land owner who wants to give agricultural land on rent.

2. Buyer / Tenant

A user interested in taking agricultural land on rent.

3. Admin

Platform administrator responsible for approving land listings and managing users.

Core Functional Requirements
1. Farmer / Land Holder Module
Registration Flow
Registration Fields

Farmer should register using:

First Name
Last Name
Address
7/12 Survey Number
Phone Number
User ID
Password
Confirm Password
Registration Validation

System should validate:

Mandatory fields
Valid phone number format
Unique user ID
Strong password rules
Unique survey number if required
OTP Verification

After registration:

Send OTP to mobile number
User enters OTP
Verify OTP before activating account
Successful Registration

After OTP verification:

Store user in database
Redirect to Login Page
Login Flow

Farmer can log in using:

User ID
Password
Features
JWT token authentication
Remember login session
Forgot password functionality
Logout functionality
Land Details Form

After first login, user should complete land profile.

Land Detail Fields
Area of land
Land unit (acre/hectare)
Crops suitable for land
Soil type
Water availability
Location
Village
Taluka
District
State
Expected rent
Rent duration
Monthly
Yearly
Additional notes/description
Upload land images
Upload 7/12 document copy
Land Listing Status

Each land listing should have status:

Pending Approval
Approved
Rejected

Initially:

Every new listing remains in “Pending Approval”

Admin reviews and approves listing.

Only approved listings become visible to buyers/public users.

2. Buyer / Tenant Module
Buyer Registration

Same registration flow as farmer:

First Name
Last Name
Address
Phone Number
User ID
Password
OTP verification
Buyer Login

Buyer can:

Login using credentials
View available approved land listings
Search and filter listings
Land Browsing Features

Buyer should be able to:

Browse all approved lands
Filter by:
State
District
Village
Soil type
Crop type
Area
Rent range
Public User View

Visitors without login can see:

Area
Crops
Soil
Location
Rent expectation

BUT:

Farmer phone number should remain masked

Example:
98XXXXXX45

Logged-In Buyer View

After login:

Buyer can see complete farmer phone number
Can contact farmer directly
3. Admin Module
Admin Login

Separate secure admin login.

Admin Dashboard Features
User Management

Admin can:

View all users
Block/unblock users
Delete fake users
Land Approval Management

Admin can:

View pending land applications
Approve listings
Reject listings
Add rejection reason
Dashboard Analytics

Admin dashboard should show:

Total farmers
Total buyers
Total approved lands
Pending approvals
Rejected listings
Application Pages
Public Pages
Home Page
About Us
Contact Us
FAQ
Land Listings
Login
Register
Farmer Pages
Farmer Dashboard
Add Land
Edit Land
View Listing Status
Profile Management
Buyer Pages
Buyer Dashboard
Search Lands
Saved Listings
Profile Management
Admin Pages
Admin Dashboard
User Management
Land Approval Management
Reports & Analytics
UI/UX Requirements
Design Requirements
Clean and modern UI
Mobile responsive design
Easy navigation
Multi-language support ready
English
Marathi
Hindi
Accessibility
Large buttons
Clear typography
Simple forms
Low internet optimization
Database Design Requirements
Main Tables
Users Table

Contains:

User ID
Name
Address
Phone
Password hash
Role
Verification status
Land Details Table

Contains:

Land ID
Owner ID
Area
Soil type
Crops
Location
Rent expectation
Approval status
OTP Verification Table

Contains:

OTP
Expiry time
Verification status
Admin Actions Table

Contains:

Admin ID
Action type
Listing ID
Timestamp
Security Requirements
Authentication Security
Password hashing using bcrypt
JWT token authentication
Session timeout
Data Protection
Prevent SQL injection
Prevent XSS attacks
Input validation
Secure API routes
API Requirements
Authentication APIs
Register
Login
OTP verify
Forgot password
Reset password
Land APIs
Add land
Update land
Delete land
Get approved listings
Get listing details
Admin APIs
Approve listing
Reject listing
Manage users
Search & Filtering Requirements

Search functionality should support:

Crop type
Soil type
State
District
Budget range
Area range

Performance Requirements
Fast page loading
Optimized image uploads
Lazy loading
Pagination for listings

Suggested Folder Structure
Frontend
components
pages
services
hooks
layouts
context
routes
Backend
controllers
routes
middleware
models
services
config
utils
Expected User Flow
Farmer Flow

Register → OTP Verify → Login → Add Land Details → Admin Approval → Listing Published

Buyer Flow

Register/Login → Browse Lands → View Contact Number → Contact Farmer

Admin Flow

Login → Review Listings → Approve/Reject → Monitor Platform

Important Business Logic
Only approved lands are visible publicly.
Phone numbers remain masked for non-logged-in users.
OTP verification is mandatory.
One user can add multiple land listings.
Admin approval is mandatory before publishing.
Buyer and Farmer roles should remain separate.
Secure handling of 7/12 document uploads is required.