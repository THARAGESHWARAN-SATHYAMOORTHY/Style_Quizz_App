import { StyleSheet } from 'react-native';

const FASHION_PALETTE = {
  primary: '#C5897A',
  background: '#FDF8F5',
  textPrimary: '#333333',
  textSecondary: '#7A7A7A',
  white: '#FFFFFF',
  border: '#EAEAEA',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FASHION_PALETTE.background,
  },
  keyboardAvoidingContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },

  headerContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: FASHION_PALETTE.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: FASHION_PALETTE.textSecondary,
  },

  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: FASHION_PALETTE.border,
    marginBottom: 25,
  },
  icon: {
    fontSize: 22,
    color: FASHION_PALETTE.textSecondary,
    marginRight: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: FASHION_PALETTE.textPrimary,
    height: 50,
  },
  forgotPasswordText: {
    textAlign: 'right',
    color: FASHION_PALETTE.primary,
    fontWeight: '500',
    fontSize: 14,
  },

  footerContainer: {
    paddingBottom: 20,
  },
  button: {
    backgroundColor: FASHION_PALETTE.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: FASHION_PALETTE.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: FASHION_PALETTE.white,
    fontSize: 18,
    fontWeight: '600',
  },
  linkText: {
    textAlign: 'center',
    color: FASHION_PALETTE.textSecondary,
    fontSize: 14,
  },
  linkTextBold: {
    fontWeight: 'bold',
    color: FASHION_PALETTE.primary,
  },

  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: FASHION_PALETTE.border,
  },
  welcomeMessage: {
    fontSize: 20,
    fontWeight: '300',
    color: FASHION_PALETTE.textSecondary,
  },
  userName: {
    fontSize: 28,
    fontWeight: '600',
    color: FASHION_PALETTE.textPrimary,
  },

  swiperContainer: {
    flex: 1,
    marginTop: -20,
  },
  card: {
    flex: 0.85,
    borderRadius: 20,
    backgroundColor: FASHION_PALETTE.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  cardImage: {
    flex: 1,
    borderRadius: 20,
  },
  cardTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  cardName: {
    color: FASHION_PALETTE.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardBrand: {
    color: FASHION_PALETTE.white,
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 20,
    zIndex: 1,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: FASHION_PALETTE.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  overlayWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeLabel: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#2ECC71',
    borderColor: '#2ECC71',
    borderWidth: 5,
    padding: 10,
    borderRadius: 10,
    transform: [{ rotate: '-15deg' }],
  },
  nopeLabel: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#E74C3C',
    borderColor: '#E74C3C',
    borderWidth: 5,
    padding: 10,
    borderRadius: 10,
    transform: [{ rotate: '15deg' }],
  },

  matchesHeader: {
    padding: 25,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: FASHION_PALETTE.border,
  },
  
  matchesTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: FASHION_PALETTE.textPrimary,
  },
  matchesContent: {
    padding: 20,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FASHION_PALETTE.white,
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  matchImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: FASHION_PALETTE.textPrimary,
  },
  matchBrand: {
    fontSize: 14,
    color: FASHION_PALETTE.textSecondary,
    marginTop: 4,
  },
  matchesFooter: {
    padding: 25,
    borderTopWidth: 1,
    borderTopColor: FASHION_PALETTE.border,
  },
  noMatchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  noMatchesText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#aaa',
    marginTop: 20,
  },
  noMatchesSubText: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 10,
  },
  gridContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  padding: 12,
},

productCard: {
  width: '48%',
  backgroundColor: FASHION_PALETTE.white,
  borderRadius: 12,
  marginBottom: 15,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
  padding: 10,
},

imageWrapper: {
  position: 'relative',
  borderRadius: 12,
  overflow: 'hidden',
},

productImage: {
  width: '100%',
  height: 180,
  borderRadius: 12,
  resizeMode: 'cover',
  flex: 1
},

wishlistIcon: {
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(255,255,255,0.9)',
  borderRadius: 20,
  padding: 5,
},

productName: {
  fontSize: 14,
  fontWeight: '600',
  color: FASHION_PALETTE.textPrimary,
  marginTop: 8,
},

productBrand: {
  fontSize: 12,
  color: FASHION_PALETTE.textSecondary,
  marginBottom: 5,
},

priceRow: {
  flexDirection: 'row',
  alignItems: 'center',
},

discountedPrice: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#222',
  marginRight: 5,
},

originalPrice: {
  fontSize: 12,
  color: '#888',
  textDecorationLine: 'line-through',
  marginRight: 5,
},

discountLabel: {
  fontSize: 12,
  color: '#E74C3C',
  fontWeight: '600',
},

ratingRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 4,
},

ratingText: {
  fontSize: 12,
  color: '#444',
  marginLeft: 3,
},
saleTag: {
  position: 'absolute',
  top: 8,
  left: 8,
  backgroundColor: '#E74C3C',
  paddingHorizontal: 8,
  paddingVertical: 3,
  borderRadius: 6,
},
saleText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: 'bold',
  textTransform: 'uppercase',
},
 headerContainer: {
  backgroundColor: '#FDF8F5',
  borderBottomWidth: 1,
  borderBottomColor: "#ddd",
},

matchesHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingVertical: 12,
},

matchesTitle: {
  fontSize: 18,
  fontWeight: "600",
  color: "#333",
},

wishlistToggle: {
  padding: 8,
},
cardInfoRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 8,
},
infoChip: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f2f2f2',
  borderRadius: 20,
  paddingHorizontal: 8,
  paddingVertical: 4,
  marginRight: 6,
  marginBottom: 6,
},
infoText: {
  marginLeft: 4,
  fontSize: 12,
  color: '#333',
},

});