import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableHighlight
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
import firebase from "react-native-firebase";
export class EditPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: false,
      title: this.props.navigation.state.params.props.title,
      desc: this.props.navigation.state.params.props.desc
    };
  }
  update() {
    this.setState({
      loader: true
    });
    firebase
      .firestore()
      .collection("posts")
      .doc(this.props.navigation.state.params.props.doc.id)
      .update({
        title: this.state.title,
        desc: this.state.desc,
        edited: true
      })
      .then(() => {
        this.setState({
          loader: false
        });
        this.props.navigation.navigate("PostsList");
      });
  }
  render() {
    return (
      <View style={styles.containerMain}>
        <Header style={{ backgroundColor: "#ff4663" }}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Edit Post</Title>
          </Body>
          <Right />
        </Header>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputs}
              placeholder="Post Title"
              value={this.state.title}
              onChangeText={e => this.setState({ title: e })}
            />
          </View>

          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              value={this.props.navigation.state.params.props.desc}
              multiline={true}
              numberOfLines={6}
              placeholder="Post Description"
              value={this.state.desc}
              onChangeText={e => this.setState({ desc: e })}
            />
          </View>
          {this.state.loader ? (
            <ActivityIndicator size="large" color="#ff4663" />
          ) : null}
          <TouchableHighlight
            style={[styles.buttonContainer, styles.signupButton]}
            onPress={() => this.update()}
          >
            <Text style={styles.signUpText}>Update</Text>
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
export default EditPost;
