pipeline {
  agent { label 'my-agent' }

  environment {
    IMAGE = "REPLACE_DOCKER_REPO:prod-${env.BUILD_NUMBER}"
    APP_BRANCH = "prod"
  }

  stages {
    stage('Build Docker Image') {
      steps { sh "docker build -t $IMAGE ." }
    }
    stage('Push Image') {
      steps {
        sh """
        echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
        docker push $IMAGE
        """
      }
    }
    stage('Deploy to Kubernetes Prod') {
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
