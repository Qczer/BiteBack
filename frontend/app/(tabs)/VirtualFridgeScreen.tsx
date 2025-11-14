import { Dimensions, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';

import { GreenVar, GrayVar, WhiteVar } from '@/assets/colors/colors';
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import Modal from 'react-native-modal';
import FilterButton from '@/components/FilterButton';
import Food from '@/classes/Food';
import FoodComponent from '@/components/FoodComponent';
import Fridge from '@/components/Fridge';

interface Filter {
  name: string;
  active: boolean;
}

const foodList: Food[] = [
  { name: "Hamburger", amount: 1 },
  { name: "Pizza", amount: 2, unit: "slices" },
  ...Array.from({length: 30}, () => ({ name: "Spaghetti", amount: 3, unit: "kg" }))
]

export default function VirtualFridgeScreen() {
  const [filters, setFilters] = useState<Filter[]>([
    { name: "Fruit", active: false},
    { name: "Vegetables", active: false},
    { name: "Snacks", active: false},
    { name: "Junk", active: false},
  ])

  const [allFilters, setAllFilters] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggleFilter = (name: string) => {
    setFilters(prev => {
      const updated = prev.map(f => 
        f.name === name ? { ...f, active: !f.active } : f
      );

      const anyActive = updated.some(f => f.active);
      setAllFilters(!anyActive);

      return updated;
    })
  };

  const toggleAll = () => {
    setAllFilters(true);
    if(!allFilters)
      setFilters(prev => prev.map(f => ({ ...f, active: false })));
  };

  return (
    <View style={styles.container}>
      {/* MODAL */}
      <Modal
        isVisible={expanded}
        onBackdropPress={() => setExpanded(curr => !curr)}

        animationIn="slideInDown"
        animationOut="slideOutUp"
        animationInTiming={200}
        animationOutTiming={200}

        hasBackdrop={false}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Pressable
            onPressIn={() => {setExpanded(curr => !curr)}}
            style={{alignSelf: 'flex-end'}}
          >
            <Ionicons name='chevron-up' size={24} color={GreenVar} />
          </Pressable>


          <ScrollView contentContainerStyle={styles.modalItemsList}>
            {foodList.map((food, i) => {
              return <FoodComponent key={i+1} food={food} />
            })}
          </ScrollView>
        </View>
      </Modal>
      <View style={styles.mainContainer}>


        {/* REST */}
        <View style={styles.topBar}>
          <Text style={styles.title}>Virtual Fridge</Text>
          <Pressable
            onPressIn={() => {setExpanded(curr => !curr)}}
          >
            <Ionicons name='chevron-down' size={24} color={GreenVar} />
          </Pressable>
        </View>
        <View style={styles.search}>
          <TextInput
            style={styles.searchInput}
            placeholder='Search category'
          />
          <Pressable style={styles.searchButton}>
            <Ionicons name="search" size={22} color={GreenVar} />
          </Pressable>
        </View>
        <View style={styles.filters}>
          <FilterButton text="ALL" active={allFilters} disabled={allFilters} onPress={toggleAll} />
          {filters.map(({ name, active }) => {
            return (
              <FilterButton key={name} text={name.toUpperCase()} active={active} onPress={() => toggleFilter(name)} />
            )
          })}
        </View>
        <Fridge addStyles={{height: height * 0.6}}/>
        {/* <View style={styles.cards}>
          <View style={[styles.card, { backgroundColor: GreenVar}]}></View>
          <View style={[styles.card, { backgroundColor: "#A08CE1"}]}></View>
          <View style={[styles.card, { backgroundColor: "#FA9DA5"}]}></View>
        </View> */}
      </View>
    </View>
  );
}

const height = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: WhiteVar
  },
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
    backgroundColor: 'transparent'
  },
  topBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "transparent",
    width: '100%',
  },
  title: {
    marginTop: 15,
    fontSize: 36,
    fontWeight: 'bold',
    color: "#0F3624",
  },
  search: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "#e0ded9"
  },
  searchInput: {
    fontSize: 16,
    color: GrayVar,
  },
  searchButton: {
    marginRight: 15,
    color: GreenVar
  },
  filters: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    gap: 10,
    backgroundColor: 'transparent',
    padding: 2
  },
  cards: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: 15,
    width: "100%",
    backgroundColor: 'transparent'
  },
  card: {
    width: "100%",
    height: 180,
    borderRadius: 20,
    backgroundColor: 'lightgray'
  },

  modal: {
    margin: 0,
  },
  modalContent: {
    flex: 1,
    backgroundColor: WhiteVar,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalItemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
    backgroundColor: WhiteVar
  }
});
