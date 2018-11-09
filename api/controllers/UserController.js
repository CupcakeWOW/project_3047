/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    login: async function (req, res) {

        if (req.method == "GET") return res.view('user/login');
    
        if (!req.body.username) return res.badRequest();
        if (!req.body.password) return res.badRequest();
    
        var user = await User.findOne({ username: req.body.username });
    
        if (!user) {
            res.status(401);
            return res.send("User not found");
        }
    
        if (user.password != req.body.password) {
            res.status(401);
            return res.send("Wrong Password");
        }
    
        req.session.regenerate(function (err) {
    
            if (err) return res.serverError(err);
    
            req.session.username = req.body.username;
            req.session.usertype = user.usertype;
    
            sails.log("Session: " + JSON.stringify(req.session) );
            
            // return res.json(req.session);
            
            if (req.wantsJSON){
                return res.redirect('/person/index');
            } else {
                return res.ok("Login successfully");
            }
    
        });
    
    },

    logout: async function (req, res) {

        req.session.destroy(function (err) {
        
            if (err) return res.serverError(err);
            
            return res.redirect('/person/index');
            
        });
    },

};

