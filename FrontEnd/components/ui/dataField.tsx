import React, { useMemo, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/components/clinic-ui';

type DateFieldProps = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
};

export default function DateField({
  label,
  value,
  onChange,
}: DateFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const formattedDate = useMemo(() => {
    const dia = String(value.getDate()).padStart(2, '0');
    const mes = String(value.getMonth() + 1).padStart(2, '0');
    const ano = value.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }, [value]);

  const webDateValue = useMemo(() => {
    const ano = value.getFullYear();
    const mes = String(value.getMonth() + 1).padStart(2, '0');
    const dia = String(value.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }, [value]);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.fieldBlock}>
        <Text style={styles.label}>{label}</Text>

        <View style={styles.webDateWrapper}>
          <input
            type="date"
            value={webDateValue}
            onChange={(e) => {
              const selected = new Date(`${e.target.value}T00:00:00`);
              onChange(selected);
            }}
            style={styles.webInput as any}
          />
          <Ionicons
            name="calendar-outline"
            size={20}
            color={COLORS.muted}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.dateText}>{formattedDate}</Text>
        <Ionicons
          name="calendar-outline"
          size={20}
          color={COLORS.muted}
        />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              onChange(selectedDate);
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldBlock: {
    marginBottom: 14,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  dateButton: {
    minHeight: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D7E5E1',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
    color: COLORS.text,
  },
  webDateWrapper: {
    minHeight: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D7E5E1',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  webInput: {
    flex: 1,
    height: 54,
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: 16,
    color: '#29434E',
  },
});