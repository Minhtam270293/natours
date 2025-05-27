// /tests/unit/authController.test.js

// Dependencies
const jwt = require('jsonwebtoken');
const { isLoggedIn, login } = require('../../controllers/authController');
const User = require('../../models/userModel');
const AppError = require('../../utils/appError');
const mockingoose = require('mockingoose');


jest.mock('jsonwebtoken');
jwt.verify = jest.fn();
jwt.sign = jest.fn();

describe('isLoggedIn middleware', () => {
    let res, req, next, user;

    beforeEach(() => {
      mockingoose.resetAll();
      jest.clearAllMocks();

        res = {locals: {}};
        req = {cookies: {}};    
        next = jest.fn();

    })


    // TC1: no jwt
    it('Should call next() immediately if no jwt', async () => {
        await isLoggedIn(req, res, next);
        expect(res.locals.user).toBeUndefined();
        expect(next).toHaveBeenCalled();
    });

    // TC2: invalid jwt
    it('Should call next() immediately if jwt is invalid', async () => {
       
        req.cookies.jwt = "invalid token";
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token'), null);
        })
        
        await isLoggedIn(req, res, next);
        expect(res.locals.user).toBeUndefined();
        expect(next).toHaveBeenCalled();
    });

    // TC3: valid jwt, no user in database
    it('Should call next() without setting res.locals.user', async () => {

        req.cookies.jwt = "valid token";
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, { _id: '12345', iat: Date.now() / 1000} );
        })

        mockingoose(User).toReturn(null, 'findOne');

        await isLoggedIn(req, res, next);
        expect(res.locals.user).toBeUndefined();
        expect(next).toHaveBeenCalled();
    })

    // TC4: valid jwt, user in database, password has been changed
    it('Should call next() without setting res.locals.user', async () => {
        req.cookies.jwt = "valid token";
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, { id: '507f191e810c19729de860ea', iat: 1700000000 });
        })

        user = {
             _id: '507f191e810c19729de860ea',
             passwordChangedAt: new Date('2024-01-01T00:00:00Z'),
             changedPasswordAfter: jest.fn().mockReturnValue(true)
        };

        mockingoose(User).toReturn(user, 'findOne');


        await isLoggedIn(req, res, next);
        expect(res.locals.user).toBeUndefined();
        expect(next).toHaveBeenCalled();
    });


    // TC5: valid jwt, user in database, password has not been changed
//     it('Should call next() and set res.local.user to user', async () => {
//         req.cookies.jwt = "valid token";
//         jwt.verify.mockImplementation((token, secret, callback) => {
//             callback(null, { id: '5073ff1e810c19729de860ea', iat: 1700000000 });
//         })

     
//         user = {
//              _id: '5073ff1e810c19729de860ea',
//             changedPasswordAfter: jest.fn().mockReturnValue(false),
//             active: true,
//               photo: "default.jpg",
//               role: "user"
//         };
     

//         mockingoose(User).toReturn(user, 'findOne');

//         await isLoggedIn(req, res, next);
//         const { changedPasswordAfter, ...userWithoutMethod } = user;

//         jest.spyOn(User, 'findById');
//         expect(res.locals.user).toMatchObject(userWithoutMethod);

//         expect(next).toHaveBeenCalled();
//     })
});



describe('authController.login', () => {
  let req, res, next, user;

  beforeEach(() => {
    mockingoose.resetAll();
    jest.clearAllMocks();

    req = { body: { email: 'test@123.com', password: '123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    };
    next = jest.fn();

    user = {
      _id: '507f191e810c19729de860ea',
      email: 'test@123.com',
      password: 'hashedPassword',
      correctPassword: jest.fn().mockResolvedValue(true),
    };

    // Mock JWT sign
    jwt.sign.mockReturnValue('mockToken');
  });

  it('should return 400 if email or password is missing', async () => {
    req.body = {};
    await login(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(res.status).not.toHaveBeenCalled();
  });

it('should return 401 if user not found or password incorrect', async () => {
  const selectMock = jest.fn().mockResolvedValue(null);
  jest.spyOn(User, 'findOne').mockReturnValue({ select: selectMock });

  await login(req, res, next);

  expect(selectMock).toHaveBeenCalledWith('+password');
  expect(next).toHaveBeenCalledWith(expect.any(AppError));
  expect(res.status).not.toHaveBeenCalled();
});

 it('should login successfully and respond with a token', async () => {
  process.env.JWT_SECRET = 'testsecret';
  process.env.JWT_EXPIRES_IN = '1d';
  process.env.JWT_COOKIE_EXPIRES_IN = '1';

  const userDoc = {
    _id: 'someuserid',
    email: 'test@123.com',
    password: 'hashedPassword',
    correctPassword: jest.fn().mockResolvedValue(true),
  };

  jest.spyOn(User, 'findOne').mockImplementation(() => ({
    select: jest.fn().mockResolvedValue(userDoc),
  }));

  jwt.sign = jest.fn().mockReturnValue('mockToken');

  const req = {
    body: {
      email: 'test@123.com',
      password: '123',
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    cookie: jest.fn(),
  };

  const next = jest.fn();

  await login(req, res, next);

  expect(userDoc.correctPassword).toHaveBeenCalledWith('123', 'hashedPassword');
});

});