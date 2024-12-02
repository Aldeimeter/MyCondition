import { AuthRequest } from "@components/user/interfaces";
import type { NextFunction, Request, Response } from "express";
import Advertisement from "./advertisement.model";
import { CustomError } from "@config/errors";

export const setActive = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { adId } = req.params;
    const ad = await Advertisement.findOneOrFail({
      where: {
        id: adId,
      },
    });
    if (!ad) {
      throw new CustomError(
        "User not found",
        404,
        `User with id ${adId} not found`,
      );
    }

    const previousActiveAd = await Advertisement.findOne({
      where: {
        isActive: true,
      },
    });

    if (previousActiveAd) {
      previousActiveAd.isActive = false;
      await previousActiveAd.save();
    }

    ad.isActive = true;
    await ad.save();
    res.status(200).json({ success: true, ad });
  } catch (error) {
    next(error);
  }
};
export const incrementCounter = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { adId } = req.params;
    const ad = await Advertisement.findOne({
      where: {
        id: adId,
      },
    });
    if (!ad) {
      throw new CustomError(
        "Ad not found",
        404,
        `Ad with id ${adId} not found`,
      );
    }

    ad.counter = ad.counter + 1;

    await ad.save();
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const createAd = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { imgUrl, targetUrl } = req.body;
    const ad = new Advertisement({
      imgUrl,
      targetUrl,
      counter: 0,
      isActive: false,
    });
    await ad.save();
    res.status(201).json({ success: true, ad });
  } catch (error) {
    next(error);
  }
};

export const getActive = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const activeAd = await Advertisement.findOne({
      where: {
        isActive: true,
      },
    });
    res.status(200).json({ success: true, activeAd });
  } catch (error) {
    next(error);
  }
};

export const getPaginated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);
    const skip = (page - 1) * limit;

    const [ads, total] = await Promise.all([
      Advertisement.find({ skip, take: limit }),
      Advertisement.count(),
    ]);

    res.status(200).json({
      success: true,
      ads,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};
