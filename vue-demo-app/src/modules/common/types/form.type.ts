import type { FetchMethod } from "@/modules/common/utils/fetch-data.util";
import type { InputConditions } from "@/modules/common/utils/validate.util";

export type Inputs = {
  name: string;
  value: string;
  conditions: InputConditions;
  isValid: boolean;
  errorMessages: string[];
}[];

export type PropInputs = {
  name: string;
  type?: "text" | "email" | "password";
  value?: string;
  isPassCode?: boolean;
  passCodeLength?: number;
  autocomplete?: "username" | "current-password" | "off";
  isHidden?: boolean;
  conditions: InputConditions;
}[];

export interface SubmitOptions {
  url: string;
  method: FetchMethod;
  accessToken?: string;
}
