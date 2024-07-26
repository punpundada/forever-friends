export type DefaultState<T, K> = {
  defaultValues: T;
  response: K | undefined;
  message: string;
  isSuccess: boolean;
};
