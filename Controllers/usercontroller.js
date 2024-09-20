const asyncHandler = require("express-async-handler");
const User = require("../Models/user");

const bcrypt = require("bcryptjs");
const generateToken = require("../Middlewares/generateToken");
const multer = require("multer");

const path = require("path");
const fs = require("fs");
const { deleteImage } = require("../Middlewares/deleteImage");
const { handleError } = require("../Middlewares/handleError");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/userprofiles"); // Destination folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  // fileFilter: fileFilter,
  // limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB
});

const signupUser = asyncHandler(async (req, res) => {
  console.log("fsdsdfsd");
  console.log(req.body);
  const { name, email, password, phone, userName, contrycode, isocode } =
    req.body;
  try {
    const user = await User.create({
      name,
      email,
      password,
      userName,
      phone,
      contrycode,
      isocode,
    });
    console.log(user.error);

    return res.status(200).json({
      Status: 1,
      user: user,
    });
  } catch (error) {

   
    handleError(error);



    // return res.status(200).json({
    //   Status: 0,
    //   error: error,
    // });
  }
  // const {
  //   email,
  //   name,
  //   devicetoken,
  //   deviceId,
  //   devicetype,
  //   role,
  //   phone,
  //   country_code,
  //   birthDate,
  //   birthTime,
  //   password,
  //   iso_code,
  //   gender,
  //   // for astrologer
  //   experience,
  //   rate,
  //   about,
  //   education,
  //   languages,
  //   expertises,
  // } = req.body;
  // if (
  //   !email ||
  //   !name ||
  //   !password ||
  //   !role ||
  //   !phone ||
  //   !country_code ||
  //   !devicetoken ||
  //   !deviceId ||
  //   !devicetype ||
  //   !birthDate ||
  //   !birthTime ||
  //   !gender
  // ) {
  //   return res.status(200).json({
  //     Status: 0,
  //     Message: "Please fill all the fields",
  //   });
  // }
  // if (role == "ast") {
  //   console.log("fsdjfhdgjds");
  //   if (!experience || !rate || !about || !education || !req.file) {
  //     return res.status(200).json({
  //       Status: 0,
  //       Message: "Please fill all the fields",
  //     });
  //   }
  // }

  // const userExists = await User.findOne({ email });

  // if (userExists) {
  //   if (role == "ast" && req.file) {
  //     deleteImage(req.file.path);
  //   }
  //   return res.status(200).json({
  //     Status: 0,
  //     Message: "user allready Exist Please do login",
  //   });
  // }
  // if (role == "ast") {
  //   const salt = await bcrypt.genSalt(10);
  //   const hashedPassword = await bcrypt.hash(password, salt);
  //   const user = await User.create({
  //     email,
  //     name,
  //     role,
  //     phone,
  //     country_code,
  //     iso_code,
  //     password: hashedPassword,
  //     languages: languages.split(",").map((id) => new ObjectId(id)),
  //     expertises: expertises.split(",").map((id) => new ObjectId(id)),
  //     experience,
  //     rate,
  //     about,
  //     education,
  //     profilepic: req.file.path,
  //   });
  //   if (user) {
  //     const device = await deviceAddUpdate({
  //       devicetoken: devicetoken,
  //       deviceId: deviceId,
  //       devicetype: devicetype,
  //       userid: user._id,
  //     });
  //     console.log("fsdkfjdshkj");
  //     console.log(device.status);
  //     if (!device.status) {
  //       deleteImage(req.file.path);
  //       return res.status(200).json({
  //         Status: 0,
  //         Message: "Something went wrong",
  //       });
  //     }
  //     const newUser = await User.findOne({ email: user.email })
  //       .populate("languages")
  //       .populate("expertises");
  //     return res.status(200).json({
  //       Status: 1,
  //       Message: "Sign up Successfully",
  //       user: newUser,
  //       UserToken: generateToken(user._id),
  //     });
  //   } else {
  //     deleteImage(req.file.path);
  //     return res.status(200).json({
  //       Status: 0,
  //       Message: "Something went wrong",
  //     });
  //   }
  // } else {
  //   const dateString = birthDate + " " + birthTime;
  //   const birthDateTime = moment(dateString, "MM/DD/YYYY hh:mm A").toDate();

  //   const salt = await bcrypt.genSalt(10);
  //   const hashedPassword = await bcrypt.hash(password, salt);
  //   const user = await User.create({
  //     email,
  //     name,
  //     role,
  //     phone,
  //     country_code,
  //     birthDateTime,
  //     iso_code,
  //     password: hashedPassword,
  //   });
  //   if (user) {
  //     const device = await deviceAddUpdate({
  //       devicetoken: devicetoken,
  //       deviceId: deviceId,
  //       devicetype: devicetype,
  //       userid: user._id,
  //     });
  //     console.log("fsdkfjdshkj");
  //     console.log(device.status);
  //     if (!device.status) {
  //       return res.status(200).json({
  //         Status: 0,
  //         Message: "Something went wrong",
  //       });
  //     }
  //     return res.status(200).json({
  //       Status: 1,
  //       Message: "Sign up Successfully",
  //       user: user,
  //       UserToken: generateToken(user._id),
  //     });
  //   } else {
  //     return res.status(200).json({
  //       Status: 0,
  //       Message: "Something went wrong",
  //     });
  //   }
  // }
});

