import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {apiResponse} from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {

  //get user details from frontend
  const { fullName, username, email, password } = req.body;
  console.log("email", email);

  //validate  - not empty
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user alredy exists: username, email
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // check for images, check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // upload them to cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  // create user object - create entry in db
  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

    //remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

    //check for user creeation
  if (!createdUser) {
    throw new ApiError(500, "User creation failed");
  }


    //return response
  res.status(201).json(new apiResponse(201, "User created successfully", createdUser));

});
export { registerUser };
