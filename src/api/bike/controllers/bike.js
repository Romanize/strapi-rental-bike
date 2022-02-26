"use strict";

/**
 *  bike controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::bike.bike", ({ strapi }) => ({
  available: async (ctx) => {
    const { query } = ctx.request;
    console.log(query);

    const response = await strapi.db.query("api::bike.bike").findMany({
      where: {
        $not: {
          rentals: {
            $or: [
              {
                $and: [
                  {
                    startDate: {
                      $gte: query.startDate,
                    },
                  },
                  {
                    endDate: {
                      $lte: query.endDate,
                    },
                  },
                ],
              },
              {
                $or: [
                  {
                    startDate: {
                      $between: [query.startDate, query.endDate],
                    },
                  },
                  {
                    endDate: {
                      $between: [query.startDate, query.endDate],
                    },
                  },
                ],
              },
            ],
          },
        },
      },
      populate: ["rentals"],
    });

    ctx.body = response;
  },
}));
