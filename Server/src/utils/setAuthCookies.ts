import { Response } from "express";

export const setAuthCookies = (
  res: Response,
  refreshToken: string,
  accessToken: string
) => {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: false,
    secure: isProd,
    sameSite: "lax", // better UX
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};


   // res.cookie("refreshToken", result.refreshToken, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === "production",
            //     sameSite: "strict",
            //     maxAge: 7 * 24 * 60 * 60 * 1000
            // });

            // res.cookie("accessToken", result.accessToken, { //  implement balck listeing tokens
            //     httpOnly: false,
            //     secure: process.env.NODE_ENV === "production",
            //     sameSite: "strict", // prefer lax
            //     maxAge: 7 * 24 * 60 * 60 * 1000
            // });
