import React, { Component } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Icon } from "native-base";
export class ViewPost extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Icon
          name="arrow-back"
          style={styles.menu}
          onPress={() => this.props.navigation.goBack()}
        />
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{ uri: this.props.navigation.state.params.props.image }}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 2,
    padding: 20,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "black"
  },
  menu: {
    position: "absolute",
    zIndex: 99,
    top: 0,
    padding: 20,
    color: "white"
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    height: "auto"
  },
  image: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: "contain"
  }
});
export default ViewPost;
