// ./app.js
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { initialize } from 'express-openapi';
import v1MetadataGenerationService from './api-v1/services/metadataGenerationService.js';
import v1ApiDoc from './api-v1/api-doc.js';

const app = express();
initialize({
  app,
  // NOTE: If using yaml you can provide a path relative to process.cwd() e.g.
  // apiDoc: './api-v1/api-doc.yml',
  apiDoc: v1ApiDoc,
  dependencies: {
    metadataGenerationService: v1MetadataGenerationService
  },
  paths: './api-v1/paths'
});

/* Swagger UI */
const options = {
  swaggerOptions: {
    url: 'http://localhost:3000/v1/api-docs'
  }
}
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));
/* Swagger UI End */

app.listen(3000);