import { AxiosError } from "axios";

export type errorType = {
  message: string;
  statusCode: number;
};

export type AxiosErrorType = AxiosError<errorType>;
