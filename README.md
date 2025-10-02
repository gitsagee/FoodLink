Foodlink: A Food and Fund Donation Platform
Foodlink is a full-stack web application built on the MERN stack, designed to bridge the gap between food donors and non-governmental organizations (NGOs). It provides a centralized platform to reduce food waste and combat hunger by facilitating the donation of surplus food and funds to those in need.

🎯 Problem Statement
In our communities, a significant amount of edible food from restaurants, events, and households is wasted daily, while many individuals and families face food insecurity. At the same time, NGOs working to feed the hungry often struggle with limited resources and inconsistent food supplies. Foodlink addresses this logistical and informational disconnect by creating an efficient, trustworthy, and scalable digital ecosystem.

✨ Key Features
The platform offers a seamless experience with role-based access control for different types of users:

👤 For Donors:
Easy Registration: Quickly sign up to start donating.

List Food Donations: Easily list surplus food items with details like name, quantity, and expiry date.

Donate Funds: Contribute monetarily to support NGOs.

Donation History: Keep track of all past food and fund donations.

Profile Management: Update personal information.

🤝 For NGOs:
Secure Verification: NGOs undergo an admin-approval process to ensure legitimacy and build trust.

Browse Donations: View a real-time feed of all available food donations.

Place Orders: Order required food items for a nominal fee.

Order History: View and manage a history of all past orders.

Profile Management: Update organization details.

⚙️ For Admins:
Centralized Dashboard: A comprehensive dashboard to oversee all platform activity.

User Management: View and manage all registered donors and NGOs.

NGO Verification: Approve or revoke NGO access to maintain platform integrity.

Monitor Activity: Track all food donations, fund contributions, and orders placed.

Top Donor Leaderboards: View leaderboards to recognize top contributors.

💻 Technology Stack
Foodlink is built with a modern and robust technology stack:

Backend: Node.js, Express.js

Frontend: React

Database: MongoDB with Mongoose ODM

Authentication: JSON Web Tokens (JWT)

Password Security: bcryptjs

HTTP Client: Axios

🚀 Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Make sure you have Node.js and npm installed on your machine.

npm

npm install npm@latest -g

You will also need a MongoDB database. You can use a local instance or a cloud service like MongoDB Atlas.

Installation
Clone the repo

git clone [https://github.com/your_username/foodlink.git](https://github.com/your_username/foodlink.git)

Navigate to the project directory

cd foodlink

Install Backend Dependencies

cd backend
npm install

Install Frontend Dependencies

cd ../frontend
npm install

Set up Environment Variables
Create a .env file in the backend directory and add the following:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Run the Application

To run the backend server (from the backend directory):

npm start

To run the frontend React app (from the frontend directory):

npm start

The application should now be running on your local machine.

🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

License
Distributed under the MIT License. See LICENSE for more information.
