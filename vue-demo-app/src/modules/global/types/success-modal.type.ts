export interface SuccessModalData {
  isShowed: boolean;
  message: string;
}

export interface SuccessModalDispatch {
  openModal: (message?: string) => void;
  closeModal: () => void;
}
