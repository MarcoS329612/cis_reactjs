// TableStages.js
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Button } from 'react-native';
import TableStagesStyles from '../styles/TableStagesStyles';

const TableStages = ({ pieces }) => {
  return (
    <View style={TableStagesStyles.gridContainer}>
      {pieces && pieces.map((stage, index) => (
        <StageWithFilters
          key={index}
          stage={stage}
        />
      ))}
    </View>
  );
};

const StageWithFilters = ({ stage }) => {
  // Cada etapa tiene su propio texto de búsqueda y orden “verde arriba/abajo”
  const [searchTerm, setSearchTerm] = useState('');
  const [showGreenBottom, setShowGreenBottom] = useState(false);

  // Lógica de filtrado y ordenado
  const getFilteredItems = () => {
    let filteredItems = [...stage.items]; // copiamos para no mutar

    // Filtrar por searchTerm (itemName u OCR)
    if (searchTerm.trim() !== '') {
      filteredItems = filteredItems.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemOCR.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar: si showGreenBottom = true, los verdes (status=true) van abajo
    if (showGreenBottom) {
      filteredItems.sort((a, b) => {
        if (a.status === b.status) return 0;
        if (a.status && !b.status) return 1;  // verde va después
        if (!a.status && b.status) return -1; // verde va antes
        return 0;
      });
    } else {
      // Verdes arriba
      filteredItems.sort((a, b) => {
        if (a.status === b.status) return 0;
        if (a.status && !b.status) return -1; 
        if (!a.status && b.status) return 1;
        return 0;
      });
    }

    return filteredItems;
  };

  const filteredItems = getFilteredItems();

  return (
    <View style={TableStagesStyles.stageContainer}>
      {/* Encabezado: Título + Botón de ordenar */}
      <View style={TableStagesStyles.stageHeader}>
        <Text selectable={true} style={TableStagesStyles.stageTitle}>
          {stage.stageName}
        </Text>
        <Button
          title={showGreenBottom ? 'Finished up' : 'Finished down'}
          onPress={() => setShowGreenBottom(!showGreenBottom)}
        />
      </View>

      {/* Campo de búsqueda debajo del header */}
      <TextInput
        style={TableStagesStyles.searchInput}
        placeholder="Filter by name or OCR..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* Tabla desplazable */}
      <ScrollView style={TableStagesStyles.tableScroll} nestedScrollEnabled={true}>
        <View style={TableStagesStyles.tableContent}>
          {/* Encabezado de columnas */}
          <View style={TableStagesStyles.tableHeader}>
            <Text selectable={true} style={TableStagesStyles.tableHeaderText}>Item</Text>
            <Text selectable={true} style={TableStagesStyles.tableHeaderText}>OCR</Text>
            <Text selectable={true} style={TableStagesStyles.tableHeaderText}>Status</Text>
          </View>

          {/* Filas filtradas y ordenadas */}
          {filteredItems.map((item, itemIndex) => {
            const rowStyle = item.status === true 
              ? TableStagesStyles.tableRowGreen 
              : null;

            return (
              <View key={itemIndex} style={[TableStagesStyles.tableRow, rowStyle]}>
                <Text selectable={true} style={TableStagesStyles.tableCell}>{item.itemName}</Text>
                <Text selectable={true} style={TableStagesStyles.tableCell}>{item.itemOCR}</Text>
                <Text selectable={true} style={TableStagesStyles.tableCell}>{item.ratio}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default TableStages;
