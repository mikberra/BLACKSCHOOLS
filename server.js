const fs = require('fs');
const mongoose = require('mongoose');

// MongoDB connection with error handling
mongoose.connect('mongodb+srv://mikberra:brooklynCS1@lab6cluster.w1enu.mongodb.net/BLACKSCHOOLS?retryWrites=true&w=majority&appName=Lab6Cluster')
.then(() => {
  console.log('Successfully connected to MongoDB.');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Create uploads_maps directory if it doesn't exist
const uploadMapsDir = 'uploads_maps';
if (!fs.existsSync(uploadMapsDir)){
    fs.mkdirSync(uploadMapsDir);
}

// ... existing imports ...
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');  // Add this line

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

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
}, { collection: 'formdatas' }); // This should match your MongoDB collection name

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
    // Add logging to debug
    console.log('Fetching GeoJSON data...');
    
    // Use the FormData model instead of GeoModel since the location data is nested
    const features = await FormData.find({}, {
      'school.location': 1 // Only fetch the location field
    });
    
    // Transform the data to GeoJSON format
    const geoJsonFeatures = features
      .filter(doc => doc.school && doc.school.location) // Filter out documents without location
      .map(doc => ({
        type: 'Feature',
        properties: {
          name: doc.school.name,
          // Add any other properties you want to include
        },
        geometry: doc.school.location.geometry
      }));

    // Send the GeoJSON response
    res.json({
      type: "FeatureCollection",
      features: geoJsonFeatures
    });
    
    console.log(`Found ${geoJsonFeatures.length} features`);
  } catch (error) {
    console.error('Error fetching GeoJSON:', error);
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
      sources: { type: String },
      image: { type: String },
      footnote: { type: String },
      imageSources: { type: String }
    },
    timeline: {
      event1: {
        title: { type: String },
        year: { type: Number },
        briefDescription: { type: String },
        sources: { type: String },
        image: { type: String },
        footnote: { type: String },
        imageSources: { type: String }
      },
      event2: {
        title: { type: String },
        year: { type: Number },
        briefDescription: { type: String },
        sources: { type: String },
        image: { type: String },
        footnote: { type: String },
        imageSources: { type: String }
      },
      event3: {
        title: { type: String },
        year: { type: Number },
        briefDescription: { type: String },
        sources: { type: String },
        image: { type: String },
        footnote: { type: String },
        imageSources: { type: String }
      },
      event4: {
        title: { type: String },
        year: { type: Number },
        briefDescription: { type: String },
        sources: { type: String },
        image: { type: String },
        footnote: { type: String },
        imageSources: { type: String }
      },
      event5: {
        title: { type: String },
        year: { type: Number },
        briefDescription: { type: String },
        sources: { type: String },
        image: { type: String },
        footnote: { type: String },
        imageSources: { type: String }
      },
      event6: {
        title: { type: String },
        year: { type: Number },
        briefDescription: { type: String },
        sources: { type: String },
        image: { type: String },
        footnote: { type: String },
        imageSources: { type: String }
      },
      event7: {
        title: { type: String },
        year: { type: Number },
        briefDescription: { type: String },
        sources: { type: String },
        image: { type: String },
        footnote: { type: String },
        imageSources: { type: String }
      },
      event8: {
        title: { type: String },
        year: { type: Number },
        briefDescription: { type: String },
        sources: { type: String },
        image: { type: String },
        footnote: { type: String },
        imageSources: { type: String }
      },
      event9: {
        title: { type: String },
        year: { type: Number },
        briefDescription: { type: String },
        sources: { type: String },
        image: { type: String },
        footnote: { type: String },
        imageSources: { type: String }
      },
      event10: {
        title: { type: String },
        year: { type: Number },
        briefDescription: { type: String },
        sources: { type: String },
        image: { type: String },
        footnote: { type: String },
        imageSources: { type: String }
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
      sources: { type: String },
      image: { type: String },
      footnote: { type: String },
      imageSources: { type: String }
    },
    figure2: {
      name: { type: String },
      years: { type: String },
      role: { type: String },
      roleYears: { type: String },
      briefDescription: { type: String },
      sources: { type: String },
      image: { type: String },
      footnote: { type: String },
      imageSources: { type: String }
    },
    figure3: {
      name: { type: String },
      years: { type: String },
      role: { type: String },
      roleYears: { type: String },
      briefDescription: { type: String },
      sources: { type: String },
      image: { type: String },
      footnote: { type: String },
      imageSources: { type: String }
    },
    figure4: {
      name: { type: String },
      years: { type: String },
      role: { type: String },
      roleYears: { type: String },
      briefDescription: { type: String },
      sources: { type: String },
      image: { type: String },
      footnote: { type: String },
      imageSources: { type: String }
    },
    figure5: {
      name: { type: String },
      years: { type: String },
      role: { type: String },
      roleYears: { type: String },
      briefDescription: { type: String },
      sources: { type: String },
      image: { type: String },
      footnote: { type: String },
      imageSources: { type: String }
    }
  },
  maps: {
    map1: {
      title: { type: String },
      decade: { type: String },
      briefDescription: { type: String },
      sources: { type: String },
      image: { type: String },
      footnote: { type: String },
      imageSources: { type: String }
    },
    map2: {
      title: { type: String },
      decade: { type: String },
      briefDescription: { type: String },
      sources: { type: String },
      image: { type: String },
      footnote: { type: String },
      imageSources: { type: String }
    },
    map3: {
      title: { type: String },
      decade: { type: String },
      briefDescription: { type: String },
      sources: { type: String },
      image: { type: String },
      footnote: { type: String },
      imageSources: { type: String }
    },
    map4: {
      title: { type: String },
      decade: { type: String },
      briefDescription: { type: String },
      sources: { type: String },
      image: { type: String },
      footnote: { type: String },
      imageSources: { type: String }
    },
    map5: {
      title: { type: String },
      decade: { type: String },
      briefDescription: { type: String },
      sources: { type: String },
      image: { type: String },
      footnote: { type: String },
      imageSources: { type: String }
    },
    map6: {
      title: { type: String },
      decade: { type: String },
      briefDescription: { type: String },
      sources: { type: String },
      image: { type: String },
      footnote: { type: String },
      imageSources: { type: String }
    },
    map7: {
      title: { type: String },
      decade: { type: String },
      briefDescription: { type: String },
      sources: { type: String },
      image: { type: String },
      footnote: { type: String },
      imageSources: { type: String }
    },
    map8: {
      title: { type: String },
      decade: { type: String },
      briefDescription: { type: String },
      sources: { type: String },
      image: { type: String },
      footnote: { type: String },
      imageSources: { type: String }
    },
    map9: {
      title: { type: String },
      decade: { type: String },
      briefDescription: { type: String },
      sources: { type: String },
      image: { type: String },
      footnote: { type: String },
      imageSources: { type: String }
    },
    map10: {
      title: { type: String },
      decade: { type: String },
      briefDescription: { type: String },
      sources: { type: String },
      image: { type: String },
      footnote: { type: String },
      imageSources: { type: String }
    }
  }
});


