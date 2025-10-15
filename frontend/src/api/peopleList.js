import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { fetchPeople } from '../api/people';

export default function PeopleList() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    const loadPeople = async () => {
      const result = await fetchPeople();
      if (!result.error) setPeople(result.data);
    };
    loadPeople();
  }, []);

  return (
    <FlatList
      data={people}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 10 }}>
          <Text>{item.name}</Text>
        </View>
      )}
    />
  );
}
