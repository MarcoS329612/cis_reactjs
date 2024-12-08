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
          <Text style={TableStagesStyles.stageTitle}>{stage.stageName}</Text>

          {/* Encabezados de las columnas */}
          <View style={TableStagesStyles.tableHeader}>
            <Text style={TableStagesStyles.tableHeaderText}>Item</Text>
            <Text style={TableStagesStyles.tableHeaderText}>Completed</Text>
            <Text style={TableStagesStyles.tableHeaderText}>Pending</Text>
          </View>

          {/* Filas de la tabla */}
          {stage.items.map((item, itemIndex) => {
            const rowStyle = item.pending > 0 
              ? TableStagesStyles.tableRowRed 
              : TableStagesStyles.tableRowGreen;

            return (
              <View key={itemIndex} style={[TableStagesStyles.tableRow, rowStyle]}>
                <Text style={TableStagesStyles.tableCell}>{item.itemName}</Text>
                <Text style={TableStagesStyles.tableCell}>{item.completed}</Text>
                <Text style={TableStagesStyles.tableCell}>{item.pending}</Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default TableStages;