const FormData = mongoose.model('FormData', formSchema);

// Serve the form
app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, 'form.html'));
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Make sure this directory exists!
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Configure multer for map uploads
const mapStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (file.fieldname.startsWith('maps.')) {
      cb(null, 'uploads_maps/');
    } else {
      cb(null, 'uploads/');
    }
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Update the upload fields configuration to match your form
const uploadFields = [
  { name: 'school.description.image', maxCount: 1 },  // Matches form input name="school.description.image"
  { name: 'school.timeline.event1.image', maxCount: 1 },  // Matches form input name="school.timeline.event1.image"
  { name: 'school.timeline.event2.image', maxCount: 1 },
  { name: 'school.timeline.event3.image', maxCount: 1 },
  { name: 'school.timeline.event4.image', maxCount: 1 },
  { name: 'school.timeline.event5.image', maxCount: 1 },
  { name: 'school.timeline.event6.image', maxCount: 1 },
  { name: 'school.timeline.event7.image', maxCount: 1 },
  { name: 'school.timeline.event8.image', maxCount: 1 },
  { name: 'school.timeline.event9.image', maxCount: 1 },
  { name: 'school.timeline.event10.image', maxCount: 1 },
  { name: 'relevantFigures.figure1.image', maxCount: 1 },  // Matches form input name="relevantFigures.figure1.image"
  { name: 'relevantFigures.figure2.image', maxCount: 1 },
  { name: 'relevantFigures.figure3.image', maxCount: 1 },
  { name: 'relevantFigures.figure4.image', maxCount: 1 },
  { name: 'relevantFigures.figure5.image', maxCount: 1 },
  // Maps
  { name: 'maps.map1.image', maxCount: 1 },
  { name: 'maps.map2.image', maxCount: 1 },
  { name: 'maps.map3.image', maxCount: 1 },
  { name: 'maps.map4.image', maxCount: 1 },
  { name: 'maps.map5.image', maxCount: 1 },
  { name: 'maps.map6.image', maxCount: 1 },
  { name: 'maps.map7.image', maxCount: 1 },
  { name: 'maps.map8.image', maxCount: 1 },
  { name: 'maps.map9.image', maxCount: 1 },
  { name: 'maps.map10.image', maxCount: 1 }
];

