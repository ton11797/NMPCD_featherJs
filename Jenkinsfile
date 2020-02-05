pipeline { 
    environment {
        registry = "denice/nmpcd_back"
    }
    agent any 
    stages {
        stage('Building js') {
            steps{
                sh 'echo "Building js"'
                sh 'npm install'
                sh 'npm run compile'
            }
        }
        stage('start pm2') {
            steps{
                sh 'pm2 start pm2run.yaml'
            }
        }
    }
}