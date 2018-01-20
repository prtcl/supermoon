
const bindHelpers = (context) => (helpers) => (
  Object.entries(helpers)
    .reduce((res, [name, helper]) => ({
      ...res,
      [name]: helper(context)
    }), {})
);

export default bindHelpers;
