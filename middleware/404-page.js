function routeNotFound(req, res, next) {
  res.status(404).json({success: false, message:"Couldn't find the Route"})
}

module.exports = {routeNotFound}