const getUser = asyncHandler(async (req, res) => {
  if (req.user) {
    if (req.user.role == "ast") {
      const user = await User.findById(req.userId)
        .populate("languages")
        .populate("expertises");
      if (user) {
        return res.status(200).json({
          Status: 1,
          Message: "User get Successfully",
          user: user,
        });
      } else {
        return res.status(200).json({
          Status: 0,
          Message: "User Not Found",
        });
      }
    } else {
      return res.status(200).json({
        Status: 1,
        Message: "User get Successfully",
        user: req.user,
      });
    }
  } else {
    return res.status(200).json({
      Status: 0,
      Message: "User Not Found",
    });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  console.log("fkfjhdfkjshfskjhfd");
  console.log(req.userId);
  if (!user) {
    if (req.file) {
      deleteImage(req.file.path);
    }
    return res.status(200).json({
      Status: 0,
      Message: "User Not Found",
    });
  }

  const {
    name,
    phone,
    country_code,
    birthDate,
    birthTime,

    iso_code,
    gender,
    // for astrologer
    experience,
    rate,
    about,
    education,
    languages,
    expertises,
  } = req.body;
  if (!name || !phone || !country_code || !birthDate || !birthTime || !gender) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }
  if (user.role == "ast") {
    console.log("fsdjfhdgjds");
    if (!experience || !rate || !about || !education || !req.file) {
      return res.status(200).json({
        Status: 0,
        Message: "Please fill all the fields",
      });
    }
  }

  if (user.role == "ast") {
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.country_code = country_code || user.country_code;
    user.iso_code = iso_code || user.iso_code;
    user.experience = experience || user.experience;
    user.rate = rate || user.rate;
    user.about = about || user.about;
    user.education = education || user.education;
    user.gender = gender || user.gender;
    if (req.file) {
      console.log(user.profilepic);
      await deleteImage(user.profilepic);
      console.log("Fsfjkhsdfksjhfskjhf");
      console.log(req.file.path);
      user.profilepic = req.file.path;
    }

    await user.save();
    const newUser = await User.findById(req.userId)
      .populate("languages")
      .populate("expertises");
    return res.status(200).json({
      Status: 1,
      Message: "Sign up Successfully",
      user: newUser,
    });
  } else {
    const dateString = birthDate + " " + birthTime;
    const birthDateTime = moment(dateString, "MM/DD/YYYY hh:mm A").toDate();
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.country_code = country_code || user.country_code;
    user.iso_code = iso_code || user.iso_code;
    user.birthDateTime = birthDateTime || user.birthDateTime;
    user.gender = gender || user.gender;
    await user.save();

    return res.status(200).json({
      Status: 1,
      Message: "Sign up Successfully",
      user: user,
    });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  if (req.user) {
    await User.deleteOne({ _id: req.userId });
    return res.status(200).json({
      Status: 1,
      Message: "User Deleted successfully",
    });
  } else {
    return res.status(200).json({
      Status: 0,
      Message: "User Not Found",
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, devicetoken, deviceId, devicetype, role } = req.body;

  if (
    !email ||
    !password ||
    !devicetoken ||
    !deviceId ||
    !devicetype ||
    !role
  ) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      Status: 0,
      Message: "Email is not Registered Please register it first",
    });
  }
  if (user.logintype != "email") {
    return res.status(200).json({
      Status: 0,
      Message: "This email allready login with another Method",
    });
  }
  if (user.role != role) {
    return res.status(200).json({
      Status: 0,
      Message: "User Signup with different role",
    });
  }

  console.log(password);
  console.log(user);
  console.log(user.password);

  if (await bcrypt.compare(password, user.password)) {
    const device = await deviceAddUpdate({
      devicetoken: devicetoken,
      deviceId: deviceId,
      devicetype: devicetype,
      userid: user._id,
    });
    console.log("fsdkfjdshkj");
    console.log(device.status);
    if (!device.status) {
      return res.status(200).json({
        Status: 0,
        Message: "Simething went wrong",
      });
    }

    if (user.role == "ast") {
      const newuser = await await User.findOne({ email })
        .populate("languages")
        .populate("expertises");
      if (newuser) {
        return res.status(200).json({
          Status: 1,
          Message: "User get Successfully",
          user: newuser,
          UserToken: generateToken(user._id),
        });
      } else {
        return res.status(200).json({
          Status: 0,
          Message: "User Not Found",
        });
      }
    } else {
      res.status(200).json({
        Status: 1,
        Message: "Login successful",
        user: user,
        UserToken: generateToken(user._id),
      });
    }
  } else {
    return res.status(200).json({
      Status: 0,
      Message: "Invalid email or password or email not verified",
    });
  }
});

