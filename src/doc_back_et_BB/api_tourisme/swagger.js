const swaggerAutogen = require('swagger-autogen')();
const doc = {
 info: {
 title: 'API Documentation',
 description: 'Documentation générée automatiquement avec Swagger.',
 },
 host: '192.168.3.11:4000',
 schemes: ['http'],
};
const outputFile = './swagger-output.json'; // Fichier de sortie


const endpointsFiles = ['./serverVV.js']; // Fichier contenant vos routes
swaggerAutogen(outputFile, endpointsFiles).then(() => {
 console.log('Documentation Swagger générée avec succès.');
});
