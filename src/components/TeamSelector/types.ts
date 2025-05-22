export interface FormData {
  customSquad: string;
  pitchType: string;
  weather: string;
  opposition: string;
}

export interface TeamSelectorFormProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}