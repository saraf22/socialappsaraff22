import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  ImageBackground
} from "react-native";
import firebase from "react-native-firebase";
import {
  Container,
  Header,
  Title,
  Button,
  Icon,
  Left,
  Right,
  Body
} from "native-base";
export class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: "",
      cya: "",
      userName: "",
      livesIn: "",
      avatarSource: null,
      loader: true,
      userData: null,
      email: null
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      user
        ? firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .get()
            .then(data => {
              this.setState({
                userName: data.data().username,
                livesIn: data.data().livesIn || null,
                cya: data.data().cya || null,
                email: data.data().email,
                avatarSource: data.data().avatarSource || null,
                uid: user.uid,
                loader: false
              });
            })
        : null;
    });
  }
  render() {
    return (
      <ImageBackground
        source={{
          uri: this.state.avatarSource
        }}
        style={{ flex: 1, backgroundColor: "black" }}
      >
        <Header
          androidStatusBarColor="rgb(196, 35, 59)"
          style={{ backgroundColor: "rgba(0,0,0,0)" }}
          noShadow
        >
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body />
          <Right>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("EditProfile")}
            >
              <Icon name="create" />
            </Button>
          </Right>
        </Header>
        <View
          source={{
            uri: this.state.avatarSource
          }}
          style={{
            width: "100%",
            height: "100%",
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-start"
          }}
        >
          <View style={styles.uploadAvatar}>
            {this.state.avatarSource !== null ? (
              <Image
                source={{
                  uri: this.state.avatarSource
                }}
                style={styles.image}
              />
            ) : (
              <Image
                source={require("./profile-placeholder.png")}
                style={styles.image}
              />
            )}
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{this.state.userName}</Text>
            {this.state.loader ? (
              <ActivityIndicator size="large" color="#ff4663" />
            ) : null}
            <View
              style={{
                flexDirection: "row",
                color: "white",
                alignItems: "center",
                padding: 20
              }}
            >
              <Icon name="information-circle" style={{ color: "#ff4663" }} />
              <Text style={styles.info}>{this.state.cya || "--No Info--"}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                color: "white",
                alignItems: "center",
                padding: 20
              }}
            >
              <Icon name="pin" style={{ color: "#ff4663" }} />
              <Text style={styles.info}>
                {this.state.livesIn || "--No Info--"}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                color: "white",
                alignItems: "center",
                padding: 20
              }}
            >
              <Icon name="mail" style={{ color: "#ff4663" }} />
              <Text style={styles.info}>{this.state.email}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  uploadAvatar: {
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    width: 150,
    borderRadius: 100,
    position: "relative",
    top: 30,
    elevation: 4,
    backgroundColor: "#ff4663"
  },
  image: {
    height: 145,
    width: 145,
    borderRadius: 100
  },
  infoContainer: {
    opacity: 0.82,
    width: "85%",
    backgroundColor: "rgba(0,0,0,0.85)",
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20
  },
  name: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
    marginTop: 25,
    marginBottom: 20,
    paddingLeft: 20
  },
  info: {
    paddingLeft: 15,
    color: "white"
  }
});
export default Profile;
