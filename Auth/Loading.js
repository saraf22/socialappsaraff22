import React, { Component } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import firebase from "react-native-firebase";
export class Loading extends Component {
  componentDidMount() {
    firebase
      ? firebase.auth().onAuthStateChanged(user => {
          this.props.navigation.navigate(user ? "Drawer" : "Login");
        })
      : null;
  }
  render() {
    return (
      <View>
        <ActivityIndicator size="large" color="#ff4663" />
      </View>
    );
  }
}

export default Loading;
