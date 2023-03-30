import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const ReviewsModel = sequelize.define("review", {
  reviewId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  content: {
    type: DataTypes.STRING(),
  },
 /*userId: {
    type: DataTypes.STRING(),
  },*/
});


export default ReviewsModel;