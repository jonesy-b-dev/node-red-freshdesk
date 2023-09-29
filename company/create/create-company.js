const axios = require('axios');

module.exports = function (RED) {
    function FreshdeskCreateCompanyNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.credentials = RED.nodes.getNode(config.freshdesk);

        // Retrieve configuration values from node
        this.domain = this.credentials.domain;
        this.apiKey = this.credentials.apiKey;
        this.inputData = config.inputData;

        // Define the function to call the Freshdesk API directly
        this.createCompany = function (msg) {
            // Access the data in the msg object
            let companyData = msg.payload;

            // Set up the Axios request with Basic Authentication header and config
            const authHeader = `Basic ${Buffer.from(this.apiKey + ':X').toString('base64')}`;
            const axiosConfig = {
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
            };

            //Check if companyData includes a name
            if (companyData.hasOwnProperty('name')) {
                // Make a POST request to create a contact in Freshdesk
                axios.post(`https://${this.domain}.freshdesk.com/api/v2/companies`, companyData, axiosConfig)
                    .then((response) => {
                        // Send the createdContact to the next node
                        node.send({ payload: response.data });
                    })
                    .catch((error) => {
                        // Handle errors
                        node.error('Failed to create company: ' + error.message);
                });
            } 
            else {
                node.error('Contact data must at least include a unique name to satisfy Freshdesk requirements. To know how to format your data, please refer to the Freshdesk API documentation: https://developers.freshdesk.com/api/#create_company');
            }
        };

        // Handle incoming messages
        this.on('input', function (msg) {
            // Call the function to create a company when a message is received
            node.createCompany(msg);
        });
    }

    RED.nodes.registerType('freshdesk-create-company', FreshdeskCreateCompanyNode);
};