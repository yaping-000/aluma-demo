#!/bin/bash

# Aluma Demo Deployment Script
# This script deploys the frontend to Vercel and backend to Railway

set -e

echo "🚀 Starting Aluma Demo Deployment..."

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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI is not installed. Please install it with: npm i -g vercel"
        exit 1
    fi
    
    if ! command -v railway &> /dev/null; then
        print_error "Railway CLI is not installed. Please install it with: npm i -g @railway/cli"
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Deploy backend to Railway
deploy_backend() {
    print_status "Deploying backend to Railway..."
    
    cd backend
    
    # Check if Railway project is linked
    if [ ! -f ".railway" ]; then
        print_warning "Railway project not linked. Please run: railway login && railway link"
        print_status "You can also deploy manually by running: railway up"
        cd ..
        return
    fi
    
    # Deploy to Railway
    railway up --detach
    
    cd ..
    print_success "Backend deployment initiated"
}

# Deploy frontend to Vercel
deploy_frontend() {
    print_status "Deploying frontend to Vercel..."
    
    cd frontend
    
    # Check if Vercel project is linked
    if [ ! -f ".vercel" ]; then
        print_warning "Vercel project not linked. Please run: vercel"
        print_status "You can also deploy manually by running: vercel --prod"
        cd ..
        return
    fi
    
    # Deploy to Vercel
    vercel --prod
    
    cd ..
    print_success "Frontend deployment initiated"
}

# Main deployment process
main() {
    print_status "Starting deployment process..."
    
    # Check dependencies
    check_dependencies
    
    # Deploy backend first
    deploy_backend
    
    # Wait a moment for backend to start
    sleep 5
    
    # Deploy frontend
    deploy_frontend
    
    print_success "Deployment process completed!"
    print_status "Check your Railway and Vercel dashboards for deployment status"
}

# Run main function
main "$@" 