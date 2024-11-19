import * as authValidator from "./auth.validators";
import * as userValidator from "./user.validators";

export default { ...authValidator, ...userValidator };
