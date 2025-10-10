// features/language/languageSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Get saved language from localStorage or default to 'en'
const getInitialLanguage = () => {
  try {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    return savedLanguage || "en";
  } catch {
    return "en";
  }
};

const initialState = {
  language: getInitialLanguage(),
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    toggleLanguage: (state) => {
      const newLanguage = state.language === "en" ? "ar" : "en";
      state.language = newLanguage;

      // Persist to localStorage
      try {
        localStorage.setItem("selectedLanguage", newLanguage);
      } catch (error) {
        console.error("Failed to save language to localStorage:", error);
      }
    },
    setLanguage: (state, action) => {
      state.language = action.payload;

      // Persist to localStorage
      try {
        localStorage.setItem("selectedLanguage", action.payload);
      } catch (error) {
        console.error("Failed to save language to localStorage:", error);
      }
    },
  },
});

export const { toggleLanguage, setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
