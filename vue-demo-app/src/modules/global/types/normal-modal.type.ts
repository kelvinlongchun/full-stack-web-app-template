export interface NormalModalData {
  isShowed: boolean;
  headerTitle: string;
  buttonName: string;
  message: string;
}

export interface NormalModalDispatch {
  openModal: (
    headerTitle?: string,
    buttonName?: string,
    message?: string
  ) => void;
  closeModal: () => void;
}
