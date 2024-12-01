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

// Define schema for GeoJSON data
const geoSchema = new mongoose.Schema({
  type: { type: String, default: "Feature" },
  properties: { type: Object },
  geometry: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  }
}, { collection: 'Brooklyn' });

const GeoModel = mongoose.model('GeoCollection', geoSchema);


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

// Main form schema
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
      year_institution_creation,
      year_building_started,
      year_building_ended,
      year_desegration,
      year_ceased,
      year_demolished,
      brief_description,
      sources_description,
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
    } = req.body;

    // Construct the MongoDB document
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
        contributors: {
          contributor1: {
            organization: organization_1,  // e.g., "Local School"
            type: type_of_organization_1  // e.g., "School"
          },
          contributor2: {
            organization: organization_2,
            type: type_of_organization_2
          },
          contributor3: {
            organization: organization_3,
            type: type_of_organization_3
          },
          contributor4: {
            organization: organization_4,
            type: type_of_organization_4
          },
          contributor5: {
            organization: organization_5,
            type: type_of_organization_5
          }
        }
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
        otherNames: {
          name1: other_school_name_1,
          name2: other_school_name_2,
          name3: other_school_name_3,
          name4: other_school_name_4,
          name5: other_school_name_5,
        },
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
        timeline: {
          event1: {
            title: event_title_1,
            year: event_year_1,
            briefDescription: event_brief_description_1,
            sources: event_sources_1
          },
          event2: {
            title: event_title_2,
            year: event_year_2,
            briefDescription: event_brief_description_2,
            sources: event_sources_2
          },
          event3: {
            title: event_title_3,
            year: event_year_3,
            briefDescription: event_brief_description_3,
            sources: event_sources_3
          },
          event4: {
            title: event_title_4,
            year: event_year_4,
            briefDescription: event_brief_description_4,
            sources: event_sources_4
          },
          event5: {
            title: event_title_5,
            year: event_year_5,
            briefDescription: event_brief_description_5,
            sources: event_sources_5
          },
          event6: {
            title: event_title_6,
            year: event_year_6,
            briefDescription: event_brief_description_6,
            sources: event_sources_6
          },
          event7: {
            title: event_title_7,
            year: event_year_7,
            briefDescription: event_brief_description_7,
            sources: event_sources_7
          },
          event8: {
            title: event_title_8,
            year: event_year_8,
            briefDescription: event_brief_description_8,
            sources: event_sources_8
          },
          event9: {
            title: event_title_9,
            year: event_year_9,
            briefDescription: event_brief_description_9,
            sources: event_sources_9
          },
          event10: {
            title: event_title_10,
            year: event_year_10,
            briefDescription: event_brief_description_10,
            sources: event_sources_10
          }
        },
        relevantFigures: {
          figure1: {
            name: figure_name_1,
            years: figure_years_1,
            role: figure_role_1,
            roleYears: figure_roleyears_1,
            briefDescription: figure_brief_description_1,
            sources: figure_sources_description_1
          },
          figure2: {
            name: figure_name_2,
            years: figure_years_2,
            role: figure_role_2,
            roleYears: figure_roleyears_2,
            briefDescription: figure_brief_description_2,
            sources: figure_sources_description_2
          },
          figure3: {
            name: figure_name_3,
            years: figure_years_3,
            role: figure_role_3,
            roleYears: figure_roleyears_3,
            briefDescription: figure_brief_description_3,
            sources: figure_sources_description_3
          },
          figure4: {
            name: figure_name_4,
            years: figure_years_4,
            role: figure_role_4,
            roleYears: figure_roleyears_4,
            briefDescription: figure_brief_description_4,
            sources: figure_sources_description_4
          },
          figure5: {
            name: figure_name_5,
            years: figure_years_5,
            role: figure_role_5,
            roleYears: figure_roleyears_5,
            briefDescription: figure_brief_description_5,
            sources: figure_sources_description_5
          }
        }
      }
    });

    // Save to MongoDB
    await formData.save();
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
