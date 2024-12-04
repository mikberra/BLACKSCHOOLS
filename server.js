const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://mikberra:brooklynCS1@lab6cluster.w1enu.mongodb.net/BLACKSCHOOLS?retryWrites=true&w=majority&appName=Lab6Cluster');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware Set Up
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// GeoJSON for map
// Define schema for GeoJSON data
const geoSchema = new mongoose.Schema({
  type: { type: String, default: "Feature" },
  properties: { type: Object },
  geometry: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  }
}, { collection: 'Brooklyn' }); //To be changed when integrate

const GeoModel = mongoose.model('GeoCollection', geoSchema);

// 
app.use(express.static(path.join(__dirname, '')));


//navigation

app.get('/homepage', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/CS', (req, res) => {
  res.sendFile(path.join(__dirname, 'CS3.html'));
});

app.get('/contribute', (req, res) => {
  res.sendFile(path.join(__dirname, 'contribute.html'));
});

app.get('/contribute_', (req, res) => {
  res.sendFile(path.join(__dirname, 'contribute_city.html'));
});



// API endpoint to get all GeoJSON data
app.get('/api/geojson', async (req, res) => {
  try {
    const features = await GeoModel.find();
    res.json({
      type: "FeatureCollection",
      features: features
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Main form schema for submitting schools
const formSchema = new mongoose.Schema({
  generalInformation: {
    areaOfWork: { type: String, required: true },
    city: { type: String },
    county: { type: String, required: true },
    neighborhood: { type: String },
    state: { type: String, required: true }
  },
  contacts: {
    contactPerson: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true }
    },
    organization: {
      name: { type: String, required: true },
      type: { type: String, required: true }
    },
    contributors: {
      contributor1: {
        organization: { type: String },
        type: { type: String }
      },
      contributor2: {
        organization: { type: String },
        type: { type: String }
      },
      contributor3: {
        organization: { type: String },
        type: { type: String }
      },
      contributor4: {
        organization: { type: String },
        type: { type: String }
      },
      contributor5: {
        organization: { type: String },
        type: { type: String }
      }
    }
  },
  school: {
    name: { type: String, required: true },
    location: geoSchema,
    address: { type: String, required: true },
    city: { type: String },
    county: { type: String, required: true },
    neighborhood: { type: String },
    state: { type: String },
    currentUse: { type: String },
    condition: { type: String, required: true },
    landmarked: { type: String, required: true },
    landmarkedBy: { type: String },
    sign: { type: String, required: true },
    owner: { type: String },
    otherNames: {
      name1: { type: String },
      name2: { type: String },
      name3: { type: String },
      name4: { type: String },
      name5: { type: String }
    },
    description: {
      yearInstitutionCreation: { type: Number },
      yearBuildingStarted: { type: Number },
      yearBuildingEnded: { type: Number },
      yearDesegregation: { type: Number },
      yearCeased: { type: Number },
      yearDemolished: { type: Number },
      briefDescription: { type: String },
      sources: { type: String }
    },
    timeline: {
      event1: {
        title: { type: String },
        year: { type: Number },
        briefDescription: { type: String },
        sources: { type: String }
      },
      event2: {
        title: { type: String },
        year: { type: Number },
        briefDescription: { type: String },
        sources: { type: String }
      },
      event3: {
        title: { type: String },
        year: { type: Number },
        briefDescription: { type: String },
        sources: { type: String }
      },
      event4: {
        title: { type: String },
        year: { type: Number },
        briefDescription: { type: String },
        sources: { type: String }
      },
      event5: {
        title: { type: String },
        year: { type: Number },
        briefDescription: { type: String },
        sources: { type: String }
      },
      event6: {
        title: { type: String },
        year: { type: Number },
        briefDescription: { type: String },
        sources: { type: String }
      },
      event7: {
        title: { type: String },
        year: { type: Number },
        briefDescription: { type: String },
        sources: { type: String }
      },
      event8: {
        title: { type: String },
        year: { type: Number },
        briefDescription: { type: String },
        sources: { type: String }
      },
      event9: {
        title: { type: String },
        year: { type: Number },
        briefDescription: { type: String },
        sources: { type: String }
      },
      event10: {
        title: { type: String },
        year: { type: Number },
        briefDescription: { type: String },
        sources: { type: String }
      }
    }
  },
  relevantFigures: {
    figure1: {
      name: { type: String },
      years: { type: String },
      role: { type: String },
      roleYears: { type: String },
      briefDescription: { type: String },
      sources: { type: String }
    },
    figure2: {
      name: { type: String },
      years: { type: String },
      role: { type: String },
      roleYears: { type: String },
      briefDescription: { type: String },
      sources: { type: String }
    },
    figure3: {
      name: { type: String },
      years: { type: String },
      role: { type: String },
      roleYears: { type: String },
      briefDescription: { type: String },
      sources: { type: String }
    },
    figure4: {
      name: { type: String },
      years: { type: String },
      role: { type: String },
      roleYears: { type: String },
      briefDescription: { type: String },
      sources: { type: String }
    },
    figure5: {
      name: { type: String },
      years: { type: String },
      role: { type: String },
      roleYears: { type: String },
      briefDescription: { type: String },
      sources: { type: String }
    }
  }
});


const FormData = mongoose.model('FormData', formSchema);

// Serve the form
app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, 'form.html'));
});


