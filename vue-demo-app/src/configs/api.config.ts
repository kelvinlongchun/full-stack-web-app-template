const backendUrl = "http://localhost:5000";

export class ApiConfig {
  public static LOGIN_API_URL = `${backendUrl}/auth/login`;
  public static REGISTER_API_URL = `${backendUrl}/user/register`;
  public static GOOGLE_AUTH_API_URL = `${backendUrl}/auth/google`;
  public static FACEBOOK_AUTH_API_URL = `${backendUrl}/auth/facebook`;
  public static GET_USER_API_URL(userId: string) {
    return `${backendUrl}/user/${userId}`;
  }
  public static REQUEST_RESEST_ACTIVATION_CODE_URL(userId: string) {
    return `${backendUrl}/user/email/activation-code/${userId}`;
  }
  public static ACTIVATE_USER_API_URL(userId: string) {
    return `${backendUrl}/user/activate/${userId}`;
  }
  public static CHANGE_USERNAME_URL(userId: string) {
    return `${backendUrl}/user/username/${userId}`;
  }
  public static REQUEST_RESEST_PASSWORD_URL = `${backendUrl}/user/email/reset-password`;
  public static RESET_PASSWORD_URL(userId: string) {
    return `${backendUrl}/user/reset-password/${userId}`;
  }
}
