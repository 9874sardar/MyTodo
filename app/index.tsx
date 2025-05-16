import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PRIMARY = '#4A3780';
const BG_LIGHT = '#F5F5F5';
const BG = '#ECECEC';
const GREY = '#999';

const CATEGORY_OPTIONS = [
  { id: 'notes', lib: 'MaterialCommunityIcons', name: 'note-outline' },
  { id: 'calendar', lib: 'MaterialCommunityIcons', name: 'calendar-month' },
  { id: 'trophy', lib: 'FontAwesome5', name: 'trophy' },
];

export default function TodoScreen() {
  // Unified task list with completed flag
  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Study lesson",
      icon: "book-open",
      iconLib: "MaterialCommunityIcons",
      time: "",
      completed: false,
    },
    {
      id: "2",
      title: "Run 5k",
      icon: "running",
      iconLib: "FontAwesome5",
      time: "4:00pm",
      completed: false,
    },
    {
      id: "3",
      title: "Go to party",
      icon: "party-popper",
      iconLib: "MaterialCommunityIcons",
      time: "10:00pm",
      completed: false,
    },
    {
      id: "4",
      title: "Game meetup",
      icon: "controller-classic",
      iconLib: "MaterialCommunityIcons",
      time: "1:00pm",
      completed: true,
    },
    {
      id: "5",
      title: "Take out trash",
      icon: "trash-can",
      iconLib: "MaterialCommunityIcons",
      time: "",
      completed: true,
    },
  ]);

  // Modal & new task inputs
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Toggle completion state
  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Add a new task
  const saveTask = () => {
    if (!newTitle.trim()) return;
    const task = {
      id: Date.now().toString(),
      title: newTitle,
      icon: 'note-outline',
      iconLib: 'MaterialCommunityIcons',
      time: format(time, 'hh:mm a'),
      completed: false,
      date: format(date, 'MMM dd, yyyy'),
      category: selectedCategory,
      notes,
    };
    setTasks(prev => [task, ...prev]);
    setModalVisible(false);
    // reset
    setNewTitle(''); setNotes('');
    setSelectedCategory(null);
    setDate(new Date()); setTime(new Date());
  };

  // Icon renderer
  const renderIcon = (lib, name, completed) => {
    const color = completed ? "#999" : PRIMARY;
    switch (lib) {
      case "MaterialCommunityIcons":
        return <MaterialCommunityIcons name={name} size={24} color={color} />;
      case "FontAwesome5":
        return <FontAwesome5 name={name} size={24} color={color} />;
      case "Ionicons":
        return <Ionicons name={name} size={24} color={color} />;
      default:
        return null;
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.taskItem, item.completed && styles.taskItemCompleted]}>
      <View
        style={[styles.iconContainer, item.completed && styles.iconCompleted]}
      >
        {renderIcon(item.iconLib, item.icon, item.completed)}
      </View>
      <View style={styles.taskText}>
        <Text style={[styles.title, item.completed && styles.textCompleted]}>
          {item.title}
        </Text>
        {item.time ? (
          <Text style={[styles.time, item.completed && styles.timeCompleted]}>
            {item.time}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity
        style={[styles.checkbox, item.completed && styles.checkboxChecked]}
        onPress={() => toggleComplete(item.id)}
      >
        {item.completed && <Ionicons name="checkmark" size={16} color="#fff" />}
      </TouchableOpacity>
    </View>
  );

  const activeTasks = tasks.filter((t) => !t.completed);
  const doneTasks = tasks.filter((t) => t.completed);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={PRIMARY} barStyle="light-content" />
       <View style={styles.behindComponent}>
        <Text style={{fontSize: 14,textAlign:"center", color: "#fff",marginBottom:20,marginTop:-20}}>{format(date, 'MMM dd, yyyy')}</Text>
        <Text style={styles.headerText}>My Todo List</Text>
        <View style={styles.circlesContainer}>
          <View style={[styles.circle, styles.circleLeft]} />
          <View style={[styles.circle, styles.circleRight]} />
        </View>
      </View>

      {/* Main Content */}
      <FlatList
        data={[]} // Empty data since we're using header/footer
        keyExtractor={(item) => item.id}
        renderItem={() => null}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={() => (
          <View style={styles.completedSection}>
            <FlatList
              data={activeTasks}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
            />
          </View>
        )}
        ListFooterComponent={() => (
          <View style={styles.completedSection}>
            <Text style={styles.completedHeader}>Completed</Text>
            <FlatList
              data={doneTasks}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
            />
          </View>
        )}
      />

      {/* Modal for new task */}
             <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.curveHeader} />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={PRIMARY} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add New Task</Text>

            <TextInput
              placeholder="Task Title"
              value={newTitle}
              onChangeText={setNewTitle}
              style={styles.input}
            />

            <Text style={styles.sectionLabel}>Category</Text>
            <View style={styles.categoryRow}>
              {CATEGORY_OPTIONS.map(cat => {
                const selected = cat.id === selectedCategory;
                const IconComp =
                  cat.lib === 'FontAwesome5'
                    ? FontAwesome5
                    : cat.lib === 'Ionicons'
                    ? Ionicons
                    : MaterialCommunityIcons;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryCircle, selected && styles.categoryCircleSelected]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <IconComp name={cat.name} size={24} color={selected ? '#fff' : PRIMARY} />
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.row}>
              <View style={styles.halfContainer}>
                <Text style={styles.sectionLabel}>Date</Text>
                <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.placeholderText}>{format(date, 'MMM dd, yyyy')}</Text>
                  <MaterialCommunityIcons name="calendar" size={20} color={GREY} />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(e, d) => {
                      setShowDatePicker(false);
                      if (d) setDate(d);
                    }}
                  />
                )}
              </View>
              <View style={styles.halfContainer}>
                <Text style={styles.sectionLabel}>Time</Text>
                <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
                  <Text style={styles.placeholderText}>{format(time, 'hh:mm a')}</Text>
                  <Ionicons name="time-outline" size={20} color={GREY} />
                </TouchableOpacity>
                {showTimePicker && (
                  <DateTimePicker
                    value={time}
                    mode="time"
                    display="default"
                    onChange={(e, t) => {
                      setShowTimePicker(false);
                      if (t) setTime(t);
                    }}
                  />
                )}
              </View>
            </View>

            <Text style={styles.sectionLabel}>Notes</Text>
            <TextInput
              placeholder="Notes"
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
            />

            <TouchableOpacity style={styles.saveButton} onPress={saveTask}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add New Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: {
    backgroundColor: PRIMARY,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: Platform.OS === "ios" ? 60 : 40,
  },
  headerText: { fontSize: 30,textAlign:"center", color: "#fff", fontWeight: "600" },
  dateText: { position: "absolute", bottom: 12, color: "#fff", fontSize: 14 },
