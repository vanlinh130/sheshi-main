import { initController } from './init.controller';
import { initWebUserController } from './user/user.controller';
import { initWebAuthController } from './user/auth.controller';
import { initWebAuthAdminController } from './admin/auth.controller';
import { initOtpController } from './user/otp.controller';
import { initOtpAdminController } from './admin/otp.controller';
import { initWebProductController } from './product.controller';
import { initWebCommonController } from './common.controller';
import { initWebOrderController } from './order.controller';
import { initWebMasterController } from './master.controller';
import { initWebContractController } from './contract.controller';
import { initWebPageController } from './page.controller';
import { initAclController } from './acl.controller';
import { initWebCommissionController } from './commission.controller';
import { initWebLevelConditionsController } from './level.controller';
import { initWebNewsController } from './news.controller';

export function initApiController(app) {
  initController(app);
  initAclController(app);
  initWebNewsController(app);
  initWebAuthController(app);
  initWebAuthAdminController(app);
  initOtpController(app);
  initOtpAdminController(app);
  initWebProductController(app);
  initWebCommissionController(app);
  initWebCommonController(app);
  initWebUserController(app);
  initWebPageController(app);
  initWebLevelConditionsController(app);
  initWebOrderController(app);
  initWebMasterController(app);
  initWebContractController(app);
}