app.post('/submit', async (req, res) => {
  try {
    const {
      area_of_work,
      city,
      borough_county,
      neighborhood,
      state,
      contact_name,
      email,
      phone,
      organization_p,
      type_of_organization_p,
      organization_1,
      organization_2,
      organization_3,
      organization_4,
      organization_5,
      type_of_organization_1,
      type_of_organization_2,
      type_of_organization_3,
      type_of_organization_4,
      type_of_organization_5,
      school_name,
      other_school_name_1,
      other_school_name_2,
      other_school_name_3,
      other_school_name_4,
      other_school_name_5,
      lon,
      lat,
      address,
      school_city,
      school_borough_county,
      school_neighborhood,
      school_state,
      current_use,
      current_state,
      landmarked,
      landmarked_by,
      sign,
      owner,
      event_title_1,
      event_year_1,
      event_brief_description_1,
      event_sources_1,
      event_title_2,
      event_year_2,
      event_brief_description_2,
      event_sources_2,
      event_title_3,
      event_year_3,
      event_brief_description_3,
      event_sources_3,
      event_title_4,
      event_year_4,
      event_brief_description_4,
      event_sources_4,
      event_title_5,
      event_year_5,
      event_brief_description_5,
      event_sources_5,
      event_title_6,
      event_year_6,
      event_brief_description_6,
      event_sources_6,
      event_title_7,
      event_year_7,
      event_brief_description_7,
      event_sources_7,
      event_title_8,
      event_year_8,
      event_brief_description_8,
      event_sources_8,
      event_title_9,
      event_year_9,
      event_brief_description_9,
      event_sources_9,
      event_title_10,
      event_year_10,
      event_brief_description_10,
      event_sources_10,
      figure_name_1,
      figure_years_1,
      figure_role_1,
      figure_roleyears_1,
      figure_brief_description_1,
      figure_sources_description_1,
      figure_name_2,
      figure_years_2,
      figure_role_2,
      figure_roleyears_2,
      figure_brief_description_2,
      figure_sources_description_2,
      figure_name_3,
      figure_years_3,
      figure_role_3,
      figure_roleyears_3,
      figure_brief_description_3,
      figure_sources_description_3,
      figure_name_4,
      figure_years_4,
      figure_role_4,
      figure_roleyears_4,
      figure_brief_description_4,
      figure_sources_description_4,
      figure_name_5,
      figure_years_5,
      figure_role_5,
      figure_roleyears_5,
      figure_brief_description_5,
      figure_sources_description_5,
      year_institution_creation,
      year_building_started,
      year_building_ended,
      year_desegration,
      year_ceased,
      year_demolished,
      brief_description,
      sources_description,
    } = req.body;

    // Normalize input
    const normalizeField = (field) => field?.trim() || null;

    const contributors = {};
    for (let i = 1; i <= 5; i++) {
      const org = normalizeField(req.body[`organization_${i}`]);
      const type = normalizeField(req.body[`type_of_organization_${i}`]);
      if (org) {
        contributors[`contributor${i}`] = { organization: org, type: type || null };
      }
    }

    const otherNames = {};
    for (let i = 1; i <= 5; i++) {
      const name = normalizeField(req.body[`other_school_name_${i}`]);
      if (name) {
        otherNames[`name${i}`] = name;
      }
    }

    const timeline = {};
    for (let i = 1; i <= 10; i++) {
      const title = normalizeField(req.body[`event_title_${i}`]);
      const year = normalizeField(req.body[`event_year_${i}`]);
      const description = normalizeField(req.body[`event_brief_description_${i}`]);
      const sources = normalizeField(req.body[`event_sources_${i}`]);
      if (title) {
        timeline[`event${i}`] = { title, year, briefDescription: description, sources };
      }
    }

    const relevantFigures = {};
    for (let i = 1; i <= 5; i++) {
      const name = normalizeField(req.body[`figure_name_${i}`]);
      const years = normalizeField(req.body[`figure_years_${i}`]);
      const role = normalizeField(req.body[`figure_role_${i}`]);
      const roleYears = normalizeField(req.body[`figure_roleyears_${i}`]);
      const description = normalizeField(req.body[`figure_brief_description_${i}`]);
      const sources = normalizeField(req.body[`figure_sources_description_${i}`]);
      if (name) {
        relevantFigures[`figure${i}`] = { name, years, role, roleYears, briefDescription: description, sources };
      }
    }

    const formData = new FormData({
      generalInformation: {
        areaOfWork: area_of_work,
        city,
        county: borough_county,
        neighborhood,
        state,
      },
      contacts: {
        contactPerson: {
          name: contact_name,
          email,
          phone,
        },
        organization: {
          name: organization_p,
          type: type_of_organization_p,
        },
        contributors,
      },
      school: {
        name: school_name,
        location: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [parseFloat(lon), parseFloat(lat)],
          },
          properties: {},
        },
        address,
        city: school_city,
        county: school_borough_county,
        neighborhood: school_neighborhood,
        state: school_state,
        currentUse: current_use,
        condition: current_state,
        landmarked,
        landmarkedBy: landmarked_by,
        sign,
        owner,
        otherNames,
        description: {
          yearInstitutionCreation: year_institution_creation,
          yearBuildingStarted: year_building_started,
          yearBuildingEnded: year_building_ended,
          yearDesegregation: year_desegration,
          yearCeased: year_ceased,
          yearDemolished: year_demolished,
          briefDescription: brief_description,
          sources: sources_description,
        },
        timeline,
      },
      relevantFigures,
    });

    // Save to MongoDB
    await formData.save();
    res.send('Data successfully saved to MongoDB!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving data');
  }
});




