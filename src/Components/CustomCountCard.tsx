import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface CustomCardProps {
  children: ReactNode;
  elevated?: boolean;
  style?: ViewStyle;
}

const CustomCountCard: React.FC<CustomCardProps> = ({ children, elevated = false, style }) => {
  const cardStyle = elevated ? [styles.card, styles.elevatedCard, style] : [styles.card, style];

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  elevatedCard: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default CustomCountCard;