const upload = multer({ 
  storage: storage,
  fileFilter: function(req, file, cb) {
    // Optional: Add file type validation
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

app.post('/submit', upload.fields(uploadFields), async (req, res) => {
  try {
    // Log the received files to debug
    console.log('Received files:', req.files);
    
    // Get file paths or null if no file was uploaded
    const schoolImage = req.files['school.description.image'] ? 
      req.files['school.description.image'][0].path : null;
    
    // Handle timeline event images
    const timelineImages = {};
    for (let i = 1; i <= 10; i++) {
      const fieldName = `school.timeline.event${i}.image`;
      timelineImages[`event${i}`] = req.files[fieldName] ? 
        req.files[fieldName][0].path : null;
    }
    
    // Handle figure images
    const figureImages = {};
    for (let i = 1; i <= 5; i++) {
      const fieldName = `relevantFigures.figure${i}.image`;
      figureImages[`figure${i}`] = req.files[fieldName] ? 
        req.files[fieldName][0].path : null;
    }

    // Process map images
    const mapImages = {};
    if (req.files) {
      for (let i = 1; i <= 3; i++) {
        const fieldName = `maps.map${i}.image`;
        if (req.files[fieldName] && req.files[fieldName][0]) {
          mapImages[`map${i}`] = req.files[fieldName][0].filename;
        }
      }
    }

    // Process maps data
    const maps = {};
    for (let i = 1; i <= 10; i++) {
      maps[`map${i}`] = {
        title: req.body[`map_title_${i}`],
        decade: req.body[`map_decade_${i}`],
        briefDescription: req.body[`map_brief_description_${i}`],
        sources: req.body[`map_sources_${i}`],
        image: req.files[`maps.map${i}.image`] ? req.files[`maps.map${i}.image`][0].filename : null,
        footnote: req.body[`map_footnote_${i}`],
        imageSources: req.body[`map_image_sources_${i}`]
      };
    }

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
      event_footnote_1,
      event_image_sources_1,
      event_title_2,
      event_year_2,
      event_brief_description_2,
      event_sources_2,
      event_footnote_2,
      event_image_sources_2,
      event_title_3,
      event_year_3,
      event_brief_description_3,
      event_sources_3,
      event_footnote_3,
      event_image_sources_3,
      event_title_4,
      event_year_4,
      event_brief_description_4,
      event_sources_4,
      event_footnote_4,
      event_image_sources_4,
      event_title_5,
      event_year_5,
      event_brief_description_5,
      event_sources_5,
      event_footnote_5,
      event_image_sources_5,
      event_title_6,
      event_year_6,
      event_brief_description_6,
      event_sources_6,
      event_footnote_6,
      event_image_sources_6,
      event_title_7,
      event_year_7,
      event_brief_description_7,
      event_sources_7,
      event_footnote_7,
      event_image_sources_7,
      event_title_8,
      event_year_8,
      event_brief_description_8,
      event_sources_8,
      event_footnote_8,
      event_image_sources_8,
      event_title_9,
      event_year_9,
      event_brief_description_9,
      event_sources_9,
      event_footnote_9,
      event_image_sources_9,
      event_title_10,
      event_year_10,
      event_brief_description_10,
      event_sources_10,
      event_footnote_10,
      event_image_sources_10,
      figure_name_1,
      figure_years_1,
      figure_role_1,
      figure_roleyears_1,
      figure_brief_description_1,
      figure_sources_description_1,
      footnote_figure_image_1,
      sources_figure_image_1,
      figure_name_2,
      figure_years_2,
      figure_role_2,
      figure_roleyears_2,
      figure_brief_description_2,
      figure_sources_description_2,
      footnote_figure_image_2,
      sources_figure_image_2,
      figure_name_3,
      figure_years_3,
      figure_role_3,
      figure_roleyears_3,
      figure_brief_description_3,
      figure_sources_description_3,
      footnote_figure_image_3,
      sources_figure_image_3,
      figure_name_4,
      figure_years_4,
      figure_role_4,
      figure_roleyears_4,
      figure_brief_description_4,
      figure_sources_description_4,
      footnote_figure_image_4,
      sources_figure_image_4,
      figure_name_5,
      figure_years_5,
      figure_role_5,
      figure_roleyears_5,
      figure_brief_description_5,
      figure_sources_description_5,
      footnote_figure_image_5,
      sources_figure_image_5,
      map_title_1,
      map_decade_1,
      map_brief_description_1,
      map_sources_1,
      map_footnote_1,
      map_image_sources_1,
      map_title_2,
      map_decade_2,
      map_brief_description_2,
      map_sources_2,
      map_footnote_2,
      map_image_sources_2,
      map_title_3,
      map_decade_3,
      map_brief_description_3,
      map_sources_3,
      map_footnote_3,
      map_image_sources_3,
      map_title_4,
      map_decade_4,
      map_brief_description_4,
      map_sources_4,
      map_footnote_4,
      map_image_sources_4,
      map_title_5,
      map_decade_5,
      map_brief_description_5,
      map_sources_5,
      map_footnote_5,
      map_image_sources_5,
      year_institution_creation,
      year_building_started,
      year_building_ended,
      year_desegration,
      year_ceased,
      year_demolished,
      brief_description,
      sources_description,
      school_footnote,
      school_image_sources
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
      const footnote = normalizeField(req.body[`event_footnote_${i}`]);
      const imageSources = normalizeField(req.body[`event_image_sources_${i}`]);
      const image = timelineImages[`event${i}`];
      
      if (title) {
        timeline[`event${i}`] = { 
          title, 
          year, 
          briefDescription: description, 
          sources,
          image,
          footnote,
          imageSources
        };
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
      const footnote = normalizeField(req.body[`footnote_figure_image_${i}`]);
      const imageSources = normalizeField(req.body[`sources_figure_image_${i}`]);
      const image = figureImages[`figure${i}`];

      if (name) {
        relevantFigures[`figure${i}`] = { 
          name, 
          years, 
          role, 
          roleYears, 
          briefDescription: description, 
          sources,
          image,
          footnote,
          imageSources
        };
      }
    }

    // Parse coordinates and validate them
    const longitude = parseFloat(lon);
    const latitude = parseFloat(lat);

    // Validate that coordinates are valid numbers
    if (isNaN(longitude) || isNaN(latitude)) {
      throw new Error('Invalid coordinates: longitude and latitude must be valid numbers');
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
            coordinates: [longitude, latitude],
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
          image: schoolImage
        },
        timeline,
      },
      relevantFigures,
      maps,
    });

    // Save to MongoDB
    await formData.save();
    res.send('Data successfully saved to MongoDB!');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send(`Error saving data: ${err.message}`);
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


// API endpoint to get all form data
app.get('/api/formdata', async (req, res) => {
  try {
    console.log('Fetching all form data...');
    
    const formData = await FormData.find({});
    
    // Transform the data to include only non-null/non-empty values
    const transformedData = formData.map(doc => {
      const data = doc.toObject();
      
      // Helper function to remove empty/null values from objects
      const removeEmpty = (obj) => {
        Object.keys(obj).forEach(key => {
          if (obj[key] && typeof obj[key] === 'object') {
            removeEmpty(obj[key]);
          }
          if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
            delete obj[key];
          }
        });
        return obj;
      };

      return removeEmpty(data);
    });

    console.log(`Found ${transformedData.length} documents`);
    res.json(transformedData);
    
  } catch (error) {
    console.error('Error fetching form data:', error);
    res.status(500).json({ error: 'Failed to fetch form data' });
  }
});


// API endpoint to get all context form data
app.get('/api/formdata_context', async (req, res) => {
  try {
    console.log('Fetching all context form data...');
    
    const formDataContext = await FormDataContext.find({});
    
    // Transform the data to include only non-null/non-empty values
    const transformedData = formDataContext.map(doc => {
      const data = doc.toObject();
      
      // Helper function to remove empty/null values from objects
      const removeEmpty = (obj) => {
        Object.keys(obj).forEach(key => {
          if (obj[key] && typeof obj[key] === 'object') {
            removeEmpty(obj[key]);
          }
          if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
            delete obj[key];
          }
        });
        return obj;
      };

      return removeEmpty(data);
    });

    console.log(`Found ${transformedData.length} context documents`);
    res.json(transformedData);
    
  } catch (error) {
    console.error('Error fetching context form data:', error);
    res.status(500).json({ error: 'Failed to fetch context form data' });
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

