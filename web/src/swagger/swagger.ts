import { UserRole } from '@vtmp/common/constants';
import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'VTMP Interntal Tools API',
    description:
      'Swagger API Documentation for VTMP Website and Internal Tools',
  },
  host: 'localhost:8000',
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
    schemas: {
      LoginRequest: {
        email: 'string',
        password: 'string',
      },
      LoginResponse: {
        token: 'string',
        user: {
          id: 'string',
          email: 'string',
          firstName: 'string',
          lastName: 'string',
          role: UserRole,
        },
      },
    },
  },
};

const outputFile = './src/swagger/swagger-output.json';
const endpointsFiles = ['./src/app.ts', 'src/routes/index.ts'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
