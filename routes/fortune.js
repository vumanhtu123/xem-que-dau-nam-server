import express from 'express';
import {GoogleGenerativeAI} from "@google/generative-ai"; // Import SDK
// import the Genkit and Google AI plugin libraries
import {gemini15Flash, gemini20FlashExp, googleAI} from '@genkit-ai/googleai';
import {genkit} from 'genkit';

const router = express.Router();

// Khởi tạo Google Generative AI API
const genAI = new GoogleGenerativeAI({
    apiKey: "AIzaSyCVPMpzv9dLz_Z0y219hHMOb0SKYCIVIi8", // API Key
});

// API "Xem Quẻ Đầu Năm"
router.post('/', async (req, res) => {
    const {question, birthday} = req.body; // Lấy câu hỏi và ngày sinh từ client
    let text1 = ''
    let jsonResult = '';

    if (!question || !birthday) {
        return res.status(400).json({error: 'Missing question or birthday parameter'});
    }

    const parseTextToJson = (text) => {
        const result = {};
        const cleanedText = cleanText(text);

        console.log(cleanedText)

        // Trích xuất Số quẻ
        const hexagramNumberMatch = cleanedText.match(/Số quẻ:\s*(\d+)/);
        result.hexagramNumber = hexagramNumberMatch ? parseInt(hexagramNumberMatch[1], 10) : null;

        // Trích xuất Tên quẻ và chữ Hán
        const hexagramNameMatch = cleanedText.match(/Tên quẻ:\s*([^\(]+)\s*\(([^\)]+)\)/);
        result.hexagramName = hexagramNameMatch ? hexagramNameMatch[1].trim() : null;
        result.hexagramNameChinese = hexagramNameMatch ? hexagramNameMatch[2].trim() : null;

        // Trích xuất Lời khuyên
        const adviceMatch = cleanedText.match(/Lời khuyên:\s*(.+)/);
        result.advice = adviceMatch ? adviceMatch[1].trim() : null;

        return result;
    };

    const cleanText = (text) => {
        return text
            .replace(/\*\*/g, '') // Xóa dấu **
            .replace(/\n/g, ' ')  // Thay \n bằng khoảng trắng
            .replace(/ {2,}/g, ' '); // Thay 2 hoặc nhiều khoảng trắng liên tiếp bằng 1 khoảng trắng
    };

    try {
        // Tạo nội dung đầu vào cho API
        const ai = genkit({
            plugins: [googleAI()], model: gemini20FlashExp, // set default model
        });
        // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Dựa vào những thông tin bạn biết về 64 quẻ kinh dịch,
         dự đoán quẻ đầu năm: ${question} cho người có ngày tháng năm sinh là: ${birthday}.
         Trả lời theo form: Số quẻ, tên quẻ, lời khuyên khoảng 15 - 30 câu. Không trả lời lan man ngoài form`;

        // Gọi API với dữ liệu
        const result = ai.defineFlow('futureFlow', async (name) => {
            // make a generation request
            text1 = await ai.generate(`${prompt}`);
            // Loại bỏ ký tự đặc biệt
            jsonResult = parseTextToJson(text1?.message.content?.[0].text);
            console.log(JSON.stringify(jsonResult, null, 2));
        });
        // const result = await model.generateContent(prompt);

        await result()
        // Trích xuất câu trả lời từ kết quả trả về
        const answer = jsonResult || "Không nhận được câu trả lời từ API";
        // text1?.message.content?.[0].text
        res.json({answer: answer});
    } catch (error) {
        console.error('Error with Google Generative AI:', error);
        res.status(500).json({error: 'Failed to get a response from Google Generative AI'});
    }
});

export default router;
