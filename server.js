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
      position: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true }
    },
    organization: {
      name: { type: String, required: true },
      type: { type: String, required: true }
    },
    contributors: [
      {
        organization: { type: String },
        type: { type: String }
      }
    ]
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
    otherNames: [String],
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
    timeline: [
      {
        title: { type: String, required: true },
        year: { type: Number },
        briefDescription: { type: String },
        sources: { type: String }
      }
    ]
  },
  relevantFigures: [
    {
      name: { type: String, required: true },
      years: { type: String },
      role: { type: String },
      roleYears: { type: String },
      briefDescription: { type: String },
      sources: { type: String }
    }
  ]
});

const FormData = mongoose.model('FormData', formSchema);

// Serve the form
app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, 'form.html'));
});

// Extract dynamic contributors
const extractContributors = (fields) =>
  Object.keys(fields)
    .filter((key) => key.startsWith('organization_'))
    .map((key) => {
      const id = key.split('_')[1]; // Extract the counter number
      return {
        organization: fields[`organization_${id}`] || null,
        type: fields[`type_of_organization_${id}`] || null,
      };
    });

// Extract dynamic events
const extractEvents = (fields) =>
  Object.keys(fields)
    .filter((key) => key.startsWith('title_event_'))
    .map((key) => {
      const id = key.split('_')[2]; // Extract the counter number
      return {
        title: fields[`title_event_${id}`] || null,
        year: parseInt(fields[`event_year_${id}`]) || null,
        briefDescription: fields[`event_brief_description_${id}`] || null,
        sources: fields[`event_sources_description_${id}`] || null,
      };
    });

// Extract dynamic relevant figures
const extractRelevantFigures = (fields) =>
  Object.keys(fields)
    .filter((key) => key.startsWith('figure_name_'))
    .map((key) => {
      const id = key.split('_')[2]; // Extract the counter number
      return {
        name: fields[`figure_name_${id}`] || null,
        years: fields[`figure_years_${id}`] || null,
        role: fields[`figure_role_${id}`] || null,
        roleYears: fields[`figure_roleyears_${id}`] || null,
        briefDescription: fields[`figure_brief_description_${id}`] || null,
        sources: fields[`figure_sources_description_${id}`] || null,
      };
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
      position,
      email,
      phone,
      organization_p,
      type_of_organization_p,
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
      ...dynamicFields // Capture all dynamic fields
    } = req.body;

    // Extract dynamic fields
    const contributors = extractContributors(dynamicFields);
    const events = extractEvents(dynamicFields);
    const relevantFigures = extractRelevantFigures(dynamicFields);

    // Filter null or empty values from otherNames
    const otherNames = [
      other_school_name_1,
      other_school_name_2,
      other_school_name_3,
      other_school_name_4,
      other_school_name_5,
    ].filter(Boolean);

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
          position,
          email,
          phone,
        },
        organization: {
          name: organization_p,
          type: type_of_organization_p,
        },
        contributors: contributors || [],
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
        timeline: events || [],
      },
      relevantFigures: relevantFigures || [],
    });

    // Save to MongoDB
    await formData.save();
    res.send('Data successfully saved to MongoDB!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving data');
  }
});
