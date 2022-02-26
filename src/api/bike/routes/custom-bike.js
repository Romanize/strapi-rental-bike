'use-strict'

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/availableBikes',
      handler: 'bike.available',
    }
  ]
}