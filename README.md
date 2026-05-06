# Online Fundraising System

This is an online fundraising system developed using the MERN stack with Vite.

## Tech Stack

- MongoDB
- Express.js
- React (Vite)
- Node.js

## Getting Started

### 1. Setup Environment Variables

Create a `.env` file inside the `server` folder.

Refer to `.env.example` for required variables.

You will need:
- A working MongoDB connection string OR
- Use the local MongoDB configuration provided

### 2. Install Dependencies

```bash
# Client
cd client
npm install

# Server
cd server
npm install
```

### 3. Run the Project

```bash
# Client
cd client
npm run dev

# Server
cd server
npm run dev
```

## Run Tests

```bash
cd server
npm test
```

## Notes

- Ensure MongoDB is running before starting the server
- Ensure `.env` is properly configured
- Client runs using Vite development server
- Server runs using Node.js + Express

## Architecture

```
Boundary  →  routes / controllers / middleware
Control   →  services
Entity    →  models / repositories
```

---

## User Stories

| Taiga ID | User Story | Sprint |
| --- | --- | --- |
| 1 | As a UA, I want to create a user profile so that I can register and manage profile details for new user in the system. | 2 |
| 2 | As a UA, I want to view a user profile so that I can access and verify a user's personal details when needed. | 2 |
| 3 | As a UA, I want to update a user profile so that I can keep the user's personal information accurate and up to date. | 2 |
| 4 | As a UA, I want to suspend a user profile so that I can remove outdated or inactive user information from the system. | 2 |
| 5 | As a UA, I want to search for user profiles so that I can quickly locate specific users and manage their information efficiently. | 2 |
| 6 | As a UA, I want to create a user account so that I can grant system access to a user and make sure that they are assigned an appropriate user type. | 1 |
| 7 | As a UA, I want to view a user account so that I can check account details such as login details, user type, and account status. | 1 |
| 8 | As a UA, I want to update a user account so that I can modify login details, user type, or account status when required. | 1 |
| 9 | As a UA, I want to suspend a user account so that I can remove system access for users who no longer require it. | 2 |
| 10 | As a UA, I want to search for user accounts so that I can quickly find and manage specific accounts. | 2 |
| 11 | As a UA, I want to log in so that I can securely access the system and perform administrative functions. | 2 |
| 12 | As a UA, I want to log out so that I can securely end my session and prevent unauthorized administrative functions. | 2 |
| 13 | As an FR, I want to create FRA so that I can publish a campaign and start seeking support from potential donors. | 3 |
| 14 | As an FR, I want to view my FRA so that I can review their details and monitor the campaigns I have created. | 3 |
| 15 | As an FR, I want to update my FRA so that I can keep the campaign information accurate, relevant, and up to date. | 3 |
| 16 | As an FR, I want to suspend my FRA so that I can stop the campaign from being active when it is no longer appropriate to receive support. | 3 |
| 17 | As an FR, I want to search my FRA so that I can quickly find and manage specific campaigns efficiently. | 3 |
| 18 | As an FR, I want to log in so that I can securely access my account and manage my FRA. | 3 |
| 19 | As an FR, I want to log out so that I can securely end my session and prevent unauthorised access to my FRA. | 3 |
| 20 | As a Donee, I want to search for FRA so that I can find campaigns that match my interests or needs efficiently. | 4 |
| 21 | As a Donee, I want to view FRA so that I can understand its details before deciding whether to support or save it. | 4 |
| 22 | As a Donee, I want to save FRA into my favourite list so that I can easily access it again later without searching for it again. | 4 |
| 23 | As a Donee, I want to view my favourite list so that I can review all the FRA I have saved in one place. | 4 |
| 24 | As a Donee, I want to search within my favourite list so that I can quickly find a specific FRA I have saved. | 4 |
| 25 | As a Donee, I want to log in so that I can securely access my account and use personalised features such as my favourite list. | 4 |
| 26 | As a Donee, I want to log out so that I can securely end my session and prevent unauthorised access to my account and saved activities. | 4 |
| 27 | As an FR, I want to view the number of views of my FRA so that I can understand how much visibility and reach my campaign is receiving. | 3 |
| 28 | As an FR, I want to view the number of times my FRA has been shortlisted so that I can assess the level of genuine interest from potential donors. | 3 |
| 29 | As an FR, I want to search the history of my completed FRA so that I can locate specific campaigns based on filter criteria such as service or date period. | 3 |
| 30 | As an FR, I want to view a completed FRA so that I can review its details and evaluate its performance. | 3 |
| 31 | As a Donee, I want to search my donation history and FRA so that I can find relevant records based on filter criteria such as category or date period. | 4 |
| 32 | As a Donee, I want to view the details and progress of a FRA so that I can understand how the campaign I supported is performing. | 4 |
| 33 | As Platform Management, I want to create an FRA category so that I can organise fundraising activities into meaningful groups for easier classification and searching. | 5 |
| 34 | As Platform Management, I want to view FRA categories so that I can review the categories available in the system and ensure they are correct. | 5 |
| 35 | As Platform Management, I want to update an FRA category so that I can keep category information accurate and relevant to the system's needs. | 5 |
| 36 | As Platform Management, I want to suspend an FRA category so that I can prevent outdated or inappropriate categories from being used without deleting historical data. | 5 |
| 37 | As Platform Management, I want to search FRA categories so that I can quickly locate and manage specific categories efficiently. | 5 |
| 38 | As Platform Management, I want to generate a daily report so that I can monitor the platform's daily fundraising activities and operational performance. | 5 |
| 39 | As Platform Management, I want to generate a weekly report so that I can review fundraising performance and platform activity over a one-week period. | 5 |
| 40 | As Platform Management, I want to generate a monthly report so that I can evaluate longer-term fundraising trends and overall platform performance. | 5 |
| 41 | As Platform Management, I want to log in so that I can securely access the platform's administrative features such as category management and report generation. | 5 |
| 42 | As Platform Management, I want to log out so that I can securely end my session and prevent unauthorised access to the platform's administrative functions. | 5 |

