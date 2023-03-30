import express from "express"
import createHttpError from "http-errors"
import { Op } from "sequelize"
import CategoriesModel from "../categories/model.js";
import ProductsModel from "./model.js"
import ProductsCategoriesModel from "./productsCategoriesModel.js"

const productsRouter = express.Router()

productsRouter.post("/", async (req, res, next) => {
  try {
    const { productId } = await ProductsModel.create(req.body)
    if (req.body.categories) {
      await ProductsCategoriesModel.bulkCreate(
        req.body.categories.map(category => {
          return { productId: productId, categoryId: category }
        })
      )
    }
    res.status(201).send({ productId })
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/", async (req, res, next) => {
  try {
      /* const products = await ProductsModel.findAll({
      attributes: ["name", "description","price", "imageUrl", "productId"],
      include: [
        { model: CategoriesModel, attributes: ["name"], through: { attributes: [] } },
      ],
    })*/


 const query = {}
    if (req.query.minPrice && req.query.maxPrice) query.price = { [Op.between]: [req.query.minPrice, req.query.maxPrice] }
    if (req.query.name) query.name = req.query.name
    if (req.query.description) query.description = req.query.description
    if (req.query.category) query.category = req.query.category

    const products = await ProductsModel.findAndCountAll({
      where: { ...query },
      limit: req.query.limit,
      offset: req.query.offset,
      order: [
        ["price", req.query.priceOrder || "ASC"],
      ],
      /*include: [
        {
          model: CategoriesModel,
          attributes: ["name"],
          through: { attributes: [] },
        }
      ],*/
     
    })

    res.send(products)
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findByPk(req.params.productId)  
    if (product) {
      res.send(product)
    } else {
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ProductsModel.update(req.body, { where: { productId: req.params.productId }, returning: true })
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0])
    } else {
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await ProductsModel.destroy({ where: { productId: req.params.productId } })
    if (numberOfDeletedRows === 1) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `Product with id ${req.params.productId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.post("/:productId/categories", async (req, res, next) => {
  try {
    const { id} = await ProductsCategoriesModel.create({ productId: req.params.productId,  categoryId: req.body.categoryId})
    res.send({ id })
  } catch (error) {
    next(error)
  }
})

export default productsRouter