const getcustomers = asyncHandler(async (req, res) => {
  console.log("Fdsfjkdsflkjds");
  console.log(req.query);

  const { page, limit } = req.query;
  const skip = (page - 1) * limit;

  const customers = await User.find({ role: "user" }).limit(limit).skip(skip);
  const count = await User.countDocuments({ role: "user" });

  return res.status(200).json({
    Status: 1,
    Message: "customer get successfully",
    count: count,
    customers: customers,
  });
});

const getasts = asyncHandler(async (req, res) => {
  userId = req.userId;
  console.log("Fdsfjkdsflkjds");
  console.log(req.query);

  const {
    page,
    limit,
    languages,
    expertises,
    minExperience,
    maxExperience,
    minRate,
    maxRate,
    search,
  } = req.query;
  const skip = (page - 1) * limit;
  var filter = { role: "ast" };

  filter.experience = {
    $gte: minExperience == "" ? 0 : minExperience ?? 0,
    $lte:
      maxExperience == ""
        ? Number.MAX_SAFE_INTEGER
        : maxExperience ?? Number.MAX_SAFE_INTEGER,
  };

  filter.rate = {
    $gte: minRate == "" || minRate == undefined ? 0 : Number(minRate) ?? 0,
    $lte:
      maxRate == "" || maxRate == undefined
        ? Number.MAX_SAFE_INTEGER
        : Number(maxRate) ?? Number.MAX_SAFE_INTEGER,
  };

  if (languages) {
    filter.languages = {
      $in: languages.split(",").map((id) => new ObjectId(id)),
    };
  }
  if (expertises) {
    filter.expertises = {
      $in: expertises.split(",").map((id) => new ObjectId(id)),
    };
  }

  if (search) {
    filter.name = { $regex: search, $options: "i" }; // 'i' makes the search case-insensitive
  }

  console.log(filter);

  const querylist = [
    {
      $match: filter,
    },
  ];
  querylist.push({
    $lookup: {
      from: "likes",
      let: { userid: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$likedTo", "$$userid"] },
                { $eq: ["$likedBy", new ObjectId(userId)] },
              ],
            },
          },
        },
      ],
      as: "likes",
    },
  });
  querylist.push({
    $addFields: {
      liked: {
        $cond: {
          if: { $gt: [{ $size: "$likes" }, 0] },
          then: true,
          else: false,
        },
      },
    },
  });
  querylist.push({
    $project: {
      likes: 0,
    },
  });

  // querylist.push({
  //   $match: {
  //     rate: { $gte: 0, $lte: 15 },
  //   },
  // });
  // querylist.push({ $skip: skip });
  // querylist.push({ $limit: Number(limit) });
  querylist.push({
    $facet: {
      totalCount: [{ $count: "count" }],
      data: [{ $skip: skip }, { $limit: Number(limit) }],
    },
  });
  console.log(querylist);
  // const asts = await User.find(filter)
  //   .populate("languages")
  //   .populate("expertises")
  //   .limit(limit)
  //   .skip(skip);
  const asts = await User.aggregate(querylist);
  const newasts = await User.populate(asts, [
    { path: "languages" },
    { path: "expertises" },
  ]);
  const count = await User.countDocuments(filter);

  return res.status(200).json({
    Status: 1,
    Message: "customer get successfully",
    count:
      newasts[0].totalCount.length == 0 ? 0 : newasts[0].totalCount[0].count,
    asts: newasts[0].data,
  });
});

