import { Pressable, StyleSheet, TextInput } from "react-native";
import { Text, View } from "react-native";

function Join() {
  const onPress = () => {
    alert("회원가입 완료!");
  };
  return (
    <View style={styles.container}>
      <View style={styles.join}>
        <Text style={styles.joinText}>회원가입</Text>
      </View>
      <View style={styles.joinForm}>
        <Text style={styles.formText}>ID</Text>
        <TextInput style={styles.formInput} placeholder="영문 3자 이상" />
        <Text style={styles.formText}>Password</Text>
        <TextInput style={styles.formInput} placeholder="8자 이상" />
        <Text style={styles.formText}>Confirm Password</Text>
        <TextInput style={styles.formInput} placeholder="8자 이상" />
        <Pressable onPress={onPress} style={styles.button}>
          <Text style={styles.buttonText}>완료</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0fbcf9",
    paddingHorizontal: 60,
    paddingVertical: 120,
  },
  join: {
    marginBottom: 20,
  },
  joinText: {
    color: "white",
    fontWeight: "600",
    fontSize: 28,
  },
  joinForm: {},
  formText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 5,
  },
  formInput: {
    paddingHorizontal: 20,
    height: 45,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 5,
  },
  button: {
    paddingHorizontal: 15,
    height: 45,
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
  },
});

export default Join;
