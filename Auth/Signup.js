import React, { Component } from "react";
import firebase from "react-native-firebase";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert,
  ActivityIndicator
} from "react-native";

class Signup extends Component {
  static navigationOptions = {
    header: null
  };
  state = {
    fullName: "",
    email: "",
    password: "",
    errorMessage: null,
    loader: false
  };
  handleSignUp() {
    this.setState({
      loader: true
    });
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        this.setState({
          loader: false
        });
        firebase
          .firestore()
          .collection("users")
          .doc(user.user.uid)
          .set({
            id: user.user.uid,
            username: this.state.fullName,
            email: user.user.email
          });
        this.props.navigation.navigate("Login");
      })
      .catch(error => this.setState({ errorMessage: error.message }));
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loader ? (
          <ActivityIndicator size="large" color="#ff4663" />
        ) : null}
        <View style={styles.inputContainer}>
          <Image
            style={styles.inputIcon}
            source={{
              uri: "https://png.icons8.com/male-user/ff4663"
            }}
          />
          <TextInput
            style={styles.inputs}
            placeholder="Full Names"
            keyboardType="email-address"
            onChangeText={fullName => this.setState({ fullName })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Image
            style={styles.inputIcon}
            source={{
              uri: "https://png.icons8.com/message/ff4663"
            }}
          />
          <TextInput
            style={styles.inputs}
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={email => this.setState({ email })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Image
            style={styles.inputIcon}
            source={{
              uri: "https://png.icons8.com/key-2/ff4663"
            }}
          />
          <TextInput
            style={styles.inputs}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={password => this.setState({ password })}
          />
        </View>

        <TouchableHighlight
          style={[styles.buttonContainer, styles.signupButton]}
          onPress={() => this.handleSignUp()}
        >
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableHighlight>

        <View>
          <Text
            style={styles.already}
            onPress={() => this.props.navigation.navigate("Login")}
          >
            Already an user? LOGIN
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  inputContainer: {
    backgroundColor: "whitesmoke",
    borderRadius: 30,
    width: 300,
    height: 45,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderColor: "skyblue",
    flex: 1
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: "center"
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 300,
    borderRadius: 30
  },
  signupButton: {
    backgroundColor: "#ff4663"
  },
  signUpText: {
    color: "white"
  },
  already: {
    color: "black"
  }
});

export default Signup;
