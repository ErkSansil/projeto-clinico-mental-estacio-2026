import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/components/clinic-ui';

type Option = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  options: Option[];
  onChange: (value: string) => void;
};

export default function SelectField({
  label,
  value,
  placeholder = 'Selecione',
  options,
  onChange,
}: SelectFieldProps) {

  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    return (
      options.find((item) => item.value === value)?.label ||
      placeholder
    );
  }, [options, value, placeholder]);

  return (
    <View
      style={[
        styles.fieldBlock,
        open && styles.fieldBlockOpen,
      ]}
    >

      <Text style={styles.label}>
        {label}
      </Text>

      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.selectButton,
          open && styles.selectButtonOpen,
        ]}
        onPress={() => setOpen(!open)}
      >

        <Text
          style={[
            styles.selectText,
            !value && styles.placeholder,
          ]}
        >
          {selectedLabel}
        </Text>

        <Ionicons
          name={
            open
              ? 'chevron-up-outline'
              : 'chevron-down-outline'
          }
          size={20}
          color={COLORS.muted}
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>

          <ScrollView
            style={styles.scrollArea}
            nestedScrollEnabled
            showsVerticalScrollIndicator
          >

            {options.map((item) => {

              const isSelected =
                item.value === value;

              return (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.optionItem,
                    isSelected &&
                      styles.optionItemSelected,
                  ]}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >

                  <Text
                    style={[
                      styles.optionText,
                      isSelected &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>

                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  fieldBlock: {
    marginBottom: 14,
    position: 'relative',
     overflow: 'visible',
  },

  fieldBlockOpen: {
  marginBottom: 220,
  },

  fieldBlockActive: {
    zIndex: 999999,
  },

  label: {
  fontSize: 14,
  color: '#17262F',
  marginBottom: 8,
  fontWeight: '500',
  },

  selectButton: {
  height: 52,
  borderWidth: 1,
  borderColor: '#DCEBE7',
  borderRadius: 14,
  backgroundColor: '#FFFFFF',
  paddingHorizontal: 14,

  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  },

  selectButtonOpen: {
    borderColor: '#BFD6CF',
  },

  selectText: {
  fontSize: 14,
  color: '#17262F',
  flex: 1,
  },

  placeholder: {
  color: '#94A3B8',
  },

  dropdown: {
  position: 'absolute',
  top: 70,
  marginTop: 6,
  left: 0,
  right: 0,

  zIndex: 999999,

  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#DCEBE7',
  borderRadius: 14,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  },

  scrollArea: {
    maxHeight: 180,
  },

  optionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },

  optionItemSelected: {
    backgroundColor: '#F2F8F6',
  },

  optionText: {
    fontSize: 16,
    color: COLORS.text,
  },

  optionTextSelected: {
    fontWeight: '700',
  },
});