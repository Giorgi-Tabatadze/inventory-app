#! /usr/bin/env node

console.log(
  "This script populates some test helmets, helmet instances and categorys to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true",
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Helmet = require("./models/helmet");
var Category = require("./models/category");
var HelmetInstance = require("./models/helmetinstance");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var categories = [];
var helmets = [];
var helmetinstances = [];

function categoryCreate(name, cb) {
  var category = new Category({ name: name });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

function helmetCreate(name, description, price, code, category, photo, cb) {
  helmetdetail = {
    name: name,
    description: description,
    price: price,
    code: code,
    category: category,
    photo: photo,
  };

  var helmet = new Helmet(helmetdetail);
  helmet.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New helmet: " + helmet);
    helmets.push(helmet);
    cb(null, helmet);
  });
}

function helmetInstanceCreate(helmet, size, color, amount, photo, cb) {
  helmetinstancedetail = {
    helmet: helmet,
    size: size,
    color: color,
    amount: amount,
    photo: photo,
  };

  var helmetinstance = new HelmetInstance(helmetinstancedetail);
  helmetinstance.save(function (err) {
    if (err) {
      console.log("ERROR CREATING BookInstance: " + helmetinstance);
      cb(err, null);
      return;
    }
    console.log("New BookInstance: " + helmetinstance);
    helmetinstances.push(helmetinstance);
    cb(null, helmetinstance);
  });
}

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate("full face", callback);
      },
      function (callback) {
        categoryCreate("half", callback);
      },
      function (callback) {
        categoryCreate("open face", callback);
      },
    ],
    // optional callback
    cb,
  );
}

