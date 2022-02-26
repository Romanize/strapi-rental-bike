'use-strict'

module.exports = plugin => {


  plugin.controllers.bike.find = (ctx) => {
    console.log('here')
  }

  plugin.controllers.bike.getAvailable = async (ctx) => {
    if(!ctx.state.user) {
      return ctx.unauthorized();
    }
  
    const response = await strapi.db.query('api::bike:bike').findMany({
      where: {
        $not: {
          rentals: {
            $and: [
              {
                $startDate: '2022-01-01',
              },
              {
                $endDate: '2022-05-30',
              }
            ]
          }
        }
      },
    });

    ctx.body = response
  }

  plugin.routes.push({
    method: 'GET',
    path: '/bikes/available',
    handler: 'bike.getAvailable'
  })

  return plugin
}