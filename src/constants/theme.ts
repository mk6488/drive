import type { TextStyle, ViewStyle } from 'react-native';

const colours = {
  riverNight: '#07120F',
  riverDeep: '#0D1D18',
  riverSurface: '#132820',
  reed: '#6F7A52',
  parchment: '#F2E6CC',
  parchmentMuted: '#DDC9A7',
  parchmentDeep: '#BFA47A',
  bronze: '#A8692C',
  gold: '#D3A64B',
  ember: '#C97A3A',
  ink: '#18251F',
  mutedInk: '#4F5D50',
  mist: '#B9C2B3',
  white: '#FFF9EC',
  danger: '#A84A34',
  success: '#6F854A',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

const radius = {
  sm: 8,
  md: 14,
  lg: 22,
  xl: 30,
  round: 999,
};

const typography = {
  eyebrow: 12,
  caption: 13,
  body: 16,
  label: 15,
  subtitle: 20,
  title: 34,
};

const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 8,
  } satisfies ViewStyle,
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 4,
  } satisfies ViewStyle,
};

const text = {
  title: {
    fontSize: typography.title,
    lineHeight: 40,
    fontWeight: '800',
  } satisfies TextStyle,
  subtitle: {
    fontSize: typography.subtitle,
    lineHeight: 27,
    fontWeight: '800',
  } satisfies TextStyle,
  body: {
    fontSize: typography.body,
    lineHeight: 24,
    fontWeight: '500',
  } satisfies TextStyle,
  label: {
    fontSize: typography.label,
    lineHeight: 20,
    fontWeight: '800',
  } satisfies TextStyle,
  caption: {
    fontSize: typography.caption,
    lineHeight: 18,
    fontWeight: '600',
  } satisfies TextStyle,
  eyebrow: {
    fontSize: typography.eyebrow,
    lineHeight: 16,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } satisfies TextStyle,
};

export const theme = {
  colours,
  spacing,
  radius,
  typography,
  shadows,
  text,
};
