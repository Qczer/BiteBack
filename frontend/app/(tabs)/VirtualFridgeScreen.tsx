import { Dimensions, ScrollView, StyleSheet } from 'react-native';

import {  WhiteVar } from '@/assets/colors/colors';
import { Text, View } from '@/components/Themed';
import { useState } from 'react';

import Modal from 'react-native-modal';
import Food, { FoodType } from '@/classes/Food';
import FoodComponent from '@/components/FoodComponent';
import Fridge from '@/components/Fridge';
import SearchInput from '@/components/SearchInput';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import FiltersList from '@/components/FiltersList';
import Filter from '@/classes/Filter';
import ExpandButton from '@/components/ExpandButton';

const foodList: Food[] = [
  { name: "Hamburger", amount: 1, type: FoodType.junk },
  { name: "Pizza", amount: 2, unit: "slices", type: FoodType.junk },
  ...Array.from({length: 30}, () => ({ name: "Spaghetti", amount: 3, unit: "kg" }))
]

export default function VirtualFridgeScreen() {
  const [filters, setFilters] = useState<Filter[]>([
    { name: "Fruit", active: false },
    { name: "Vegetable", active: false},
    { name: "Snack", active: false},
    { name: "Junk", active: false},
  ])

  const [expanded, setExpanded] = useState<boolean>(false);
  const [filterName, setFilterName] = useState<string>("");

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView>
        {/* MODAL */}
        <Modal
          isVisible={expanded}
          onBackdropPress={() => setExpanded(curr => !curr)}
          statusBarTranslucent={false}

          animationIn="slideInDown"
          animationOut="slideOutUp"
          animationInTiming={200}
          animationOutTiming={200}

          hasBackdrop={false}
          style={styles.modal}
        >
          <ExpandButton direction="up" onPressIn={() => setExpanded(false)} />
          <SearchInput addStyle={{width: "90%"}} onInput={setFilterName} />
          <ScrollView contentContainerStyle={styles.modalItemsList}>
            {foodList.filter(e => e.name.toUpperCase().includes(filterName.toUpperCase())).map((food, i) => {
              return <FoodComponent key={i+1} food={food} />
            })}
          </ScrollView>
        </Modal>

        {/* REST */}
        <View style={styles.mainContainer}>
          <ExpandButton direction="down" onPressIn={() => setExpanded(true)} />
          <Text style={[styles.title, { alignSelf: 'flex-start' }]}>Virtual Fridge</Text>
          <SearchInput/>
          <FiltersList filters={filters} setFilters={setFilters}/>
          <Fridge addStyles={{height: height * 0.6}}/>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const height = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: WhiteVar
  },
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
    backgroundColor: 'transparent',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: "#0F3624",
  },

  modal: {
    margin: 0,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
    backgroundColor: WhiteVar,
  },
  modalItemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
    backgroundColor: WhiteVar
  }
});