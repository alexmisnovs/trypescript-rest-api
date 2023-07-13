import { Request, Response } from "express";
import {
  createProductInput,
  updateProductInput,
  deleteProductInput,
  getProductInput,
} from "../schemas/product.schema";
import {
  createProduct,
  deleteProduct,
  findAndUpdateProduct,
  findProduct,
} from "../services/product.service";
import { IProductInput } from "../models/product.model";

export async function createProductHandler(
  req: Request<{}, {}, createProductInput["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const body = req.body;
  try {
    const product = await createProduct({ ...body, user: userId });
    return res.send(product);
  } catch (error) {
    res.send("Error creating a product");
  }
}
export async function updateProductHandler(
  req: Request<updateProductInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const productId = req.params.productId;
  const update = req.body;

  await findProductHelper(productId, userId, update, res);

  const updatedProduct = await findAndUpdateProduct({ productId }, update, { new: true });

  return res.send(updatedProduct);
}

export async function getProductHandler(req: Request<getProductInput["params"]>, res: Response) {
  const productId = req.params.productId;
  const product = await findProduct({ productId });

  if (!product) {
    return res.sendStatus(404);
  }

  return res.send(product);
}
export async function deleteProductHandler(
  req: Request<deleteProductInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const productId = req.params.productId;
  const update = req.body;

  await findProductHelper(productId, userId, update, res);
  //  const product = await findProduct({ productId });

  // if (!product) {
  //   return res.sendStatus(404);
  // }

  // if (product.user !== userId) {
  //   return res.sendStatus(403);
  // }

  await deleteProduct({ productId });

  return res.sendStatus(200);
}

async function findProductHelper(
  productId: string,
  userId: string,
  update: IProductInput,
  res: Response
) {
  const product = await findProduct({ productId });

  if (!product) {
    return res.sendStatus(404);
  }

  if (String(product.user) !== userId) {
    return res.sendStatus(403);
  }
}
