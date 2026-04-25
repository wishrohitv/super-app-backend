<!-- Setup Instructions -->
# Setup Instructions
To set up the project, follow these steps:

pre-requisites:
- Node.js (version 24 or higher)
- npm (Node Package Manager)
- MongoDB (for database)
- Cloudinary account (for image storage)

1. **Clone the Repository**: Start by cloning the repository to your local machine using the following command:
   ```bash
   git clone https://github.com/wishrohitv/super-app-backend.git
   ```

2. **Navigate to the Project Directory**: Change your current directory to the project folder:
   ```bash
   cd super-app-backend
   ```

3. **Install Dependencies**: Install the required dependencies using npm:
   ```bash
   npm install
   ```

4. **Configure Environment Variables**: Create a `.env` file in the root directory of the project and add the necessary environment variables. file for the required variables.
    ```env
    PORT=3000
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    ```

5. **Start the Server**: Start the development server using the following command:
    ```bash
    npm run dev
    ``` 
6. **Access the Application**: Once the server is running, you can access the application at `http://localhost:3000`.  