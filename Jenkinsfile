pipeline {
  agent { label 'docker-agent' }

  environment {
    IMAGE = "tusharrahangdale/kubernetes-multi-branch:dev-${env.BUILD_NUMBER}"
    APP_BRANCH = "dev"
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

    stage('Deploy to Kubernetes (DEV)') {
      steps {
        sh """
        kubectl apply -f k8s/deployment-dev.yaml
        kubectl -n dev set image deployment/kubernetes-multi-branch kubernetes-multi-branch=$IMAGE
        kubectl -n dev rollout status deployment/kubernetes-multi-branch
        """
      }
    }
  }
}
