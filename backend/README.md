# Library Booking System Backend

This is the backend component of the Library Booking System. It consists of:

- **Node.js/Express** for the server
- **MongoDB** as the database
- **Dockerfile** for containerization
- **Terraform** and **Kubernetes** files in the infra folder for deployment

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Run in development**:
   ```bash
   npm run dev
   ```
3. **Production build and run**:
   ```bash
   npm start
   ```

Configure your `.env` file to set environment variables such as `PORT` and `MONGO_URI`.
