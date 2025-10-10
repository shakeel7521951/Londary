import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const LanguageTest = () => {
  const reduxLanguage = useSelector((state) => state.language.language);
  const { i18n } = useTranslation();
  const localStorageLanguage = localStorage.getItem("selectedLanguage");

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h3>Language Persistence Test</h3>
      <p>
        <strong>Redux Language:</strong> {reduxLanguage}
      </p>
      <p>
        <strong>i18next Language:</strong> {i18n.language}
      </p>
      <p>
        <strong>LocalStorage Language:</strong>{" "}
        {localStorageLanguage || "Not set"}
      </p>
      <p>
        <strong>Document Direction:</strong> {document.documentElement.dir}
      </p>
      <p>
        <strong>Document Language:</strong> {document.documentElement.lang}
      </p>
    </div>
  );
};

export default LanguageTest;
