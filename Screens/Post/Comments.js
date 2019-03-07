import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView
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
export class Comments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: [],
      loader: true,
      uid: null,
      userName: "",
      comment: "",
      likes: [],
      commentSize: null,
      commentId: null,
      edit: false,
      reply: false
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
      .doc(this.props.navigation.state.params.id)
      .collection("comments")
      .onSnapshot(data => {
        let comments = [];
        data.forEach(doc => {
          comments.push(doc);
        });
        this.setState({
          loader: false,
          comments
        });
      });
    firebase
      .firestore()
      .collection("posts")
      .doc(this.props.navigation.state.params.id)
      .collection("comments")
      .onSnapshot(data => {
        this.setState({
          commentSize: data.size
        });
      });
  }
  deleteComment(item) {
    firebase
      .firestore()
      .collection("posts")
      .doc(this.props.navigation.state.params.id)
      .collection("comments")
      .doc(item.id)
      .delete()
      .then(() => {
        firebase
          .firestore()
          .collection("posts")
          .doc(this.props.navigation.state.params.id)
          .update({
            commentSize: this.state.commentSize
          });
      })
      .then(() => {
        firebase
          .firestore()
          .collection("posts")
          .doc(this.props.navigation.state.params.id)
          .collection("comments")
          .onSnapshot(data => {
            this.setState({
              commentSize: data.size
            });
            // .then(doc => {
            //   this.setState({
            //     commentSize: doc.data().commentSize
            //   });
            // });
          });

        console.warn("success");
      })
      .catch(e => console.warn(e));
  }
  editComment(item, postId, props) {
    const {
      navigate
    } = this.props.navigation.state.params.props.prop.navigation;
    navigate("EditComment", {
      item,
      postId,
      props,
      go_back_key: this.props.navigation.state.key
    });
  }
  replyComment(item, props) {
    const { navigate } = this.props.navigation;
    navigate("ReplyComment", { props, item });
  }
  likeComment(item) {
    if (this.state.uid === item.data().id) {
      return null;
    } else if (item.data().likes.indexOf(this.state.uid) !== -1) {
      firebase
        .firestore()
        .collection("posts")
        .doc(this.props.navigation.state.params.id)
        .collection("comments")
        .doc(item.id)
        .update({
          likes: item.data().likes.filter(data => {
            return data !== this.state.uid;
          })
        });
    } else {
      firebase
        .firestore()
        .collection("posts")
        .doc(this.props.navigation.state.params.id)
        .collection("comments")
        .doc(item.id)
        .update({
          likes: [this.state.uid, ...item.data().likes]
        });
    }
  }
  showUser(props) {
    const { navigate } = this.props.navigation;
    navigate("OtherUserProfile", { props });
  }
  comment() {
    firebase
      .firestore()
      .collection("users")
      .doc(this.state.uid)
      .onSnapshot(data => {
        firebase
          .firestore()
          .collection("posts")
          .doc(this.props.navigation.state.params.id)
          .collection("comments")
          .doc()
          .set({
            name: data.data().username,
            comment: this.state.comment,
            date: new Date(),
            id: this.state.uid,
            likes: this.state.likes
          })
          .then(() => {
            firebase
              .firestore()
              .collection("posts")
              .doc(this.props.navigation.state.params.id)
              .update({
                commentSize: this.state.commentSize
              });
          });
      });
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
            <Title>Comments</Title>
          </Body>
          <Right />
        </Header>
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
              placeholder="Comment"
              onChangeText={comment => this.setState({ comment })}
            />
          </View>
          <TouchableOpacity
            style={[styles.buttonContainer, styles.signupButton]}
            onPress={() => this.comment()}
          >
            <FontAwesome5 name={"paper-plane"} size={18} color="white" />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {this.state.loader ? (
            <ActivityIndicator size="large" color="#ff4663" />
          ) : null}
          <FlatList
            data={this.state.comments}
            renderItem={({ item, key }) => (
              <View style={styles.commentContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  {this.state.uid !== item.data().id ? (
                    <Text
                      style={styles.commenter}
                      onPress={() => this.showUser(item.data())}
                    >
                      {item.data().name}
                    </Text>
                  ) : (
                    <Text style={styles.commenter}>You</Text>
                  )}
                  <Text style={styles.date}>
                    {this.agoConvert(item.data().date)}
                  </Text>
                </View>
                <Text style={styles.comment}>{item.data().comment}</Text>
                <View
                  style={{
                    paddingTop: 15,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end"
                  }}
                >
                  {item.data().likes.length > 0 ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <FontAwesome5
                        name={"heart"}
                        onPress={() => this.likeComment(item)}
                        color={
                          item.data().likes
                            ? item.data().likes.indexOf(this.state.uid) !== -1
                              ? "red"
                              : null
                            : null
                        }
                        size={12}
                      />

                      <Text style={styles.postLikes}>
                        {item.data().likes.length}
                      </Text>
                    </View>
                  ) : null}
                  <View>
                    <FontAwesome5
                      name={"reply"}
                      size={12}
                      style={{ marginLeft: 40, zIndex: 9 }}
                      onPress={() =>
                        this.replyComment(
                          item,
                          this.props.navigation.state.params.id
                        )
                      }
                    />
                  </View>

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
                          this.editComment(
                            item,
                            this.props.navigation.state.params.id,
                            this.props
                          )
                        }
                      />
                      <FontAwesome5
                        name={"trash-alt"}
                        onPress={() => this.deleteComment(item)}
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
  container: {
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
export default Comments;
