// features/language/languageSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: "en", // default language
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    toggleLanguage: (state) => {
      state.language = state.language === "en" ? "ar" : "en";
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const { toggleLanguage, setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
