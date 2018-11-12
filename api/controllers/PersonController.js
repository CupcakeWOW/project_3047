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
            limit: 4
           
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

    // reg
  
  
    
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

        var persons = await Person.find();
        return res.view('person/search', { 'persons': persons });

    },



    // search result function 
    search_result :async function (req, res) {

        const qname = req.query.name || "";
        const qorganizer = req.query.org || "";
        const qvenue = req.query.venue || "";
        const qSD = req.query.sdate || "";
        const qED = req.query.edate || "";

        console.log(qname, qorganizer, qvenue, qSD, qED)

        const qPage = Math.max(req.query.page - 1, 0) || 0;

        const numOfItemsPerPage = 2;
        
        if (qSD != "" && qED != ""){
            var persons = await Person.find({
                where: { name: { contains: qname }, org: { contains: qorganizer }, venue: { contains: qvenue }, date: { "<=": qED, ">=": qSD } },
                limit: numOfItemsPerPage,
                skip: numOfItemsPerPage * qPage
            })
            var count = await Person.find({
                where: { name: { contains: qname }, org: { contains: qorganizer }, venue: { contains: qvenue }, date: { "<=": qED, ">=": qSD } },
            })

        } else if (qSD == "" && qED != "") {
            var persons = await Person.find({
                where: { name: { contains: qname }, org: { contains: qorganizer }, venue: { contains: qvenue }, date: { "<=": qED } },
                limit: numOfItemsPerPage,
                skip: numOfItemsPerPage * qPage
            })
            var count = await Person.find({
                where: { name: { contains: qname }, org: { contains: qorganizer }, venue: { contains: qvenue }, date: { "<=": qED } },
            })
        } else if (qSD != "" && qED == "") {
            var persons = await Person.find({
                where: { name: { contains: qname }, org: { contains: qorganizer }, venue: { contains: qvenue }, date: { ">=": qSD } },
                limit: numOfItemsPerPage,
                skip: numOfItemsPerPage * qPage
            })
            var count = await Person.find({
                where: { name: { contains: qname }, org: { contains: qorganizer }, venue: { contains: qvenue }, date: { ">=": qSD } },
            })
        } else {
            var persons = await Person.find({
                where: { name: { contains: qname }, org: { contains: qorganizer }, venue: { contains: qvenue } },
                limit: numOfItemsPerPage,
                skip: numOfItemsPerPage * qPage
            })
            var count = await Person.find({
                where: { name: { contains: qname }, org: { contains: qorganizer }, venue: { contains: qvenue } },
            })
        }

        console.log(persons)

        var numOfPage = Math.ceil(await count.length / numOfItemsPerPage);

        return res.view('person/search_result', { 'Persons': persons, 'count': numOfPage });


    },

    // action - admin
    admin: async function (req, res) {

        var persons = await Person.find();
        return res.view('person/admin', { 'persons': persons });

    },

    //

    populate: async function (req, res) {

        if (!['worksFor'].includes(req.params.association)) return res.notFound();
    
        const message = sails.getInvalidIdMsg(req.params);
    
        if (message) return res.badRequest(message);
    
        var model = await Person.findOne(req.params.id).populate(req.params.association);
    
        if (!model) return res.notFound();
    
        console.log(model.worksFor);

        return res.view('person/reg2', { 'person': model.worksFor });
    
    },


};

