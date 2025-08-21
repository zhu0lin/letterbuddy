# Handwriting Analysis Setup Guide

## Overview
This backend now includes AI-powered handwriting analysis using OpenAI's Vision API (GPT-4o). Users can upload images of handwritten text and receive detailed feedback on their handwriting quality.

## New Endpoints

### 1. Analyze Handwriting
- **POST** `/handwriting/analyze`
- **Purpose**: Analyze uploaded image for handwritten text
- **Input**: Image file (JPEG, PNG, etc.)
- **Output**: Detected letters, quality assessment, suggestions

### 2. Get Feedback
- **POST** `/handwriting/feedback`
- **Purpose**: Generate detailed feedback based on analysis
- **Input**: Analysis response
- **Output**: Letter formation, spacing, consistency scores

### 3. Demo Analysis
- **GET** `/handwriting/demo`
- **Purpose**: Test endpoint with sample data
- **Output**: Sample analysis response

## Setup Requirements

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Set OpenAI API Key
You need an OpenAI API key with access to GPT-4o Vision:

```bash
# Set environment variable
export OPENAI_API_KEY="your_actual_api_key_here"

# Or create a .env file in backend directory:
echo "OPENAI_API_KEY=your_actual_api_key_here" > .env
```

### 3. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new secret key
5. Copy the key and set it as environment variable

## How It Works

1. **Image Upload**: User uploads image via frontend
2. **Image Processing**: Backend converts image to base64
3. **AI Analysis**: OpenAI Vision API analyzes the handwritten text
4. **Response Parsing**: Backend extracts detected letters and feedback
5. **Structured Output**: Returns organized analysis and suggestions

## API Response Format

### Handwriting Analysis Response
```json
{
  "detected_letters": ["A", "B", "C", "D"],
  "handwriting_quality": "Good",
  "suggestions": ["Practice letter formation", "Work on spacing"],
  "confidence_score": 0.85,
  "analysis": "Detailed analysis text from OpenAI..."
}
```

### Handwriting Feedback Response
```json
{
  "letter_formation": "Good",
  "spacing": "Needs Improvement",
  "consistency": "Consistent",
  "overall_score": 7,
  "improvement_tips": ["Practice writing each letter..."]
}
```

## Testing

### 1. Test Demo Endpoint
```bash
curl http://localhost:8000/handwriting/demo
```

### 2. Test with Image Upload
```bash
curl -X POST http://localhost:8000/handwriting/analyze \
  -F "image=@path/to/your/image.jpg"
```

## Error Handling

- **Missing API Key**: Returns 500 error with setup instructions
- **Invalid Image**: Returns 400 error for non-image files
- **API Errors**: Returns 500 error with OpenAI error details

## Security Notes

- API key is stored as environment variable (never in code)
- Image data is processed in memory and not stored
- OpenAI API calls are made server-side only

## Cost Considerations

- GPT-4o Vision API has usage costs
- Each image analysis counts toward your OpenAI quota
- Consider implementing rate limiting for production use

## Next Steps

1. Set your OpenAI API key
2. Test the demo endpoint
3. Integrate with your frontend upload functionality
4. Add rate limiting and user authentication
5. Implement image storage if needed
