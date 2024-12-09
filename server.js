const fs = require('fs');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static file middleware - order matters!
app.use(express.static(path.join(__dirname, 'public')));
app.use('/CS', express.static(path.join(__dirname, ''))); // Serve CS directory files
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'ddsuauehz',
  api_key: '924313197448929',
  api_secret: 'pJh8P0UP5tDIGRUZrqt3VtggUpI'
});

// Configure storage for different types of uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Optional: resize large images
  }
});

const mapStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 2000, height: 2000, crop: 'limit' }] // Maps might need larger sizes
  }
});



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
  res.sendFile(path.join(__dirname, 'CS.html'));
});


app.get('/preserve', (req, res) => {
  res.sendFile(path.join(__dirname, 'preserve.html'));
});

app.get('/educate', (req, res) => {
  res.sendFile(path.join(__dirname, 'educate.html'));
});



// API endpoint to get all GeoJSON data
app.get('/api/geojson', async (req, res) => {
  try {
    console.log('Fetching GeoJSON data...');
    
    const features = await FormData.find({
      'school.name': { $exists: true },
      'school.location.geometry': { $exists: true }
    });
    
    // Transform the data to GeoJSON format
    const geoJsonFeatures = features
      .filter(doc => doc.school && doc.school.location && doc.school.location.geometry)
      .map(doc => ({
        type: 'Feature',
        properties: {
          _id: doc._id.toString(), // Ensure _id is included and converted to string
          Name: doc.school.name || 'Unknown Name',
          Address: doc.school.address || 'No address'
        },
        geometry: doc.school.location.geometry
      }));

    // Debug log
    console.log('First feature example:', geoJsonFeatures[0]);

    res.json({
      type: "FeatureCollection",
      features: geoJsonFeatures
    });
    
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

app.post('/submit', multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).fields(uploadFields), async (req, res) => {
  try {
    console.log('Received files:', req.files);
    
    // Process uploaded files - now using Cloudinary URLs
    const processUploadedFile = (fieldName) => {
      if (req.files[fieldName] && req.files[fieldName][0]) {
        return req.files[fieldName][0].path; // Cloudinary returns the URL in the path property
      }
      return null;
    };

    // Process school image
    const schoolImage = processUploadedFile('school.description.image');
    
    // Process timeline images
    const timelineImages = {};
    for (let i = 1; i <= 10; i++) {
      const fieldName = `school.timeline.event${i}.image`;
      timelineImages[`event${i}`] = processUploadedFile(fieldName);
    }
    
    // Process figure images
    const figureImages = {};
    for (let i = 1; i <= 5; i++) {
      const fieldName = `relevantFigures.figure${i}.image`;
      figureImages[`figure${i}`] = processUploadedFile(fieldName);
    }

    // Process map images
    const mapImages = {};
    for (let i = 1; i <= 10; i++) {
      const fieldName = `maps.map${i}.image`;
      mapImages[`map${i}`] = processUploadedFile(fieldName);
    }

    // Process maps data
    const maps = {};
    for (let i = 1; i <= 10; i++) {
      maps[`map${i}`] = {
        title: req.body[`map_title_${i}`],
        decade: req.body[`map_decade_${i}`],
        briefDescription: req.body[`map_brief_description_${i}`],
        sources: req.body[`map_sources_${i}`],
        image: mapImages[`map${i}`],
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

    // Update how images are saved in the formData object
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
    res.send('Data successfully saved to MongoDB with Cloudinary images!');
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

// Serve static files
app.use(express.static('public'));

// Dynamic route for school pages
app.get('/CS/:id', async (req, res) => {
    try {
        const schoolId = req.params.id;
        console.log('Requested school ID:', schoolId);
        
        // First check if the school exists
        const school = await FormData.findById(schoolId);
        if (!school) {
            console.log('School not found for ID:', schoolId);
            return res.status(404).send('School not found');
        }

        // Read the CS.html file
        let htmlContent = await fs.promises.readFile(path.join(__dirname, 'CS.html'), 'utf8');
        
        // Fix paths for all assets
        htmlContent = htmlContent
            .replace(
                /<link[^>]*href=["'](?!http|\/\/)([^"']*\.css)["'][^>]*>/g,
                match => match.replace(/href=["']([^"']*)["']/, 'href="/$1"')
            )
            .replace(
                /<script[^>]*src=["'](?!http|\/\/)([^"']*\.js)["'][^>]*>/g,
                match => match.replace(/src=["']([^"']*)["']/, 'src="/$1"')
            )
            .replace(
                /src=["'](?!http|\/\/)([^"']*\.(jpg|jpeg|png|gif))["']/g,
                'src="/$1"'
            );

        // Replace the hardcoded schoolId in the script with the dynamic one
        const scriptReplacement = `
            <script>
                window.onload = async function () {
                    const schoolId = "${schoolId}"; // Dynamic school ID
                    const contextId = "6755f8497dc1fb8687a92dfb"; // Context ID
                    await fetchData(schoolId, contextId);
                };
            </script>
        `;

        // Replace the entire script section
        htmlContent = htmlContent.replace(
            /<script>\s*window\.onload[^<]*<\/script>/s,
            scriptReplacement
        );
        
        res.send(htmlContent);
    } catch (error) {
        console.error('Error serving school page:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Add endpoint to fetch specific school data
app.get('/api/formdata/:id', async (req, res) => {
    try {
        const school = await FormData.findById(req.params.id);
        if (!school) {
            return res.status(404).json({ error: 'School not found' });
        }
        res.json(school);
    } catch (error) {
        console.error('Error fetching school data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Add endpoint to fetch specific context data
app.get('/api/formdata_context/:id', async (req, res) => {
    try {
        const context = await FormDataContext.findById(req.params.id);
        if (!context) {
            return res.status(404).json({ error: 'Context not found' });
        }
        res.json(context);
    } catch (error) {
        console.error('Error fetching form data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Add this near the top of your server.js file
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).send('Internal Server Error');
});

// Add this to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Add this new endpoint near other API endpoints
app.get('/api/recent-schools', async (req, res) => {
  try {
    const recentSchools = await FormData.find({
      'school.name': { $exists: true },
      'school.city': { $exists: true }
    })
    .sort({ _id: -1 }) // Sort by newest first
    .limit(4) // Get only 4 records
    .select('school.name school.city school.description.image _id'); // Include image field

    res.json(recentSchools);
  } catch (error) {
    console.error('Error fetching recent schools:', error);
    res.status(500).json({ error: 'Failed to fetch recent schools' });
  }
});

// Modify the homepage route to include the data
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

