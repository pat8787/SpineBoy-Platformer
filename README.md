## Steps on how to run:
`cd www`

`npm i --save phaser`

### Add Browser Platform:
`cordova platform add browser`

`cordova plugin add cordova-plugin-browsersync`

### Run on browser:
`cordova run browser --live-reload`


### Add Mobile Platform
`cordova plugin add https://github.com/AraHovakimyan/cordova-plugin-wkwebviewxhrfix`

`cordova platform add ios android`

### Run on iOS:
`cordova emulate ios`