//Submit contributors

//Set up general scheme
const formSchema_cont = new mongoose.Schema({
  generalInformation: {
    areaOfWork: { type: String, required: true },
    city: { type: String },
    county: { type: String, required: true },
    neighborhood: { type: String },
    state: { type: String, required: true }
  },
  contacts: {
    contactPerson: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true }
    },
    organization: {
      name: { type: String, required: true },
      type: { type: String, required: true }
    },
    contributors: {
      contributor1: {
        organization: { type: String },
        type: { type: String }
      },
      contributor2: {
        organization: { type: String },
        type: { type: String }
      },
      contributor3: {
        organization: { type: String },
        type: { type: String }
      },
      contributor4: {
        organization: { type: String },
        type: { type: String }
      },
      contributor5: {
        organization: { type: String },
        type: { type: String }
      }
    }
  }
});

const FormDataCont = mongoose.model('FormDataCont', formSchema_cont);


// Serve the form
app.get('/form_cont', (req, res) => {
  res.sendFile(path.join(__dirname, 'form_cont.html'));
});

//Submit
app.post('/submit_cont', async (req, res) => {
  try {
    // Normalize input fields
    const area_of_work = req.body.area_of_work?.trim() || null;
    const city = req.body.city?.trim() || null;
    const borough_county = req.body.borough_county?.trim() || null;
    const neighborhood = req.body.neighborhood?.trim() || null;
    const state = req.body.state?.trim() || null;
    const contact_name = req.body.contact_name?.trim() || null;
    const email = req.body.email?.trim() || null;
    const phone = req.body.phone?.trim() || null;
    const organization_p = req.body.organization_p?.trim() || null;
    const type_of_organization_p = req.body.type_of_organization_p?.trim() || null;

    const organization_1 = req.body.organization_1?.trim() || null;
    const type_of_organization_1 = req.body.type_of_organization_1?.trim() || null;

    const organization_2 = req.body.organization_2?.trim() || null;
    const type_of_organization_2 = req.body.type_of_organization_2?.trim() || null;

    const organization_3 = req.body.organization_3?.trim() || null;
    const type_of_organization_3 = req.body.type_of_organization_3?.trim() || null;

    const organization_4 = req.body.organization_4?.trim() || null;
    const type_of_organization_4 = req.body.type_of_organization_4?.trim() || null;

    const organization_5 = req.body.organization_5?.trim() || null;
    const type_of_organization_5 = req.body.type_of_organization_5?.trim() || null;

    // Create contributors object, including only those with non-empty organization_X
    const contributors = {};
    if (organization_1) {
      contributors.contributor1 = { organization: organization_1, type: type_of_organization_1 || null };
    }
    if (organization_2) {
      contributors.contributor2 = { organization: organization_2, type: type_of_organization_2 || null };
    }
    if (organization_3) {
      contributors.contributor3 = { organization: organization_3, type: type_of_organization_3 || null };
    }
    if (organization_4) {
      contributors.contributor4 = { organization: organization_4, type: type_of_organization_4 || null };
    }
    if (organization_5) {
      contributors.contributor5 = { organization: organization_5, type: type_of_organization_5 || null };
    }

    // Construct the MongoDB document
    const formDataCont = new FormDataCont({
      generalInformation: {
        areaOfWork: area_of_work,
        city,
        county: borough_county,
        neighborhood,
        state,
      },
      contacts: {
        contactPerson: {
          name: contact_name,
          email,
          phone,
        },
        organization: {
          name: organization_p,
          type: type_of_organization_p,
        },
        contributors, // Includes only contributors with non-empty organizations
      },
    });

    // Save to MongoDB
    await formDataCont.save();
    res.send('Data successfully saved to MongoDB!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving data');
  }
});







