/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileModel } from "@/models/file";
import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
/*************************
 * File Type
 *************************/
const getFileType = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();

  if (!ext) return "other";

  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext))
    return "image";

  if (["pdf"].includes(ext)) return "pdf";

  if (["mp4", "mkv", "avi", "mov"].includes(ext)) return "video";

  return "other";
};

/*************************
 * Upload Files
 *************************/
export const upload_file_controller = async (req: Request, res: Response) => {
  const user = (req as any)?.user?._id;
  try {
    const files = Array.isArray(req.files)
      ? (req.files as Express.Multer.File[])
      : [];

    if (!files || files.length === 0) {
      return res.status(400).json({
        status: "failed",
        message: "No files uploaded.",
      });
    }

    const host = req.get("host");

    const fileData = files.map((file) => ({
      file_type: getFileType(file.originalname),

      uploaded_by: user._id,

      file_url: `${req.protocol}://${host}/uploads/${file.filename}`,

      file_path: `/${file.filename}`,

      file_size: file.size,

      file_name: file.originalname,

      upload_name: file.filename,

      file_extension: file.originalname.split(".").pop()?.toLowerCase() || "",
      user: user,
    }));

    const savedFiles = await FileModel.insertMany(fileData);

    return res.status(201).json({
      status: "success",
      message: "Files uploaded successfully.",
      data: savedFiles,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};

/*************************
 * Delete File
 *************************/
export const delete_file_controller = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = (req as any).user;

    const file: any = await FileModel.findById(id);

    if (!file) {
      return res.status(404).json({
        status: "failed",
        message: "File not found.",
      });
    }

    // Authorization
    if (
      file.uploaded_by.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return res.status(403).json({
        status: "failed",
        message: "You are not allowed to delete this file.",
      });
    }

    const uploadDir = path.resolve(process.cwd(), "uploads");

    const filePath = path.join(uploadDir, file.upload_name);

    try {
      await fs.unlink(filePath);
    } catch (error: any) {
      console.warn("File already deleted:", error.message);
    }

    await FileModel.findByIdAndDelete(id);

    return res.status(200).json({
      status: "success",
      message: "File deleted successfully.",
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
