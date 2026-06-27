/* eslint-disable @typescript-eslint/no-explicit-any */
import { CartModel } from "@/models/inventory/cart_model";
import {
  add_cart_item_service,
  remove_cart_item_service,
} from "@/services/inventory";
import { create_cart_service } from "@/services/inventory/create_cart_service";
import { get_all_cart_service } from "@/services/inventory/get_all_carts_service";
import { get_cart_service } from "@/services/inventory/get_single_cart_service";
import { update_cart_item_service } from "@/services/inventory/update_cart_service";
import { Request, Response } from "express";

export const create_cart_controller = async (req: Request, res: Response) => {
  await create_cart_service({
    req,
    res,
    model: CartModel as any,
    message: "Cart created successfully.",
  });
};

export const get_cart_controller = async (req: Request, res: Response) => {
  await get_cart_service({
    req,
    res,
    model: CartModel as any,
  });
};

export const get_all_cart_controller = async (req: Request, res: Response) => {
  await get_all_cart_service({
    req,
    res,
    model: CartModel as any,
  });
};

export const add_cart_item_controller = async (req: Request, res: Response) => {
  await add_cart_item_service({
    req,
    res,
    model: CartModel as any,
    message: "Product added to cart successfully.",
  });
};
export const update_cart_item_controller = async (
  req: Request,
  res: Response,
) => {
  await update_cart_item_service({
    req,
    res,
    model: CartModel as any,
    message: "Cart updated successfully.",
  });
};
export const remove_cart_item_controller = async (
  req: Request,
  res: Response,
) => {
  await remove_cart_item_service({
    req,
    res,
    model: CartModel as any,
    message: "Product removed from cart successfully.",
  });
};
