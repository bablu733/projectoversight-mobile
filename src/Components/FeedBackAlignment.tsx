import React, { useState } from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const FeedbackAlignment = ({ label, value, onValueChange, options }) => {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>{label}:</Text>
            <View style={styles.input}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option.rating}
                        onPress={() => onValueChange(option.rating)}
                        style={styles.ratingIcon}
                    >
                        <Ionicons
                            name="star"
                            size={30}
                            color={option.isSelected ? "#FFA500" : "#ccc"}
                        />
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={styles.inputTitle}>Rating: {value}</Text>
        </View>
    );
};

const styles = {
    inputContainer: {
        marginHorizontal: 26,
        marginVertical: 8,
    },
    inputTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 8,
    },
    ratingIcon: {
        marginHorizontal: 8,
    },
};

export default FeedbackAlignment;
