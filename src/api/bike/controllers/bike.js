"use strict";

/**
 *  bike controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::bike.bike", ({ strapi }) => ({
  available: async (ctx) => {
    const { query } = ctx.request;
    
    if (!query.startDate || !query.endDate) {
      return ctx.badRequest('startDate and endDate are required')
    }

    const response = await strapi.db.query("api::bike.bike").findMany({
      where: {
        $not: {
          rentals: {
            $or: [
              {
                startDate: {
                  $between: [query.startDate,query.endDate]
                }
              },
              {
                endDate: {
                  $between: [query.startDate, query.endDate]
                }
              }
            ]
          },
        },
      },
      populate: ['rentals', 'color', 'location', 'rates'],
    });

    ctx.body = response;
  },
}));
