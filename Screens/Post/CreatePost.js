import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Image,
  ActivityIndicator
} from "react-native";
import ImagePicker from "react-native-image-picker";
import firebase from "react-native-firebase";
import { Header, Title, Button, Icon, Left, Right, Body } from "native-base";
const options = {
  title: "Select Avatars",
  customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
  storageOptions: {
    skipBackup: true,
    path: "images"
  }
};
export class CreatePost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageData: null,
      avatarSource: null,
      title: "",
      desc: "",
      date: new Date(),
      createdBy: null,
      likes: [],
      commentSize: 0,
      loader: false,
      userName: "",
      pointerForPage: "auto"
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
            .then(doc => {
              this.setState({
                createdBy: user.uid,
                userName: doc.data().username
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
        console.log("User cancelled picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const source = { uri: response.uri };

        this.setState({
          avatarSource: source
        });
      }
    });
  }
  post() {
    this.setState({
      loader: true,
      pointerForPage: "none"
    });
    const fileType = this.state.imageData.fileName;
    const type = fileType.substr(fileType.indexOf(".") + 1);
    const storageRef = firebase
      .storage()
      .ref("/postImages/" + this.state.imageData.fileName);
    storageRef
      .putFile(this.state.imageData.uri, {
        contentType: `image/${type}`
      })
      .then(data => {
        firebase
          .firestore()
          .collection("posts")
          .add({
            title: this.state.title || "",
            desc: this.state.desc || "",
            date: new Date(),
            createdBy: this.state.createdBy,
            likes: [],
            commentSize: 0,
            image: data.downloadURL || "",
            userName: this.state.userName,
            edited: false
          });
      })
      .then(() => {
        this.setState({
          loader: false,
          pointerForPage: "auto"
        });
        console.warn("Posted Successfully");
        this.props.navigation.navigate("Drawer");
      })
      .catch(error => {
        console.warn(error);
      });
  }
  render() {
    console.log(this.props);
    return (
      <View
        style={styles.containerMain}
        pointerEvents={this.state.pointerForPage}
      >
        <Header style={{ backgroundColor: "#ff4663" }}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Create Post</Title>
          </Body>
          <Right />
        </Header>
        <View style={styles.container}>
          <TouchableHighlight
            style={styles.uploadAvatar}
            onPress={() => this.openImagePicker()}
          >
            <Image
              source={
                this.state.avatarSource || require("./placeholder-image.png")
              }
              style={styles.image}
            />
          </TouchableHighlight>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputs}
              placeholder="Post Title"
              onChangeText={title => this.setState({ title })}
            />
          </View>

          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              multiline={true}
              numberOfLines={6}
              placeholder="Post Description"
              onChangeText={desc => this.setState({ desc })}
            />
          </View>
          {this.state.loader ? (
            <ActivityIndicator size="large" color="#ff4663" />
          ) : null}
          <TouchableHighlight
            style={[styles.buttonContainer, styles.signupButton]}
            onPress={() => this.post()}
          >
            <Text style={styles.signUpText}>Post</Text>
          </TouchableHighlight>
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
    paddingBottom: 20
  },
  image: {
    height: "100%",
    width: "100%"
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
export default CreatePost;
