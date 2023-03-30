import express from "express"
import CategoriesModel from "./model.js";



const categoriesRouter = express.Router()

categoriesRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await CategoriesModel.create(req.body)
    res.status(201).send({ id } )
  } catch (error) {
    next(error)
  }
})

categoriesRouter.get("/", async (req, res, next) => {
  try {
    const categories = await CategoriesModel.findAll({
      attributes: ["id", "categoryName"],
    })
    res.send(categories)
  } catch (error) {
    next(error)
  }
})

/*categoriesRouter.post("/bulk", async (req, res, next) => {
  try {
    const categories = await CategoriesModel.bulkCreate([{ categoryName: "sport" }, { categoryName: "movies" }, { categoryName: "tech" }])
    res.send(categories.map(c => c.categoryId))
  } catch (error) {}
})*/

export default categoriesRouter