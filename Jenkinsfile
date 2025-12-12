pipeline {
  agent { label 'my-agent' }

  environment {
    IMAGE = "REPLACE_DOCKER_REPO:qa-${env.BUILD_NUMBER}"
    APP_BRANCH = "qa"
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
    stage('Deploy to Kubernetes QA') {
      steps {
        sh """
        kubectl apply -f k8s/deployment-qa.yaml
        kubectl -n qa set image deployment/kubernetes-multi-branch kubernetes-multi-branch=$IMAGE
        kubectl -n qa rollout status deployment/kubernetes-multi-branch
        """
      }
    }
  }
}
