import { inject } from "vue";

import type { Provider } from "@/modules/common/types/provider.type";
import type { UserData, UserDispatch } from "@/modules/user/types/user.type";
import type {
  ErrorModalData,
  ErrorModalDispatch,
} from "@/modules/global/types/error-modal.type";
import type {
  SuccessModalData,
  SuccessModalDispatch,
} from "@/modules/global/types/success-modal.type";
import type {
  AuthModalData,
  AuthModalDispatch,
} from "@/modules/global/types/auth-modal.type";
import type {
  NormalModalData,
  NormalModalDispatch,
} from "@/modules/global/types/normal-modal.type";

type ReturnType<T extends Provider> = T extends Provider.user
  ? UserData
  : T extends Provider.userDispatch
  ? UserDispatch
  : T extends Provider.errorModal
  ? ErrorModalData
  : T extends Provider.errorModalDispatch
  ? ErrorModalDispatch
  : T extends Provider.successModal
  ? SuccessModalData
  : T extends Provider.successModalDispatch
  ? SuccessModalDispatch
  : T extends Provider.authModal
  ? AuthModalData
  : T extends Provider.authModalDispatch
  ? AuthModalDispatch
  : T extends Provider.normalMdoal
  ? NormalModalData
  : T extends Provider.normalMoalDispatch
  ? NormalModalDispatch
  : undefined;

export function getInjection<T extends Provider>(key: T) {
  return inject(key) as ReturnType<T>;
}
