output "namespace" {
  description = "The Kubernetes namespace where resources are deployed"
  value       = var.namespace
}

output "app_replicas" {
  description = "Number of application replicas deployed"
  value       = var.app_replicas
}

output "cluster_url" {
  description = "The URL where the application is accessible"
  value       = "http://library-booking-system.${var.namespace}.svc.cluster.local"
}
