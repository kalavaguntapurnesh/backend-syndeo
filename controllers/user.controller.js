const userModel = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const tokenModel = require("../models/token.model.js");
const individualScheduleModel = require("../models/individualSchedules.model.js");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { log } = require("console");
const nodemailer = require("nodemailer");
const ApiError = require("../utils/ApiError.js");
const sendMail = require("../helpers/sendMail.js");
const organizationModel = require("../models/organization.model.js");
const organizerModel = require("../models/organizer.model.js");

exports.registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      organizationName,
      organizationCountry,
      organizationState,
      organizationCity,
      phoneNumber,
    } = req.body;
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return res.status(400).json({ error: "Required fields missing" });
      // throw new ApiError(400, "Required fields missing");
    }
    const user = await userModel.findOne({ email });
    if (user) {
      return res.json({ message: "User Already Exists" });
      // throw new ApiError(409, "User Already Exists");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      firstName,
      lastName,
      email,
      password: hashPassword,
      phoneNumber,
      role,
    });
    await newUser.save();
    const token = new tokenModel({
      userId: newUser._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    await token.save();
    const link = `http://localhost:8080/confirm/${token.token}`;
    if (role === "organization") {
      const organization = new organizationModel({
        organizationName,
        organizationCountry,
        organizationState,
        organizationCity,
        organizationAdminId: newUser._id,
      });
      await organization.save();
    }
    const transporter = nodemailer.createTransport({
      host: "mail.clouddatanetworks.com",
      port: 465,
      secure: true,
      auth: {
        user: "syndrome-noreply@clouddatanetworks.com",
        pass: "CDN@Syndeo@",
      },
    });
    // await sendMail.sendMailToUser(
    //   email,
    //   "Welcome to Syndèo!!! 🎉 🎉",
    //   `Hi, ${lastName} ${firstName}. Thank you for registering with us`,
    //   `<!DOCTYPE html>
    //   <html>
    //     <head>
    //       <style>
    //       body {
    //         font-family: Arial, sans-serif;
    //         height: 100%;
    //         width: 100%;
    //       }

    //       .container {
    //         max-width: 600px;
    //         margin: 0 auto;
    //         padding: 20px;
    //         background-color: #fff;
    //         border-radius: 5px;
    //         box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    //       }

    //         .header {
    //           text-align: center;
    //           margin-bottom: 20px;
    //         }

    //         .header h1 {
    //           color: #333;
    //           font-size: 22px;
    //           font-weight: 600;
    //           text-align: center;
    //         }

    //         .content {
    //           margin-bottom: 30px;
    //         }

    //         .content p {
    //           margin: 0 0 10px;
    //           line-height: 1.5;
    //         }

    //         .content #para p {
    //           margin-top: 20px;
    //         }

    //         .content .button {
    //           text-align: center;
    //           display: flex;
    //           justify-content: center;
    //           align-items: center;
    //           margin-top: 20px;
    //           margin-bottom: 20px;
    //         }

    //         .content .button a {
    //           border-radius: 40px;
    //           padding-top: 16px;
    //           padding-bottom: 16px;
    //           padding-left: 100px;
    //           padding-right: 100px;
    //           background-color: #007ae1;
    //           text-decoration: none;
    //           color: white;
    //           font-weight: 600;
    //         }

    //         /* .footer {
    //           text-align: center;
    //         } */

    //         .footer p {
    //           color: #999;
    //           font-size: 14px;
    //           margin: 0;
    //           margin-top: 8px;
    //           margin-bottom: 8px;
    //         }
    //       </style>
    //     </head>
    //     <body>
    //       <div class="container">
    //         <div class="header">
    //           <h1>Verify your email address to complete registration</h1>
    //         </div>
    //         <div class="content">
    //           <p id="para">Greetings, <span style="font-weight: bold">${firstName} ${lastName}!</span></p>
    //           <p>
    //             Thanks for your interest in joining Syndèo! To complete your
    //             registration, we need you to verify your email address.
    //           </p>
    //           <p>
    //             As part of our ongoing efforts to promote trust and protect your
    //             security, we now require you to obtain an Identity Verification which
    //             is done by verifying your email.
    //           </p>
    //           <div class="button">
    //             <a href="${link}">Verify Email</a>
    //           </div>
    //         </div>
    //         <p>Thanks for helping to keep Syndèo secure!</p>
    //         <div class="footer">
    //           <p>Best regards,</p>
    //           <p>Team Syndèo</p>
    //         </div>
    //       </div>
    //     </body>
    //   </html>
    //   `
    // );
    var mailOptions = {
      from: "syndrome-noreply@clouddatanetworks.com",
      to: email,
      subject: "Welcome to Syndèo!!! 🎉 🎉. Thank you for registering with us",
      html: `<!DOCTYPE html>
    <html>
      <head>
        <style>
        body {
          font-family: Arial, sans-serif;
          height: 100%;
          width: 100%;
        }
  
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
    
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
    
          .header h1 {
            color: #333;
            font-size: 22px;
            font-weight: 600;
            text-align: center;
          }
    
          .content {
            margin-bottom: 30px;
          }
    
          .content p {
            margin: 0 0 10px;
            line-height: 1.5;
          }
    
          .content #para p {
            margin-top: 20px;
          }
    
          .content .button {
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
            margin-bottom: 20px;
          }
    
          .content .button a {
            border-radius: 40px;
            padding-top: 16px;
            padding-bottom: 16px;
            padding-left: 100px;
            padding-right: 100px;
            background-color: #007ae1;
            text-decoration: none;
            color: white;
            font-weight: 600;
          }
    
          /* .footer {
            text-align: center;
          } */
    
          .footer p {
            color: #999;
            font-size: 14px;
            margin: 0;
            margin-top: 8px;
            margin-bottom: 8px;
          }
        </style>
      </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verify your email address to complete registration</h1>
            </div>
            <div class="content">
              <p id="para">Greetings, <span style="font-weight: bold">${firstName} ${lastName}!</span></p>
              <p>
                Thank you for your interest in joining Syndèo! To complete your
                registration, we need you to verify your email address.
              </p>
              <p>
                As part of our ongoing efforts to promote trust and protect your
                security, we now require you to obtain an Identity Verification which
                is done by verifying your email.
              </p>
              <div class="button">
                <a>Verify Email</a>
              </div>
            </div>
            <p>Thanks for helping to keep Syndèo secure!</p>
            <div class="footer">
              <p>Best regards,</p>
              <p>Team Syndèo</p>
            </div>
          </div>
        </body>
    </html>
      `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({ status: false, message: "Error in sending mail" });
      } else {
        console.log("This is for the testing purposes");
        return res.status(201).json(newUser);
      }
    });
  } catch (error) {
    // next(error);
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    // throw new ApiError(500, "Internal Server Error");
  }
};

