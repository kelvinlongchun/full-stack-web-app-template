export interface AuthModalData {
  isShowed: boolean;
  isLogin: boolean;
}

export interface AuthModalDispatch {
  toggleModal: () => void;
  toggleIsLogin: () => void;
  resetModal: () => void;
}
