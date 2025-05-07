"use client";

import { useContext, useState } from "react";
import { FormLogoContext, FormLogoState } from "./context/form-logo-context";
import { FormLogoName } from "./form-logo-name";
import FormLogoCategory from "./form-logo-category";
import { FormLogoDescription } from "./form-logo-description";
import { FormLogoColors } from "./form-logo-colors";
import { FormLogoStyles } from "./form-logo-styles";
import { FormLogoResult } from "./form-logo-result";

const FormStateComponent = () => {
  const formLogoContext = useContext(FormLogoContext);
  switch (formLogoContext.name) {
    case "name":
      return <FormLogoName />;
    case "category":
        return <FormLogoCategory />;
    case "description":
      return <FormLogoDescription />;
    case "colors":
      return <FormLogoColors />;
    case "style":
      return <FormLogoStyles />;
    case "generating":
      return <FormLogoResult />;
    default:
      return <></>;
  }
};

export const FormLogoMain = () => {
  const [state, setState] = useState<FormLogoState>({
    name: "name",
    values: {
      name: "",
      category:"",
      description: "",
      colors: [],
      style: "",
    },
    setState: () => {},
  });

  return (
    <FormLogoContext.Provider
      value={{
        ...state,
        setState: (partial) => {
          console.log(partial);
          setState((prev) => ({ ...prev, ...partial }));
        },
      }}
    >
      <FormStateComponent />
    </FormLogoContext.Provider>
  );
};
