/**
 * PersonController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    // action - create
    create: async function (req, res) {

        if (req.method == "GET")
            return res.view('person/create');

        if (typeof req.body.Person === "undefined")
            return res.badRequest("Form-data not received.");

        await Person.create(req.body.Person);

        return res.view('person/sucess');
    },


    // action - index
    index: async function (req, res) {

        const qPage = Math.max(req.query.page - 1, 0) || 0;

        const numOfItemsPerPage = 2;

        var persons = await Person.find({
            limit: numOfItemsPerPage,
            skip: numOfItemsPerPage * qPage
        });

        var numOfPage = Math.ceil(await Person.count() / numOfItemsPerPage);

        return res.view('person/index', { 'persons': persons, 'count': numOfPage });

    },

    // action - view
    view: async function (req, res) {

        var message = Person.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        var model = await Person.findOne(req.params.id);

        if (!model) return res.notFound();

        return res.view('person/view', { 'person': model });

    },

    // action - delete 
    delete: async function (req, res) {

        if (req.method == "GET") return res.forbidden();

        var message = Person.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        var models = await Person.destroy(req.params.id).fetch();

        if (models.length == 0) return res.notFound();

        return res.view('person/sucess');


    },

    // action - update
    update: async function (req, res) {

        var message = Person.getInvalidIdMsg(req.params);

        if (message) return res.badRequest(message);

        if (req.method == "GET") {

            var model = await Person.findOne(req.params.id);

            if (!model) return res.notFound();

            return res.view('person/update', { 'person': model });

        } else {

            if (typeof req.body.Person === "undefined")
                return res.badRequest("Form-data not received.");

            if (req.body.Person.highlight == "") {

                var models = await Person.update(req.params.id).set({
                    name: req.body.Person.name,
                    short_des: req.body.Person.short_des,
                    long_des: req.body.Person.long_des,
                    img: req.body.Person.img,
                    org: req.body.Person.org,
                    date: req.body.Person.date,
                    time: req.body.Person.time,
                    venue: req.body.Person.venue,
                    quota: req.body.Person.quota,
                    highlight: "",
                }).fetch();

            } else {

                var models = await Person.update(req.params.id).set({
                    name: req.body.Person.name,
                    short_des: req.body.Person.short_des,
                    long_des: req.body.Person.long_des,
                    img: req.body.Person.img,
                    org: req.body.Person.org,
                    date: req.body.Person.date,
                    time: req.body.Person.time,
                    venue: req.body.Person.venue,
                    quota: req.body.Person.quota,
                    highlight: "true",
                }).fetch();
            }
                if (models.length == 0) return res.notFound();

                return res.view('person/sucess');

            }
        },

        // search function
        search: async function (req, res) {

            const qName = req.query.name || "";
            const qAge = parseInt(req.query.age);

            if (isNaN(qAge)) {

                var persons = await Person.find({
                    where: { name: { contains: qName } },
                    sort: 'name'
                });

            } else {

                var persons = await Person.find({
                    where: { name: { contains: qName }, age: qAge },
                    sort: 'name'
                });

            }

            return res.view('person/index', { 'persons': persons });
        },

        // action - admin
        admin: async function (req, res) {

            var persons = await Person.find();
            return res.view('person/admin', { 'persons': persons });

        },


    };

