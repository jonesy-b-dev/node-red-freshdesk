const axios = require('axios');

module.exports = function (RED) {
    function FreshdeskContactByIdNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        // Retrieve configuration values from node
        this.name = config.name;
        this.apiKey = config.apiKey;
        this.contactId = config.contactId;

        // Define the function to call the Freshdesk API directly
        this.getContactById = function () {
            // Set up the Axios request with Basic Authentication header
            //const authHeader = `Basic ${Buffer.from(node.apiKey + ':X').toString('base64')}`;
            const authHeader = "Basic UHBFOGNrMThValRGdzBRME50Og==";
            const axiosConfig = {
                headers: {
                    'Authorization': authHeader,
                    //'Content-Type': 'application/json',
                },
            };

            // Make a GET request to the Freshdesk API
            node.warn(axiosConfig);
            //console.log('This is a server-side debugging message');
            axios.get(`https://jonesybinc.freshdesk.com/api/v2/contacts/${node.contactId}`, axiosConfig)
                .then((response) => {
                    // Handle the API response here
                    const contactData = response.data;

                    // You can send the contactData to the next node
                    node.send({ payload: contactData });
                })
                .catch((error) => {
                    // Handle errors here
                    node.error('Failed to fetch contact data: ' + error.message);
                });
        };

        // Handle incoming messages
        this.on('input', function (msg) {
            // Call the Freshdesk API when a message is received
            node.getContactById();
        });
    }

    RED.nodes.registerType('freshdesk-contact-by-id', FreshdeskContactByIdNode);
};
