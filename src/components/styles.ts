// styles.ts

import { StyleSheet } from "react-native";

const additionalStyles = StyleSheet.create({
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  formColumn: {
    flex: 0.48,
  },
  propertyDetailsRow: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 8,
  },
  propertyDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  propertyDetailIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  propertyDetailText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  amenitiesContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  amenitiesLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  amenityChip: {
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
  },
  amenityText: {
    fontSize: 10,
    color: "#4a90e2",
  },
  selectedAmenitiesContainer: {
    marginBottom: 16,
  },
  selectedAmenitiesLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  selectedAmenitiesRow: {
    flexDirection: "row",
  },
  selectedAmenityChip: {
    marginRight: 8,
    borderRadius: 16,
    overflow: "hidden",
  },
  selectedAmenityGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedAmenityText: {
    fontSize: 12,
    color: "#4a90e2",
    marginRight: 4,
  },
  removeAmenityText: {
    fontSize: 14,
    color: "#e74c3c",
    fontWeight: "bold",
  },
  yearBuiltText: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  headerLeft: {
    flexDirection: "column",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#12181F",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  profileButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  profileGradient: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  profileInitial: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  addPropertySection: {
    marginBottom: 20,
  },
  glassCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  glassGradient: {
    padding: 16,
    borderRadius: 16,
  },
  addPropertyHeader: {
    alignItems: "center",
    marginBottom: 12,
  },
  futuristicButton: {
    borderRadius: 24,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  formContainer: {
    marginTop: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  futuristicInput: {
    marginBottom: 12,
  },
  predictionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
  },
  predictionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  predictionText: {
    fontSize: 14,
    color: "#333",
  },
  predictionSeparator: {
    height: 1,
    backgroundColor: "#ddd",
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  dropdownButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  dropdownGradient: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#666",
  },
  dropdownMenu: {
    borderRadius: 8,
  },
  dropdownMenuItem: {
    paddingVertical: 8,
  },
  dropdownMenuItemTitle: {
    fontSize: 14,
    color: "#333",
  },
  imageButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 8,
  },
  imageButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  imageButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  imageButtonText: {
    fontSize: 14,
    color: "#333",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  imagePreviewContainer: {
    marginTop: 10,
    borderRadius: 16,
    overflow: "hidden",
  },
  imagePreview: {
    height: 160,
    width: "100%",
  },
  imagePreviewOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  imagePreviewGradient: {
    flex: 1,
  },
  addButton: {
    borderRadius: 24,
    overflow: "hidden",
    marginTop: 16,
  },
  addButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 24,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  propertiesSection: {
    marginTop: 20,
  },
  propertiesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#ffffff",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    width: "95%",
    height: 60,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#12181F",
  },
  countContainer: {
    borderRadius: 20,
    overflow: "hidden",
  },
  countGradient: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  countText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "600",
  },
  propertyCard: {
    borderRadius: 20,
    overflow: "hidden",
  },
  cardGlow: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  cardGradient: {
    borderRadius: 20,
  },
  imageContainer: {
    position: "relative",
    height: 200,
  },
  propertyImage: {
    height: "100%",
    width: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  imageGradient: {
    height: "50%",
  },
  priceTag: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#4a90e2",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  priceText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  propertyContent: {
    padding: 14,
  },
  propertyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#12181F",
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 6,
    borderRadius: 14,
    overflow: "hidden",
  },
  actionButtonGradient: {
    padding: 6,
  },
  actionButtonText: {
    fontSize: 14,
  },
  typeChipContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  typeEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  typeText: {
    fontSize: 14,
    color: "#333",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  navItem: {
    padding: 6,
  },
  locationIcon: {
    marginRight: 6,
  },
  locationEmoji: {
    fontSize: 14,
  },
  propertyAddress: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  propertyDescription: {
    marginTop: 8,
    fontSize: 13,
    color: "#555",
  },
  propertyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  dateContainer: {},
  dateLabel: {
    fontSize: 11,
    color: "#999",
  },
  dateText: {
    fontSize: 12,
    color: "#333",
  },
  viewButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  viewButtonText: {
    fontSize: 13,
    color: "#4a90e2",
    fontWeight: "600",
  },
  separator: {
    height: 16,
  },
  loadingContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#555",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 30,
    borderRadius: 16,
    overflow: "hidden",
  },
  emptyGradient: {
    alignItems: "center",
    padding: 30,
    borderRadius: 16,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  emptySubtext: {
    fontSize: 13,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
  },
  modalGradient: {
    flex: 1,
    paddingTop: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {},
  closeButtonText: {
    fontSize: 18,
    color: "#333",
  },
  modalContent: {
    paddingHorizontal: 16,
  },
  floatingNavContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  floatingNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 30,
  },
  navButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  navButtonText: {
    fontSize: 14,
    color: "#4a90e2",
    fontWeight: "600",
  },
  dropdown: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 16,
  },

  dropdownItem: {
    backgroundColor: "rgba(74,144,226,0.08)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginBottom: 8,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  selectedDropdownItem: {
    backgroundColor: "#4a90e2",
  },

  selectedDropdownText: {
    color: "#fff",
  },
});

export default { ...styles, ...additionalStyles };