// Main form schema for submitting local context
const formSchemaContext = new mongoose.Schema({
  generalInformation: {
    areaOfWork: { type: String, required: true },
    city: { type: String },
    county: { type: String, required: true },
    neighborhood: { type: String },
    state: { type: String, required: true },
  },
  timeline: {
    event1: {
      title: { type: String },
      year: { type: Number },
      briefDescription: { type: String },
      sources: { type: String },
    },
    event2: {
      title: { type: String },
      year: { type: Number },
      briefDescription: { type: String },
      sources: { type: String },
    },
    event3: {
      title: { type: String },
      year: { type: Number },
      briefDescription: { type: String },
      sources: { type: String },
    },
    event4: {
      title: { type: String },
      year: { type: Number },
      briefDescription: { type: String },
      sources: { type: String },
    },
    event5: {
      title: { type: String },
      year: { type: Number },
      briefDescription: { type: String },
      sources: { type: String },
    },
    event6: {
      title: { type: String },
      year: { type: Number },
      briefDescription: { type: String },
      sources: { type: String },
    },
    event7: {
      title: { type: String },
      year: { type: Number },
      briefDescription: { type: String },
      sources: { type: String },
    },
    event8: {
      title: { type: String },
      year: { type: Number },
      briefDescription: { type: String },
      sources: { type: String },
    },
    event9: {
      title: { type: String },
      year: { type: Number },
      briefDescription: { type: String },
      sources: { type: String },
    },
    event10: {
      title: { type: String },
      year: { type: Number },
      briefDescription: { type: String },
      sources: { type: String },
    },
  },
});

const FormDataContext = mongoose.model('FormDataContext', formSchemaContext);

// Serve the form
app.get('/form_context', (req, res) => {
  res.sendFile(path.join(__dirname, 'form_context.html'));
});