const getmyasts = asyncHandler(async (req, res) => {
  console.log("Fdsfjkdsflkjds");
  console.log(req.query);

  const {
    page,
    limit,
    languages,
    expertises,
    minExperience,
    maxExperience,
    minRate,
    maxRate,
    search,
  } = req.query;
  const skip = (page - 1) * limit;

  // filter.experience = {
  //   $gte: minExperience == "" ? 0 : minExperience ?? 0,
  //   $lte:
  //     maxExperience == ""
  //       ? Number.MAX_SAFE_INTEGER
  //       : maxExperience ?? Number.MAX_SAFE_INTEGER,
  // };

  // filter.rate = {
  //   $gte: minRate == "" ? 0 : minRate ?? 0,
  //   $lte:
  //     maxRate == ""
  //       ? Number.MAX_SAFE_INTEGER
  //       : maxRate ?? Number.MAX_SAFE_INTEGER,
  // };
  // if (languages) {
  //   filter.languages = {
  //     $in: languages.split(",").map((id) => new ObjectId(id)),
  //   };
  // }
  // if (expertises) {
  //   filter.expertises = {
  //     $in: expertises.split(",").map((id) => new ObjectId(id)),
  //   };
  // }

  // if (search) {
  //   filter.name = { $regex: search, $options: "i" }; // 'i' makes the search case-insensitive
  // }
  var filter = { likedBy: new ObjectId(req.userId) };
  console.log(filter);
  console.log(req.userId);
  const asts = await Like.find(filter)
    .select("likedTo")
    .populate({
      path: "likedTo",
      populate: {
        path: "languages",
        model: "languages",
      },
      populate: {
        path: "expertises",
        model: "expertises",
      },
    })
    .limit(limit)
    .skip(skip);
  console.log(asts);
  console.log("Fdsfksdhfksdjfjk");

  const newasts = asts.map((ast) => {
    const likedToObj = ast.likedTo.toObject();
    likedToObj.liked = true;
    return likedToObj;
  });
  // const asts = await User.find(filter)
  //   .populate("languages")
  //   .populate("expertises")
  //   .limit(limit)
  //   .skip(skip);
  const count = await Like.countDocuments(filter);

  return res.status(200).json({
    Status: 1,
    Message: "customer get successfully",
    count: count,
    asts: newasts,
  });
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }
  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      Status: 0,
      Message: "User is not Register",
    });
  }

  if (user.logintype != "email") {
    return res.status(200).json({
      Status: 0,
      Message:
        "You can not do forgot password for this email because you did login with different login tyoe",
    });
  }
  // Generate a reset token and set an expiration time
  const resetToken = Math.floor(1000 + Math.random() * 9000);
  // const resetExpires = Date.now() + 300000; // 5 min

  user.otp = resetToken;

  await user.save();
  // await sendResetPasswordEmail(email, resetToken, "reset your password", req);
  res.status(200).json({
    Status: 1,
    Message: "otp sent successfully",
    user_id: user._id,
    otp: resetToken,
  });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }
  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      Status: 0,
      Message: "User is not Register",
    });
  }

  if (user.logintype != "email") {
    return res.status(200).json({
      Status: 0,
      Message:
        "You can not do forgot password for this email because you did login with different login tyoe",
    });
  }

  if (user.otp == otp) {
    return res.status(200).json({
      Status: 1,
      Message: "OTP verified Successfully",
    });
  } else {
    return res.status(200).json({
      Status: 0,
      Message: "Wrong OTP",
    });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;

  if (!email || !otp) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }
  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      Status: 0,
      Message: "User is not Register",
    });
  }

  if (user.logintype != "email") {
    return res.status(200).json({
      Status: 0,
      Message:
        "You can not do forgot password for this email because you did login with different login tyoe",
    });
  }

  if (user.otp == otp) {
    if (await bcrypt.compare(password, user.password)) {
      return res.status(200).json({
        Status: 0,
        Message: "Please use different password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.otp = null;

    await user.save();
    return res.status(200).json({
      Status: 1,
      Message: "Password Changed Successfully",
    });
  } else {
    return res.status(200).json({
      Status: 0,
      Message: "Wrong OTP",
    });
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(200).json({
      Status: 0,
      Message: "User not found",
    });
  }
  const { oldpassword, newpassword } = req.body;
  if (!oldpassword || !newpassword) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all fields",
    });
  }
  // const {otp} = req.body;
  // console.log(otp);
  if (!(await bcrypt.compare(oldpassword, user.password))) {
    return res.status(200).json({
      Status: 0,
      Message: "Old password is not correct",
    });
  }

  if (await bcrypt.compare(newpassword, user.password)) {
    return res.status(200).json({
      Status: 0,
      Message: "New password and old password cannot be same",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newpassword, salt);

  user.password = hashedPassword;
  user.resettoken = null;
  user.resettokentime = null;
  await user.save();
  res.status(200).json({
    Status: 1,
    Message: "Change password successful",
  });
});

