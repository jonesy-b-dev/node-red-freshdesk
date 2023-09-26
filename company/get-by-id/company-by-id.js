const axios = require('axios');

module.exports = function (RED) {
    function FreshdeskCompanyByIdNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        // Retrieve configuration values from node
        this.name = config.name.trim();
        this.apiKey = config.apiKey.trim();
        this.companyId = config.companyId.trim();
        this.domain = config.domain.trim();

        // Define the function to call the Freshdesk API directly
        this.getCompanyById = function () {

            // Set up the Axios request with Basic Authentication header
            const authHeader = `Basic ${Buffer.from(apiKey + ':X').toString('base64')}`;
            const axiosConfig = {
                headers: {
                    'Authorization': authHeader,
                    //'Content-Type': 'application/json',
                },
            };

            // Make a GET request to the Freshdesk API
            axios.get(`https://${node.domain}.freshdesk.com/api/v2/companies/${node.companyId}`, axiosConfig)
                .then((response) => {
                    // Handle the API response here
                    const companyData = response.data;

                    // You can send the companyData to the next node
                    node.send({ payload: companyData });
                })
                .catch((error) => {
                    // Handle errors here
                    node.error('Failed to fetch company data: ' + error.message);
                });
        };

        // Handle incoming messages
        this.on('input', function (msg) {
            // Call the Freshdesk API when a message is received
            node.getCompanyById();
        });
    }

    RED.nodes.registerType('freshdesk-company-by-id', FreshdeskCompanyByIdNode);
};

