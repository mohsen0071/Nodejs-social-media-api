const Joi = require('joi');

const login = {
    body: Joi.object().keys({
        email: Joi.string().email().message('Invalid email').trim().required(),
        password: Joi.string().trim().required()
    })
}

const userByIds = {
    body: Joi.object({
        ids: Joi.array()
            .items(
                Joi.string()
                    .hex()
                    .length(24)
                    .messages({
                        'string.hex': 'Invalid User Id',
                        'string.length': 'Invalid User Id',
                    })
            )
            .required()
            .messages({
                'array.base': 'IDs must be in an array format',
                'any.required': 'IDs field is required'
            })
    })
};

const followUser = {
    body: Joi.object().keys({
        followingUserId: Joi.string().hex().message('Invalid userId').length(24).required(),
    })
}

module.exports = { login, userByIds, followUser };