import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type FormState = {
  key: string;
  prefix: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  nationality: string;
  idCard: string;
  gender: string;
  phone: string;
  passport: string;
  expectedSalary: string;
};

type AddToFormAction = {
  type: string;
  payload: {
    field: string;
    value: string;
  };
};

export const initialValues: FormState = {
  key: "",
  prefix: "",
  firstName: "",
  lastName: "",
  birthDate: "",
  nationality: "",
  idCard: "",
  gender: "",
  phone: "",
  passport: "",
  expectedSalary: "",
};

const formSlice = createSlice({
  name: "form",
  initialState: initialValues,
  reducers: {
    addToForm: (state: FormState | any, action: AddToFormAction) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    clearForm: () => initialValues,
  },
});

export const { addToForm, clearForm } = formSlice.actions;
export const formSelector = (store: RootState) => store.formReducer;
export default formSlice.reducer;
