/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  createSwitchNavigator,
  createAppContainer,
  createDrawerNavigator,
  createStackNavigator
} from "react-navigation";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import PostsList from "./Screens/Post/PostsList";
import CreatePost from "./Screens/Post/CreatePost";
import Loading from "./Auth/Loading";
import Logout from "./Screens/Extras/Logout";
import Settings from "./Screens/Extras/Settings";
import ViewPost from "./Screens/Post/ViewPost";
import EditPost from "./Screens/Post/EditPost";
import LikedBy from "./Screens/Post/LikedBy";
import Comments from "./Screens/Post/Comments";
import ReplyComment from "./Screens/Post/ReplyComment";
import EditComment from "./Screens/Post/EditComment";
import EditReply from "./Screens/Post/EditReply";
import EditProfile from "./Screens/User/EditProfile";
import OtherUserProfile from "./Screens/User/OtherUserProfile";
const Drawer = createDrawerNavigator(
  {
    PostsList: { screen: PostsList },
    Settings,
    Logout
  },
  {
    initialRouteName: "PostsList",
    contentOptions: {
      activeTintColor: "#ff4663"
    }
  }
);

const AuthStack = createStackNavigator(
  {
    Login: { screen: Login },
    Signup: { screen: Signup },
    Drawer: { screen: Drawer }
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);
const PostStack = createStackNavigator(
  {
    Drawer,
    CreatePost: { screen: CreatePost },
    ViewPost: { screen: ViewPost },
    EditPost: { screen: EditPost },
    LikedBy: { screen: LikedBy },
    Comments: { screen: Comments },
    ReplyComment: { screen: ReplyComment },
    EditComment: { screen: EditComment },
    EditReply: { screen: EditReply },
    EditProfile: { screen: EditProfile },
    OtherUserProfile: { screen: OtherUserProfile }
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);
const Switch = createSwitchNavigator(
  {
    Loading,
    AuthStack,
    PostStack
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);

const AppCont = createAppContainer(Switch);
export default class App extends Component {
  render() {
    return <AppCont />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});
