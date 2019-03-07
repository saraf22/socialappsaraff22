import React, { Component } from "react";
import { Text, View } from "react-native";
import firebase from "react-native-firebase";
export class Logout extends Component {
  componentDidMount() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.navigation.navigate("Login");
      });
  }
  render() {
    return (
      <View>
        <Text />
      </View>
    );
  }
}

export default Logout;
