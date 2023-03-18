exports.messaging = {
  //AUTH SERVICE QUEUES
  AUTH_SERVICE_UPDATE_DRIVER: "AUTH_SERVICE_UPDATE_DRIVER",
  AUTH_SERVICE_FETCH_DRIVER: "AUTH_SERVICE_FETCH_DRIVER",

  //RIDE SERVICE QUEUES
  RIDE_SERVICE_APPROVE_DRIVER: "RIDE_SERVICE_APPROVE_DRIVER",

};

exports.OrderStatus = {
  PENDING: "pending",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  ACCEPTED: "accepted",
};

exports.TripMatchStatus = {
  PENDING: "pending",
  REJECTED: "rejected",
  ACCEPTED: "accepted",
};
