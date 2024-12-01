import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import DashBoardStyles from '../styles/DashBoardStyles';

export default function DashBoard({ navigation }) {
  return (
    <ScrollView style={DashBoardStyles.container}>
      {/* Header */}
      <View style={DashBoardStyles.header}>
        <Text style={DashBoardStyles.title}>GRUPO ARGA - INVENTORY CONTROL SYSTEM</Text>
        <Text style={DashBoardStyles.subtitle}>
          INNOVATION AND TECHNOLOGY - Scanning and Control of Materials
        </Text>
      </View>

      {/* Buttons */}
      <View style={DashBoardStyles.buttonContainer}>
        <Button title="Upload CSV File" onPress={() => {}} />
        <Button title="Scan with Camera" onPress={() => navigation.navigate('TakePhoto')} />
      </View>

      {/* Search OCR */}
      <View style={DashBoardStyles.searchContainer}>
        <TextInput
          style={DashBoardStyles.input}
          placeholder="Search OCR"
        />
        <Button title="Find and Mark Scan" onPress={() => {}} />
        <Button title="Save Changes" onPress={() => {}} />
      </View>

      {/* Console Messages */}
      <View style={DashBoardStyles.console}>
        <Text style={DashBoardStyles.consoleTitle}>Console Messages</Text>
        <View style={DashBoardStyles.consoleBox}></View>
      </View>

      {/* Sections */}
      <View style={DashBoardStyles.sectionContainer}>
        {['CUTTING', 'MACHINING', 'WAREHOUSE', 'BENT'].map((section) => (
          <View key={section} style={DashBoardStyles.section}>
            <Text style={DashBoardStyles.sectionTitle}>{section}</Text>
            <View style={DashBoardStyles.sectionContent}>
              <View style={[DashBoardStyles.sectionColumn, DashBoardStyles.unscannedItems]}>
                <Text style={DashBoardStyles.sectionLabel}>UNSCANNED ITEMS</Text>
                <View style={DashBoardStyles.table}></View>
              </View>
              <View style={[DashBoardStyles.sectionColumn, DashBoardStyles.scannedItems]}>
                <Text style={DashBoardStyles.sectionLabel}>SCANNED ITEMS</Text>
                <View style={DashBoardStyles.table}></View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
