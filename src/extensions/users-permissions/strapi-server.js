module.exports = plugin => {
  const sanitizeOutput = (user) => {
    const {
      password, resetPasswordToken, confirmationToken, ...sanitizedUser
    } = user; // be careful, you need to omit other private attributes yourself
    return sanitizedUser;
  };

  plugin.controllers.user.me = async (ctx) => {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }
    
    const user = await strapi.entityService.findOne(
      'plugin::users-permissions.user',
      ctx.state.user.id,
      { populate: ['role'] }
    );
    
    const sanitized = sanitizeOutput(user);
    ctx.body = { ...sanitized, role: sanitized.role.name }
  };

  plugin.controllers.user.find = async (ctx) => {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }
    const users = await strapi.entityService.findMany(
      'plugin::users-permissions.user',
      { populate: ['role'] }
    )
    ctx.body = users.map(user => {
      const sanitized = sanitizeOutput(user);
      return {
        ...sanitized,
        role: sanitized.role.name
      }
    })
  }

  plugin.controllers.user.findOne = async (ctx) => {
    if(!ctx.state.user) {
      return ctx.unauthorized();
    }

    const id = ctx.request.params.id;
    const query = ctx.request.query;

    const user = await strapi.entityService.findOne(
      'plugin::users-permissions.user',
      id,
      query
    )

    const sanitized = sanitizeOutput(user);
    ctx.body = sanitized
  }

  return plugin
};