exports.makeIndividualEvents = async (req, res) => {
  try {
    const {
      userId,
      title,
      description,
      location,
      date,
      startTime,
      endTime,
      emails,
    } = req.body;
    const newIndividualEvent = new individualScheduleModel({
      userId,
      title,
      description,
      location,
      date,
      startTime,
      endTime,
      emails,
    });
    await newIndividualEvent.save();
    const transporter = nodemailer.createTransport({
      host: "mail.clouddatanetworks.com",
      port: 465,
      secure: true,
      auth: {
        user: "syndrome-noreply@clouddatanetworks.com",
        pass: "CDN@Syndeo@",
      },
    });
    var mailOptions = {
      from: "syndrome-noreply@clouddatanetworks.com",
      to: emails.join(","),
      subject: "You got an invitation for an upcoming event",
      html: `<!DOCTYPE html>
    <html>
      <head>
        <style>
        body {
          font-family: Arial, sans-serif;
          height: 100%;
          width: 100%;
        }
  
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
    
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
    
          .header h1 {
            color: #333;
            font-size: 22px;
            font-weight: 600;
            text-align: center;
          }
    
          .content {
            margin-bottom: 30px;
          }
    
          .content p {
            margin: 0 0 10px;
            line-height: 1.5;
          }
    
          .content #para p {
            margin-top: 20px;
          }
    
          .content .button {
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
            margin-bottom: 20px;
          }
    
          .content .button a {
            border-radius: 40px;
            padding-top: 16px;
            padding-bottom: 16px;
            padding-left: 100px;
            padding-right: 100px;
            background-color: #007ae1;
            text-decoration: none;
            color: white;
            font-weight: 600;
          }
    
          /* .footer {
            text-align: center;
          } */
    
          .footer p {
            color: #999;
            font-size: 14px;
            margin: 0;
            margin-top: 8px;
            margin-bottom: 8px;
          }
        </style>
      </head>
       <body>
          <div class="container">
            <div class="header">
              <h1>The details of the event are as follows:</h1>
            </div>
            <div class="content">
              <p id="para">Hello, you are invited for <span style="font-weight: bold">${title}!</span></p>
              <p>
                The location is <span style="font-weight: bold">${location}</span> on the date of <span style="font-weight: bold">${date}</span> and the event starts at ${startTime}</span> and ends at ${endTime}</span>.
              </p>
              <p>
               The description of the event is <span style="font-weight: bold">${description}</span>. This emails indicates that the user cares very much for you.
              </p>
              <div class="button">
                <a href="">Add to Calendar</a>
              </div>
            </div>
            <div class="footer">
              <p>Best regards,</p>
              <p>Team Syndèo</p>
            </div>
          </div>
        </body>
    </html>
      `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.status(500).json({ error: "Error in sending mail" });
      } else {
        console.log("This is for the testing purposes");
        return res.status(200).json(newIndividualEvent);
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Required fields missing" });
    }
    const user = await userModel.findOne({ email });
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user._id }, process.env.KEY, {
        expiresIn: "24h",
      });
      res.cookie("token", token, { httpOnly: true, maxAge: 1800000 });
      return res.status(200).json({ message: "Login Successful", token });
    } else {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await userModel.findOneAndUpdate(
      {
        _id: req.body.userId,
      },
      req.body
    );
    return res.status(200).json({ message: "Profile Updated Successfully!" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    } else {
      return res.status(200).json({ data: user });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getIndividualSchedules = async (req, res) => {
  try {
    const individualSchedules = await individualScheduleModel.find({
      userId: req.body.userId,
    });
    if (!individualSchedules) {
      return res.status(404).json({ message: "User Not Found" });
    } else {
      // return res.status(200).json({ data: individualSchedules });
      return res.status(200).json(individualSchedules);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = userModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      {
        new: true,
        useFindAndModify: false,
      }
    );
    if (updatedUser) {
      res
        .status(200)
        .json({ message: "Profile updated successfully", updatedUser });
    } else {
      res.status(404).send();
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

exports.confirmToken = async (req, res) => {
  try {
    const token = await tokenModel.findOne({ token: req.params.token });
    const user = await userModel.findOne({ _id: token.userId });
    await userModel.updateOne(
      {
        _id: token.userId,
      },
      {
        $set: { verified: true },
      }
    );
    await tokenModel.findByIdAndDelete(token._id);
    await user.save();
    res.status(200).json({ message: "Email Verified Successfully" });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "Email Not Found" });
    }
    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "10m",
    });

    const transporter = nodemailer.createTransport({
      host: "mail.clouddatanetworks.com",
      port: 465,
      secure: true,
      auth: {
        user: "noreply-syndeo@clouddatanetworks.com",
        pass: "CDN@syndeo",
      },
    });
    var mailOptions = {
      from: "noreply-syndeo@clouddatanetworks.com",
      to: email,
      subject: "Reset Your Password",
      html: `<!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              height: 100%;
              width: 100%;
              background-color: #f8f9f0;
            }
      
            .container {
              max-width: 900px;
              margin: 0 auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
      
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
      
            .header h1 {
              color: #333;
              font-size: 22px;
              font-weight: 600;
              text-align: center;
            }
      
            .content {
              margin-bottom: 30px;
            }
      
            .content p {
              margin: 0 0 10px;
              line-height: 1.5;
              text-align: center;
            }
      
            .button {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 20px;
              margin-bottom: 20px;
            }
      
            .button a {
              border-radius: 40px;
              cursor: pointer;
              padding-top: 16px;
              padding-bottom: 16px;
              padding-left: 30px;
              padding-right: 30px;
              background-color: #007ae1;
              text-decoration: none;
              color: white;
              font-weight: 600;
              text-align: center;
            }
      
            .bottom p {
              text-align: center;
            }
      
            .footer p {
              color: #999;
              font-size: 14px;
              margin: 0;
              margin-top: 8px;
              margin-bottom: 8px;
            }
            .footer .footerOne {
              text-align: center;
            }
            .footer .footerTwo {
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset your password</h1>
            </div>
            <div class="content">
              <p>This link will expire in 10 minutes.</p>
              <p>If it wasn't done by you, please contact us immediately.</p>
            </div>
            <div class="button">
              <a href="https://syndeo-frontend.vercel.app/resetPassword/${user._id}/${token}"
                >Reset the password</a
              >
            </div>
            <div class="bottom">
              <p>Thanks for helping to keep Syndèo secure!</p>
            </div>
            <div class="footer">
              <p class="footerOne">Best regards,</p>
              <p class="footerTwo">Team Syndèo</p>
            </div>
          </div>
        </body>
      </html>
      
      
      `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({ message: "Error in sending Mail" });
      } else {
        res
          .status(200)
          .json({ message: "Check your email once", status: true });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Some Error Arised", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  jwt.verify(token, process.env.KEY, (err, decoded) => {
    if (err) {
      return res.json({
        status: false,
        message: "Error in resetting the password",
      });
    } else {
      bcrypt.hash(password, 10).then((hash) => {
        userModel
          .findByIdAndUpdate({ _id: id }, { password: hash })
          .then((u) => {
            res.json({
              status: true,
              message: "Password Updated Succcessfully",
            });
          })
          .catch((err) => {
            res.json({ message: "Password Updation Failed" });
          });
      });
    }
  });
};

exports.addEmployees = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      role,
      adminId,
      employeeId,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
    });
    await user.save();
    const organization = await organizationModel.findOne({
      organizationAdminId: adminId,
    });
    if (!organization) {
      return res.status(404).json({ message: "Organization Not Found" });
    }
    const employee = new organizerModel({
      userId: user._id,
      organizationName: organization?.organizationName,
      organizationAdminId: adminId,
      employeeId: employeeId,
    });
    await employee.save();
    return res.status(201).json(employee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrganizationEmployees = async (req, res) => {
  try {
    const { adminId } = req.body;
    const employees = await organizerModel
      .find({
        organizationAdminId: adminId,
      })
      .populate("userId", "firstName lastName email");
    const result = employees.map((employee) => ({
      firstName: employee.userId.firstName,
      lastName: employee.userId.lastName,
      email: employee.userId.email,
      employeeId: employee.employeeId,
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
