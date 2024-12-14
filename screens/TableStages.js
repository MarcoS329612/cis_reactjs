// components/TableStages.js
import React from 'react';
import { View, Text } from 'react-native';
import TableStagesStyles from '../styles/TableStagesStyles';

const TableStages = ({ pieces }) => {
  return (
    <View style={TableStagesStyles.container}>
      {pieces && pieces.map((stage, index) => (
        <View key={index} style={TableStagesStyles.stageContainer}>
          {/* Título de la etapa */}
          <Text selectable={true} style={TableStagesStyles.stageTitle}>
            {stage.stageName}
          </Text>

          {/* Encabezados de las columnas */}
          <View style={TableStagesStyles.tableHeader}>
            <Text selectable={true} style={TableStagesStyles.tableHeaderText}>Item</Text>
            <Text selectable={true} style={TableStagesStyles.tableHeaderText}>OCR</Text>
            <Text selectable={true} style={TableStagesStyles.tableHeaderText}>Status</Text>
          </View>

          {/* Filas de la tabla */}
          {stage.items.map((item, itemIndex) => {
            const rowStyle = (item.status == true) 
              ? TableStagesStyles.tableRowGreen 
              : null; // Ajusta esta condición si lo necesitas

            return (
              <View key={itemIndex} style={[TableStagesStyles.tableRow, rowStyle]}>
                <Text selectable={true} style={TableStagesStyles.tableCell}>{item.itemName}</Text>
                <Text selectable={true} style={TableStagesStyles.tableCell}>{item.itemOCR}</Text>
                <Text selectable={true} style={TableStagesStyles.tableCell}>{item.ratio}</Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default TableStages;
