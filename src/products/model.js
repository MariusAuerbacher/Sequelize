import { DataTypes } from "sequelize"
import sequelize from "../db.js"
import CategoriesModel from "../categories/model.js"
import ProductsCategoriesModel from "./productsCategoriesModel.js";

const ProductsModel = sequelize.define(
  "product",
  {
    productId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, 
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    /*category: {
      type: DataTypes.STRING(50), 
      allowNull: false,
    },*/
    description: {
      type: DataTypes.STRING(50),
      allowNull: false,
    }, 
    imageUrl: {
      type: DataTypes.STRING(150),
      allowNull: false,
    }, 
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
   
  }
 
)
// Many to many relationship
ProductsModel.belongsToMany(CategoriesModel, {
  through: ProductsCategoriesModel,
  foreignKey: { name: "productId", allowNull: false },
});
CategoriesModel.belongsToMany(ProductsModel, {
  through: ProductsCategoriesModel,
  foreignKey: { name: "id", allowNull: false },
});



export default ProductsModel