const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log(user);
  if (user) {
    const device = await Device.findById(user.deviceid);
    if (device) {
      console.log(device);
      const newdevice = await Device.deleteOne(device._id);

      res.status(200).json({
        Status: 1,
        Message: "Logout successful",
      });
    } else {
      res.status(200).json({
        Status: 1,
        Message: "Logout successful",
      });
    }
  }

  res.status(200).json({
    Status: 0,
    Message: "Logout successful",
  });
});

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, devicetoken, deviceId, type } = req.body;

  if (!email || !password || !devicetoken || !deviceId || !type) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(200).json({
      Status: 0,
      Message: "Email already used",
    });
  }
  console.log(req.body);
  console.log(userExists);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate a random 4-digit OTP
  const everification = "confirm your email";
  const otp = Math.floor(1000 + Math.random() * 9000);
  await sendResetPasswordEmail(email, otp, everification, req);

  const user = await User.create({
    email,
    password: hashedPassword,
    otp: otp,
    // devicei
  });

  if (user) {
    const device = await deviceAddUpdate({
      devicetoken: devicetoken,
      deviceId: deviceId,
      type: type,
      userid: user._id,
    });
    console.log("fsdkfjdshkj");
    console.log(device.status);
    if (!device.status) {
      return res.status(200).json({
        Status: 0,
        Message: "Something went wrong",
      });
    }
    res.status(200).json({
      Status: 1,
      Message: "Otp sent to your email for verification",
      user_id: user._id,
      otp: user.otp,
    });
  } else {
    return res.status(200).json({ error: "Invaild user data" });
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    console.log(user);
    return res.status(200).json({
      Status: 0,

      Message: "Please Register first",
    });
  }

  const { otp, pass_req } = req.body;

  const exists = await User.findOne({ email: user.email, otp: otp });

  if (exists) {
    if (pass_req == 0) {
      user.emailverified = true;
      user.otp = null;
      await user.save();
      res.status(200).json({
        Status: 1,
        Message: "Registration successfully",
        info: user,
        UserToken: generateToken(user._id),
      });
    } else if (pass_req == 1) {
      user.emailverified = true;
      user.otp = null;
      res.status(200).json({
        Status: 1,
        Message: "OTP verified successfully",
      });
    } else {
      res.status(200).json({
        Status: 0,
        Message: "Please provide flag",
      });
    }
  } else {
    // await User.findByIdAndDelete(user._id);
    return res.status(200).json({
      Status: 0,
      Message: "Invaild OTP",
    });
  }
});
//resend otp
const resendOTP = asyncHandler(async (req, res) => {
  // const user = await User.findById(req.params.id);
  const email = req.params.id;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      Status: 0,
      Message: "Email is not Registered",
    });
  }
  const otp = Math.floor(1000 + Math.random() * 9000);
  const verification = "confirm your email";
  // try{
  await sendResetPasswordEmail(email, otp, verification, req);

  user.otp = otp;
  user.emailverified = false;
  await user.save();

  res.status(200).json({
    Status: 1,
    Message: "OTP sent successfully",
    info: {
      // user_id: user._id,
      // first_name: user.fname,
      // last_name: user.lname,
      // email_id: user.email,
      // user_role: user.role,
      //  is_email_verified: user.emailverified,
      otp: otp,
    },
  });
  // }catch(e){
  //     return res.status(200).json(
  //         {
  //         Status:0,
  //         Message: 'Something went wrong try again',
  //         data:e
  //     }
  //     );
  // }
});