behindComponent: {
    position: 'absolute',
   width: '100%',
    height: 200,
    backgroundColor: PRIMARY,
    padding: 20,
  },
  circlesContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 20,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  halfContainer: { flex: 1 },
  circleLeft: {
    marginLeft: -60,
    marginBottom: -100,
  },
  circleRight: {
    marginRight: -80,
    marginTop: -80,
  },
  listContainer: {
    padding: 20,
    paddingTop: 80, 
    // paddingBottom: 140,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    // ...Platform.select({ android: { elevation: 2 }, ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } } })
  },
  taskItemCompleted: { opacity: 0.5 },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BG_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCompleted: { backgroundColor: BG },

  taskText: { flex: 1, marginLeft: 12 },
  title: { fontSize: 16, color: "#333", fontWeight: "500" },
  textCompleted: { textDecorationLine: "line-through", color: "#999" },
  time: { fontSize: 12, color: "#666", marginTop: 4 },
  timeCompleted: { color: "#aaa" },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: PRIMARY, borderColor: PRIMARY },

  completedSection: {
    marginTop: 24,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
  },
  completedHeader: {
    fontSize: 14,
    marginBottom: 12,
    fontWeight: "600",
    color: "#333",
  },

  addButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: PRIMARY,
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  curveHeader: {
    height: 130,
    backgroundColor: PRIMARY,
    // borderBottomLeftRadius: 120,
    // borderBottomRightRadius: 120,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#fff',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    marginTop: 80,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '600',
    color: '#fff',
  },
  sectionLabel: { marginTop: 16, marginHorizontal: 20, fontSize: 14, fontWeight: '500', color: '#333' },
  input: {
    marginTop: 8,
    marginHorizontal: 20,
    backgroundColor: BG_LIGHT,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeholderText: { color: GREY },
  categoryRow: { flexDirection: 'row', marginTop: 8, marginHorizontal: 20 },
  categoryCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  categoryCircleSelected: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  // halfInputContainer: { flex: 1, marginHorizontal: 20 },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveButton: {
    backgroundColor: PRIMARY,
    margin: 20,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  addText: { color: "#fff", fontWeight: "500" },
});
