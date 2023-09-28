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
            // Access the nested property using the inputData string
            let companyData = msg.payload;

            // Set up the Axios request with Basic Authentication header
            const authHeader = `Basic ${Buffer.from(this.apiKey + ':X').toString('base64')}`;
            const axiosConfig = {
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
            };

            //check if companyData includes a name and email
            if (companyData.hasOwnProperty('name') && companyData.hasOwnProperty('email')) {

            // Make a POST request to create a contact in Freshdesk
            axios.post(`https://${this.domain}.freshdesk.com/api/v2/companies`, companyData, axiosConfig)
                .then((response) => {
                    // Handle the API response here
                    const createdContact = response.data;

                    // You can send the createdContact to the next node
                    node.send({ payload: createdContact });
                })
                .catch((error) => {
                    // Handle errors here
                    node.error('Failed to create company: ' + error.message);
                });
            } 
            else {
                node.error('Contact data must at least include a name and email to satisfy Freshdesk requirements');
            }
        };

        // Handle incoming messages
        this.on('input', function (msg) {
            // Call the function to create a contact when a message is received
            node.createCompany(msg);
        });
    }

    RED.nodes.registerType('freshdesk-create-company', FreshdeskCreateCompanyNode);
};