# SportSphere Hub

Web application for sports facility reservations, individual training scheduling, sports equipment shopping, and teammate matching.

## Technologies


Frontend: Angular 20, Chart.js, Leaflet  
Backend: NodeJS, Express, Mongoose  
Database: MongoDB  
Authentication: bcrypt, localStorage  
File upload: Multer  
PDF reports: PDFKit  
Avatars: DiceBear API  
Maps: Leaflet + OpenStreetMap  

## User Roles

### Guest
- View total active facilities
- TOP 3 highest rated facilities
- Active promotions
- Facility search

### Athlete
- Profile with personal data
- Court reservation via calendar or form
- Individual training sessions
- Teammate matching
- Facility ratings and comments
- Equipment shop
- Statistics

### Employee
- Profile with legal entity data
- Create and update facilities
- Court management
- View reservations and trainings
- Interactive calendar
- Promotions
- Equipment management
- PDF reports

### Administrator
- View, edit and delete users
- Approve registrations
- Approve facilities
- Manage trainers
- Add sports

## Installation

### Prerequisites

1. NodeJS(22.21.0): https://nodejs.org/dist/v22.21.0/
2. MongoDB(8.2.1): https://www.mongodb.com/try/download/community
3. Angular CLI(20.3.6): npm install –g @angular/cli@20.3.6

### 1. Clone

git clone https://github.com/DaniloMilovanovic/SportSphere-Hub.git  
cd SportSphere-Hub

### 2. Start MongoDB

Start MongoDB service on localhost:27017

### 3. Import database

Create a database sportsphere_hub and import JSON files from db/folder into collections with the same name.

### 4. Backend

cd backend_Node  
npm install  
npm run build  
npm start  

Backend: http://localhost:4000

### 5. Frontend

cd frontend  
npm install  
ng serve  

Frontend: http://localhost:4200

## Dependencies

### Backend
- express
- mongoose
- cors
- multer
- pdfkit
- bcrypt
- typescript

### Frontend
- @angular/core
- @angular/router
- @angular/forms
- chart.js

### External
- DiceBear API
- Leaflet
- OpenStreetMap

## Note

Student project for the "Internet Application Programming" course at the Faculty of Electrical Engineering, University of Belgrade.