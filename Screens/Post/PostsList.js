import React, { Component } from "react";
import MyPosts from "../User/MyPosts";
import Profile from "../User/Profile";
import firebase from "react-native-firebase";

import { createBottomTabNavigator } from "react-navigation";
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
import {
  StyleSheet,
  StatusBar,
  View,
  FlatList,
  ActivityIndicator
} from "react-native";
import Post from "./Post";
export class PostsList extends Component {
  static navigationOptions = {
    header: null
  };
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
      posts: [],
      timeStamp: null
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
      console.log(doc.data());
      const {
        title,
        desc,
        userName,
        date,
        likes,
        image,
        edited,
        createdBy,
        commentSize
      } = doc.data();

      posts.push({
        key: doc.id,
        doc,
        title,
        desc,
        commentSize,
        userName,
        image,
        likes,
        date,
        edited,
        createdBy
      });
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
    console.log("Rding post lists");
    if (this.state.loading) {
      return null;
    }

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
            <Title>Home</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("CreatePost")}
            >
              <Icon name="images" />
            </Button>
          </Right>
        </Header>
        <View style={styles.container}>
          {this.state.loader ? (
            <ActivityIndicator size="large" color="#ff4663" />
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

const BottomTab = createBottomTabNavigator(
  {
    Home: {
      screen: PostsList,
      navigationOptions: () => ({
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name={"home"} color={tintColor} size={16} />
        )
      })
    },
    MyPosts: {
      screen: MyPosts,
      navigationOptions: () => ({
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name={"eye"} color={tintColor} size={16} />
        )
      })
    },
    Profile: {
      screen: Profile,
      navigationOptions: () => ({
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome5 name={"user"} color={tintColor} size={16} />
        )
      })
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {}
    }),
    tabBarOptions: {
      activeTintColor: "#ff4663"
    }
  }
);
export default BottomTab;
