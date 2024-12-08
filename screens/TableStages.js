// components/TableStages.js
import React from 'react';
import { View, Text } from 'react-native';
import TableStagesStyles from '../styles/TableStagesStyles';

const TableStages = ({ pieces }) => {
  const sections = ['CUTTING', 'MACHINING', 'WAREHOUSE', 'BENT'];

  return (
    <View>
      <Text style={TableStagesStyles.sectionLabel}>SCANNED ITEMS</Text>
      {pieces && pieces.map((piece, index) => (
        <Text key={index}>{piece.name}</Text>
      ))}
    </View>
  );
};

export default TableStages;