import { sql } from "../config/db.js";

// Function to get site by site ID
export async function getSiteByID(req, res) {
    try {
        const { siteId } = req.params;

        const result = await sql`
            SELECT *
            FROM sites
            WHERE site_id = ${siteId}
        `;

        res.json(result[0]);

    }
    catch (error) {
        console.log("Error getting the site", error);
        res.status(500).json({ message: "Internal server error"});
    }
}

// Function to get independance summary by site ID and timeframe
// export async function getIndepSummary(req, res) {
//     try {
//
//     }
//     catch (error) {
//         console.log("Error getting the summary", error);
//         res.status(500).json({ message: "Internal server error"});
//     }
// }