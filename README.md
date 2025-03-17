# Library Booking System

A comprehensive system for managing library table bookings with modern DevOps practices.

## Technologies Used

### Backend
- Node.js/Express backend service
- MongoDB for database

### Frontend
- React.js frontend application
- TypeScript
- Tailwind CSS

### DevOps Technologies
1. **Containerization (Docker)**
   - Dockerfile for containerizing the application
   - Container image optimization for production

2. **Container Orchestration (Kubernetes)**
   - Deployment configurations
   - Service definitions
   - Ingress setup
   - Load balancing

3. **Infrastructure as Code (Terraform)**
   - AWS infrastructure provisioning
   - Infrastructure state management
   - Resource configurations

4. **CI/CD (GitHub Actions)**
   - Automated testing
   - Build pipeline
   - Containerization
   - Deployment automation

## Getting Started

### Local Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm start
```

### Database Setup with Docker
```bash
# Start MongoDB container
docker-compose up -d mongodb

# Optional: Start Mongo Express (MongoDB UI) by uncommenting its section in docker-compose.yml
# Access MongoDB UI at http://localhost:8081
```

### Application Deployment
```bash
# Start only the database
docker-compose up -d mongodb

# For local development with Docker database
cd backend
npm install
npm run dev

cd frontend
npm install
npm start
```

### Kubernetes Deployment
```bash
kubectl apply -f infra/kubernetes/
```

### Infrastructure Deployment
```bash
cd infra/terraform
terraform init
terraform plan
terraform apply
```

## Project Structure
```
📂 library-booking-system
├── 📂 backend               # Node.js/Express backend
├── 📂 frontend             # React.js frontend
├── 📂 infra               
│   ├── kubernetes         # Kubernetes manifests
│   └── terraform          # Terraform configurations
└── 📂 .github             # GitHub Actions workflows
```

## Environment Variables
Configure your `.env` file with:
```
PORT=4000
MONGO_URI=mongodb://mongodb:27017/libraryBookingSystem  # When using Docker
JWT_SECRET=your_jwt_secret
```

### Database Access
- MongoDB runs on: `mongodb://mongodb:27017` (inside Docker) or `mongodb://localhost:27017` (from host)
- Optional MongoDB UI: http://localhost:8081 (if mongo-express is enabled in docker-compose.yml)

## Contributing
1. Create a new branch
2. Make changes
3. Submit a pull request

## License
MIT License
