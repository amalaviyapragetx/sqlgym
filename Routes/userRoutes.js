const express = require('express');
const router = express.Router();
const {signupUser,getUser,updateUser,deleteUser,loginUser,getcustomers,getasts,getmyasts,forgetPassword,verifyOtp,resetPassword,changePassword,registerUser,verifyEmail,resendOTP,forgetpass,users,changepass,resetpass,getUserProfile,updateUserProfile,deleteUserProfile,thirdpartyUser,logout} = require('../Controllers/userController');
const { protect,checkUserExists } = require('../Middlewares/auth');
const { uploadProfileImage } = require('../Middlewares/uploadImage');

//register user
// uploadProfileImage
// router.route('/').post(signupUser);
router.post('/',  signupUser);

//login user
router.post('/login', loginUser);

//get user profile
router.get('/', protect,getUser);

//update user profile
router.put('/',protect, uploadProfileImage, updateUser);
// router.put('/', protect,uploadProfileImage, updateUser);

//Delete user profile
router.delete('/',protect,deleteUser); 

//get all users
router.get('/customers', protect,getcustomers);

//get all users
router.get('/asts', protect,getasts);

//get all users
router.get('/myasts', protect,getmyasts);

//forgot password
router.route('/forgetpassword').post(forgetPassword)

//verifyOtp 
router.route('/verifyOtp').post(verifyOtp)

//verifyOtp 
router.route('/resetPassword').post(resetPassword)

//changePassword 
router.post('/changePassword', protect,changePassword);

//Delete user profile
router.delete('/logout',protect,logout);  




//register user
router.route('/register').post(registerUser);

//register user
router.route('/users').post(users);

//thirdparty user
router.route('/thirdparty').post(thirdpartyUser);

//verify email
router.route('/verifyemail/:id').post(verifyEmail);

//resend otp
router.route('/resendotp/:id').post(resendOTP);

//login
router.route('/login').post(loginUser);

//forgot password
router.route('/forgetpassword').post(forgetpass)

router.post('/changepass', protect, changepass);

router.post('/resetpass/:id',  resetpass);

//get user profile
router.get('/profile', protect,getUserProfile);

//update user profile
router.put('/updateprofile', protect, updateUserProfile);

//Delete user profile
router.delete('/deleteprofile',protect,deleteUserProfile);  



module.exports = router;