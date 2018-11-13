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
            req.session.uid = user.id;

            sails.log("Session: " + JSON.stringify(req.session));

            // return res.json(req.session);

            if (req.wantsJSON) {
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


    //
    populate: async function (req, res) {

        if (!['supervises'].includes(req.params.association)) return res.notFound();

        const message = Person.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        var model = await User.findOne(req.params.id).populate(req.params.association);

        if (!model) return res.notFound();

        console.log(model.supervises);

        return res.view('user/reg', { "pop2": model.supervises });

    },

    //

    add: async function (req, res) {

        if (!['supervises'].includes(req.params.association)) return res.notFound();

        const message = sails.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        if (!await User.findOne(req.params.id)) return res.notFound();

        if (req.params.association == "supervises") {
            if (!await Person.findOne(req.params.fk)) return res.notFound();
        }

         var model = await Person.findOne(req.params.fk);

         await Person.update(req.params.fk).set({
            quota: model.quota - 1,
        }).fetch();

        await User.addToCollection(req.params.id, req.params.association).members(req.params.fk);
        
        //
        if (req.wantsJSON) {
            return res.redirect('/');
        } else {
            return res.redirect('/');
        }

    },

    //

    remove: async function (req, res) {

        if (!['supervises'].includes(req.params.association)) return res.notFound();

        const message = sails.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        if (!await User.findOne(req.params.id)) return res.notFound();

        if (req.params.association == "supervises") {
            if (!await Person.findOne(req.params.fk)) return res.notFound();
        }

        await User.removeFromCollection(req.params.id, req.params.association).members(req.params.fk);

        return res.redirect('/');

    },

};

