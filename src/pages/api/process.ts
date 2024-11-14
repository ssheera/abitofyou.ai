import type { NextApiRequest, NextApiResponse } from 'next'
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Fields, Files, IncomingForm } from 'formidable'
import fs from 'fs'
import OpenAI from "openai";

const openai = new OpenAI();

const uploadFile = async (key: string, path: string) => {

    const body = fs.readFileSync(path)

    const client = new S3Client({region: process.env.AWS_REGION})
    const cmdPut = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME, Key: key, Body: body
    })
    const cmdGet = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME, Key: key
    })

    try {
        await client.send(cmdPut)
        return await getSignedUrl(client, cmdGet, {expiresIn: 3600})
    } catch (error) {
        throw new Error(`Error uploading file: ${error}`)
    }

}

const parseForm = async (req: NextApiRequest): Promise<{ fields: Fields, files: Files }> => {
    return new Promise((resolve, reject) => {
        const form = new IncomingForm()
        form.parse(req, (err, fields, files) => {
            if (err) reject(err)
            resolve({ fields, files })
        })
    })
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { fields, files } = await parseForm(req)
            if (!files.file || files.file.length !== 2) {
                return res.status(400).json({ message: 'Missing image files' })
            }
            const img1 = files.file[0]
            const img2 = files.file[1]
            if (img1 && img2) {
                const url1 = await uploadFile('img1', img1.filepath)
                const url2 = await uploadFile('img2', img2.filepath)
                const completion = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: [
                                {
                                    type: "text",
                                    text: "To determine compatibility in relationships, key methods include:\n" +
                                        "\n" +
                                        "Similarity: Matching on personality traits, values, and interests.\n" +
                                        "Complementarity: Some research supports the idea that opposites attract, though this is debated.\n" +
                                        "Communication: Effective and open communication patterns are crucial for compatibility.\n" +
                                        "Behavioral Interdependence: How well partners' actions mesh over time impacts long-term compatibility.\n" +
                                        "Psychological Factors: Traits like emotional stability, agreeableness, and attachment styles are predictive of compatibility.\n" +
                                        "These factors collectively influence satisfaction, stability, and relationship longevity."
                                },
                                {
                                    type: "text",
                                    text: "Take in two images. \nImage 1 is of the user, and Image 2 is of someone they may be compatible with. \nJudge the images and return a JSON response that shows how compatible they would be in terms of a relationship. \nThe score is fictional and just based on how they look and what they may be into based on stereotypes.\nThe response should look like this: \n{\"score\": \"a compatibility score from 0 to 100\", \"reason\": \"reasoning why, short\"}"
                                }
                            ]
                        },
                        {
                            role: "user",
                            content: [
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: url1
                                    }
                                },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: url2
                                    }
                                }
                            ]
                        }

                    ]
                })
                const reply = completion.choices[0].message.content
                if (reply) {
                    return res.status(200).json(JSON.parse(reply))
                } else {
                    return res.status(500).json({ message: 'Error processing request' })
                }
            } else {
                return res.status(400).json({ message: 'Missing image files' })
            }
        } catch (error) {
            console.error('Error processing request:', error)
            res.status(500).json({error: 'Server error processing request'})
        }
    } else {
        res.status(405).json({error: 'Method Not Allowed'})
    }
}

export default handler

export const config = {
    api: {
        bodyParser: false,
    },
}