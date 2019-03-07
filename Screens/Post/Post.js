import React, { Component } from "react";
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import firebase from "react-native-firebase";
class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heart: null,
      _menu: null,
      uid: null,
      likesFromDb: [],
      color: null
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
      .onSnapshot(data => {
        data.forEach(doc => {
          this.setState({
            likesFromDb: [...doc.data().likes]
          });
        });
      });
  }

  setMenuRef = ref => {
    this.setState({
      _menu: ref
    });
  };

  hideMenu = () => {
    this.state._menu.hide();
  };
  showMenu = () => {
    this.state._menu.show();
  };

  passImage(props) {
    const { navigate } = props.prop.navigation;
    navigate("ViewPost", { props });
  }
  passPost(props) {
    const { navigate } = props.prop.navigation;
    this.state._menu.hide();
    navigate("EditPost", { props });
  }
  passComments(props, id) {
    const { navigate } = props.prop.navigation;
    navigate("Comments", { id, props });
  }
  deletePost(docId) {
    firebase
      .firestore()
      .collection("posts")
      .doc(docId)
      .delete();
  }
  showUser(props) {
    const { navigate } = props.prop.navigation;
    navigate("OtherUserProfile", { props });
  }
  likePost(props, docId, likes, createdBy) {
    this.state.color === null && createdBy !== this.state.uid
      ? this.setState({
          color: "#ff4663"
        })
      : this.setState({
          color: null
        });
    if (this.state.uid === createdBy) {
      const { navigate } = props.prop.navigation;
      navigate("LikedBy", { likes });
    } else if (likes.indexOf(this.state.uid) !== -1) {
      firebase
        .firestore()
        .collection("posts")
        .doc(docId)
        .update({
          likes: likes.filter(data => {
            return data !== this.state.uid;
          })
        })
        .then(() => {
          this.setState({
            color: null
          });
        });
    } else {
      firebase
        .firestore()
        .collection("posts")
        .doc(docId)
        .update({
          likes: [this.state.uid, ...likes]
        })
        .then(() => {
          this.setState({
            color: "red"
          });
        });
    }
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
      return day + " " + month + year + "";
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 15
          }}
        >
          {/* <Image
            source={{ uri: () => this.profileImage(this.props.createdBy) }}
            style={{ width: 50, height: 50 }}
          /> */}
          {this.props.createdBy === this.state.uid ? (
            <Text style={styles.userName}>You</Text>
          ) : (
            <TouchableOpacity onPress={() => this.showUser(this.props)}>
              <Text style={styles.userName}>{this.props.userName}</Text>
            </TouchableOpacity>
          )}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.date}>{this.agoConvert(this.props.date)}</Text>

            <Menu
              ref={this.setMenuRef}
              button={
                <FontAwesome5
                  style={{ paddingRight: 10 }}
                  onPress={this.showMenu}
                  name={"chevron-circle-down"}
                  size={22}
                  color={"#ff4663"}
                />
              }
            >
              {this.props.createdBy === this.state.uid ? (
                <>
                  <MenuItem onPress={() => this.passPost(this.props)}>
                    Edit Post
                  </MenuItem>
                  <MenuItem onPress={() => this.deletePost(this.props.doc.id)}>
                    Delete Post
                  </MenuItem>
                </>
              ) : (
                <MenuItem>Save</MenuItem>
              )}
            </Menu>
          </View>
        </View>

        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => this.passImage(this.props)}
        >
          <Image source={{ uri: this.props.image }} style={styles.postImage} />
        </TouchableOpacity>

        <Text style={styles.postTitle}>{this.props.title}</Text>
        <Text style={styles.postDesc}>{this.props.desc}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            paddingTop: 25,
            paddingBottom: 25
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <FontAwesome5
              name={"heart"}
              onPress={() =>
                this.likePost(
                  this.props,
                  this.props.doc.id,
                  this.props.likes,
                  this.props.createdBy
                )
              }
              color={
                this.state.color ||
                this.props.likes.indexOf(this.state.uid) !== -1
                  ? "#ff4663"
                  : null
              }
              size={20}
              style={styles.action}
            />
            {this.props.likes.length > 0 ? (
              <Text style={styles.postLikes}>{this.props.likes.length}</Text>
            ) : null}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <FontAwesome5
              name={"comment"}
              size={20}
              style={styles.action}
              onPress={() => this.passComments(this.props, this.props.doc.id)}
            />
            {this.props.commentSize > 0 ? (
              <Text style={styles.postLikes}>{this.props.commentSize}</Text>
            ) : null}
          </View>
          <FontAwesome5 style={styles.action} name={"share"} size={20} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    elevation: 5
  },
  postImage: {
    width: "100%",
    height: 300
  },
  date: {
    padding: 20
  },
  action: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 100,
    elevation: 2
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    paddingLeft: 20
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    paddingTop: 30,
    paddingBottom: 20,
    paddingLeft: 15
  },
  postDesc: {
    fontSize: 12,
    color: "black",
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 15
  },
  postLikes: {
    paddingLeft: 10,
    color: "#ff4663"
  }
});
export default Post;
