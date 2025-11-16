import { Dimensions, ScrollView, StyleSheet } from 'react-native';

import {  WhiteVar } from '@/assets/colors/colors';
import { Text, View } from '@/components/Themed';
import { useState } from 'react';

import Modal from 'react-native-modal';
import Food, { FoodType } from '@/classes/Food';
import Fridge from '@/components/Fridge';
import SearchInput from '@/components/SearchInput';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import FoodFiltersList from '@/components/FoodFiltersList';
import ExpandButton from '@/components/ExpandButton';
import FoodFilter from '@/classes/FoodFilter';
import FoodList from '@/components/FoodList';

const foodList: Food[] = [
  { name: "Hamburger", amount: 1, type: FoodType.junk },
  { name: "Pizza", amount: 2, unit: "slices", type: FoodType.junk },
  ...Array.from({length: 30}, () => ({ name: "Spaghetti", amount: 3, unit: "kg", type: FoodType.meat }))
]

const allFoodTypes = Object.keys(FoodType)
  .filter(key => isNaN(Number(key))) as (keyof typeof FoodType)[];

export default function VirtualFridgeScreen() {
  const [foodFilters, setFoodFilters] = useState<FoodFilter[]>(
    allFoodTypes.map(typeName => ({
      foodType: FoodType[typeName],
      active: false,
    }))
  );

  const [expanded, setExpanded] = useState<boolean>(false);
  const [nameFilter, setNameFilter] = useState<string>("");

  const filteredFoodList = foodList
    .filter(elem => elem.name.toUpperCase().includes(nameFilter.toUpperCase()))
    .filter(food =>
      foodFilters.some(f => f.active && f.foodType === food.type) || 
      !foodFilters.some(f => f.active)
    );

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
          <SearchInput addStyle={{width: "90%"}} onInput={setNameFilter} />
          <FoodFiltersList filters={foodFilters} setFilters={setFoodFilters}/>
          <FoodList foodList={filteredFoodList}/>
        </Modal>

        {/* REST */}
        <View style={styles.mainContainer}>
          <ExpandButton direction="down" onPressIn={() => setExpanded(true)} />
          <Text style={styles.title}>Virtual Fridge</Text>
          <SearchInput/>
          <FoodFiltersList filters={foodFilters} setFilters={setFoodFilters}/>
          <Fridge addStyles={{height: height * 0.6}} filters={foodFilters}/>
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
    alignSelf: 'flex-start'
  },

  modal: {
    margin: 0,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
    backgroundColor: WhiteVar,
  }
});