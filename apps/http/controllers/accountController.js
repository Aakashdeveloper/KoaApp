import jsonwebtoken from 'jsonwebtoken';
import user from '../../user';
import md5 from 'md5';

class accountController {
  /**
   * login
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async login(ctx) {
    try {
      const User = await user.find({
        attributes: { exclude: ['password'] }, // Excluded columns
        where: {
          loginName: ctx.query.loginName,
          password: md5(ctx.query.password),
        },
      });
      if (User) {
        const token = jsonwebtoken.sign(User.dataValues, 'shared-secret', { expiresIn: '1h' });
        ctx.body = {
          token,
          status: 0,
          messages: 'hi ',
          data: User,
        };
      } else {
        ctx.body = {
          status: -1,
          messages: 'hello',
        };
      }
    } catch (err) {
      ctx.body = {
        status: -1,
        messages: err,
      };
    }
  }

  /**
   * register
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async register(ctx) {
    const newUser = {
      loginName: ctx.query.loginName,
      password: md5(ctx.query.password),
    };
    try {
      await user.create(newUser);
      ctx.body = {
        status: 0,
        messages: 'hi',
      };
    } catch (err) {
      ctx.body = {
        status: -1,
        messages: err,
      };
    }
  }
}

export default accountController;
