import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { Platform } from "react-native";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import Entry from "../screens/Entry";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {}
});

const EntryStack = createSwitchNavigator(
  {
    Entry: Entry,
    Login: Login,
    Signup: Signup
  },
  {
    initialRouteName: "Entry"
  },
  {
    navigationOptions: {
      gesturesEnabled: true
    }
  },
  config
);

const AuthPages = createAppContainer(EntryStack);
export default AuthPages;
