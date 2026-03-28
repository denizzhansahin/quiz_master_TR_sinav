export default {
  "expo": {
    "name": "YKS-KPSS Quiz Master TR",
    "slug": "quiz_master_tr",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/logo.png",
    "scheme": "quizmastertr",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.denizhansahin.quiz-master-tr"
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/logo.png",
        "backgroundImage": "./assets/images/logo.png",
        "monochromeImage": "./assets/images/logo.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": "com.denizhansahin.quiz_master_tr"
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon_logo.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash_logo.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ],
      "expo-sqlite",
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": process.env.androidAppId,
          "iosAppId": process.env.iosAppId
        }
      ],
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
};
