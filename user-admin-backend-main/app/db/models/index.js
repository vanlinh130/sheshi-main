import Sequelize from 'sequelize';
import databaseConfig from '../../config/database';
import User from './user/user';
import OTP from './otp';
import UserInformation from './user/user-information';
import UserAddress from './user/user-address';
import Product from './product/product';
import ProductInventory from './product/product-inventory';
import ProductImage from './product/product-image';
import ProductCategory from './product/product-category';
import Discount from './product/discount';
import Order from './order/order';
import OrderItem from './order/orderItem';
import OrderPayment from './order/orderPayment';
import Admin from './admin/admin';
import UserReferral from './user/user-referral';
import MasterData from './master/masterData';
import Contract from './contract';
import ProductDetail from './product/product-detail';
import ContactPage from './page/contact-page';
import ContentPage from './page/content-page';
import SlidePage from './page/slide-page';
import ACLAction from './acl/acl-action';
import ACLGroup from './acl/acl-group';
import ACLModule from './acl/acl-module';
import ACLGroupAction from './acl/acl-group-action';
import CommissionConfig from "./commission-config";
import LevelConditions from './level-conditions';
import CommissionLevel from './commission-level';
import CommissionUser from './commission-user';
import UserBonus from './user/user-bonus';
import News from './news';

const env = process.env.NODE_ENV || 'development';

const config = {
  ...databaseConfig[env]
};

const sequelize = new Sequelize(config.database, config.username, config.password, config);
const models = {
  // Admin
  Admin: Admin.init(sequelize),

  // ACL
  ACLAction: ACLAction.init(sequelize),
  ACLGroup: ACLGroup.init(sequelize),
  ACLGroupAction: ACLGroupAction.init(sequelize),
  ACLModule: ACLModule.init(sequelize),

  // Master
  MasterData: MasterData.init(sequelize),
  CommissionConfig: CommissionConfig.init(sequelize),
  CommissionLevel: CommissionLevel.init(sequelize),
  CommissionUser: CommissionUser.init(sequelize),
  LevelConditions: LevelConditions.init(sequelize),

  // User
  User: User.init(sequelize),
  UserInformation: UserInformation.init(sequelize),
  UserAddress: UserAddress.init(sequelize),
  UserReferral: UserReferral.init(sequelize),
  UserBonus: UserBonus.init(sequelize),
  OTP: OTP.init(sequelize),

  // Product
  Product: Product.init(sequelize),
  ProductDetail: ProductDetail.init(sequelize),
  ProductInventory: ProductInventory.init(sequelize),
  ProductImage: ProductImage.init(sequelize),
  ProductCategory: ProductCategory.init(sequelize),
  Discount: Discount.init(sequelize),

  // Order
  Order: Order.init(sequelize),
  OrderPayment: OrderPayment.init(sequelize),
  OrderItem: OrderItem.init(sequelize),

  // Contract
  Contract: Contract.init(sequelize),

  // Page
  ContactPage: ContactPage.init(sequelize),
  ContentPage: ContentPage.init(sequelize),
  SlidePage: SlidePage.init(sequelize),

  // News
  News: News.init(sequelize)
};

Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
