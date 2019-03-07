import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  ActivityIndicator
} from "react-native";
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
import ImagePicker from "react-native-image-picker";
import firebase from "react-native-firebase";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
const options = {
  title: "Select Avatar",
  customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
  storageOptions: {
    skipBackup: true,
    path: "images"
  }
};
export class EditPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: "",
      cya: "",
      userName: "",
      livesIn: "",
      avatarSource: null,
      imageFromDb: null,
      loader: true,
      userData: null,
      email: null,
      pointerForPage: "auto",
      imageData: null
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
                imageFromDb: data.data().avatarSource,
                uid: user.uid,
                loader: false
              });
            })
        : null;
    });
  }
  openImagePicker() {
    ImagePicker.showImagePicker(options, response => {
      this.setState({
        imageData: response
      });
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        this.setState({
          avatarSource: response.uri
        });
      }
    });
  }
  update() {
    this.setState({
      loader: true,
      pointerForPage: "none"
    });
    if (
      this.state.imageData !== null &&
      this.state.avatarSource !== this.state.imageFromDb
    ) {
      const fileType = this.state.imageData.fileName;
      const type = fileType.substr(fileType.indexOf(".") + 1);
      const storageRef = firebase
        .storage()
        .ref("/profileImages/" + this.state.imageData.fileName);
      storageRef
        .putFile(this.state.imageData.uri, {
          contentType: `image/${type}`
        })
        .then(data => {
          firebase
            .firestore()
            .collection("users")
            .doc(this.state.uid)
            .set({
              avatarSource:
                data.downloadURL !== null
                  ? data.downloadURL
                  : this.state.imageFromDb,
              username: this.state.userName,
              id: this.state.uid,
              email: this.state.email,
              livesIn: this.state.livesIn,
              cya: this.state.cya
            });
        })
        .then(() => {
          this.setState({
            loader: false,
            pointerForPage: "auto"
          });
          console.warn("Posted Successfully");
          this.props.navigation.navigate("Profile");
        })
        .catch(error => {
          console.warn(error);
        });
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(this.state.uid)
        .set({
          avatarSource: this.state.imageFromDb,
          username: this.state.userName,
          id: this.state.uid,
          email: this.state.email,
          livesIn: this.state.livesIn,
          cya: this.state.cya
        })
        .then(() => {
          this.setState({
            loader: false,
            pointerForPage: "auto"
          });
          console.warn("Posted Successfully");
          this.props.navigation.navigate("Profile");
        })
        .catch(error => {
          console.warn(error);
        });
    }
  }
  render() {
    return (
      <View
        style={styles.containerMain}
        pointerEvents={this.state.pointerForPage}
      >
        <Header style={{ backgroundColor: "#ff4663", elevation: 3 }}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Edit Profile</Title>
          </Body>
          <Right />
        </Header>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.uploadAvatar}
            onPress={() => this.openImagePicker()}
          >
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
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <TextInput
              autoFocus={true}
              style={styles.inputs}
              value={this.state.userName}
              placeholder="User Name"
              onChangeText={userName => this.setState({ userName })}
            />
          </View>

          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              value={this.state.livesIn}
              placeholder="Lives In"
              onChangeText={livesIn => this.setState({ livesIn })}
            />
          </View>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              value={this.state.cya}
              placeholder="What Do You Call Yourself?"
              onChangeText={cya => this.setState({ cya })}
            />
          </View>
          {this.state.loader ? (
            <ActivityIndicator size="large" color="#ff4663" />
          ) : null}
          <TouchableOpacity
            style={[styles.buttonContainer, styles.signupButton]}
            onPress={() => this.update()}
          >
            <Text style={styles.signUpText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  containerMain: {
    flex: 1
  },
  header: {
    flex: 1
  },
  uploadAvatar: {
    height: 150,
    width: 150,
    borderRadius: 100,
    paddingBottom: 20
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 100
  },
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
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center"
  },
  textAreaContainer: {
    backgroundColor: "whitesmoke",
    borderRadius: 30,
    width: 300,
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
  textArea: {
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
export default EditPost;
