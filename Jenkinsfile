pipeline {
  agent any
  stages {
    stage('Install and Build') {
      agent {
        node {
          label 'Build'
        }

      }
      steps {
        sh 'npm install'
        sh 'npm run screen "--props={\\n  \\"height\\": \\"1080\\",\\n  \\"websiteURL\\": \\"https://tai-studio.netlify.app/\\",\\n  \\"width\\": \\"1920\\"\\n}"'
      }
    }

  }
}