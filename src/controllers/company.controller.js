import { asyncHandler } from "../utils/asyncHandler.js";
import {
  ConflictError,
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "../utils/AppErrors.js";
import { Company } from "../models/company.model.js";
import { SuccessResponse } from "../utils/AppResponse.js";
import { uploadFile, deleteFile } from "../services/cloudinary.js";

const createCompany = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name, description, website, address, email } = req.body;
  const logoFiles = req.file;

  if (!name && !description) {
    throw new BadRequestError("Name and description are required");
  }

  const existingCompany = await Company.findOne({ name });

  if (existingCompany) {
    throw new ConflictError("Company with this name already exists");
  }

  let uploadResult;
  if (logoFiles) {
    // Process logo files
    try {
      uploadResult = await uploadFile(logoFiles.path);
    } catch (error) {
      throw new InternalServerError(
        "Error uploading logo files, please try again"
      );
    }
  }

  const newCompany = await Company.create({
    name,
    description,
    website: website ?? null,
    email: email ?? null,
    address: address ?? null,
    logo: uploadResult
      ? {
          public_id: uploadResult.public_id,
          secure_url: uploadResult.secure_url,
        }
      : null,
  });

  if (!newCompany) {
    // Clean up uploaded logo if company creation fails
    if (uploadResult) {
      await deleteFile(uploadResult.public_id);
    }
    throw new InternalServerError("Failed to create company, please try again");
  }

  res
    .status(201)
    .json(new SuccessResponse(201, newCompany, "Company created successfully"));
});

const updateCompany = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { companyId } = req.params;
  const { name, description, website, address, email } = req.body;
  const logoFiles = req.file;

  if (!name && !description && !website && !logoFiles && !email && !address) {
    throw new BadRequestError(
      "At least one of Name, description, website, logo files, email, or address is required"
    );
  }

  const company = await Company.findById(companyId);

  if (!company) {
    throw new NotFoundError("Company not found");
  }

  // Store existing logo public_id for cleanup if new logo is uploaded successfully
  let existingLogoPublicId = company.logo?.public_id;

  let uploadResult;
  if (logoFiles) {
    // Process logo files
    try {
      uploadResult = await uploadFile(logoFiles.path);
    } catch (error) {
      throw new InternalServerError(
        "Error uploading logo files, please try again"
      );
    }
  }

  try {
    if (name) company.name = name;
    if (description) company.description = description;
    if (website) company.website = website;
    if (email) company.email = email;
    if (address) company.address = address;
    if (logoFiles)
      company.logo = uploadResult
        ? {
            public_id: uploadResult.public_id,
            secure_url: uploadResult.secure_url,
          }
        : null;

    await company.save();

    // Clean up old logo if a new one was uploaded successfully
    if (existingLogoPublicId) {
      await deleteFile(existingLogoPublicId);
    }
  } catch (error) {
    // Clean up uploaded logo if company creation fails
    if (uploadResult) {
      await deleteFile(uploadResult.public_id);
    }
    throw new InternalServerError("Failed to update company, please try again");
  }

  res
    .status(200)
    .json(new SuccessResponse(200, company, "Company updated successfully"));
});

export { createCompany, updateCompany };
