#!/bin/bash

echo "🚀 Secure File Storage System - Setup Script"
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version: $(node -v)"

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    print_warning "MongoDB is not installed or not in PATH. Please ensure MongoDB is running."
else
    print_success "MongoDB found"
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    print_status "Creating .env file from .env.example..."
    cp .env.example .env
    
    # Generate random JWT secret
    JWT_SECRET=$(openssl rand -hex 32)
    sed -i "s/your_super_secret_jwt_key_here_make_it_long_and_complex_at_least_32_characters/$JWT_SECRET/" .env
    
    # Generate random encryption key
    ENCRYPTION_KEY=$(openssl rand -hex 32)
    sed -i "s/your_256_bit_hex_encryption_key_here_64_characters_long/$ENCRYPTION_KEY/" .env
    
    print_success ".env file created with generated secrets"
    print_warning "Please review and update the .env file with your specific configuration"
else
    print_success ".env file already exists"
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p uploads/temp
mkdir -p logs
print_success "Directories created"

# Check if MongoDB connection string is configured
if grep -q "mongodb://localhost:27017" .env; then
    print_warning "MongoDB is configured to use localhost. Make sure MongoDB is running locally."
fi

echo ""
print_success "Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Review and update the .env file with your configuration"
echo "2. Start MongoDB (if using local instance)"
echo "3. Run 'npm run server' to start the backend server"
echo "4. Run 'npm run dev' to start the frontend development server"
echo ""
echo "📚 Check the DEVELOPMENT_PLAN.md for detailed implementation guide"
