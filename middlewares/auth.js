// // const jwt = require('jsonwebtoken');
// const { responseObject, authorFewPopulate } = require("../helpers");
// const { HTTP_BAD_REQUEST, HTTP_UNAUTHORIZED } = require("../helpers/httpCodes");
// // const Users = require("../models/user");
// // const db = require('../models');
// // const Users = db.users;

// exports.isAuthorized = async (req, _, next) => {
//   try {
//     const token =
//     req.headers.authorization && req.headers.authorization.split(" ")[1];

//     if (!token) {
//       return next( 
//         {
//           status: "error",
//           code: HTTP_UNAUTHORIZED,
//           message:"Authorization token is missing.",
//         }
//       );
//     }

//    const {id} = verifyJwt(token);


//     const existingUser =  await User.findById(id);
//     if(!existingUser){
//       return next( 
//         {
//           status: "error",
//           code: HTTP_UNAUTHORIZED ,
//           message:'Unauthorized to perform this action',
//         }
//       );
//     } else {
//       req.user = existingUser
//       req.token = token,
//       req.userId = existingUser._id
//       return next()
//     }

//   } catch (error) {
//     console.log(error);
//     return {
//       status: "error",
//       code: HTTP_SERVER_ERROR,
//       message: error.message,
//       data: error
//     }
//   }
// }

// exports.authTest = async (req, res, next) => {
//   try {
//     console.log("req#@", req.headers);
//     let id = req.headers.authid;
//     console.log("du#", id);

//     // const id = "115";
//     if (!id) {
//       return responseObject(
//         res,
//         HTTP_UNAUTHORIZED,
//         "error",
//         null,
//         "Invalid or expired token"
//       );
//     }

//     let user = await Users.findOne({
//       _id: id,
//     });
//     // .populate({
//     //   path: 'vybers',
//     //   populate: {
//     //     path: 'vyber',
//     //     select: authorFewPopulate()
//     //   }
//     // });

//     if (!user) {
//       return responseObject(
//         res,
//         HTTP_UNAUTHORIZED,
//         "error",
//         null,
//         "No user with this token"
//       );
//     }

//     console.log("AUTHORIZED USER FROM MIDDLEWARE", user);
//     req.user = user;

//     req.userId = id;
//     return next();
//   } catch (error) {
//     if (error) console.log(error);
//   }
// };

// exports.adminAuth = async (req, res, next) => {
//   try {
//     // const adminId = req.headers.xappid;
//     // if (!adminId) {
//     //   return responseObject(
//     //     res,
//     //     HTTP_UNAUTHORIZED,
//     //     "error",
//     //     null,
//     //     "Invalid App Access"
//     //   );
//     // }
//     // if (adminId !== "trybe-admin") {
//     //   return responseObject(
//     //     res,
//     //     HTTP_UNAUTHORIZED,
//     //     "error",
//     //     null,
//     //     "Invalid App Access"
//     //   );
//     // }
//     return next();
//   } catch (error) {
//     return responseObject(
//       res,
//       HTTP_UNAUTHORIZED,
//       "error",
//       null,
//       error.toString()
//     );
//   }
// };
// // exports.auth = async (req, res, next) => {
// //   try {
// //     const auth = req.headers.authid;
// //     if (!auth)
// //       return responseObject(
// //         res,
// //         HTTP_UNAUTHORIZED,
// //         'error',
// //         null,
// //         'Invalid or expired token'
// //       );

// //       req.userId = auth;
// //        next();

// //   } catch (error) {
// //     if (error) console.log(error);
// //   }
// // };
