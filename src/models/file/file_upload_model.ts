import { Document, Schema, Types, model } from "mongoose";

export interface IFile extends Document {
  file_type:
    | "image"
    | "pdf"
    | "video"
    | "excel"
    | "csv"
    | "doc"
    | "docx"
    | "zip"
    | "other";
  uploaded_by?: Types.ObjectId;
  file_url: string;
  file_path?: string;
  uploadedAt: Date;
  file_size: number;
  file_name: string;
  upload_name: string;
  file_extension: string;
  user?: string;
}

const fileSchema = new Schema<IFile>(
  {
    file_type: {
      type: String,
      enum: [
        "image",
        "pdf",
        "video",
        "excel",
        "csv",
        "doc",
        "docx",
        "zip",
        "other",
      ],
      required: true,
    },
    user: { type: Types.ObjectId },
    uploaded_by: {
      type: Types.ObjectId,
      ref: "User",
    },

    file_url: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => {
          return /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid URL!`,
      },
    },

    file_path: {
      type: String,
      default: "",
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },

    file_size: {
      type: Number,
      required: true,
    },

    file_name: {
      type: String,
      required: true,
    },

    upload_name: {
      type: String,
      required: true,
    },

    file_extension: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

fileSchema.index({ file_type: 1 });
fileSchema.index({ uploaded_by: 1 });

export const FileModel = model<IFile>("File", fileSchema);