function createHelmets(cb) {
  async.parallel(
    [
      function (callback) {
        helmetCreate(
          "Daytona Skull Cap Solids",
          `Daytona Helmets Skull Cap motorcycle helmets are some of the smallest and lightest DOT approved helmets in the world. It's part of our slimline, a sleek contoured Half shell design, that is available in a range of styles.

          Skull Cap Helmets are for riders who don't want to sacrifice looks for protection. The extra low profile shell conforms to the shape of your head as much as possible while still meeting DOT standards. Eliminating the mushroom head look you get with other street legal helmets. Recessed trim enhances the sleek profile and the Skull Cap’s inverted contoured shape has a tapered rear edge that hugs your head for a much better look. A feature you won't see on other half shell helmets.
          Skull Caps come in three different shelf sizes to make sure that every rider gets that proportionate fit. So, as your head gets smaller the helmet shell size get smaller too. Inside the customer informed interior is padded with moisture wicking fabric that keeps your head cooler and more comfortable during those longer rides. The nylon Y-strap retention system has a sliding adjuster that let you position your Skull Cap exactly where you want it. Once the feels right, a quick release lock retention keeps the helmet secured in place. Most of our Skull Caps Helmets come in sizes 3XS - 4XL.
          
          When it comes to style, there are four families in the Skull Cap lineup. First up is the minimalist look, with your basic and custom colors. Most available with or without a removable snap on mini scoop visor.
          You get the same option with the gray Carbon Fiber model, which uses real carbon fiber with the tightest weave, engineered for above standard performance.
          Next is the Leather Covered option. Crafted with the finest New Zealand lamb hide for an authentic style. Also available with or without the visor.
          Finally you have a variety of Graphic designs to choose from so you can nail down the unique, head turning look at that fits your personality. Every helmet in the Skull Cap lineup comes with A head wrap and a cloth drawstring bag.
          
          Daytona helmets, leading the way in quality headgear.`,
          77.36,
          "DAYTONA-SKULLCAP",
          categories[1],
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetCreate(
          "Scorpion EXO-C110 Half Helmet",
          `The EXO-C110 is Scorpions next generation take on a classic helmet. The EXO110 features subtle modern lines, an advanced ventilation system, a dual EPS liner, and an improved SpeedView sunvisor mechanism. These features allow the EXO-C110 to provide a premium feel while maintaining the classic half helmet look and fit.`,
          134.95,
          "387-2S",
          categories[1],
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetCreate(
          "Scorpion EXO-CT220 Solid",
          `The all new EXO-CT220 was designed to offer a modern, protective and functional product for those riders that need more than just an old school open-face helmet. The versatile EXO-CT220 can be configured with a face shield for serious wind blocking or switch the shield for a sun blocking visor for more of that wind-in-your-face feel. The face shield is specially extended in length and reduces turbulence inside the helmet by re-directing the air flow under the helmet instead of the interior.`,
          159.95,
          "1438",
          categories[2],
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetCreate(
          "Arai Classic V Helmet",
          `CLASSIC-V
          Heritage styling with modern luxuries. Traditional stitched faux leather edge trim. Faux leather interior accents. Behind the vintage look are modern technologies. Patented hidden interior ventilation. Arai's uncompromising level of quality and protection. The Classic-V: Look cool. Stay cool.
          
          Sizes: XS-XXL
          
          WARNING: Fluorescent and/or bright finishes fade over time and exposure to sunlight. This is normal and is not covered by warranty.`,
          489.95,
          "2371",
          categories[2],
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetCreate(
          "Arai Quantum-X Drone Fluorescent Yellow Frost Helmet",
          `QUANTUM-X
          Purpose-built for the street. A new benchmark in comfort, quiet, stability and ventilation. Arai applied the same tireless 24-7 focus devoted to our race helmets to designing it, refining and adapting proven concepts to a new purpose. On the rounder end of the head shape spectrum, the Quantum series has always been the "go-to" helmet of choice. The new Quantum-X brings that shape back in a feature rich package.
          
          Sizes: XS - XXL
          
          WARNING: Fluorescent and/or bright finishes fade over time and exposure to sunlight. This is normal and is not covered by warranty.
          
          QUANTUM-X FIT
          ARAI IS THE ONLY COMPANY OFFERING MULTIPLE INTERIOR-FIT SHAPES TO BETTER ADDRESS THE INFINITE VARIETY OF RIDERS? HEAD SHAPES AND SIZES.
          
          No one pays more attention to the subtle variations and infinite possibilities of the human head shape than Arai. Why? Because its the secret to getting the best comfort and fit.
          
          And Arai is nothing short of obsessed with putting you into the best fitting, most comfortable helmet possible ? because that?s who we are.
          
          
          The Quantum-X has Arai's ROUND OVAL (RO) interior fit shape.  Shorter front-to-back and a little wider side-to-side (as compared to Intermediate Oval).*`,
          849.95,
          "2147-2567-2",
          categories[0],
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetCreate(
          "HJC i10 Full-face Helmet",
          `Built to replace the CL-17, one of HJC’s best sellers, the i10 is bringing a new level of performance to the HJC lineup. The compact, modern design allows you to take to the streets in style, while still maintaining an accessible price point for the everyday rider. Improved ventilation from new intakes and exhausts increases airflow while maintenance is made easy with simple, snap-on top vents. The i10 is Bluetooth compatible with SmartHJC, available in sizes XS-3XL standard DOT & SNELL approved.`,
          159.99,
          "152518",
          categories[0],
          undefined,
          callback,
        );
      },
    ],
    // optional callback
    cb,
  );
}

function createHelmetInstances(cb) {
  async.parallel(
    [
      function (callback) {
        helmetInstanceCreate(
          helmets[0],
          "small",
          "Dull Black w/visor",
          5,
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetInstanceCreate(
          helmets[0],
          "small",
          "Pink w/visor",
          6,
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetInstanceCreate(
          helmets[0],
          "small",
          "white w/visor",
          2,
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetInstanceCreate(
          helmets[0],
          "medium",
          "white w/visor",
          2,
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetInstanceCreate(
          helmets[1],
          "small",
          "white",
          2,
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetInstanceCreate(
          helmets[1],
          "small",
          "black",
          4,
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetInstanceCreate(
          helmets[1],
          "medium",
          "black",
          5,
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetInstanceCreate(
          helmets[2],
          "small",
          "white",
          2,
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetInstanceCreate(
          helmets[2],
          "small",
          "black",
          4,
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetInstanceCreate(
          helmets[2],
          "medium",
          "white",
          4,
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetInstanceCreate(
          helmets[2],
          "medium",
          "black",
          4,
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetInstanceCreate(
          helmets[3],
          "small",
          "black",
          4,
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetInstanceCreate(
          helmets[3],
          "small",
          "copper frost",
          2,
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetInstanceCreate(
          helmets[3],
          "medium",
          "black",
          4,
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetInstanceCreate(
          helmets[3],
          "medium",
          "copper frost",
          2,
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetInstanceCreate(
          helmets[4],
          "small",
          "yellow",
          3,
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetInstanceCreate(
          helmets[4],
          "medium",
          "yellow",
          3,
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetInstanceCreate(
          helmets[5],
          "small",
          "white",
          5,
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetInstanceCreate(
          helmets[5],
          "small",
          "black",
          2,
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetInstanceCreate(
          helmets[5],
          "medium",
          "black",
          2,
          undefined,
          callback,
        );
      },
      function (callback) {
        helmetInstanceCreate(
          helmets[5],
          "medium",
          "white",
          2,
          undefined,
          callback,
        );
      },
    ],
    // Optional callback
    cb,
  );
}

async.series(
  [createCategories, createHelmets, createHelmetInstances],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("BOOKInstances: " + helmetinstances);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  },
);