const forgetpass = asyncHandler(async (req, res) => {
  const { email } = req.body;
  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      Status: 0,
      Message: "User is not Register",
    });
  }

  if (user.logintype != "email") {
    return res.status(200).json({
      Status: 0,
      Message:
        "You can not do forgot password for this email because you did login with different login tyoe",
    });
  }
  // Generate a reset token and set an expiration time
  const resetToken = Math.floor(1000 + Math.random() * 9000);
  // const resetExpires = Date.now() + 300000; // 5 min

  user.otp = resetToken;

  await user.save();
  await sendResetPasswordEmail(email, resetToken, "reset your password", req);
  res.status(200).json({
    Status: 1,
    Message: "otp sent successfully",
    user_id: user._id,
    otp: resetToken,
  });
});

const changepass = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(200).json({
      Status: 0,
      Message: "User not found",
    });
  }
  const { oldpassword, newpassword } = req.body;
  if (!oldpassword || !newpassword) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all fields",
    });
  }
  // const {otp} = req.body;
  // console.log(otp);
  if (!(await bcrypt.compare(oldpassword, user.password))) {
    return res.status(200).json({
      Status: 0,
      Message: "Old password is not correct",
    });
  }

  if (await bcrypt.compare(newpassword, user.password)) {
    return res.status(200).json({
      Status: 0,
      Message: "New password and old password cannot be same",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newpassword, salt);

  user.password = hashedPassword;
  user.resettoken = null;
  user.resettokentime = null;
  await user.save();
  res.status(200).json({
    Status: 1,
    Message: "Change password successful",
  });
});

