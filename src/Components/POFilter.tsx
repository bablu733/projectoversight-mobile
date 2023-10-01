import React, { useState } from 'react';
import { View,  StyleSheet, TouchableOpacity,Image ,Text} from 'react-native';
import Modal from 'react-native-modal';
import PODateTimePicker from './PODateTimePicker';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { Chip } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

interface FilterDetailsPopupProps {
  onFilterChange: boolean;
  Status:string[];
  weekEndingDate:string[],
  onSubmit: (status: string[],estStartDate: string, weekEndDate: string[]) => void;
}
const FilterComponent : React.FC<FilterDetailsPopupProps> = ({
  onFilterChange,
  Status,
  weekEndingDate,
  onSubmit,
}) => {
  
  const [estStartDate, setEstStartDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [weekEndDate, setWeekEstEndDate] = useState('');
  const [weekEndDatevalue, setWeekEstEndvalue] = useState<Date[]>([]);
  const [StatusValue, setStatusValue] = useState('');
  const [StatusOptions, setStatusOptions] = useState<string[]>([]);
  const handleWeekEndDateChange = (text: string) => {
    setWeekEstEndDate(text);
  };
  const handleEstStartDateChange = (text: string) => {
    setEstStartDate(text);
  };
  const handleTaskTypeSelect = (text: string) => {
    setStatusValue(text);
  };
  const dataArray = ['In-Progress', 'Completed', 'Active', 'InActive'];

  const [selectedChips, setSelectedChips] = useState([]);
  const [selectedWeekEndingChips, setSelectedWeekEndingChips] = useState([]);
  const handleStatusChipPress = (text) => {
    if (selectedChips.includes(text)) {
      setSelectedChips(selectedChips.filter((item) => item !== text));
    } else {
      setSelectedChips([...selectedChips, text]);
    }
  };
  const handleWeekEndingChipPress = (text) => {
    if (selectedWeekEndingChips.includes(text)) {
      setSelectedWeekEndingChips(selectedWeekEndingChips.filter((item) => item !== text));
    } else {
      setSelectedWeekEndingChips([...selectedWeekEndingChips, text]);
    }
  };

 console.log(selectedChips)
console.log(selectedWeekEndingChips)

  const handleFilterApply = () => {
    onSubmit(selectedChips,estStartDate,selectedWeekEndingChips)
    setShowModal(false);
  };
  const handleReset = () => {
    setSelectedChips([]); // Reset selected status filters
    setEstStartDate(''); // Reset estimation start date
    setSelectedWeekEndingChips([]); // Reset selected week ending date filters
  }
    const handleClose = () => {
      
      setShowModal(false);
  };
  return (
    <View >
      <TouchableOpacity  onPress={() => setShowModal(true)}>
      <Ionicons name="filter" size={25} color="#BEBEBE" style={styles.ProfileIcon} />
      </TouchableOpacity>

      <Modal
        isVisible={showModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5}
        //onBackdropPress={() => setShowModal(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <FontAwesome name="close" size={24} color="#999" />
          </TouchableOpacity>
          <Text style={styles.modalHeader}>Filter Options</Text>
            <Text style={styles.modalHeader}>Status</Text>
 <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {Status.map((text, index) => (
        <Chip
          key={index}
          style={{
            margin: 5,
            backgroundColor: selectedChips.includes(text) ? '#90EE90' : '#A9A9A9',
          }}
          textStyle={{ color: selectedChips.includes(text) ? '#000000' : '#FFFFFF' }}
          onPress={() => handleStatusChipPress(text)}
        >
          {text}
        </Chip>
      ))}
    </View>
<Text style={styles.modalHeader}>Date</Text>
<PODateTimePicker
              label={'Date'}
              placeholder='Date'
              value={estStartDate}
              onChangeText={handleEstStartDateChange}
              minimumDate={undefined}
            />

    {/* <PODropDown
              title="Week Ending Date"
              placeholder="Select an option"
              data={status1}
              value={weekEndDate}
              disable={false}
              setValue={setWeekEstEndDate}
              onChange={handleWeekEndDateChange}
            /> */}
<Text style={styles.modalHeader}>Week Ending Date</Text>
<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {weekEndingDate.map((text, index) => (
        <Chip
          key={index}
          style={{
            margin: 5,
            backgroundColor: selectedWeekEndingChips.includes(text) ? '#90EE90' : '#A9A9A9',
          }}
          textStyle={{ color: selectedWeekEndingChips.includes(text) ? '#000000' : '#FFFFFF' }}
          onPress={() => handleWeekEndingChipPress(text)}
        >
          {text}
        </Chip>
      ))}
    </View>
          <TouchableOpacity style={styles.applyButton} onPress={handleFilterApply}>
            <Text style={styles.applyButtonText}>Apply Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
        <Text style={styles.resetButtonText}>Reset</Text>
      </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
 
  filterButtonImage: {
    width: 24, // Set the width of the image as needed
    height: 24, // Set the height of the image as needed
    resizeMode: 'contain', // Adjust the resizeMode as per your image requirements
  },
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '30%', // Adjust the width to control spacing between containers
    height: 35, // Adjust the height for a medium-sized container
    borderRadius: 20,
    marginBottom: 3,
    marginLeft: 10,
  },
  
  searchbar: {
    flexDirection: 'row',
    backgroundColor: '#0b628a', // Set the initial background color to blue
    alignItems: 'center',
    flex: 1,
    height: '65%',
    borderRadius: 20,
    paddingRight: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 5, // Adjust the margin for medium-sized text
    opacity: 1,
    fontSize: 16, // Adjust the font size for medium-sized text
  },
  filterButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  modal: {
    justifyContent: 'flex-end', // Align the modal at the bottom
    margin: 0,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '100%',
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pickerContainer: {
    height: 40,
    marginBottom: 16,
  },
  picker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  dropDown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  dateLabel: {
    fontSize: 16,
    marginBottom: 8,
    textDecorationLine: 'underline',
  },
  applyButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  ProfileIcon: {
    width: 40,
    transform: [{ rotateY: '180deg' }]
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: 'red', // Set your desired background color for the "Reset" button
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 999,
  },
});

export default FilterComponent;
