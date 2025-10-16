import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Clínica SaludTotal API",
      version: "1.0.0",
    },
  },
  apis: ["./src/docs/**/*.yaml"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
