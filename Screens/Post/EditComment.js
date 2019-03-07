import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableHighlight,
  TextInput
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
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
export class EditComment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: this.props.navigation.state.params.item.data().comment
    };
  }
  update() {
    firebase
      .firestore()
      .collection("posts")
      .doc(this.props.navigation.state.params.postId)
      .collection("comments")
      .doc(this.props.navigation.state.params.item.id)
      .update({
        comment: this.state.comment
      })
      .then(() => {
        this.props.navigation.goBack();
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
            <Title>Edit Comment</Title>
          </Body>
          <Right />
        </Header>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputs}
              placeholder="Comment"
              value={this.state.comment}
              onChangeText={e => this.setState({ comment: e })}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#ff4663",
    height: 50,
    paddingRight: 15,
    paddingLeft: 15
  },
  headerText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center"
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

export default EditComment;
