// Mock data for the prayer app prototype
// All content is Lorem Ipsum except campaign group names

const MOCK_DATA = {
    campaigns: [
        // Doxa Life group
        {
            id: "campaign1",
            name: "Lorem ipsum dolor sit amet",
            group: "Doxa Life",
            languages: ["en", "fr", "es", "zh"],
            code: "LOREM001",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
            id: "campaign2",
            name: "Consectetur adipiscing elit",
            group: "Doxa Life",
            languages: ["en", "fr", "es", "zh"],
            code: "LOREM002",
            description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            id: "campaign3",
            name: "Sed do eiusmod tempor",
            group: "Doxa Life",
            languages: ["en", "fr", "es", "zh"],
            code: "LOREM003",
            description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
        },
        {
            id: "campaign4",
            name: "Incididunt ut labore",
            group: "Doxa Life",
            languages: ["en", "fr", "es", "zh"],
            code: "LOREM004",
            description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },
        // 110 Cities group
        {
            id: "campaign5",
            name: "Ut enim ad minim",
            group: "110 Cities",
            languages: ["en", "fr", "es", "zh"],
            code: "LOREM005",
            description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium."
        },
        {
            id: "campaign6",
            name: "Quis nostrud exercitation",
            group: "110 Cities",
            languages: ["en", "fr", "es", "zh"],
            code: "LOREM006",
            description: "Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt."
        },
        {
            id: "campaign7",
            name: "Ullamco laboris nisi",
            group: "110 Cities",
            languages: ["en", "fr", "es", "zh"],
            code: "LOREM007",
            description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni."
        },
        {
            id: "campaign8",
            name: "Aliquip ex ea commodo",
            group: "110 Cities",
            languages: ["en", "fr", "es", "zh"],
            code: "LOREM008",
            description: "Dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est, qui dolorem ipsum."
        },
        {
            id: "campaign9",
            name: "Consequat duis aute",
            group: "110 Cities",
            languages: ["en", "fr", "es", "zh"],
            code: "LOREM009",
            description: "Quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt."
        },
        // Ramadan 2026 group
        {
            id: "campaign10",
            name: "Irure dolor in reprehenderit",
            group: "Ramadan 2026",
            languages: ["en", "fr", "es", "zh"],
            code: "LOREM010",
            description: "Ut labore et dolore magnam aliquam quaerat voluptatem ut enim ad minima veniam, quis nostrum."
        },
        {
            id: "campaign11",
            name: "Voluptate velit esse",
            group: "Ramadan 2026",
            languages: ["en", "fr", "es", "zh"],
            code: "LOREM011",
            description: "Exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur."
        },
        {
            id: "campaign12",
            name: "Cillum dolore eu fugiat",
            group: "Ramadan 2026",
            languages: ["en", "fr", "es", "zh"],
            code: "LOREM012",
            description: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur."
        },
        {
            id: "campaign13",
            name: "Nulla pariatur excepteur",
            group: "Ramadan 2026",
            languages: ["en", "fr", "es", "zh"],
            code: "LOREM013",
            description: "Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur at vero eos et accusamus."
        }
    ],

    // Prayer fuel dates for each campaign (5-7 days per campaign)
    prayerFuel: {
        campaign1: ["2024-01-15", "2024-01-16", "2024-01-17", "2024-01-18", "2024-01-19"],
        campaign2: ["2024-01-15", "2024-01-16", "2024-01-17", "2024-01-18", "2024-01-19", "2024-01-20"],
        campaign3: ["2024-01-15", "2024-01-16", "2024-01-17", "2024-01-18", "2024-01-19", "2024-01-20", "2024-01-21"],
        campaign4: ["2024-01-15", "2024-01-16", "2024-01-17", "2024-01-18", "2024-01-19"],
        campaign5: ["2024-01-15", "2024-01-16", "2024-01-17", "2024-01-18", "2024-01-19", "2024-01-20"],
        campaign6: ["2024-01-15", "2024-01-16", "2024-01-17", "2024-01-18", "2024-01-19"],
        campaign7: ["2024-01-15", "2024-01-16", "2024-01-17", "2024-01-18", "2024-01-19", "2024-01-20", "2024-01-21"],
        campaign8: ["2024-01-15", "2024-01-16", "2024-01-17", "2024-01-18", "2024-01-19"],
        campaign9: ["2024-01-15", "2024-01-16", "2024-01-17", "2024-01-18", "2024-01-19", "2024-01-20"],
        campaign10: ["2024-01-15", "2024-01-16", "2024-01-17", "2024-01-18", "2024-01-19"],
        campaign11: ["2024-01-15", "2024-01-16", "2024-01-17", "2024-01-18", "2024-01-19", "2024-01-20"],
        campaign12: ["2024-01-15", "2024-01-16", "2024-01-17", "2024-01-18", "2024-01-19", "2024-01-20", "2024-01-21"],
        campaign13: ["2024-01-15", "2024-01-16", "2024-01-17", "2024-01-18", "2024-01-19"]
    }
};

