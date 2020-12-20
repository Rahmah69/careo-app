import { StyleSheet } from 'react-native'

export const headStyles = StyleSheet.create({
  headerSection: {
    height: 44 + 40, 
    width: '100%', 
    backgroundColor: '#C4CBC8',
    paddingTop: 50,
  },
  headerDisplaySection: {
    flex: 1,
    width: '100%', 
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    textAlign: 'center', 
    textAlignVertical: 'center',
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#125171',
  },
  backButton: {
    textAlign: 'left', textAlignVertical: 'center', fontSize: 20, color: '#125171', marginBottom: 3
  },
})