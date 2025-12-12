pipeline {
  agent { label 'my-agent' }

  environment {
    IMAGE = "REPLACE_DOCKER_REPO:dev-${env.BUILD_NUMBER}"
    APP_BRANCH = "dev"
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
    stage('Deploy to Kubernetes Dev') {
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
