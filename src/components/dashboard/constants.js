//All the constants are declared here
export const features = [
    {
        key: 1,
        name: "Client Contacts",
        values: [
            {
                label: "Active",
                value: ["clientContacts", "active"]
            },
            {
                label: "Opt Out",
                value: ["clientContacts", "optOut"]
            },
            {
                label: "Bad",
                value: ["clientContacts", "bad"]
            },
            {
                label: "Total",
                value: ["clientContacts", "total"]
            },
            {
                label: "Status",
                value: ["clientContacts", "contactStatus"]
            }
        ],
        apiParams: "contact/10",
        class: "text-red"
    },
    {
        key: 2,
        name: "Email Campaigns",
        values: [
            {
                label: "Total",
                value: ["emailCampaigns", "total"]
            },
            {
                label: "Open Rate",
                value: ["emailCampaigns", "averageTotalOpenRate"]
            }
        ],
        apiParams: "email/10",
        class: "text-blue"
    },
    {
        key: 3,
        name: "SMS Campaigns",
        values: [
            {
                label: "Total",
                value: ["smsCampaigns", "total"]
            },
            {
                label: "Replies",
                value: ["smsCampaigns", "totalReplies"]
            }
        ],
        apiParams: "sms/10",
        class: "text-green"
    },
    {
        key: 4,
        name: "SMS Polling",
        values: [
            {
                label: "Total",
                value: ["smsPolling", "total"]
            },
            {
                label: "Responses",
                value: ["smsPolling", "totalResponses"]
            }
        ],
        apiParams: "polling/10",
        class: "text-violet"
    },
    {
        key: 5,
        name: "Surveys",
        values: [
            {
                label: "Total",
                value: ["surveys", "total"]
            },
            {
                label: "Responses",
                value: ["surveys", "totalResponses"]
            }
        ],
        apiParams: "survey/10",
        class: "text-orange"
    },
    {
        key: 6,
        name: "Assessments",
        values: [
            {
                label: "Total",
                value: ["assessment", "total"]
            },
            {
                label: "Responses",
                value: ["assessment", "totalResponses"]
            }
        ],
        apiParams: "assessment/10",
        class: "text-red"
    },
];

export const todos = [
    {
        Title: "Find a place for client meetings",
        Remaining: "00:15"
    },
    {
        Title: "Send weekly summary (with attachement)",
        Remaining: "00:30"
    },
    {
        Title: "Send weekly summary (with attachement)",
        Remaining: "00:30"
    },
    {
        Title: "Find a place for client meetings",
        Remaining: "00:15"
    },
    {
        Title: "Send weekly summary (with attachement)",
        Remaining: "00:30"
    },
    {
        Title: "Send weekly summary (with attachement)",
        Remaining: "00:30"
    },
    {
        Title: "Send weekly summary (with attachement)",
        Remaining: "00:30"
    }];