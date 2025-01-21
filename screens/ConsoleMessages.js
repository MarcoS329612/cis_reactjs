import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../styles/ConsoleMessagesStyles';

const ConsoleMessages = forwardRef((props, ref) => {
    const [messages, setMessages] = useState([]);

    useImperativeHandle(ref, () => ({
        addMessage: (text) => {
            const newMessage = {
                id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Key única
                text,
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prevMessages => [...prevMessages, newMessage]);
        }
    }));

    if (!messages || messages.length === 0) {
        return (
            <View style={styles.consoleContainer}>
                <View style={styles.consoleHeader}>
                    <Text style={styles.consoleTitle}>Console Messages</Text>
                    <TouchableOpacity style={styles.clearButton} disabled>
                        <Text style={[styles.clearButtonText, { opacity: 0.5 }]}>Clear</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No messages to display</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.consoleContainer}>
            <View style={styles.consoleHeader}>
                <Text style={styles.consoleTitle}>Console Messages</Text>
                <TouchableOpacity 
                    onPress={() => setMessages([])} 
                    style={styles.clearButton}
                >
                    <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
            </View>
            {/** ▼ SCROLLVIEW HIJO con nestedScrollEnabled */}
            <ScrollView 
                nestedScrollEnabled={true}   // Permite scroll anidado
                style={styles.messagesContainer}
                showsVerticalScrollIndicator={true}
            >
                {messages.map((message) => (
                    <View key={message.id} style={styles.messageItem}>
                        <View style={styles.messageHeader}>
                            <Text style={styles.timestamp}>{message.timestamp}</Text>
                        </View>
                        <Text style={styles.messageText}>{message.text}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
});

export default ConsoleMessages;
