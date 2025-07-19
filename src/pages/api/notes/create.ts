import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import type { NextApiRequest, NextApiResponse } from "next";

import s3 from "@/lib/s3";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") return res.status(405).end("Method not allowed");

    const noteId = uuidv4(); // Generate random UUID for file name/ID
    const fileRoute = `notes/${req.body.user}/${noteId}.md`; // File route for the generated MD file

    // Set parameters for S3 file
    const createParams = {
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: fileRoute,
        Body: "",
        ContentType: "text/markdown",
    };

    try {
        // Upload empty markdown file to S3 bucket
        const command = new PutObjectCommand(createParams);
        await s3.send(command);

        // await s3.putObject(createParams).promise();

        return res.status(200).json({ success: true, noteId, fileRoute });
    } catch {
        return res.status(500).json({ error: "Failed to create note" });
    }
}
