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
                $and: [
                  {
                    startDate: {
                      $gte: query.startDate
                    }
                  },
                  {
                    startDate: {
                      $lte: query.endDate
                    }
                  }
                ]
              },
              {
                $and: [
                  {
                    endDate: {
                      $gte: query.startDate
                    }
                  },
                  {
                    endDate: {
                      $lte: query.endDate
                    }
                  }
                ]
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
