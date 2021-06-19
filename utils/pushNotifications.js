import PushNotifications from 'node-pushnotifications';

const settings = {
    gcm: {
        id: null,
        phonegap: false, // phonegap compatibility mode, see below (defaults to false)
        // ...
    },
    apn: {
        token: {
            key: './certs/key.p8', // optionally: fs.readFileSync('./certs/key.p8')
            keyId: 'ABCD',
            teamId: 'EFGH',
        },
        production: false // true for APN production environment, false for APN sandbox environment,
        // ...
    },
    isAlwaysUseFCM: false, // true all messages will be sent through node-gcm (which actually uses FCM)
};
const push = new PushNotifications(settings);

// module.exports = {
//     push
    
// }