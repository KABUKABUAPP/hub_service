const jwt = require('jsonwebtoken');
const { responseObject, authorFewPopulate, verifyJwt, axiosRequestFunction } = require("../helpers");
const { HTTP_BAD_REQUEST, HTTP_UNAUTHORIZED, HTTP_SERVER_ERROR } = require("../helpers/httpCodes");
const {Inspector} = require("../models");
const config_env = require('../config_env');

exports.isAuthorized = async (req, _res, next) => {
  try {
    const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
      const respo = 
        {
          status: "error",
          code: HTTP_UNAUTHORIZED,
          message:"Authorization token is missing.",
          data: null,

        }
      
      return next(
        responseObject(_res, respo.code, respo.status, respo.data, respo.message)
      )
    }


   const {id} = verifyJwt(token);
    if (!id) {
      const respo = 
        {
          status: "error",
          code: HTTP_BAD_REQUEST,
          message:"Invalid jwt passed",
          data: null,

        }
      
      return next(
        responseObject(_res, respo.code, respo.status, respo.data, respo.message)
      )
    }


    const existingInspector =  await Inspector.findById(id);
    // console.log(existingUser);
    if(!existingInspector){
       const respo =  {
          status: "error",
          code: HTTP_UNAUTHORIZED ,
          message:'Unauthorized to perform this action',
        }
      return next(
        responseObject(_res, respo.code, respo.status, respo.data, respo.message)
      )      
    } else {
      req.user = existingInspector
      req.token = token,
      req.userId = existingInspector._id
      return next()
    }
    

  } catch (error) {
    console.log(error);
    const respo = {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error.message,
      data: error
    }
    return next(
      responseObject(_res, respo.code, respo.status, respo.data, respo.message)
    ) 
  }
}
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

exports.authorizeAdmin = (role) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      try {
        //   validate
        const getAdmin = await axiosRequestFunction({
          url: config_env.RIDE_SERVICE_BASE_URL+`/admin/auth/validate/${token}`,
          method: "get"
        })
        if(getAdmin.status === "error"){
          return getAdmin
        }
        const admin = getAdmin.data
        console.log("THIS IS THE ADMIN DATA>>>>>>>>>>", admin)
        const adminEmail = admin?.email
        const adminId = admin?._id
        if (
          String(admin.role) === String(role) ||
          String(role) === "All"
        ) {
          req.token = token;
          req.userId = adminId
          req.admin = adminEmail
          next();
        } else {
          const data = {
            code: 401,
            status: "error",
            message: "Unauthorized",
          };
          return res.status(401).json(data);
        }
      } catch (error) {
        const data = {
          code: 401,
          status: "error",
          message: error?.message,
          data: error.stack,
        };
        return res.status(401).json(data);
      }
    } else {
      const data = {
        code: 401,
        status: "error",
        message: "Unauthorized",
      };
      return res.status(401).json(data);
    }
  };
};