const resetpass = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  // const {otp} = req.body;
  // console.log(otp);
  if (req.body.password) {
    const newpassword = req.body.password;

    // if (await bcrypt.compare(newpassword, user.password)) {
    //   return res.status(200).json({
    //     Status: 0,
    //     Message: "New password and old password cannot be same",
    //   });
    // }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newpassword, salt);

    const exists = await User.findOne({ email: user.email });

    if (exists) {
      user.password = hashedPassword;
      user.resettoken = null;
      user.resettokentime = null;
      await user.save();
      res.status(200).json({
        Status: 1,
        Message: "Reset password successful",
        newpassword: user.password,
      });
    } else {
      return res.status(200).json({
        Status: 0,
        Message: "User not found",
      });
    }
  } else {
    return res.status(200).json({
      Status: 0,
      Message: "All fields are mandatory",
    });
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(200).json({
        Status: 0,
        Message: "User not found",
      });
    }

    if (!user.profilepic) {
      return res.status(200).json({
        Status: 0,
        Message: "Profile picture not found",
      });
    }

    const profilePicFilename = user.profilepic;
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageurl = baseUrl + "/userprofiles/" + profilePicFilename;

    const { _id, fname, lname, email } = user;
    res.status(200).json({
      Status: 1,
      Message: "Profile fetched successfully",
      info: {
        user: user,
        privacy_policy: "https://www.google.com/",
        toc: "https://www.google.com/",
      },
    });
  } catch (error) {
    //   console.error(error);
    res.status(200).json({ Status: 0, Message: "Error in profile fetching" });
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  console.log(req.user._id);
  try {
    const user = await User.findById(req.user._id);
    console.log(user);
    if (!user) {
      return res.status(200).json({
        Status: 0,
        Message: "User not found",
      });
    }

    const previousProfilePic = user.profilepic;

    upload.single("profilepic")(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res
          .status(200)
          .json({ Status: 0, Message: "File upload error" });
      } else if (err) {
        return res.status(200).json({
          Status: 0,
          // error : err,
          Message: "Internal server error",
        });
      }

      if (req.file) {
        user.profilepic = req.file.filename;
        console.log(user.profilepic);
        if (
          previousProfilePic != null &&
          previousProfilePic != "generaluserpic.png"
        ) {
          const parentDirectory = path.dirname(__dirname);
          const previousImagePath = path.join(
            parentDirectory,
            "public/userprofiles",
            previousProfilePic
          );
          console.log(previousImagePath);
          // Check if the file exists before attempting to delete it
          fs.access(previousImagePath, fs.constants.F_OK, (err) => {
            if (err) {
              // File doesn't exist
              console.error(
                `Error deleting previous image: File does not exist`
              );
            } else {
              // File exists, attempt to delete it
              fs.unlink(previousImagePath, (err) => {
                if (err) {
                  console.error(`Error deleting previous image: ${err}`);
                } else {
                  console.log(`Previous image deleted successfully`);
                }
              });
            }
          });
        }
      }

      const { fname, lname, phone_number, country_code, ios_code } = req.body;
      user.fname = fname || user.fname;
      user.lname = lname || user.lname;
      user.phone = phone_number || user.phone;
      user.country_code = country_code || user.country_code;
      user.ios_code = ios_code || user.ios_code;

      await user.save();

      res.status(200).json({
        Status: 1,
        Message: "Updated successfully",
        info: {
          user_id: user._id,
          first_name: user.fname ?? "",
          last_name: user.lname ?? "",
          phone: user.phone ?? "",
          user_profile: user.profilepic || "generaluserpic.png",
          user: user,
        },
      });
    });
  } catch (err) {
    console.error(err);
    res.status(200).json({
      Status: 0,
      Message: "Something went wrong. Profile not updated",
      err: err,
    });
  }
});

