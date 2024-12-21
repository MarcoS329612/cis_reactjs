import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
    consoleContainer: {
        marginVertical: 15,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    consoleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#f8f9fa',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    consoleTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
    },
    clearButton: {
        backgroundColor: '#6c757d',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    clearButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },
    messagesContainer: {
        //maxHeight: 250,
        height: 250, // establecer una altura fija
    },
    messageItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#ffffff',
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    timestamp: {
        fontSize: 12,
        color: '#666',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    messageText: {
        fontSize: 16,
        color: '#2c3e50',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
    }
});