import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    image: {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    customId: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);
categorySchema.virtual("subCategory", {
  ref: "subCategory",
  localField: "_id",
  foreignField: "categoryId",
});
export const categoryModel = model("Category", categorySchema);
