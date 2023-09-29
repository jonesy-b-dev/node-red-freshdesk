const axios = require('axios');

module.exports = function (RED) {
    function FreshdeskUpdateCompanyByIDNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.credentials = RED.nodes.getNode(config.freshdesk);

        // Retrieve configuration values from node
        this.domain = this.credentials.domain;
        this.apiKey = this.credentials.apiKey;
        this.inputData = config.inputData; 

        // Define the function to call the Freshdesk API directly
        this.updateCompany = function (msg) {
            // Access the data in the msg object
            let companyData = msg.payload;
            let companyId = msg.id;

            // Set up the Axios request with Basic Authentication header and config
            const authHeader = `Basic ${Buffer.from(this.apiKey + ':X').toString('base64')}`;
            const axiosConfig = {
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json',
                },
            };

            //check if companyData includes a name
            if (companyData.hasOwnProperty('name')) {
                // Make a PUT request to the Freshdesk API
                axios.put(`https://${this.domain}.freshdesk.com/api/v2/companies/${companyId}`, companyData, axiosConfig)
                    .then((response) => {
                        // Send the response to the next node
                        node.send({ payload:  response.data });
                    })
                    .catch((error) => {
                        // Handle errors and log the response
                        if (error.response) {
                            node.error('Failed to update contact: ' + error.response.status + ' ' + error.response.statusText);
                            node.warn('Response data: ' + JSON.stringify(error.response.data));
                        } else {
                            node.error('Failed to update contact: ' + error.message);
                        }
                    }
                );
            } 
            else {
                node.error('Contact data must at least include a name and email to satisfy Freshdesk requirements. To know how to format your data, please refer to the Freshdesk API documentation: https://developers.freshdesk.com/api/#update_contact');
            }
        };

        // Handle incoming messages
        this.on('input', function (msg) {
            // Call the function to create a contact when a message is received
            node.updateCompany(msg);
        });
    }

    RED.nodes.registerType('freshdesk-update-company-by-id', FreshdeskUpdateCompanyByIDNode);
};