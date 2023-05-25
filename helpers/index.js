const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const {cloudinary} = require('../config')
const axios = require('axios')

// dotenv.config();
const config = require("../config_env");
const bcrypt = require("bcryptjs");
const { HTTP_SERVER_ERROR } = require("./httpCodes");

exports.hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

exports.comparePassword = (hashedPassword, password) => {
  return bcrypt.compareSync(password, hashedPassword);
};

exports.verificationCode = () => {
  const code = Math.floor(1000 + Math.random() * 9000);
  return code;
};


exports.encryptPassword = (password, salt) => {
  if (!password) return "";
  try {
    return crypto.createHmac("sha1", salt).update(password).digest("hex");
  } catch (error) {
    return "";
  }
};

exports.decryptPassword = (password, salt) => {
  if (!password) return "";
  try {
    const hash = crypto.createHmac("sha1", salt).update(password).digest("hex");
    return hash;
  } catch (error) {
    console.log(error);
    return "";
  }
};

// VERIFY JWT tokens to users
exports.verifyJwt = (token) => {
  return jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return err
    }

    return decoded;
  });
};

// Issues JWT tokens to users
exports.issueJwt = (user) => {
  const payload = {
    id: user?._id,
    email: user?.email?user.email: undefined,
    phone_number: user?.phone_number?user.phone_number: undefined
  };

  const signedToken = jwt.sign(payload, config.JWT_SECRET, {
    // expiresIn: '1d'
  });
  return signedToken;
};
//Issue JWT for OTP
exports.jwtForOtp = (data) => {

  const signedToken = jwt.sign(data, config.JWT_SECRET, {
    // expiresIn: '1d'
  });
  return signedToken;
};

// Returns a Backend response object
exports.responseObject = (response, code, status, data, message) => {
  if (status === "error" || (code === "success" && !data)) {
    return response.status(code).json({
      status,
      message,
    });
  } else {
    return response.status(code).json({
      status,
      // resultCount: data ? data.length : 0,
      data,
      message,
    });
  }
};

exports.authorFewPopulate = () => {
  return "_id user_id first_name last_name email phone profile_image is_online";
};

exports.getVibersIds = (arr, userId) => {
  if (!arr) {
    return [];
  }
  let idLists = [];
  for (item of arr) {
    //console.log(item);
    if (item.vybers) {
      for (i of item.vybers) {
        if (i.vyber_id != userId) {
          idLists.push(i.vyber_id);
        }
        if (i.user_id != userId) {
          idLists.push(i.user_id);
        }
      }
    } else {
      if (item.vyber_id != userId) {
        idLists.push(item.vyber_id);
      }
      if (item.user_id != userId) {
        idLists.push(item.user_id);
      }
    }
  }

  return idLists;
};

exports.sorter = (sortParameter, column) => {
  let sort;
  switch (sortParameter) {
    case "a-z":
      sort = { [column]: "asc" };
      break;
    case "z-a":
      sort = { [column]: "desc" };
      break;
    case "top-bottom":
      sort = { createdAt: "asc" };
      break;
    case "bottom-top":
      sort = { createdAt: "desc" };
      break;
    default:
      sort = { createdAt: "desc" };
      break;
  }
  return sort;
};

exports.filter = (queryParameters) => {
  if (Object.keys(queryParameters).includes("startDate")) {
    const conditions = {
      ...queryParameters,
      createdAt: {
        $gte: queryParameters.startDate,
        $lt: queryParameters.endDate,
      },
    };
    delete conditions.startDate;
    delete conditions.endDate;
    const newConditions = { ...conditions };
    return newConditions;
  }
  return { ...queryParameters };
};

exports.generateTicketCheckinReference = () => {
  return `Trybe1${this.generateRandomString(5)}`;
};

exports.generateRandomString = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

exports.getRandomRef = () => {
  const getRef = () => {
    var nums = "0123456789";
    var rand = "";
    for (var i = 0; i < 5; i++) {
      rand += nums[Math.floor(Math.random() * 10)];
    }
    return rand;
  };
  let randRef = "Trybe" + getRef() + Date.now();

  return randRef;
};


exports.cleanString = (string) => {
  // this is a rough implementation
  const first = String(string).replace(/ /g, "+")
  const second = String(first).replace(/,/g, "+")
  let last = "";
  let plus = "+"
  let result = "";
  const length = Number(second.length)
  for(let i = 0; i < length; i++){
    let char = second.charAt(i);
    if(char!== plus){
      result += char;
      last = char;
    } else if(char !== last && char === plus){
      if(result.charAt(Number(result.length)- 1) === plus ){
        result
      } else {
        result += char
      }
    }
  }
  return String(result)
}

//CLOUDINARY FILE UPLOADS
exports.imageUploader = async (file) =>{
    const {secure_url} = await cloudinary.uploader.upload(file, {
        folder: "hub_service_images",
        // compressing images
        transformation: [
            {width: 480, aspect_ratio: "1.0", crop: 'fill'},
            {fetch_format: "webp"}
        ],

        // transformation: [
        //     {aspect_ratio: "1.8", width: 1920, crop: "fill"},
        // ],

        secure: true

    },)
    return secure_url
}


exports.fileUploader = async (file) =>{
    const {secure_url} = await cloudinary.uploader.upload(file,
      {
        folder: "hub_service_docs", 
        secure: true
      },
    )
    return secure_url
}

exports.formatPhoneNumber =  (phone_number) => {
  const stringed = String(phone_number)
     let formated
    formated = '+234'+ stringed.slice(-10)
    return formated
}


exports.axiosRequestFunction = async({method,url,data,params,headers}) =>{
  try {
    const config = {
      method: method,
      url: url,
      data: {...(data && data)},
      params: {...(params &&params)},
      headers: {...(headers &&headers)},

    }
    const res = await axios(config).catch(function (error) {
      if (error.response) {
        return {
          status: error.response.data.status,
          code: error.response.status,
          message: error.response.data.message,
        }
      } else if (error.request) {
        console.log("AXIOS ERROR REQUEST>>>>", error.request);
      } else {
        console.log('"AXIOS ERROR MESSAGE>>>>",', error.message);
      }
      console.log("AXIOS ERROR CONFIG>>>>",error.config);
    });
    if(Number(res.status) < 400){
      const resData = res.data
        console.log("THIS IS THE ELSE DATA", resData);

      return {
        status: resData?.status,
        code: resData?.code,
        message: resData?.message,
        data: resData?.data
      }
      }else {
        console.log("THIS IS THE ELSE OR ERROR", res);
        return {
          status: res?.status,
          code: res?.code,
          message: res?.message
        }
      }
  } catch (error) {
    return {
      status: "error",
      code: HTTP_SERVER_ERROR,
      message: error.toString()
    }
  }
  
}
