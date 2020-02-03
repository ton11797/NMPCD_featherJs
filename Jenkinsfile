pipeline { 
    environment {
        registry = "denice/nmpcd_back"
    }
    agent any 
    stages {
        stage('Building image') {
            steps{
                script {
                    docker.build registry + ":$BUILD_NUMBER"
                }
            }
        }
    }
}