//delete user
const deleteUserProfile = asyncHandler(async (req, res) => {
  console.log(req.user.id);
  const user = await User.findById(req.user._id);
  if (user && user.emailverified) {
    await User.findByIdAndDelete(req.user._id);
    res
      .status(200)
      .json({ Status: 1, Message: "Your Account deleted successfully" });
  } else {
    return res.status(200).json({
      Status: 0,
      Message: "No User found or Login first",
    });
  }
});

//Thiredparty Api

const thirdpartyUser = asyncHandler(async (req, res) => {
  console.log("login_by_thirdparty api called", req.body);
  const {
    email,
    loginbythirdpartyid,
    logintype,
    fname,
    lname,
    devicetoken,
    deviceId,
    type,
  } = req.body;
  if (
    !email ||
    !loginbythirdpartyid ||
    !logintype ||
    !devicetoken ||
    !deviceId ||
    !type
  ) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }
  const user = await User.findOne({ email: email });
  if (user) {
    if (user.logintype != logintype) {
      return res.status(200).json({
        Status: 0,
        Message: "this emial is already login with another login method",
      });
    }
  }
  const thirdpartyuser = await User.findOne({
    loginbythirdpartyid: loginbythirdpartyid,
  });

  console.log(thirdpartyuser);
  console.log(user);
  if (thirdpartyuser) {
    if (
      thirdpartyuser.logintype == logintype &&
      thirdpartyuser.loginbythirdpartyid == loginbythirdpartyid
    ) {
      console.log(thirdpartyuser.logintype);

      const device = await deviceAddUpdate({
        devicetoken: devicetoken,
        deviceId: deviceId,
        type: type,
        userid: user._id,
      });
      console.log("fsdkfjdshkj");
      console.log(device.status);
      if (!device.status) {
        return res.status(200).json({
          Status: 0,
          Message: "Simething went wrong",
        });
      }
      res.status(200).json({
        Status: 1,
        Message: "Login successful",
        info: {
          user_id: thirdpartyuser._id,
          fname: thirdpartyuser.fname ?? "",
          lname: thirdpartyuser.lname ?? "",
          email_id: thirdpartyuser.email,
          user_role: thirdpartyuser.role,
          issignup: 0,
          UserToken: generateToken(thirdpartyuser._id),
          devicetoken: devicetoken,
        },
      });
    } else {
      return res.status(200).json({
        Status: 0,
        Message: "this emial is already login with another login method",
      });
    }
  } else {
    const emailverified = true;
    const newuser = await User.create({
      email,
      logintype,
      loginbythirdpartyid,
      emailverified,
      fname,
      lname,
    });
    console.log("dsakjdhaskjdhjk");
    console.log(newuser);
    if (newuser) {
      const device = await deviceAddUpdate({
        devicetoken: devicetoken,
        deviceId: deviceId,
        type: type,
        userid: newuser._id,
      });
      console.log("fsdkfjdshkj");
      console.log(device.status);
      if (!device.status) {
        return res.status(200).json({
          Status: 0,
          Message: "Simething went wrong",
        });
      }
      res.status(200).json({
        Status: 1,
        Message: "signup successful",
        info: {
          user_id: newuser._id,
          fname: newuser.fname ?? "",
          lname: newuser.lname ?? "",
          email_id: newuser.email,
          user_role: newuser.role,
          issignup: 1,
          UserToken: generateToken(newuser._id),
        },
      });
    }
  }
});

const users = asyncHandler(async (req, res) => {
  const users = await User.findOne({ email: req.body.email });
  res.status(200).json({
    Status: 1,
    Message: "Login successful",
    info: users,
  });
});

module.exports = {
  signupUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  getcustomers,
  getasts,
  getmyasts,
  forgetPassword,
  verifyOtp,
  resetPassword,
  changePassword,
  logout,

  registerUser,
  verifyEmail,
  resendOTP,
  forgetpass,
  changepass,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  resetpass,
  thirdpartyUser,
  users,
};
