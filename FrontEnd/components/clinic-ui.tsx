import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

export const COLORS = {
  bg: '#EEF5F3',
  page: '#EAF2EF',
  white: '#FFFFFF',
  text: '#244043',
  muted: '#6B7A7A',
  border: '#D7E5E1',
  primary: '#4E9EB3',
  secondary: '#74B59D',
  tealLight: '#D9EBE6',
  greenLight: '#DCEEDF',
  peachLight: '#F3DDD4',
  shadow: 'rgba(66, 98, 92, 0.12)',
};

export function useResponsive() {
  const { width } = useWindowDimensions();
  return {
    width,
    isDesktop: width >= 900,
    isTablet: width >= 680,
  };
}

export function Screen({ children }: { children: React.ReactNode }) {
  return <View style={styles.screen}>{children}</View>;
}

export function BrandHeader({ title, centered = false }: { title: string; centered?: boolean }) {
  const { isDesktop } = useResponsive();
  return (
    <View style={[styles.headerWrap, centered && styles.headerWrapCentered]}>
      <View style={[styles.logoRow, centered && styles.centerRow]}>
        <Ionicons name="flower-outline" size={isDesktop ? 28 : 24} color={COLORS.primary} />
        <Text style={[styles.brand, isDesktop && styles.brandDesktop]}>CLÍNICA MENTAL</Text>
      </View>
      <View style={styles.titleBadge}>
        <Text style={styles.titleBadgeText}>{title}</Text>
      </View>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  green = false,
}: {
  label: string;
  onPress?: () => void;
  green?: boolean;
}) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View style={[styles.primaryButton, green ? styles.primaryButtonGreen : styles.primaryButtonBlue]}>
        <Text style={styles.primaryButtonText}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function InputField({
  label,
  placeholder,
  icon,
}: {
  label: string;
  placeholder: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputWrap}>
        <TextInput placeholder={placeholder} placeholderTextColor="#8DA1A2" style={styles.input} />
        {icon ? <Ionicons name={icon} size={20} color="#6D9EAE" /> : null}
      </View>
    </View>
  );
}

export function SectionCard({
  title,
  tone = 'teal',
  children,
  rightImage = false,
}: {
  title: string;
  tone?: 'teal' | 'green' | 'peach';
  children: React.ReactNode;
  rightImage?: boolean;
}) {
  const toneStyle = tone === 'green' ? styles.toneGreen : tone === 'peach' ? styles.tonePeach : styles.toneTeal;
  return (
    <View style={styles.sectionCard}>
      <View style={[styles.sectionHeader, toneStyle]}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {rightImage ? (
          <View style={styles.sectionMiniImage}>
            <Ionicons name="bed-outline" size={22} color="#6E8B8B" />
          </View>
        ) : null}
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

export function ListRow({
  left,
  right,
  bold = false,
}: {
  left: string;
  right?: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.listRow}>
      <Text style={[styles.rowLeft, bold && styles.rowBold]}>{left}</Text>
      {right ? <Text style={[styles.rowRight, bold && styles.rowBold]}>{right}</Text> : null}
    </View>
  );
}

export function SearchBar({ placeholder = 'Buscar paciente...' }: { placeholder?: string }) {
  return (
    <View style={styles.searchWrap}>
      <Ionicons name="search-outline" size={18} color="#8AA0A0" />
      <TextInput placeholder={placeholder} placeholderTextColor="#99AAAA" style={styles.searchInput} />
    </View>
  );
}

export function PatientRow({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('');
  return (
    <View style={styles.patientRow}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <Text style={styles.patientName}>{name}</Text>
      <Ionicons name="ellipse" size={8} color="#B6BFC0" style={{ marginLeft: 'auto' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  headerWrap: {
  marginBottom: 14,
  marginTop: 13, // 👈 espaço pra não colar na barra
  },
  headerWrapCentered: {
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  centerRow: {
    justifyContent: 'center',
  },
  brand: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: COLORS.text,
  },
  brandDesktop: {
    fontSize: 20,
  },
  titleBadge: {
    backgroundColor: '#CFE2DC',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D7E7E2',
  },
  titleBadgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FFFE',
    textShadowColor: 'rgba(27, 67, 76, 0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  primaryButton: {
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Platform.OS === 'web' ? undefined : '#4A94B9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryButtonBlue: {
    backgroundColor: '#5BA8C2',
  },
  primaryButtonGreen: {
    backgroundColor: '#67A982',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  fieldBlock: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  inputWrap: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#8EB2AF',
    shadowOpacity: Platform.OS === 'web' ? 0.06 : 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 12,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DEE9E5',
    marginBottom: 14,
    shadowColor: '#85A19F',
    shadowOpacity: Platform.OS === 'web' ? 0.06 : 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  sectionHeader: {
    minHeight: 58,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  sectionMiniImage: {
    width: 56,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionBody: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toneTeal: {
    backgroundColor: '#80B8BE',
  },
  toneGreen: {
    backgroundColor: '#9AC6A4',
  },
  tonePeach: {
    backgroundColor: '#D9B0A4',
  },
  listRow: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F1',
  },
  rowLeft: {
    fontSize: 15,
    color: COLORS.text,
  },
  rowRight: {
    fontSize: 15,
    color: COLORS.text,
  },
  rowBold: {
    fontWeight: '700',
  },
  searchWrap: {
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    paddingVertical: 10,
  },
  patientRow: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E1EBE8',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#CFE6E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontWeight: '800',
    color: COLORS.text,
  },
  patientName: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
  },
});
