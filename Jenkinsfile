pipeline {
  agent { label 'docker-agent' }

  environment {
    IMAGE = "tusharrahangdale/kubernetes-multi-branch:prod-${env.BUILD_NUMBER}"
    APP_BRANCH = "prod"
  }

  stages {
    stage('Build Docker Image') {
      steps { sh "docker build -t $IMAGE ." }
    }

    stage('Push Image') {
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: 'dockerhub-creds',
            usernameVariable: 'DOCKER_USERNAME',
            passwordVariable: 'DOCKER_PASSWORD'
          )
        ]) {
          sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin"
          sh "docker push $IMAGE"
        }
      }
    }

    stage('Deploy to Kubernetes (PROD)') {
      steps {
        sh """
        kubectl apply -f k8s/deployment-prod.yaml
        kubectl -n prod set image deployment/kubernetes-multi-branch kubernetes-multi-branch=$IMAGE
        kubectl -n prod rollout status deployment/kubernetes-multi-branch
        """
      }
    }
  }
}
