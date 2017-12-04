pipeline {
    agent any
    tools {
        nodejs 'Node 8.9.1'
    }
    parameters {
        booleanParam(name: 'RELEASE', defaultValue: false, description: 'Generar un release?')
    }

    environment {
        ACAMICA_TOKEN = credentials('acamica-npm-token')
        GITHUB_TOKEN  = credentials('acamica-release-token')
        REGISTRY      = credentials('acamica-registry-password')
        AWS_CDN_FILE  = credentials('acamica-aws-cdn')
        NPM_TOKEN     = '1' // semantic release need this environment
        CI            = '1' // semantic release need this environment
    }
    stages {
        stage('Install dependencies') {
            steps {
                sh 'node -v'
                sh 'npm -v'
                sh "echo //registry.npmjs.org/:_authToken=${env.ACAMICA_TOKEN} > .npmrc" //TODO: replace with folder credentials
                sh 'npm whoami'
                sh 'npm install'
                sh 'rm .npmrc'
            }
        }

        stage('Semantic release') {
            when { expression { return params.RELEASE } }

            steps {
                sh 'npm run semantic-release'
                sh 'rm .npmrc'
            }
        }

        stage('Build Docker images for Production') {
            when { expression { return params.RELEASE } }
            steps {
                //TODO: replace with folder credentials
                sh "echo //registry.npmjs.org/:_authToken=${env.ACAMICA_TOKEN} > .npmrc"
                sh './docker-build.sh ${JOB_NAME} jenkins-${BUILD_NUMBER}'
                sh 'docker login -u ${REGISTRY_USR} -p ${REGISTRY_PSW} registry.acamica.com' //TODO: replace with folder credentials
                sh './docker-push.sh ${JOB_NAME} jenkins-${BUILD_NUMBER}'
                sh 'rm .npmrc'
            }
        }
    }

    post {
        success {
            slackSend channel: env.SLACK_SUCC_CHANNEL, color: 'good', message: "Build finished successfully : ${env.JOB_NAME} - ${env.BUILD_NUMBER} (<${env.JOB_URL}|Open>)"
        }
        failure {
            slackSend channel: env.SLACK_ERR_CHANNEL, color: '#FF0000', message: "Build failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER} (<${env.JOB_URL}|Open>)"
        }
    }
}
