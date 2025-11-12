import { Pressable, StyleSheet, TextInput } from 'react-native';

import { GreenVar, GrayVar, WhiteVar } from '@/assets/colors/colors';
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import Modal from 'react-native-modal';

interface Filter {
  name: string;
  active: boolean;
}

export default function TabTwoScreen() {
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
        </View>
      </Modal>

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
        <Pressable style={[styles.filterButton, allFilters && styles.activeFilterButton]} onPress={toggleAll}>
          <Text style={[styles.filterText, allFilters && styles.activeFilterText]}>ALL</Text>
        </Pressable>
        {filters.map(filter => {
          return (
            <Pressable key={filter.name} style={[styles.filterButton, filter.active && styles.activeFilterButton]} onPress={() => toggleFilter(filter.name)}>
              <Text style={[styles.filterText, filter.active && styles.activeFilterText]}>{filter.name.toUpperCase()}</Text>
            </Pressable>
          )
        })}
      </View>
      <View style={styles.cards}>
        <View style={[styles.card, { backgroundColor: GreenVar}]}></View>
        <View style={[styles.card, { backgroundColor: "#A08CE1"}]}></View>
        <View style={[styles.card, { backgroundColor: "#FA9DA5"}]}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: WhiteVar
  },
  topBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "transparent",
    width: '100%'
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: "#0F3624",
    marginTop: 30
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
    marginTop: 30,
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
    marginTop: 15,
    backgroundColor: 'transparent',
    padding: 2
  },
  filterButton: {
    borderRadius: 10,
    padding: 10,
    outlineWidth: 1,
    outlineColor: '#BFBFBD',
    height: 45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    color: GreenVar
  },
  activeFilterText: {
    color: "#fff"

  },
  activeFilterButton: {
    backgroundColor: GreenVar,
    outlineWidth: 0,
  },
  cards: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: 15,
    marginTop: 30,
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
});
