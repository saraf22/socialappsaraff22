import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet
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
export class LikedBy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      likedBy: [],
      loader: true
    };
  }

  async componentDidMount() {
    if (this.props.navigation.state.params.likes.length > 0) {
      await firebase
        .firestore()
        .collection("users")
        .onSnapshot(data => {
          let users = [];
          data.forEach(doc => {
            if (
              this.props.navigation.state.params.likes.indexOf(
                doc.data().id
              ) !== -1
            ) {
              users.push(doc.data().username);
            }
          });
          this.setState({
            likedBy: users,
            loader: false
          });
        });
    } else {
      this.setState({
        loader: false
      });
    }
  }
  render() {
    return (
      <View>
        <Header style={{ backgroundColor: "#ff4663", elevation: 3 }}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>LikedBy</Title>
          </Body>
          <Right />
        </Header>
        <View style={styles.container}>
          <View>
            {this.state.loader ? (
              <ActivityIndicator size="large" color="#ff4663" />
            ) : null}
            {this.state.likedBy.length > 0 ? (
              <FlatList
                data={this.state.likedBy}
                renderItem={({ item, key }) => (
                  <Text key={key * 1000} style={styles.listText}>
                    {item}
                  </Text>
                )}
                keyExtractor={index => index.toString()}
              />
            ) : (
              <Text>- No Likes -</Text>
            )}
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  listText: {
    paddingTop: 10,
    paddingBottom: 10,
    color: "black",
    fontSize: 20,
    fontWeight: "bold"
  }
});
export default LikedBy;
