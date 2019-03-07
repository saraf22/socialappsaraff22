import React, { Component } from "react";
import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native";
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

import Post from "../Post/Post";
export class MyPosts extends Component {
  constructor() {
    super();
    this.ref = firebase
      .firestore()
      .collection("posts")
      .orderBy("date", "DESC");
    this.unsubscribe = null;
    this.state = {
      uid: null,
      loader: true,
      posts: []
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
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }
  onCollectionUpdate = querySnapshot => {
    const posts = [];
    querySnapshot.forEach(doc => {
      if (doc.data().createdBy === this.state.uid) {
        const {
          title,
          desc,
          userName,
          date,
          likes,
          commentSize,
          image,
          createdBy
        } = doc.data();
        posts.push({
          key: doc.id,
          doc,
          title,
          desc,
          userName,
          date,
          image,
          likes,
          commentSize,
          createdBy
        });
      }
    });
    this.setState({
      posts,
      loader: false
    });
  };
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    return (
      <View>
        <Header
          androidStatusBarColor="rgb(196, 35, 59)"
          style={{ backgroundColor: "#ff4663" }}
        >
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>MyPosts</Title>
          </Body>
          <Right />
        </Header>
        <View style={styles.container}>
          {this.state.loader ? (
            <ActivityIndicator size="small" color="#00ff00" />
          ) : null}
          <FlatList
            data={this.state.posts}
            renderItem={({ item }) => <Post prop={this.props} {...item} />}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    paddingBottom: 100
  }
});
export default MyPosts;