app.post('/submit_context', async (req, res) => {
  try {
    // Normalize input fields inline
    const area_of_work = req.body.area_of_work?.trim() || null;
    const city = req.body.city?.trim() || null;
    const borough_county = req.body.borough_county?.trim() || null;
    const neighborhood = req.body.neighborhood?.trim() || null;
    const state = req.body.state?.trim() || null;

    // Create an array of events and filter valid ones
    const events = [
      {
        title: req.body.event_title_1?.trim() || null,
        year: req.body.event_year_1 ? parseInt(req.body.event_year_1, 10) : null,
        briefDescription: req.body.event_brief_description_1?.trim() || null,
        sources: req.body.event_sources_1?.trim() || null,
      },
      {
        title: req.body.event_title_2?.trim() || null,
        year: req.body.event_year_2 ? parseInt(req.body.event_year_2, 10) : null,
        briefDescription: req.body.event_brief_description_2?.trim() || null,
        sources: req.body.event_sources_2?.trim() || null,
      },
      {
        title: req.body.event_title_3?.trim() || null,
        year: req.body.event_year_3 ? parseInt(req.body.event_year_3, 10) : null,
        briefDescription: req.body.event_brief_description_3?.trim() || null,
        sources: req.body.event_sources_3?.trim() || null,
      },
      {
        title: req.body.event_title_4?.trim() || null,
        year: req.body.event_year_4 ? parseInt(req.body.event_year_4, 10) : null,
        briefDescription: req.body.event_brief_description_4?.trim() || null,
        sources: req.body.event_sources_4?.trim() || null,
      },
      {
        title: req.body.event_title_5?.trim() || null,
        year: req.body.event_year_5 ? parseInt(req.body.event_year_5, 10) : null,
        briefDescription: req.body.event_brief_description_5?.trim() || null,
        sources: req.body.event_sources_5?.trim() || null,
      },
      {
        title: req.body.event_title_6?.trim() || null,
        year: req.body.event_year_6 ? parseInt(req.body.event_year_6, 10) : null,
        briefDescription: req.body.event_brief_description_6?.trim() || null,
        sources: req.body.event_sources_6?.trim() || null,
      },
      {
        title: req.body.event_title_7?.trim() || null,
        year: req.body.event_year_7 ? parseInt(req.body.event_year_7, 10) : null,
        briefDescription: req.body.event_brief_description_7?.trim() || null,
        sources: req.body.event_sources_7?.trim() || null,
      },
      {
        title: req.body.event_title_8?.trim() || null,
        year: req.body.event_year_8 ? parseInt(req.body.event_year_8, 10) : null,
        briefDescription: req.body.event_brief_description_8?.trim() || null,
        sources: req.body.event_sources_8?.trim() || null,
      },
      {
        title: req.body.event_title_9?.trim() || null,
        year: req.body.event_year_9 ? parseInt(req.body.event_year_9, 10) : null,
        briefDescription: req.body.event_brief_description_9?.trim() || null,
        sources: req.body.event_sources_9?.trim() || null,
      },
      {
        title: req.body.event_title_10?.trim() || null,
        year: req.body.event_year_10 ? parseInt(req.body.event_year_10, 10) : null,
        briefDescription: req.body.event_brief_description_10?.trim() || null,
        sources: req.body.event_sources_10?.trim() || null,
      },
    ];

    // Construct timeline object by including only events with a defined title
    const timeline = {};
    events.forEach((event, index) => {
      if (event.title) {
        timeline[`event${index + 1}`] = event;
      }
    });

    // Construct the MongoDB document
    const formDataContext = new FormDataContext({
      generalInformation: {
        areaOfWork: area_of_work,
        city,
        county: borough_county,
        neighborhood,
        state,
      },
      timeline, // Includes only events with a defined title
    });

    // Save to MongoDB
    await formDataContext.save();
    res.send('Data successfully saved to MongoDB!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving data');
  }
});








// add html path in server.js
app.get('/test', (req, res) => {
  res.sendFile(__dirname + '/test.html');
  });
  // API endpoint to get data by _id
  app.get('/api/location/:id', async (req, res) => {
  try {
  const feature = await GeoModel.findById(req.params.id);
  if (feature) {
  res.json(feature);
  } else {
  res.status(404).json({ error: 'Data not found' });
  }
  } catch (error) {
  res.status(500).json({ error: 'Failed to fetch data' });
  }
  });