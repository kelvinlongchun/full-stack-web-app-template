export interface ErrorModalData {
  isShowed: boolean;
  message: string;
}

export interface ErrorModalDispatch {
  openModal: (message?: string) => void;
  closeModal: () => void;
}