---

## Controller Mapping

### 🔐 auth

| Controller | Stories |
| --- | --- |
| `loginController.js` | 11, 18, 25, 41 |
| `logoutController.js` | 12, 19, 26, 42 |

### 👤 userAccount

| Controller | Story |
| --- | --- |
| `createAccountController.js` | 6 |
| `viewAccountController.js` | 7 |
| `updateAccountController.js` | 8 |
| `suspendAccountController.js` | 9 |
| `searchAccountController.js` | 10 |

### 🧾 userProfile

| Controller | Story |
| --- | --- |
| `createProfileController.js` | 1 |
| `viewProfileController.js` | 2 |
| `updateProfileController.js` | 3 |
| `suspendProfileController.js` | 4 |
| `searchProfileController.js` | 5 |
| `listAllProfilesController.js` | Additional - supports profile dropdown |

### 💰 fra

| Controller | Story |
| --- | --- |
| `createMyFRAController.js` | 13 |
| `listMyFRAController.js` | Additional - no story |
| `updateMyFRAController.js` | 15 |
| `suspendMyFRAController.js` | 16 |
| `markCompleteFRAController.js` | Additional - no story |
| `listAllFRAController.js.js` | Additional - no story |
| `viewMyCompletedFRAController.js` | 30 |
| `searchFRAController.js` | 17, 20 |
| `viewFRAController.js` | 21, 32, 14 |
| `viewFRAViewCountController.js` | 27, 28 |
| `searchAllFRAController.js` | 29 |

### ⭐ favourite

| Controller | Story |
| --- | --- |
| `saveFavouriteController.js` | 22 |
| `viewFavouriteController.js` | 23 |
| `searchFavouriteController.js` | 24 |
| `removeFavouriteController.js` | Additional - no story |
| `listFavouriteController.js.js` | Additional - no story |

### 💳 donation

| Controller | Story |
| --- | --- |
| `createDonationController.js` | Additional - no story |
| `listDonationHistoryController.js.js` | Additional - no story |
| `searchDonationHistoryController.js` | 31 |

### 🗂️ fraCategory

| Controller | Story |
| --- | --- |
| `createFRACategoryController.js` | 33 |
| `viewFRACategoryController.js` | 34 |
| `updateFRACategoryController.js` | 35 |
| `suspendFRACategoryController.js` | 36 |
| `searchFRACategoryController.js` | 37 |
| `listAllCategoriesController.js` | Additional - supports category dropdown |

### 📊 report

| Controller | Story |
| --- | --- |
| `generateDailyReportController.js` | 38 |
| `generateWeeklyReportController.js` | 39 |
| `generateMonthlyReportController.js` | 40 |
