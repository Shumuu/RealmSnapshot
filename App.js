import React, {useState, useEffect} from 'react';
import Realm from 'realm';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native';

const TodoSchema = {
  name: 'Todo',
  properties: {
    name: 'string',
  },
};

const App = () => {
  const [text, setText] = useState('');
  const [realm, setRealm] = useState(null);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    Realm.open({schema: [TodoSchema]}).then((realm) => setRealm(realm));

    return () => {
      if (realm !== null && !realm.isClosed) realm.close();
    };
  }, []);

  useEffect(() => {
    if (realm !== null) {
      realm.objects('Todo').addListener(todoListener);
    }

    return () => {
      if (realm !== null) realm.removeAllListeners();
    };
  }, [realm]);

  const todoListener = (collection, changes) => {
    //collection.sorted('name');
    console.log(collection.filtered('name == $0', 'test'));
    setTodos(collection);
  };

  const addTodo = () => {
    if (realm != null) {
      realm.write(() => {
        realm.create('Todo', {
          name: text,
        });
      });
      setText('');
    }
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          height: 60,
          marginHorizontal: 16,
          marginVertical: 16,
          flexDirection: 'row',
        }}>
        <TextInput
          placeholder="Todo"
          value={text}
          onChangeText={setText}
          style={styles.textInput}
        />
        <TouchableOpacity
          onPress={() => addTodo()}
          style={{justifyContent: 'center', alingSelf: 'center', margin: 16}}>
          <Text style={{fontSize: 40}}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        keyExtractor={(item) => `${(Math.random() * 1000).toString()}`}
        renderItem={({item}) => (
          <View>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'black',
    flex: 1,
  },
});

export default App;
