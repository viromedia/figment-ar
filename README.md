# Figment AR
This repository contains the entire source code, built using ViroReact and React Native, for Viro Media's Figment AR App. Available on [Google Play](https://play.google.com/store/apps/details?id=com.viro.figment) and [App Store](https://itunes.apple.com/us/app/figment-ar/id1270018902?mt=8).

<img src="screenshots/figment_1.png" width="200"/> <img src="screenshots/figment_2.png" width="200"/> <img src="screenshots/figment_3.png" width="200"/> <img src="screenshots/figment_4.png" width="200"/>

## Installation
Follow the installation guide below to set up and run this source code locally on Mac/Linux (For setting up on Windows, go through Windows specific steps to setup Android Studio [here](https://docs.viromedia.com/docs/quick-start-windows) and [here](https://docs.viromedia.com/docs/installing-viro-android)

### Prerequisites
1. Make sure you have signed up on www.viromedia.com/signup and have your API key
2. And have gone through our [Quick Start (Mac/Linux)](https://docs.viromedia.com/docs/quick-start) page and installed the required dependencies.
3. iOS Device with A9 chip or higher and running iOS 11 or an [ARCore supported device](https://developers.google.com/ar/discover/supported-devices) running Android N or higher.
4. For iOS - Xcode 9 or later.
5. For Android - Android Studio for the Android SDK and tools.
  
    _Make sure to install the Android SDK and build tools for API level 26_

### Clone Repo
```
git clone https://github.com/viromedia/figment-ar.git
cd figment-ar
```

### Install and setup dependencies
#### All platforms
```
npm install
```
#### iOS
```
cd ios
pod install
```
#### Android
Nothing needed here

### Running and Debugging the app
#### Add your API key
Open file `js/app.js`. Update `ViroARSceneNavigator` definition's `apiKey` at lines 127 with your own API Key
#### Android
1. For Android, make sure you have downloaded and installed Android Studio from [here](https://developer.android.com/studio/install) to get required SDK and platform-tools for building android apps
    Make sure you have the required environment variables set - `$ANDROID_HOME`, and added `platform-tools` to `$PATH` variable. If not,
    ```
    export ANDROID_HOME=/YOUR_PATH_TO/Android/sdk
    export PATH=$ANDROID_HOME/platform-tools:$PATH
    export PATH=$ANDROID_HOME/tools:$PATH
    ```
2. To build, install and launch the android app, from the root of the project (`viro/` directory)
    ```
    react-native run-android --variant=gvrDebug
    ```
#### iOS
For building iOS App via Xcode
1. Open Xcode workspace
```
cd ios
open figment.xcworkspace
```
2. Select correct Team and Provisioning Profiles for Signing the app in Xcode. 
3. Click Play button to build and install 

## Project Structure
The JS portion of the app is structured as below:
```
figment-ar/js/
├── app.js    // Entry point for the app
├── figment.js    // AR Scene where all the Viro Components are rendered 
├── component
│   ├── ARInitializationUI.js    // AR Initialization animation
│   ├── ButtonComponent.js    // Buttons used in the bottom-left menu switching listview contents between Portals, Objects, Effect 
│   ├── ContextMenuButton.js    // Menu on the top right that appears when you tap a 3D object / Portal
│   ├── EffectItemRender.js    // Render the selected effect from listview
│   ├── FigmentListView.js    // ListView at the bottom
│   ├── ListViewItem.js    // Individual items in ListView
│   ├── ModelItemRender.js    // Render the Model (Object) from the listview added by user
│   ├── PSConstants.js    // Constants used in PhotoSelector and Portals
│   ├── PhotosSelector.js    // UI to enable user to select backgrounds for Portals
│   ├── PortalItemRender.js   // Render the Object from the listview added by user
│   ├── RecordButton.js    // Red record video button at the bottom
│   ├── ShareScreenButtonComponent.js   // Share button on preview screen
│   └── SuccessAnimation.js   // Save to Camera Roll Success animation
├── effects
│   └── effects.js    // Post Processing effects and Particle Emitters list

├── helpers
│   └── renderIf.js    // Helper function for conditional rendering
├── model
│   ├── EffectItems.js   // Data model for Effects
│   ├── ModelItems.js    // Data model for Models (Objects)
│   ├── PortalItems.js    // Data model for Portals
│   └── emitters
│       ├── BirthdayCakeEmitter.js    // Particle Emitter for "flame" on top of birthday cake 
│       ├── EmojiAngryEmitter.js    // Particle Emitter for "smoke" coming out from Angry Emoji's ears 
│       └── ParticleEmitter.js     // Helper function to add above particle emitters to birthday cake and emoji models
├── redux
│   ├── EffectsConstants.js
│   ├── LoadingStateConstants.js
│   ├── UIConstants.js
│   ├── actions
│   │   └── index.js    // Redux actions
│   └── reducers
│       ├── arobjects.js    // Redux store / reducers for Viro components in AR Scene
│       ├── index.js    // Combining arobjects.js and ui.js reducers
│       └── ui.js    // Redux store / reducers for 2D UI components
└── res
```
## Troubleshooting
For iOS you might run into a few issues such as follows:
### Xcode: Undefined symbols for architecture x86_64: "JSObjectGetPrototype"
Refer to https://github.com/facebook/react-native/issues/23183 for how to fix it

### "TextCompositionLayer.swift" used twice IOS
Refer to https://github.com/react-native-community/lottie-react-native/issues/523 for how to fix
If doing the steps mentioned on `lottie-react-native` does not fix it, open Lottie.xcodeproj in your Xcode's project explorer under Libraries and search for `TextCompositionLayer.swift`. You might notice this file being included twice. Simply delete one of them from Xcode (reference only). It's basically including two copies of the same file. And that should resolve the problem for you.
