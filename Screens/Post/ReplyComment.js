import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
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
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import firebase from "react-native-firebase";
export class ReplyComment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reply: "",
      replies: [],
      loader: true,
      uid: null
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      user
        ? this.setState({
            uid: user.uid
          })
        : null;
    });
    firebase
      .firestore()
      .collection("posts")
      .doc(this.props.navigation.state.params.props)
      .collection("comments")
      .doc(this.props.navigation.state.params.item.id)
      .collection("replies")
      .onSnapshot(data => {
        let replies = [];
        data.forEach(doc => {
          replies.push(doc);
        });
        this.setState({
          replies,
          loader: false
        });
      });
  }

  showUser(props) {
    const { navigate } = this.props.navigation;
    navigate("OtherUserProfile", { props });
  }
  reply(id) {
    firebase
      .firestore()
      .collection("users")
      .doc(this.state.uid)
      .onSnapshot(data => {
        firebase
          .firestore()
          .collection("posts")
          .doc(this.props.navigation.state.params.props)
          .collection("comments")
          .doc(id)
          .collection("replies")
          .add({
            id: this.state.uid,
            username: data.data().username,
            reply: this.state.reply,
            date: new Date()
          });
      });
  }
  editReply(item, postId, commentId) {
    const { navigate } = this.props.navigation;
    navigate("EditReply", { item, postId, commentId });
  }
  deleteReply(item) {
    firebase
      .firestore()
      .collection("posts")
      .doc(this.props.navigation.state.params.props)
      .collection("comments")
      .doc(this.props.navigation.state.params.item.id)
      .collection("replies")
      .doc(item.id)
      .delete();
  }
  goPrevious(id) {
    const { navigate } = this.props.navigation;
    navigate("Comments", { id });
  }
  agoConvert(timeStamp) {
    const now = new Date(),
      secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
    if (secondsPast < 60) {
      return parseInt(secondsPast) + "s ago";
    }
    if (secondsPast < 3600) {
      return parseInt(secondsPast / 60) + "m ago";
    }
    if (secondsPast <= 86400) {
      return parseInt(secondsPast / 3600) + "h ago";
    }
    if (secondsPast > 86400) {
      day = timeStamp.getDate();
      month = timeStamp
        .toDateString()
        .match(/ [a-zA-Z]*/)[0]
        .replace(" ", "");
      year =
        timeStamp.getFullYear() == now.getFullYear()
          ? ""
          : " " + timeStamp.getFullYear();
      return day + " " + month + year + " ago";
    }
  }
  render() {
    return (
      <View>
        <Header style={{ backgroundColor: "#ff4663" }}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Reply Comment</Title>
          </Body>
          <Right />
        </Header>
        <View style={styles.commentContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            {this.props.navigation.state.params.item.data().id !==
            this.state.uid ? (
              <Text
                style={styles.commenter}
                onPress={() => this.showUser(item.data())}
              >
                {this.props.navigation.state.params.item.data().name}
              </Text>
            ) : (
              <Text style={styles.commenter}>You</Text>
            )}
            <Text style={styles.date}>
              {this.agoConvert(
                this.props.navigation.state.params.item.data().date
              )}
            </Text>
          </View>
          <TextInput style={styles.comment}>
            {this.props.navigation.state.params.item.data().comment}
          </TextInput>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 30,
            paddingBottom: 30,
            paddingRight: 20,
            paddingLeft: 20
          }}
        >
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              multiline={true}
              numberOfLines={2}
              placeholder="Write a reply"
              onChangeText={reply => this.setState({ reply })}
            />
          </View>
          <TouchableOpacity
            style={[styles.buttonContainer, styles.signupButton]}
            onPress={() =>
              this.reply(this.props.navigation.state.params.item.id)
            }
          >
            <FontAwesome5 name={"paper-plane"} size={18} color="white" />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {this.state.loader ? (
            <ActivityIndicator size="large" color="#ff4663" />
          ) : null}
          <FlatList
            data={this.state.replies}
            renderItem={({ item, key }) => (
              <View style={styles.commentContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  {item.data().id !== this.state.uid ? (
                    <Text
                      style={styles.commenter}
                      onPress={() => this.showUser(item.data())}
                    >
                      {item.data().username}
                    </Text>
                  ) : (
                    <Text style={styles.commenter}>You</Text>
                  )}
                  <Text style={styles.date}>
                    {this.agoConvert(item.data().date)}
                  </Text>
                </View>
                <Text style={styles.comment}>{item.data().reply}</Text>
                <View
                  style={{
                    paddingTop: 15,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end"
                  }}
                >
                  {item.data().id === this.state.uid ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <FontAwesome5
                        name={"pen"}
                        size={12}
                        style={{ paddingLeft: 40, paddingRight: 40 }}
                        onPress={() =>
                          this.editReply(
                            item,
                            this.props.navigation.state.params.props,
                            this.props.navigation.state.params.item.id
                          )
                        }
                      />
                      <FontAwesome5
                        name={"trash-alt"}
                        onPress={() => this.deleteReply(item)}
                        size={12}
                      />
                    </View>
                  ) : null}
                </View>
              </View>
            )}
            keyExtractor={index => index.toString()}
          />
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
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
    width: 260,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  textArea: {
    marginLeft: 16,
    borderColor: "skyblue",
    flex: 1
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 45,
    borderRadius: 50,
    elevation: 4
  },
  signupButton: {
    backgroundColor: "#ff4663"
  },
  signUpText: {
    color: "white"
  },
  commentContainer: {
    padding: 30,
    backgroundColor: "whitesmoke"
  },
  commenter: {
    fontWeight: "bold",
    fontSize: 16,
    color: "black"
  },
  comment: {
    fontSize: 14,
    paddingTop: 4
  },
  date: {
    fontSize: 10
  }
});

export default ReplyComment;
