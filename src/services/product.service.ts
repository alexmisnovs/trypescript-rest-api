import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import productModel, { IProduct, IProductInput } from "../models/product.model";

export async function createProduct(input: IProductInput) {
  return productModel.create(input);
}
export async function findProduct(
  query: FilterQuery<IProduct>,
  options: QueryOptions = { lean: true }
) {
  return productModel.findOne(query, {}, options);
}
export async function findAndUpdateProduct(
  query: FilterQuery<IProduct>,
  update: UpdateQuery<IProduct>,
  options: QueryOptions
) {
  return productModel.findOneAndUpdate(query, update, options);
}
export async function deleteProduct(query: FilterQuery<IProduct>) {
  return productModel.deleteOne(query);
}
