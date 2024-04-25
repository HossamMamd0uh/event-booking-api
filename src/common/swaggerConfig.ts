import swaggerJsdoc from 'swagger-jsdoc';


const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ticketing API',
            version: '1.0.0',
            description: 'A simple Express Ticketing API booking tickets for events.',
        },
        servers: [
            {
                url: 'http://localhost:8000',
            },
        ],
        components: {
            securitySchemes: {
              bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
              },
            },
          },
    },
    apis: ['src/routes/*.ts'],
};


export const swaggerSpec = swaggerJsdoc(options);
