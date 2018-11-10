/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function(done) {


  sails.getInvalidIdMsg = function (opts) {

    if (opts.id && isNaN(parseInt(opts.id))) {
        return "Primary key specfied is invalid (incorrect type).";
    }

    if (opts.fk && isNaN(parseInt(opts.fk))) {
        return "Foreign key specfied is invalid (incorrect type).";
    }

    return null;        // falsy

}


  if (await Person.count() > 0) {
    return done();
}

await Person.createEach([
  {"name":"event1","short_des":"this is short       ","full_des":"this is full                ","img":"https://sa.hkbu.edu.hk/f/ccl_event_file/4461/640p0/CCL18190082-20181011161500.jpg","org":"Department of Music","date":"2018-10-23","time":"12:44","venue":"AC_hall","quota":90,"highlight":"true"},
  {"name":"event2","short_des":"this is short       ","full_des":"this is full                ","img":"https://sa.hkbu.edu.hk/f/ccl_event_file/4461/640p0/CCL18190082-20181011161500.jpg","org":"Department of Music","date":"2018-10-23","time":"12:44","venue":"AC_hall","quota":90,"highlight":"true"}
    // etc.
]);

await User.createEach([
  { username : "admin", password : "123456", usertype : "admin"},
  { username: "stu1", password: "123456", usertype : "student"},
  { username: "stu2", password: "123456", usertype : "student"}
  // etc.
]);

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return done();
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap)




  const event1 = await Person.findOne({name: "event1"});
  const event2 = await Person.findOne({name: "event2"});
  const admin = await User.findOne({username: "admin"});
  const student1 = await User.findOne({username: "stu1"});
  
  await User.addToCollection(student1.id, 'supervises').members(event1.id);

  await User.addToCollection(admin.id, 'supervises').members([student1.id, event1.id,event2.id]);



  return done();



};
