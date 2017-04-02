# About the Toolchain

The site is deployed using [Google's Firebase](https://firebase.google.com/) service. Firebase is great for many reasons including:

- [x] Standard CDN behavior
- [x] Http/2 support
- [x] Automagic SSL/TLS provision
- [x] Generous free tier
- [x] Great developer CLI
- [x] Full services for file storage, custom domains, and real-time database

The Firebase URL is [semo-capston-haiti.firebaseapp.com](https://semo-capston-haiti.firebaseapp.com/). This is the direct URL for the server, however opte.us will forward traffic to it using standard A records. 

# Deploying the App

1. Clone the Repository
 - Install [Git](https://git-scm.com/)
 - Run `git clone https://github.com/josiah1888/semo-capstone.git`
 
2. Install project dependencies
 - [NodeJS](https://nodejs.org/en/download/)
 - Run `npm install -g gulp http-server firebase-tools`
 
3. Login with the [Firebase CLI](https://firebase.google.com/docs/cli/)
 - Run `firebase login`, login with credentials for the project
 
4. Make the changes you would like

5. Run `npm start` to build the project

6. Run `firebase deploy` to push the code to the server
