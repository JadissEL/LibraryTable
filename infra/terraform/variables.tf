# ====================================
# TERRAFORM VARIABLES DECLARATION
# ====================================
# This file defines input variables for the Terraform configuration
# Learning Path: Infrastructure as Code (IaC) Variables Management
# - Variable types and constraints
# - Environment-specific configurations
# - Secret management in IaC

# Kubernetes Configuration Path Variable
# Skills to learn:
# - Kubernetes cluster management
# - Configuration file security
# - Environment separation practices
variable "kubeconfig_path" {
  description = "Path to kubeconfig file"
  type        = string
  # Default path to local Kubernetes config
  # Skills to learn: 
  # - Kubernetes context management
  # - CI/CD integration with Kubernetes
  default     = "~/.kube/config"
}

# Namespace Declaration
# Skills to learn:
# - Kubernetes namespaces and isolation
# - Multi-tenant architecture
# - Resource organization in Kubernetes
variable "namespace" {
  description = "Kubernetes namespace for the application"
  type        = string
  # Application-specific namespace
  # Skills to learn:
  # - Namespace-based access control
  # - Resource quota management
  # - Network policies
  default     = "library-booking-system"
}

# Application Scaling Configuration
# Skills to learn:
# - Horizontal Pod Autoscaling
# - Load balancing concepts
# - High availability patterns
variable "app_replicas" {
  description = "Number of application replicas"
  type        = number
  # Default replica count for high availability
  # Skills to learn:
  # - Container orchestration
  # - Service reliability
  # - Resource optimization
  default     = 2
}
