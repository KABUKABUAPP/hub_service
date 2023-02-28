// const { createUser, updateUser } = require("../modules/user/service");
// const { User } = require("../models");
// const { update } = require("lodash");

// // USERS EVENTS
// exports.fnConsumerUserCreate = async (msg, callback) => {
//   const userData = JSON.parse(msg.content);
//   console.log("User create consumer >>>>>>>>>>>>", userData);
//   try {
//     //call create user controller
//     const existingUser = await User.findById(userData._id);
//     if (!existingUser) {
//       const created = await createUser(userData);
//       //if successful
//       if (created) {
//         callback(true);
//       } else {
//         //not successful
//         callback(false);
//       }
//     } else {
//       const user_data = {
//         full_name: userData.full_name,
//         phone_number: userData.phone_number,
//         email: userData.email,
//         profile_image: userData.profile_image,
//         type: userData.type,
//         isBlocked: userData.isBlocked,
//         accessTokens: userData.accessTokens,
//         next_of_kin: userData.next_of_kin,
//         onboarding_step: userData.onboarding_step,
//         is_onboarding_complete: userData.is_onboarding_complete,
//         driver: userData.driver,
//         accessory_id: userData.accessory_id,
//         guarantor: userData.guarantor,
//         latitude_location: userData.latitude_location,
//         longitude_location: userData.longitude_location,
//       };
//       const payload = {
//         id: userData._id,
//         data: user_data,
//       };
//       await updateUser(payload);
//       callback(true);
//     }
//   } catch (error) {
//     console.log(error);
//     // return true
//   }
// };

// exports.fnConsumerUserUpdate = async (msg, callback) => {
//   const userData = JSON.parse(msg.content);
//   console.log(userData);
//   try {
//     //call update user controller
//     const user_data = {
//       full_name: userData.full_name,
//       phone_number: userData.phone_number,
//       email: userData.email,
//       profile_image: userData.profile_image,
//       type: userData.type,
//       isBlocked: userData.isBlocked,
//       accessTokens: userData.accessTokens,
//       next_of_kin: userData.next_of_kin,
//       onboarding_step: userData.onboarding_step,
//       is_onboarding_complete: userData.is_onboarding_complete,
//       driver: userData.driver,
//       accessory_id: userData.accessory_id,
//       guarantor: userData.guarantor,
//       latitude_location: userData.latitude_location,
//       longitude_location: userData.longitude_location,
//     };
//     const payload = {
//       id: userData._id,
//       data: user_data,
//     };
//     const updated = await updateUser(payload);
//     //if successful
//     if (updated) {
//       callback(true);
//     } else {
//       //not successful
//       callback(false);
//     }
//   } catch (error) {
//     console.log(error);
//     return true;
//   }
// };
