from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import openai
import os
import base64
from PIL import Image
import io
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()

# Pydantic models for request/response
class HandwritingAnalysisRequest(BaseModel):
    image_data: str  # Base64 encoded image
    user_id: int = 1  # Demo user ID

class HandwritingAnalysisResponse(BaseModel):
    detected_letters: List[str]
    handwriting_quality: str
    suggestions: List[str]
    confidence_score: float
    analysis: str
    letters_to_improve: List[str]  # New field for letters that need improvement

class HandwritingFeedback(BaseModel):
    letter_formation: str
    spacing: str
    consistency: str
    overall_score: int
    improvement_tips: List[str]

# Initialize OpenAI client (you'll need to set OPENAI_API_KEY environment variable)
try:
    openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
except:
    openai_client = None

@router.post("/analyze", response_model=HandwritingAnalysisResponse)
async def analyze_handwriting(image: UploadFile = File(...)):
    """
    Analyze handwritten text in an uploaded image using OpenAI Vision API
    """
    if not openai_client:
        raise HTTPException(
            status_code=500, 
            detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable."
        )
    
    try:
        # Validate image file
        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and process image
        image_data = await image.read()
        
        # Convert to base64 for OpenAI API
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        # Prepare the prompt for handwriting analysis
        system_prompt = """
        You are a handwriting analysis expert. Analyze the handwritten text in the image and provide a structured response in the following format:

        DETECTED_LETTERS: [List all letters found in the image, separated by commas]
        QUALITY: [Excellent/Good/Fair/Needs Improvement]
        CONFIDENCE: [0.0-1.0 score]
        SUGGESTIONS: [List 3-5 specific improvement suggestions]
        LETTERS_TO_IMPROVE: [List specific letters that need improvement, separated by commas]
        ANALYSIS: [Detailed analysis of handwriting quality, spacing, consistency, and readability]

        Focus on:
        - Letter formation and clarity
        - Spacing between letters and words
        - Consistency of handwriting style
        - Readability and neatness
        
        For LETTERS_TO_IMPROVE, identify specific letters that:
        - Have poor formation or are hard to read
        - Are inconsistent in size or style
        - Have spacing or alignment issues
        - Could benefit from practice
        
        Provide constructive, encouraging feedback suitable for learning.
        """
        
        # Call OpenAI Vision API
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Please analyze this handwritten text and provide detailed feedback on the handwriting quality, detected letters, and suggestions for improvement."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=1000,
            temperature=0.3
        )
        
        # Parse the response
        analysis_text = response.choices[0].message.content
        
        # Parse the structured response
        detected_letters = []
        handwriting_quality = "Good"
        suggestions = []
        confidence_score = 0.85
        letters_to_improve = []
        
        # Extract detected letters
        if "DETECTED_LETTERS:" in analysis_text:
            letters_section = analysis_text.split("DETECTED_LETTERS:")[1].split("\n")[0]
            # Extract letters from the section
            for char in letters_section:
                if char.isalpha():
                    detected_letters.append(char.upper())
            detected_letters = sorted(list(set(detected_letters)))
        
        # Extract quality assessment
        if "QUALITY:" in analysis_text:
            quality_section = analysis_text.split("QUALITY:")[1].split("\n")[0].strip()
            if quality_section in ["Excellent", "Good", "Fair", "Needs Improvement"]:
                handwriting_quality = quality_section
        
        # Extract confidence score
        if "CONFIDENCE:" in analysis_text:
            try:
                confidence_section = analysis_text.split("CONFIDENCE:")[1].split("\n")[0].strip()
                confidence_score = float(confidence_section)
            except ValueError:
                confidence_score = 0.85
        
        # Extract suggestions
        if "SUGGESTIONS:" in analysis_text:
            suggestions_section = analysis_text.split("SUGGESTIONS:")[1].split("LETTERS_TO_IMPROVE:")[0] if "LETTERS_TO_IMPROVE:" in analysis_text else analysis_text.split("SUGGESTIONS:")[1]
            # Parse suggestions (assuming they're separated by newlines or commas)
            suggestions_text = suggestions_section.strip()
            if suggestions_text:
                # Split by newlines and clean up
                raw_suggestions = [s.strip() for s in suggestions_text.split('\n') if s.strip()]
                # Clean up suggestions and remove numbering/bullets
                for suggestion in raw_suggestions:
                    # Remove common prefixes like "- ", "* ", "1. ", etc.
                    clean_suggestion = suggestion.lstrip('- *0123456789. ')
                    if clean_suggestion and len(clean_suggestion) > 10:  # Only add meaningful suggestions
                        suggestions.append(clean_suggestion)
        
        # If no suggestions were parsed, use fallback
        if not suggestions:
            suggestions = [
                "Practice letter formation",
                "Work on consistent spacing",
                "Focus on readability"
            ]
        
        # Extract letters to improve
        if "LETTERS_TO_IMPROVE:" in analysis_text:
            letters_to_improve_section = analysis_text.split("LETTERS_TO_IMPROVE:")[1].split("\n")[0].strip()
            if letters_to_improve_section:
                letters_to_improve = [l.upper() for l in letters_to_improve_section.split(',') if l.strip()]
                letters_to_improve = sorted(list(set(letters_to_improve)))
        
        # Generate structured response
        return HandwritingAnalysisResponse(
            detected_letters=detected_letters,
            handwriting_quality=handwriting_quality,
            suggestions=suggestions[:5],  # Limit to 5 suggestions
            confidence_score=confidence_score,
            analysis=analysis_text,
            letters_to_improve=letters_to_improve # Include the new field
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing handwriting: {str(e)}")

@router.post("/feedback", response_model=HandwritingFeedback)
async def get_handwriting_feedback(analysis: HandwritingAnalysisResponse):
    """
    Generate detailed feedback based on handwriting analysis
    """
    try:
        # Generate feedback based on the analysis
        letter_count = len(analysis.detected_letters)
        
        if letter_count >= 10:
            quality = "Excellent"
            score = 9
        elif letter_count >= 5:
            quality = "Good"
            score = 7
        elif letter_count >= 3:
            quality = "Fair"
            score = 5
        else:
            quality = "Needs Practice"
            score = 3
        
        return HandwritingFeedback(
            letter_formation=quality,
            spacing="Good" if score >= 7 else "Needs Improvement",
            consistency="Consistent" if score >= 7 else "Inconsistent",
            overall_score=score,
            improvement_tips=[
                "Practice writing each letter multiple times",
                "Focus on consistent letter size",
                "Work on spacing between letters and words",
                "Use lined paper for better alignment",
                "Take your time with each stroke"
            ]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating feedback: {str(e)}")

@router.get("/demo")
async def get_demo_analysis():
    """
    Get a demo handwriting analysis response for testing
    """
    return HandwritingAnalysisResponse(
        detected_letters=["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
        handwriting_quality="Good",
        suggestions=[
            "Practice letter 'A' formation with consistent angles",
            "Work on maintaining even spacing between letters",
            "Focus on consistent letter height and alignment",
            "Improve line smoothness for better appearance"
        ],
        confidence_score=0.85,
        letters_to_improve=["A", "E", "R", "S"],
        analysis="""DETECTED_LETTERS: A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z
QUALITY: Good
CONFIDENCE: 0.85
SUGGESTIONS: Practice letter 'A' formation with consistent angles, Work on maintaining even spacing between letters, Focus on consistent letter height and alignment, Improve line smoothness for better appearance
LETTERS_TO_IMPROVE: A, E, R, S
ANALYSIS: This is a demo analysis showing detected letters A through Z. The handwriting demonstrates good potential with clear letter formation and readable text. There's room for improvement in consistency and spacing, but overall the writing is neat and legible. The uppercase letters are well-formed with distinct shapes, though some could benefit from more consistent sizing and alignment."""
    )
